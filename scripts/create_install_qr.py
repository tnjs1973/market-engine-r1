"""Generate a Rabbit R1 Creation installation QR using ReportLab and Pillow.

The QR contains Rabbit's Creation metadata JSON, not just a webpage URL.
Run: python scripts/create_install_qr.py
"""

import json
from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.graphics.barcode.qr import QrCodeWidget


SITE_URL = "https://tnjs1973.github.io/market-engine-r1/?v=2"
CONFIG = {
    "title": "Market Engine R1",
    "url": SITE_URL,
    "description": "Read-only market research companion; live feed not yet connected.",
    "iconUrl": "",
    "themeColor": "#F0642B",
}


def main() -> None:
    payload = json.dumps(CONFIG, separators=(",", ":"), ensure_ascii=True)
    qr = QrCodeWidget(payload)
    qr.qr.make()
    matrix = qr.qr.modules
    module_size = 10
    quiet_zone = 4
    side = (len(matrix) + 2 * quiet_zone) * module_size
    image = Image.new("RGB", (side, side), "white")
    draw = ImageDraw.Draw(image)
    for row, values in enumerate(matrix):
        for col, is_dark in enumerate(values):
            if is_dark:
                x = (col + quiet_zone) * module_size
                y = (row + quiet_zone) * module_size
                draw.rectangle((x, y, x + module_size - 1, y + module_size - 1), fill="black")

    target = Path(__file__).resolve().parents[2] / "market-engine-r1-v0.2-install-qr.png"
    image.save(target)
    print(f"Saved {target} ({side}x{side})")
    print("Encoded creation URL:", SITE_URL)


if __name__ == "__main__":
    main()
