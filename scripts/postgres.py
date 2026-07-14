#!/usr/bin/env python3

import os
import sys
import subprocess

POSTGRES_SERVICE = os.environ["POSTGRES_SERVICE"]
POSTGRES_CONTAINER = os.environ["POSTGRES_CONTAINER"]
MIGRATE_SERVICE = os.environ["MIGRATE_SERVICE"]
MIGRATE_CONTAINER = os.environ["MIGRATE_CONTAINER"]

MIGRATE_HOST_PATH = os.environ["MIGRATE_HOST_PATH"]
MIGRATE_DOCKER_PATH = os.environ["MIGRATE_DOCKER_PATH"]

POSTGRES_HOST_PATH = os.environ["POSTGRES_HOST_PATH"]
POSTGRES_DOCKER_PATH = os.environ["POSTGRES_DOCKER_PATH"]

POSTGRES_DOCKER_CONNECTION = os.environ["POSTGRES_DOCKER_CONNECTION"]

def execute(cmd):
    return subprocess.run(cmd, shell=True, stdout=subprocess.PIPE ,stderr=subprocess.PIPE)

def handle_error(rez):
    print(f"something went wrong")
    print(rez.stderr.decode())
    sys.exit(1)

def container_exists(container_name):
    return execute(f"docker inspect {container_name}").returncode == 0

def postgres_server_up ():
    if container_exists(POSTGRES_CONTAINER):
        print(f'container {POSTGRES_CONTAINER} already exists')
        print(f'nothing to do')
        sys.exit(0)
    rez = execute(f"docker compose up -d {POSTGRES_SERVICE}")
    if rez.returncode == 0:
        print(f"service {POSTGRES_SERVICE} started")
        print(f"container name: {POSTGRES_CONTAINER}")
        sys.exit(0)
    else:
        handle_error(rez)

def postgres_server_down ():
    if not container_exists(POSTGRES_CONTAINER):
        print(f"container does not exist")
        print(f"nothing to do")
        sys.exit(0)
    
    rez = execute(f"docker compose down {POSTGRES_SERVICE}")
    if rez.returncode == 0:
        print(f"service {POSTGRES_SERVICE} has been stopped")
        sys.exit(0)
    else:
        handle_error(rez)
    
def postgres_migrate_create(seq):
    rez = execute(f"docker compose run --rm {MIGRATE_SERVICE} create -ext sql -dir {MIGRATE_DOCKER_PATH} -seq {seq}")
    if rez.returncode == 0:
        print(f"migration with seq={seq} created at {MIGRATE_HOST_PATH}")
        sys.exit(0)
    else:
        handle_error(rez)

def postgres_migrate_up(n = 1):
    rez = execute(f'docker compose run --rm {MIGRATE_SERVICE} -path {MIGRATE_DOCKER_PATH} -database "{POSTGRES_DOCKER_CONNECTION}" up {n}')
    if rez.returncode == 0:
        print(f"{n} new migrations have been applied")
        sys.exit(0)
    else:
        handle_error(rez)

def postgres_migrate_down(n = 1):
    rez = execute(f'docker compose run --rm {MIGRATE_SERVICE} -path {MIGRATE_DOCKER_PATH} -database "{POSTGRES_DOCKER_CONNECTION}" down {n}')
    if rez.returncode == 0:
        print(f"last {n} migrations have been reverted")
        sys.exit(0)
    else:
        handle_error(rez)

def postgres_clean_up(n = 1):
    execute(f"docker compose down {POSTGRES_SERVICE}")
    execute(f"rm -rf {POSTGRES_HOST_PATH}")
    sys.exit(0)

def print_usage():
    print("Usage:")
    print("  python postgres.py --help                  Show this message")
    print("  python postgres.py clean-up                Drop entire database")
    print("  python postgres.py server-up               Start postgres server")
    print("  python postgres.py server-down             Stop postgres server")
    print("  python postgres.py migrate-create <seq>    Create migration (seq = integer)")
    print("  python postgres.py migrate-up <n>          Apply n migrations")
    print("  python postgres.py migrate-down <n>        Revert n migrations")
    print("  python postgres.py migrate-down <n>        Revert n migrations")

if __name__ == "__main__":
    argc = len(sys.argv)

    if argc not in [2, 3]:
        print_usage()
        sys.exit(1)

    if argc == 2:
        if sys.argv[1] in ["--help", "help", "-h"]:
            print_usage()
            sys.exit(0)
        if sys.argv[1] in ["server-up", "server_up"]:
            postgres_server_up()
        if sys.argv[1] in ["server-down", "server_down"]:
            postgres_server_down()
        if sys.argv[1] in ["clean-up", "clean_up"]:
            postgres_clean_up()
    
    if argc == 3:
        if sys.argv[1] in ["migrate-create", "migrate_create"]:
            postgres_migrate_create(sys.argv[2])
        if sys.argv[1] in ["migrate-up", "migrate_up"]:
            postgres_migrate_up(int(sys.argv[2]))
        if sys.argv[1] in ["migrate-down", "migrate_down"]:
            postgres_migrate_down(int(sys.argv[2]))

    print_usage()
    sys.exit(1)
