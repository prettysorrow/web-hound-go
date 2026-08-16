from instagram.auth import get_client
from instagram.dto import InstagramUser
from fastapi import APIRouter, HTTPException, Query
from instagrapi.exceptions import ClientError, RateLimitError
import requests

router = APIRouter(
    prefix="/api/fetching/instagram/users", tags=["fetching", "instagram", "users"]
)


@router.get("/{username}")
def get_user(username: str, limit: int = Query(default=50, ge=1, le=500)) -> InstagramUser:
    try:
        client = get_client()
        user = client.user_info_by_username(username)
        user_id = user.pk

        followees = [
            InstagramUser(username=followee.username, avatar_url=followee.profile_pic_url)
            for _, followee in client.user_following(user_id, amount=limit).items()
        ]
        followers = [
            InstagramUser(username=follower.username, avatar_url=follower.profile_pic_url)
            for _, follower in client.user_followers(user_id, amount=limit).items()
        ]
    except (ClientError, requests.RequestException) as exc:
        status_code = 429 if isinstance(exc, RateLimitError) or "429" in str(exc) else 502
        raise HTTPException(
            status_code=status_code,
            detail=f"instagram api error: {exc}"[:300],
        )

    return InstagramUser(
        username=username,
        bio=user.biography,
        avatar_url=user.profile_pic_url,
        followees=followees,
        followers=followers,
    )
