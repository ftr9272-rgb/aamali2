
import urllib.request
import sys

try:
    with urllib.request.urlopen("http://127.0.0.1:5173", timeout=5) as response:
        print(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
