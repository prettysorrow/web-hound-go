from instagram.auth import get_client
from instagram.dto import InstagramUser
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/fetching/instagram/users", tags=["fetching", "instagram", "users"]
)


@router.get("/{username}")
async def get_user(username: str):
    async with get_client() as client:
        user = client.user_info_by_username(username)
        user_id = client.user_id_from_username(username)

        followees = [
            InstagramUser(username=followee.username, avatar_url=followee.profile_pic_url)
            for _, followee in client.user_following(user_id).items()
        ]
        followers = [
            InstagramUser(username=follower.username, avatar_url=follower.profile_pic_url)
            for _, follower in client.user_followers(user_id).items()
        ]

        return InstagramUser(
            username=username,
            bio=user.biography,
            avatar_url=user.profile_pic_url,
            followees=followees,
            followers=followers,
        )
