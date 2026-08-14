#!/usr/bin/env python3

import os
import json

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
import logging
import uvicorn

settings_path = f"{os.environ["REPO_ROOT"]}/settings/fetching-settings.json"

host = os.environ.get("FETCHING_SERVER_HOST", "127.0.0.1")
port = os.environ.get("FETCHING_SERVER_PORT", "8090")

app = FastAPI()

with open(settings_path, "r") as f:
    settings = json.load(f)

    for service in settings["enabled-services"]:
        try:
            match service:
                case "steam":
                    from steam.handlers import router as steam_router

                    app.include_router(steam_router)
                case "github":
                    from github.handlers import router as github_router

                    app.include_router(github_router)
                case "telegram":
                    from telegram.handlers import router as telegram_router

                    app.include_router(telegram_router)
                case "instagram":
                    from instagram.handlers import router as instagram_router

                    app.include_router(instagram_router)
                case other:
                    logging.warning(
                        msg=f"unknown service specified in settings: {other} (ignoring)"
                    )
        except Exception as ex:
            logging.warning(
                msg=f"failed to enable service {service}: {ex} (skipping)"
            )


if __name__ == "__main__":
    uvicorn.run(app=app, port=int(port), host=host)
