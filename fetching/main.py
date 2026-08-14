#!/usr/bin/env python3

from fastapi import FastAPI
import logging
import uvicorn
import os
import json

host, port = "127.0.0.1", 8080

settings_path = f"{os.environ["REPO_ROOT"]}/settings/fetching-settings.json"

app = FastAPI()

with open(settings_path, "r") as f:
    settings = json.load(f)

    for service in settings["enabled-services"]:
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

    if "server-host" in settings:
        host = settings["server-host"]
        logging.info(msg=f"using host from setting: {host}")
    else:
        logging.info(msg=f"using standart host: {host}")

    if "server-port" in settings:
        port = settings["server-port"]
        logging.info(msg=f"using port from setting: {port}")
    else:
        logging.info(msg=f"using standart port: {port}")


if __name__ == "__main__":
    uvicorn.run(app=app, port=port, host=host)
