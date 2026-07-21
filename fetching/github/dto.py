from __future__ import annotations
from utils.dtos import ForbidExtraModel
from pydantic import Field, AnyUrl
from typing import List, Optional


class GitHubUser(ForbidExtraModel):
    username: str = Field(max_length=100)
    user_url: AnyUrl
    avatar_url: AnyUrl
    followers: Optional[List[GitHubUser]] = None
    followees: Optional[List[GitHubUser]] = None
