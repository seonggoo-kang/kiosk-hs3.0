import os

base = "/vercel/share/v0-project/public/products"
folders = {}
root_files = []

for dirpath, dirnames, filenames in os.walk(base):
    rel_dir = os.path.relpath(dirpath, base)
    for f in sorted(filenames):
        if rel_dir == ".":
            root_files.append(f)
        else:
            if rel_dir not in folders:
                folders[rel_dir] = []
            folders[rel_dir].append(f)

print(f"=== ROOT FILES ({len(root_files)}) ===")
for f in sorted(root_files):
    print(f"  {f}")

print(f"\n=== SUBFOLDERS ({len(folders)}) ===")
for folder in sorted(folders.keys()):
    files = folders[folder]
    print(f"\n[{folder}] ({len(files)} files)")
    for f in files:
        print(f"  {f}")

total_new = sum(len(v) for v in folders.values())
print(f"\n=== TOTALS ===")
print(f"Root (old) files: {len(root_files)}")
print(f"Subfolder (new) files: {total_new}")
print(f"Subfolders: {len(folders)}")
