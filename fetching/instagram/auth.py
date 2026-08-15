import contextlib
import os
import threading

session = f"{os.environ["REPO_ROOT"]}/settings/instagram-session.json"

login, password = os.environ["INSTAGRAM_LOGIN"], os.environ["INSTAGRAM_PASSWORD"]

_client = None
_lock = threading.Lock()

_secondary_client = None
_secondary_lock = threading.Lock()

# instagrapi Client is not thread-safe, so every use of a client is serialized.
_primary_use_lock = threading.Lock()
_secondary_use_lock = threading.Lock()


@contextlib.contextmanager
def use_primary_client():
    with _primary_use_lock:
        yield get_client()


@contextlib.contextmanager
def use_secondary_client():
    with _secondary_use_lock:
        yield get_secondary_client()


def get_client():
    global _client

    if _client is None:
        with _lock:
            if _client is None:
                from instagrapi import Client

                _client = Client()
                _client.request_timeout = 0

                if os.path.exists(path=session):
                    try:
                        _client.load_settings(session)
                    except Exception:
                        os.remove(session)

                _client.login(login, password)
                _client.dump_settings(session)
    return _client


def get_secondary_client():
    global _secondary_client

    if _secondary_client is None:
        with _secondary_lock:
            if _secondary_client is None:
                from instagrapi import Client

                _secondary_client = Client()
                _secondary_client.request_timeout = 0
                _secondary_client.load_settings(session)
    return _secondary_client
