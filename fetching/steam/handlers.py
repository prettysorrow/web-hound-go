import os
import httpx
from fastapi import APIRouter
from steam.auth import auth_params
from steam.dto import SteamUser

router = APIRouter(prefix="/api/fetching/steam/users", tags=["fetching", "steam"])

base_url = "https://api.steampowered.com"


def get_steamid(slug: str):
    params = auth_params + {"vanity_url": slug}
    response = httpx.get(f"{base_url}/ISteamUser/ResolveVanityURL/v0001", params=params)
    return response.json()["response"]["steamid"]


# expects something like "https://steamcommunity.com/id/prettysorrow/"
def get_slug(user_url: str):
    if "steamcommunity.com/profiles/" in user_url:
        raise Exception("not supported")

    return user_url.split("/id/")[-1].strip("/")


@router.get("/{slug}")
def get_user(slug: str):
    steam_id = get_steamid(slug=slug)

    # get friends ids
    endpoint = f"{base_url}/ISteamUser/GetFriendList/v0001"
    params = auth_params + {"steamid": steam_id} + {"relationship": "friend"}
    response = httpx.get(endpoint, params=params)
    friends_steam_ids = [
        friend["steamid"] for friend in response.json()["friendslist"]["friends"]
    ]

    # get summaries
    endpoint = f"{base_url}/ISteamUser/GetPlayerSummaries/v0002"
    params = auth_params + {"steamids": [steam_id] + friends_steam_ids}
    response = httpx.get(endpoint, params=params)
    summaries = response.json()["response"]["players"]

    # form friends DTOs
    friends = [
        SteamUser(
            user_slug=get_slug(user_url=friend["profileurl"]),
            user_url=friend["profileurl"],
            display_name=friend["personaname"],
            avatar_url=friend["avatarfull"],
            friends=None,
        )
        for friend in summaries
        if friend["steamid"] != steam_id
    ]

    # form user DTO
    summary = next(s for s in summaries if s["steamid"] == steam_id)
    return SteamUser(
        user_slug=slug,
        user_url=summary["profileurl"],
        display_name=summary["personaname"],
        avatar_url=summary["avatarfull"],
        friends=friends,
    )
