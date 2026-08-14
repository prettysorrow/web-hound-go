#!/usr/bin/env python3

import os
import subprocess
import sys
import time
import webbrowser

ROOT_DIR = os.path.join(os.path.dirname(__file__), "..")


def execute(cmd):
    return subprocess.run(
        cmd, shell=True, cwd=ROOT_DIR, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )


def load_env():
    secrets = os.path.join(ROOT_DIR, ".secrets.sh")
    paths = os.path.join(ROOT_DIR, ".paths.sh")

    for env_file in (secrets, paths):
        if not os.path.exists(env_file):
            continue
        for line in open(env_file):
            line = line.strip()
            if not line.startswith("export "):
                continue
            body = line[len("export "):]
            name, _, value = body.partition("=")
            value = value.strip()
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            os.environ.setdefault(name, value)


def start_server():
    load_env()

    os.environ.setdefault("REPO_ROOT", ROOT_DIR)

    interpreter = os.path.join(ROOT_DIR, "fetching", "venv", "bin", "python")
    if not os.path.exists(interpreter):
        interpreter = "python3"

    cmd = f"{interpreter} -m uvicorn main:app --host {os.environ['FETCHING_SERVER_HOST']} --port {os.environ['FETCHING_SERVER_PORT']} --app-dir fetching"
    print(f"running: {cmd}")

    subprocess.run(cmd, shell=True, cwd=ROOT_DIR)


def print_usage():
    print("Usage:")
    print("  python scripts/fetching.py server    Start the external fetching service (FastAPI)")
    print("")
    print("Reads FETCHING_SERVER_HOST and FETCHING_SERVER_PORT from .paths.sh")


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
