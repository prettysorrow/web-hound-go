from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, Optional


class TelegramUser(BaseModel):
    username: str = Field(max_length=100)
    first_name: str = Field(max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=20)
    bio: Optional[str] = Field(default=None, max_length=1000)
    channel: Optional[TelegramChannel] = Field(default=None)
    photos: Optional[List[TelegramPhoto]] = Field(default=None)


class TelegramChannel(BaseModel):
    url: str
    name: str
    bio: Optional[str] = None
    photos: List[TelegramPhoto] = Field(default_factory=list)
    posts_photos: List[TelegramPhoto] = Field(default_factory=list)


class TelegramPhoto(BaseModel):
    image_data: bytes
