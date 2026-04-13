"""
generate_qr.py — Python QR code generation backend.
Usage: python generate_qr.py <url> <output_path> [color]

Generates a styled QR code PNG with black background and colored foreground.
Returns exit code 0 on success, 1 on failure.
"""

import sys
import os
import requests
import qrcode
from PIL import Image


def url_checker(url: str) -> bool:
    """Return True if the URL is reachable (HTTP 200-4xx), False on network errors. Skip non-http."""
    if not url.startswith("http://") and not url.startswith("https://"):
        return True # Bypass for custom schemas (ethereum:, nfc, etc.)
    try:
        response = requests.get(url, timeout=10, allow_redirects=True)
        # Accept any response that didn't throw a network error
        return response.status_code < 500
    except requests.exceptions.RequestException as e:
        print(f"[url_checker] {url}: is Not reachable\nErr: {e}", file=sys.stderr)
        return False


def generate_qr(url: str, output_path: str = "Generated_QRCode.png", qr_color: str = "white") -> tuple:
    """
    Generate a QR code PNG for the given URL.

    Args:
        url:         The target URL or data to encode.
        output_path: Where to save the output PNG file.
        qr_color:    Foreground dot color (any Pillow-supported color name or hex).
                     Background is always black for maximum contrast.

    Returns:
        ("Success", <PIL.Image>) on success, ("Failed",) on validation error.
    """
    if not url:
        return ("Failed",)

    if not url_checker(url):
        print(f"[generate_qr] URL not reachable: {url}", file=sys.stderr)
        return ("Failed",)

    qr_code_obj = qrcode.QRCode(
        version=1,
        box_size=12,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
    )

    qr_code_obj.add_data(url)
    qr_code_obj.make(fit=True)

    # Black background, colored dots — high contrast and visually distinct
    qr_img = qr_code_obj.make_image(
        fill_color=qr_color,
        back_color="black",
    ).convert("RGB")

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    qr_img.save(output_path)
    print(f"[generate_qr] Saved QR code to: {output_path}")
    return ("Success", qr_img)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_qr.py <url> <output_path> [color]", file=sys.stderr)
        sys.exit(1)

    target_url = sys.argv[1]
    out_path = sys.argv[2]
    color = sys.argv[3] if len(sys.argv) > 3 else "white"

    result = generate_qr(target_url, out_path, color)
    if result[0] == "Success":
        print(f"QR code generated successfully: {out_path}")
        sys.exit(0)
    else:
        print("QR generation failed.", file=sys.stderr)
        sys.exit(1)
