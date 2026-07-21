import os

session = f"{os.environ["REPO_ROOT"]}/settings/instagram-session.json"

login, password = os.environ["INSTAGRAM_LOGIN"], os.environ["INSTAGRAM_PASSWORD"]

_client = None


async def get_client():
    global _client

    if _client is None:
        from instagrapi import Client

        _client = Client()

        if os.path.exists(path=session):
            _client.load_settings(session)
        else:
            with open(session, "w"):
                pass

        _client.login(login, password)
        _client.dump_settings(session)
    return _client
