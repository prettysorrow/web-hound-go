from __future__ import annotations
from utils.dtos import ForbidExtraModel
from pydantic import Field, AnyUrl
from typing import List, Optional


class InstagramUser(ForbidExtraModel):
    username: str = Field(max_length=100)
    bio: Optional[str] = Field(default=None, max_length=1000)
    avatar_url: Optional[AnyUrl] = None
    followees: Optional[List[InstagramUser]] = None
    followers: Optional[List[InstagramUser]] = None
