#!/usr/bin/env python3
"""Generate a 1200x630 social preview card for gregrickaby/nextjs-github-pages.

Reproduces the site's own branding: white background, black Next.js wordmark,
dark text, matching the demo page (bg-zinc-50 / white, text-black).
Portable: no machine paths; fonts resolved via NEXTJS_FONT_DIR -> ./fonts -> ~/.fonts -> system.
"""
import os, tempfile
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = "#ffffff"
TEXT = "#000000"
DIM = "#525252"  # zinc-600 from the page
ACCENT = "#000000"

def find_font(name, size):
    candidates = []
    env = os.environ.get("NEXTJS_FONT_DIR")
    if env:
        candidates.append(os.path.join(env, name))
    candidates += [
        os.path.join("fonts", name),
        os.path.join(os.path.expanduser("~"), ".fonts", name),
        os.path.join("/usr/share/fonts/truetype/dejavu", name),
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    for f in os.listdir(os.path.expanduser("~/.fonts")):
        if f.lower().endswith((".ttf", ".otf")):
            try:
                return ImageFont.truetype(os.path.join(os.path.expanduser("~/.fonts"), f), size)
            except Exception:
                pass
    return ImageFont.load_default()

def render_next_logo(size=120):
    """Render the Next.js wordmark from public/next.svg via cairosvg."""
    import cairosvg
    here = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(here, "..", "public", "next.svg"),
        os.path.join(here, "public", "next.svg"),
        os.path.join(os.getcwd(), "public", "next.svg"),
        os.path.join(os.getcwd(), "next.svg"),
    ]
    svg_path = next((p for p in candidates if os.path.exists(p)), None)
    env_svg = os.environ.get("NEXTJS_SVG_DIR")
    if env_svg and os.path.exists(os.path.join(env_svg, "next.svg")):
        svg_path = os.path.join(env_svg, "next.svg")
    if not svg_path:
        raise FileNotFoundError("next.svg not found; pass NEXTJS_SVG_DIR or run from repo root")
    png = cairosvg.svg2png(url=svg_path, output_width=size*4, output_height=int(size*4*80/394))
    tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    tmp.write(png); tmp.close()
    img = Image.open(tmp.name).convert("RGBA")
    os.unlink(tmp.name)
    return img

def main():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    logo = render_next_logo(150)
    img.paste(logo, (80, 70), logo)

    title_font = find_font("Montserrat-ExtraBold.ttf", 72)
    d.text((80, 300), "Next.js GitHub Pages", font=title_font, fill=TEXT)

    sub_font = find_font("Montserrat-SemiBold.ttf", 40)
    d.text((80, 400), "Deploy Next.js to GitHub Pages", font=sub_font, fill=DIM)

    dom_font = find_font("Montserrat-Regular.ttf", 34)
    d.text((80, 480), "gregrickaby.github.io/nextjs-github-pages", font=dom_font, fill=DIM)

    d.rectangle([80, 560, 1120, 566], fill=ACCENT)

    here = os.path.dirname(os.path.abspath(__file__))
    out_candidates = [
        os.path.join(here, "..", "public", "social-preview.png"),
        os.path.join(here, "public", "social-preview.png"),
        os.path.join(os.getcwd(), "public", "social-preview.png"),
    ]
    out = next((p for p in out_candidates if os.path.isdir(os.path.dirname(p))), out_candidates[-1])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out, "PNG")
    print(out)

if __name__ == "__main__":
    main()
