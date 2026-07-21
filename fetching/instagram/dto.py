from __future__ import annotations
from enum import Enum
from utils.dtos import ForbidExtraModel
from pydantic import Field, AnyUrl
from typing import List, Optional


class InstagramUser(ForbidExtraModel):
    username: str = Field(max_length=100)
    bio: Optional[str] = Field(default=None, max_length=1000)
    followees: Optional[List[InstagramUser]] = None
    followers: Optional[List[InstagramUser]] = None
    medias: Optional[List[InstagramMedias]] = None


class InstagramMedias(ForbidExtraModel):
    type: InstagramMediaType
    url: AnyUrl


class InstagramMediaType(str, Enum):
    VIDEO = "video"
    PHOTO = "photo"
