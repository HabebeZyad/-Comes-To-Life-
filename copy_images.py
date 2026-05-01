import shutil
import os

source_dir = r"C:\Users\GEDO STORE\.gemini\antigravity\brain\cd7a9aa2-8ed1-4b8c-94d2-d5df7de6a7fa"
dest_dir = r"d:\BOO\Comes To Life\comes-to-life\src\assets\games"

os.makedirs(dest_dir, exist_ok=True)

files = [f for f in os.listdir(source_dir) if f.endswith(".png") and "_background_" in f]

for f in files:
    if "anubis" in f:
        shutil.copy(os.path.join(source_dir, f), os.path.join(dest_dir, "anubis.png"))
    elif "cleopatra" in f:
        shutil.copy(os.path.join(source_dir, f), os.path.join(dest_dir, "cleopatra.png"))
    elif "pharaoh" in f:
        shutil.copy(os.path.join(source_dir, f), os.path.join(dest_dir, "pharaoh.png"))

print("Copied images successfully.")
