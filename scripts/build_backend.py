#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys


def main():
    # Get project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    os.chdir(project_root)

    print("Building backend with PyInstaller...")

    result = subprocess.run([
        'pyinstaller',
        '--onefile',
        '--collect-all=uvicorn',
        '--collect-all=pywal',
        'backend/main.py'
    ], check=False)

    if result.returncode != 0:
        print("Error: PyInstaller build failed")
        sys.exit(1)

    source_path = 'dist/main'
    target_dir = 'src-tauri/binaries/'
    target_path = os.path.join(target_dir, 'main-x86_64-unknown-linux-gnu')

    os.makedirs(target_dir, exist_ok=True)

    if os.path.exists(source_path):
        shutil.copy2(source_path, target_path)
        print(f"Binary copied to: {target_path}")
    else:
        print(f"Error: Binary not found at {source_path}")
        sys.exit(1)

    # Clean up temporary files
    print("Cleaning up...")
    for path in ['build', 'dist', 'main.spec']:
        if os.path.exists(path):
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)

    print("Build completed successfully")


if __name__ == '__main__':
    main()
