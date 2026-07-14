#!/usr/bin/env python3

import glob
import os
import signal
import socket
import subprocess
import sys
import time
import webbrowser

ROOT_DIR = os.path.join(os.path.dirname(__file__), "..")
DOCS_DIR = os.path.join(ROOT_DIR, "docs")


def execute(cmd):
    return subprocess.run(cmd, shell=True, cwd=ROOT_DIR, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def find_transport_dirs():
    pattern = os.path.join(ROOT_DIR, "entities", "*", "transport")
    return sorted(glob.glob(pattern))


def generate():
    transport_dirs = find_transport_dirs()
    rel_dirs = ["./cmd"] + [os.path.relpath(d, ROOT_DIR) for d in transport_dirs]
    dirs_arg = ",".join(rel_dirs)

    print(f"scanning: {dirs_arg}")
    rez = execute(f"swag init --dir {dirs_arg} --output ./docs --parseDependency --parseInternal")
    if rez.returncode != 0:
        print("swag init failed:")
        print(rez.stderr.decode())
        sys.exit(1)

    print(f"docs generated at {os.path.relpath(DOCS_DIR, ROOT_DIR)}/")


def wait_for_port(host, port, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex((host, port)) == 0:
                return True
        time.sleep(0.5)
    return False


def dev():
    generate()

    host = os.environ.get("BACKEND_SERVER_HOST")
    port_str = os.environ.get("BACKEND_SERVER_PORT")

    if not host:
        print("error: BACKEND_SERVER_HOST is not set")
        sys.exit(1)
    if not port_str:
        print("error: BACKEND_SERVER_PORT is not set")
        sys.exit(1)

    port = int(port_str)

    proc = subprocess.Popen(
        ["go", "run", "./cmd/main.go"],
        cwd=ROOT_DIR,
        stdout=None,
        stderr=None,
        start_new_session=True,
    )

    def shutdown(sig=None, frame=None):
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    print(f"waiting for backend on {host}:{port}...")
    if not wait_for_port(host, port):
        print(f"error: backend did not start within 30s")
        os.killpg(os.getpgid(proc.pid), signal.SIGTERM)
        sys.exit(1)

    url = f"http://{host}:{port}/swagger/"
    print(f"swagger ui at {url}")

    try:
        webbrowser.open(url)
    except Exception as ex:
        print(f"warning: failed to open browser: {ex}")
        pass

    proc.wait()


def print_usage():
    print("Usage:")
    print("  python scripts/swag.py generate   Generate swagger docs")
    print("  python scripts/swag.py dev        Generate docs, launch backend, open /swagger/")
    print("")
    print("Dev mode reads BACKEND_SERVER_HOST and BACKEND_SERVER_PORT from env")
    print("It searches swagger annotations in all 'REPO_ROOT/entities/*/transport/' directories")


if __name__ == "__main__":
    args = sys.argv[1:]

    if not args:
        print_usage()
        sys.exit(1)

    if args[0] in ["--help", "help", "-h"]:
        print_usage()
        sys.exit(0)

    if args[0] == "generate":
        generate()
        sys.exit(0)

    if args[0] == "dev":
        dev()

    print_usage()
    sys.exit(1)
