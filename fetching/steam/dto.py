from __future__ import annotations
from utils.dtos import ForbidExtraModel
from pydantic import Field, AnyUrl
from typing import Optional, List


class SteamUser(ForbidExtraModel):
    user_slug: str = Field(max_length=100)
    user_url: AnyUrl
    display_name: str = Field(max_length=100)
    avatar_url: Optional[AnyUrl] = None
    friends: Optional[List[SteamUser]] = None
