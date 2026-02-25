import os
import subprocess

# Check various possible locations
paths_to_check = [
    '/vercel/share/v0-project/public/products',
    '/vercel/share/v0-project/public',
    '/home/user/v0-project/public/products',
    '/home/user/public/products',
]

for p in paths_to_check:
    exists = os.path.exists(p)
    is_dir = os.path.isdir(p) if exists else False
    print(f"{p}: exists={exists}, isdir={is_dir}")
    if is_dir:
        entries = os.listdir(p)
        print(f"  entries ({len(entries)}): {entries[:20]}")

# Also try find command
print("\n=== find /vercel/share/v0-project/public/products -maxdepth 1 ===")
result = subprocess.run(['find', '/vercel/share/v0-project/public/products', '-maxdepth', '1'], capture_output=True, text=True)
print(result.stdout[:2000] if result.stdout else f"stderr: {result.stderr[:500]}")

# Check what's in public
print("\n=== ls /vercel/share/v0-project/public ===")
result2 = subprocess.run(['ls', '-la', '/vercel/share/v0-project/public'], capture_output=True, text=True)
print(result2.stdout[:2000] if result2.stdout else f"stderr: {result2.stderr[:500]}")

# Check if products directory exists and list its contents
print("\n=== find products dirs anywhere ===")
result3 = subprocess.run(['find', '/vercel/share/v0-project/public', '-type', 'd', '-name', '*'], capture_output=True, text=True)
print(result3.stdout[:3000] if result3.stdout else f"stderr: {result3.stderr[:500]}")
