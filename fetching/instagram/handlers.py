import os
from instagram.auth import use_primary_client, use_secondary_client
from instagram.dto import (
    InstagramMedias,
    InstagramMediaType,
    InstagramUser,
    InstagramUserChunk,
    InstagramUserInfo,
)
from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/api/fetching/instagram/users", tags=["fetching", "instagram", "users"]
)


def _fetch_media_enabled() -> bool:
    return os.environ.get("INSTAGRAM_FETCH_MEDIA", "true").strip().lower() not in (
        "0",
        "false",
        "no",
        "off",
    )


def _fetch_follow_limit() -> int:
    raw = os.environ.get("INSTAGRAM_FETCH_FOLLOW_LIMIT", "100")
    try:
        return max(int(raw), 1)
    except ValueError:
        return 100


# Instagram returns at most ~23 users per follow-list request regardless of the
# requested count, so each chunk call maps to one request to Instagram.
_FOLLOW_PAGE_SIZE = 23


@router.get("/{username}/info")
def get_user_info(username: str):
    with use_primary_client() as client:
        user = client.user_info_by_username(username)

    return InstagramUserInfo(
        avatar_url=user.profile_pic_url,
        is_private=user.is_private,
        follow_limit=_fetch_follow_limit(),
        user_id=str(user.pk),
    )


@router.get("/{username}/chunk")
def get_user_chunk(username: str, list: str, user_id: str = "", max_id: str = ""):
    if list not in ("followers", "followees"):
        raise HTTPException(status_code=400, detail="list must be 'followers' or 'followees'")

    if list == "followees":
        with use_primary_client() as client:
            if not user_id:
                user_id = client.user_id_from_username(username)
            users, next_max_id = client.user_following_v1_chunk(
                user_id, max_amount=_FOLLOW_PAGE_SIZE, max_id=max_id
            )
    else:
        with use_secondary_client() as client:
            if not user_id:
                user_id = client.user_id_from_username(username)
            users, next_max_id = client.user_followers_v1_chunk(
                user_id, max_amount=_FOLLOW_PAGE_SIZE, max_id=max_id
            )

    return InstagramUserChunk(
        users=[
            InstagramUser(username=user.username, avatar_url=user.profile_pic_url)
            for user in users
        ],
        next_max_id=next_max_id or "",
        done=not next_max_id,
    )


@router.get("/{username}/media")
def get_user_media(username: str, limit: int = 3):
    medias = []
    if _fetch_media_enabled():
        with use_primary_client() as client:
            user_id = client.user_id_from_username(username)
            for media in client.user_medias(user_id, amount=limit):
                if media.media_type == 1:
                    medias.append(InstagramMedias(type="photo", url=media.thumbnail_url))
                elif media.media_type == 2:
                    medias.append(InstagramMedias(type="video", url=media.video_url))

    return InstagramUser(username=username, medias=medias)
