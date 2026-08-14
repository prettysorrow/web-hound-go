#!/usr/bin/env python3

import os
import subprocess
import sys

from scripts.env import load_env_file

load_env_file()

ROOT_DIR = os.environ["REPO_ROOT"]


def execute(cmd):
    return subprocess.run(
        cmd, shell=True, cwd=ROOT_DIR, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )


def start_server():
    interpreter = os.path.join(ROOT_DIR, "fetching", "venv", "bin", "python")
    if not os.path.exists(interpreter):
        interpreter = "python3"

    cmd = f"{interpreter} -m uvicorn main:app --host {os.environ['FETCHING_SERVER_HOST']} --port {os.environ['FETCHING_SERVER_PORT']} --app-dir fetching"
    print(f"running: {cmd}")

    subprocess.run(cmd, shell=True, cwd=ROOT_DIR)


def print_usage():
    print("Usage:")
    print(
        "  python scripts/fetching.py server    Start the external fetching service (FastAPI)"
    )
    print("")
    print("Reads FETCHING_SERVER_HOST and FETCHING_SERVER_PORT from the root .env file")


if __name__ == "__main__":
    args = sys.argv[1:]

    if not args or args[0] in ["--help", "help", "-h"]:
        print_usage()
        sys.exit(1)

    if args[0] == "server":
        start_server()
        sys.exit(0)

    print_usage()
    sys.exit(1)
