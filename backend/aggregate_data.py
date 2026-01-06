import os
import pytesseract
from PIL import Image

def aggregate(base_dir="book_data"):
    output = "ai_knowledge_base.txt"
    with open(output, "w", encoding="utf-8") as f:
        for root, dirs, files in os.walk(base_dir):
            for file in sorted(files):
                if file.endswith(".png"):
                    path = os.path.join(root, file)
                    text = pytesseract.image_to_string(Image.open(path))
                    f.write(f"\n--- FILE: {path} ---\n{text}\n")
    print("Done! Data ready in ai_knowledge_base.txt")

if __name__ == "__main__":
    aggregate()
    /////////////