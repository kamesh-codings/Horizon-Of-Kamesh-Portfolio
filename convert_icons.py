# convert_icons.py
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "--quiet"])
    from PIL import Image

icons_dir = Path(r"C:\Users\kamesh\OneDrive\Desktop\Kamesh  Portfolio\Icons")
target_size = (32, 32)

for jpeg_path in icons_dir.glob("*.jpeg"):
    png_path = jpeg_path.with_suffix('.png')
    with Image.open(jpeg_path) as im:
        im = im.convert('RGBA')
        im_resized = im.resize(target_size, Image.LANCZOS)
        im_resized.save(png_path, format='PNG')
        print(f"Converted {jpeg_path.name} -> {png_path.name}")
