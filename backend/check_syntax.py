import os
import ast
import sys

def check_syntax(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            source = f.read()
            ast.parse(source, filename=file_path)
            return True, None
    except SyntaxError as e:
        return False, f"Syntax error in {file_path}: {e}"
    except Exception as e:
        return False, f"Error reading {file_path}: {e}"

all_ok = True
for root, _, files in os.walk("."):
    if "venv" in root or "__pycache__" in root:
        continue
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            ok, err = check_syntax(path)
            if not ok:
                all_ok = False
                print(err)

if all_ok:
    print("All Python files have valid syntax.")
else:
    sys.exit(1)
