from __future__ import annotations
from enum import Enum
from utils.dtos import ForbidExtraModel
from pydantic import Field, AnyUrl
from typing import List, Optional


class InstagramUser(ForbidExtraModel):
    username: str = Field(max_length=100)
    avatar_url: Optional[AnyUrl] = None
    medias: Optional[List[InstagramMedias]] = None


class InstagramUserInfo(ForbidExtraModel):
    avatar_url: Optional[AnyUrl] = None
    is_private: bool = False
    follow_limit: int
    user_id: str


class InstagramUserChunk(ForbidExtraModel):
    users: List[InstagramUser]
    next_max_id: str
    done: bool


class InstagramMedias(ForbidExtraModel):
    type: InstagramMediaType
    url: AnyUrl


class InstagramMediaType(str, Enum):
    VIDEO = "video"
    PHOTO = "photo"
