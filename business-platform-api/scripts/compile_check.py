import sys
import py_compile
import traceback

if len(sys.argv) < 2:
    print('Usage: compile_check.py <file>')
    sys.exit(2)

path = sys.argv[1]
try:
    py_compile.compile(path, doraise=True)
    print('COMPILED_OK', path)
except Exception:
    traceback.print_exc()
    sys.exit(1)
