import httpx
from fastapi import APIRouter, HTTPException, status
from steam.auth import auth_params
from steam.dto import SteamUser, UnexpectedSteamAPIResponseFormatException
from typing import Optional, List
from pydantic import AnyUrl

router = APIRouter(
    prefix="/api/fetching/steam/users", tags=["fetching", "steam", "users"]
)

base_url = "https://api.steampowered.com"


# uses resolve_vanity_url steam enpoint to find steam id by user vanity url (user slug)
def get_steamid(slug: str):
    params = auth_params | {"vanityurl": slug}
    response = httpx.get(f"{base_url}/ISteamUser/ResolveVanityURL/v0001", params=params)
    content = response.json()

    ## begin response format validation
    if response.status_code != 200:
        raise UnexpectedSteamAPIResponseFormatException

    if "response" not in content or "success" not in content["response"]:
        raise UnexpectedSteamAPIResponseFormatException

    if content["response"]["success"] != 1:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"failed to resolve steamid for user with slug={slug}",
        )

    if "steamid" not in content["response"]:
        raise UnexpectedSteamAPIResponseFormatException
    ## end response format validation

    return content["response"]["steamid"]


# expects something like https://steampowered.com/profile/67696661377 or https://steampowered.com/id/prettysorrow
def get_slug(user_url: AnyUrl) -> Optional[AnyUrl]:
    if "steamcommunity.com/profiles/" in user_url:
        # it means user has no slug
        return None

    if "steamcommunity.com/id/" not in user_url or len(user_url.split("/id/")) != 2:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="unexpected user_url format",
        )

    return user_url.split("/id/")[-1].strip("/")


@router.get("/{slug}")
def get_user(slug: str):
    steam_id = get_steamid(slug=slug)

    # get friends ids
    endpoint = f"{base_url}/ISteamUser/GetFriendList/v0001"
    params = auth_params | {"steamid": steam_id} | {"relationship": "friend"}
    response = httpx.get(endpoint, params=params)
    content = response.json()
    ## begin response format validation
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"failed to fetch friend list for user with slug={slug}: {content}",
        )

    if "friendslist" not in content or "friends" not in content["friendslist"]:
        raise UnexpectedSteamAPIResponseFormatException

    for friend in content["friendslist"]["friends"]:
        if "steamid" not in friend:
            raise UnexpectedSteamAPIResponseFormatException
    ## end response format validation
    friends_steam_ids = [
        friend["steamid"] for friend in response.json()["friendslist"]["friends"]
    ]

    # get summaries
    endpoint = f"{base_url}/ISteamUser/GetPlayerSummaries/v0002"
    params = auth_params | {"steamids": ",".join([steam_id] + friends_steam_ids)}
    response = httpx.get(endpoint, params=params)
    content = response.json()
    ## begin response format validation
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"failed to fetch summaries: {content}",
        )

    if "response" not in content or "players" not in content["response"]:
        raise UnexpectedSteamAPIResponseFormatException
    ## end response format validation

    summaries = response.json()["response"]["players"]

    ## begin response format validation
    for summary in summaries:
        if (
            "steamid" not in summary
            or "profileurl" not in summary
            or "personaname" not in summary
            or "avatarfull" not in summary
        ):
            raise UnexpectedSteamAPIResponseFormatException
    ## end response format validation

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
    try:
        summary = next(s for s in summaries if s["steamid"] == steam_id)
    except:
        raise UnexpectedSteamAPIResponseFormatException
    return SteamUser(
        user_slug=slug,
        user_url=summary["profileurl"],
        display_name=summary["personaname"],
        avatar_url=summary["avatarfull"],
        friends=friends,
    )
