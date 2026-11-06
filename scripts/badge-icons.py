"""Builds the badge-style game and service icons: the Stux.Games mark on a round avatar with a badge in the bottom-right
corner saying what the game or tool is (the style projects.stuxie.dev uses; copied from StuxGroup/Services, which adapted it
from TheRidgwells/Projects' scripts/badge-icons.py).
Usage: python -I scripts/badge-icons.py <brand> <brand icon.png> <out dir> [--size=256] [icon ...]
  <brand> is stux-games (picks the colours); <brand icon.png> is the brand's icon-light.png, e.g.
  assets/img/icon-light.png. With no icons named, it builds every icon for that brand."""
import sys
from PIL import Image, ImageDraw, ImageFilter

args = [a for a in sys.argv[1:] if not a.startswith("--size=")]
SIZE = next((int(a.split("=", 1)[1]) for a in sys.argv[1:] if a.startswith("--size=")), 256)
brand, src, out = args[0], args[1], args[2]
S = 4                      # supersampling
N = 512 * S
WHITE = (255, 255, 255, 255)

# Each brand: its dark background and a three-stop gradient for the rings, then the icons it has.
BRANDS = {
    "stux-games": {"bg": (14, 11, 4), "grad": [(255, 214, 102), (255, 186, 26), (176, 118, 0)],  # #0e0b04; #ffd666, #ffba1a, #b07600
                   "icons": {"status": "stux-games-status.png", "flag": "stux-games-flappie-race.png",
                             "pong": "stux-games-multipong.png", "handheld": "stux-games-gamepage.png",
                             "list": "stux-games-gameserverlist.png", "servers": "stux-games-gameservermanager.png",
                             "layers": "stux-games-flappierace-backend.png"}},
}
B = BRANDS[brand]
BG = B["bg"] + (255,)
emblem = Image.open(src).convert("RGBA")
emblem = emblem.crop(emblem.getbbox())


def gradient(size):
    """A diagonal gradient square through the brand's three colours."""
    a, b, c = B["grad"]
    g = Image.new("RGBA", (size, size))
    px = g.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            p, q, u = (a, b, t / 0.5) if t < 0.5 else (b, c, (t - 0.5) / 0.5)
            px[x, y] = tuple(round(p[i] + (q[i] - p[i]) * u) for i in range(3)) + (255,)
    return g


def round_base():
    """The brand's mark on a round dark avatar inside a gradient ring."""
    base = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    m = Image.new("L", (N, N), 0)
    ImageDraw.Draw(m).ellipse((0, 0, N - 1, N - 1), fill=255)
    base.paste(gradient(N), (0, 0), m)
    ring = int(N * 0.04)
    ImageDraw.Draw(base).ellipse((ring, ring, N - 1 - ring, N - 1 - ring), fill=BG)
    w, h = emblem.size
    k = (N * 0.56) / max(w, h)
    e = emblem.resize((round(w * k), round(h * k)), Image.LANCZOS)
    base.alpha_composite(e, ((N - e.width) // 2 - int(N * 0.035), (N - e.height) // 2 - int(N * 0.04)))
    return base


R = int(N * 0.205)          # badge radius
CX = CY = N - R - int(N * 0.01)
RING = int(N * 0.022)


def badge_base():
    layer = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    sh = Image.new("RGBA", (N, N), (0, 0, 0, 0))    # soft shadow so the badge lifts off the avatar
    ImageDraw.Draw(sh).ellipse((CX - R, CY - R + 6 * S, CX + R, CY + R + 6 * S), fill=(0, 0, 0, 120))
    layer = Image.alpha_composite(layer, sh.filter(ImageFilter.GaussianBlur(8 * S)))
    mask = Image.new("L", (2 * R, 2 * R), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 2 * R - 1, 2 * R - 1), fill=255)
    layer.paste(gradient(2 * R), (CX - R, CY - R), mask)
    ImageDraw.Draw(layer).ellipse((CX - R + RING, CY - R + RING, CX + R - RING, CY + R - RING), fill=BG)
    return layer


def glyph(layer, parts):
    """Draws white strokes given in a 64-unit space (the glyphs span about 40 units), scaled into the badge."""
    k = (2 * R * 0.62) / 40
    ox, oy = CX - 32 * k, CY - 32 * k
    d = ImageDraw.Draw(layer)
    w = int(4.5 * k)
    def P(x, y): return (ox + x * k, oy + y * k)
    def cap(p): d.ellipse((p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2), fill=WHITE)
    for kind, a in parts:
        if kind == "poly":
            pts = [P(*p) for p in a]
            d.line(pts, fill=WHITE, width=w, joint="curve")
            cap(pts[0]); cap(pts[-1])
        elif kind == "dot":
            x, y, r = a; c = P(x, y)
            d.ellipse((c[0] - r * k, c[1] - r * k, c[0] + r * k, c[1] + r * k), fill=WHITE)
        elif kind == "rrect":
            x0, y0, x1, y1, rad = a
            d.rounded_rectangle((*P(x0, y0), *P(x1, y1)), radius=rad * k, outline=WHITE, width=w)
        elif kind == "arc":          # centre, radius, start and end angles (clockwise from 3 o'clock)
            x, y, r, start, end = a
            d.arc((*P(x - r, y - r), *P(x + r, y + r)), start, end, fill=WHITE, width=w)
        elif kind == "moon":         # a filled crescent
            x, y, r = a
            d.ellipse((*P(x - r, y - r), *P(x + r, y + r)), fill=WHITE)
            d.ellipse((*P(x - r + 8, y - r - 5), *P(x + r + 8, y + r - 5)), fill=BG)


GLYPHS = {
    "status": [("poly", [(12, 34), (22, 34), (27, 22), (35, 46), (41, 30), (44, 34), (52, 34)])],            # a heartbeat line
    "flag": [("poly", [(20, 50), (20, 14)]), ("poly", [(20, 16), (46, 16), (40, 24), (46, 32), (20, 32)])],   # a race flag
    "pong": [("poly", [(15, 16), (15, 34)]), ("poly", [(49, 30), (49, 48)]), ("dot", (30, 36, 3.6))],          # two paddles and a ball
    "handheld": [("rrect", (19, 12, 45, 52, 5)), ("rrect", (24, 17, 40, 31, 2)),
                 ("poly", [(26, 42), (32, 42)]), ("poly", [(29, 39), (29, 45)]), ("dot", (39, 41, 2))],          # a handheld console
    "list": [("dot", (17, 20, 2.6)), ("poly", [(25, 20), (49, 20)]), ("dot", (17, 32, 2.6)), ("poly", [(25, 32), (49, 32)]),
             ("dot", (17, 44, 2.6)), ("poly", [(25, 44), (49, 44)])],                                          # a server list
    "servers": [("rrect", (14, 14, 50, 29, 3)), ("rrect", (14, 35, 50, 50, 3)),
                ("dot", (21, 21.5, 1.8)), ("dot", (21, 42.5, 1.8))],                                           # a server rack
    "layers": [("poly", [(32, 14), (50, 23), (32, 32), (14, 23), (32, 14)]), ("poly", [(14, 32), (32, 41), (50, 32)]),
               ("poly", [(14, 41), (32, 50), (50, 41)])],                                                      # a stack (Docker Compose)
}

avatar = round_base()
wanted = args[3:] or list(B["icons"])
for key in wanted:
    layer = badge_base()
    glyph(layer, GLYPHS[key])
    icon = Image.alpha_composite(avatar, layer).resize((SIZE, SIZE), Image.LANCZOS)
    icon.save(f"{out}/{B['icons'][key]}", optimize=True)
    print(B["icons"][key])
