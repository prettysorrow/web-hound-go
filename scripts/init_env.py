#!/usr/bin/env python3

import os

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_env_file(env_path=None):
    if env_path is None:
        env_path = os.path.join(REPO_ROOT, ".env")

    if not os.path.exists(env_path):
        return

    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip()

            if (len(value) >= 2 and value[0] == '"' and value[-1] == '"') or (
                len(value) >= 2 and value[0] == "'" and value[-1] == "'"
            ):
                value = value[1:-1]

            os.environ.setdefault(key, value)
