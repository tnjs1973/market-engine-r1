"""Create an R1 Creation install QR for the standalone microphone diagnostic."""

import json
from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.graphics.barcode.qr import QrCodeWidget


def main() -> None:
    data = {
        "title": "Market Engine Mic",
        "url": "https://tnjs1973.github.io/market-engine-r1/mic-test.html?v=3",
        "description": "Local-only microphone and side-button diagnostic (no audio upload)",
        "iconUrl": "",
        "themeColor": "#F0642B",
    }
    payload = json.dumps(data, separators=(",", ":"))
    qr = QrCodeWidget(payload)
    qr.qr.make()
    unit, border = 10, 4
    matrix = qr.qr.modules
    dimension = (len(matrix) + 2 * border) * unit
    image = Image.new("RGB", (dimension, dimension), "white")
    painter = ImageDraw.Draw(image)
    for y, row in enumerate(matrix):
        for x, dark in enumerate(row):
            if dark:
                left, top = (x + border) * unit, (y + border) * unit
                painter.rectangle((left, top, left + unit - 1, top + unit - 1), fill="black")
    target = Path(__file__).resolve().parents[2] / "market-engine-r1-mic-test-qr.png"
    image.save(target)
    print(f"Saved {target}: {dimension}x{dimension}, URL={data['url']}")


if __name__ == "__main__":
    main()
