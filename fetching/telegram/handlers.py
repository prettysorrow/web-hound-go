from fastapi import APIRouter
from telegram.dto import TelegramPhoto, TelegramChannel, TelegramUser
from telegram.auth import get_client

router = APIRouter(
    prefix="/api/fetching/telegram/users", tags=["fetching", "telegram", "users"]
)


@router.get("/{username}")
async def get_user(username: str):
    async with get_client() as client:
        user = await client.get_users(username)
        bio = (await client.get_chat(username)).bio

        # get profile photos
        profile_photos = []
        photos_iterator = client.get_chat_photos(id=username, limit=None)
        async for photo in photos_iterator:
            image_data: bytes = (
                await client.download_media(photo.file_id, in_memory=True)
            ).getvalue()
            profile_photos.append(TelegramPhoto(image_data))

        # TODO: channel and channel photos
        channel = None

        # form user dto
        return TelegramUser(
            username=username,
            first_name=user.first_name,
            last_name=user.last_name,
            phone=user.phone_number,
            bio=bio,
            channel=channel,
            photos=profile_photos,
        )
