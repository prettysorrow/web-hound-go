import os
from instagram.auth import get_client
from instagram.dto import InstagramUser, InstagramMedia, InstagramMediaType
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/fetching/instagram/users", tags=["fetching", "instagram", "users"]
)


@router.get("/{username}")
async def get_user(username: str, limit: int):
    async with get_client() as client:
        user = client.user_info_by_username(username)
        user_id = client.user_id_from_username(username)

        followees = [
            InstagramUser(username=followee.username)
            for _, followee in client.user_following(user_id).items()
        ]
        followers = [
            InstagramUser(username=follower.username)
            for _, follower in client.user_followers(user_id).items()
        ]

        medias = []
        for media in client.user_medias(user_id, amount=limit):
            if media.media_type == 1:
                medias.append(InstagramMedia(type="photo", url=media.thumbnail_url))
            elif media.media_type == 2:
                medias.append(InstagramMedia(type="video", url=media.video_url))

        return InstagramUser(
            username=username,
            bio=user.biography,
            followees=followees,
            followers=followers,
            medias=medias,
        )
