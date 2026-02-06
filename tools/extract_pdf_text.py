import re

import fitz


def main() -> None:
    path = r"d:\chinese chi\Chinese CHI 2026 pre meeting_20260107v2.pdf"
    doc = fitz.open(path)
    print(f"pages={doc.page_count}")
    for i in range(doc.page_count):
        text = doc.load_page(i).get_text("text")
        text = re.sub(r"[ \t]+\n", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text).strip()
        print(f"\n=== page {i + 1} ===\n")
        print(text)


if __name__ == "__main__":
    main()
