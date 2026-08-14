import os

api_id, api_hash = os.environ["TELEGRAM_API_ID"], os.environ["TELEGRAM_API_HASH"]


_client = None


def get_client():
    global _client
    if _client is None:
        from pyrogram import Client

        _client = Client(name="webhound", api_id=api_id, api_hash=api_hash)
    return _client
