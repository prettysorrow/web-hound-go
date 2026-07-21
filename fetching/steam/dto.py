from __future__ import annotations
from fastapi import HTTPException, status
from utils.dtos import ForbidExtraModel
from pydantic import Field, AnyUrl
from typing import Optional, List


class SteamUser(ForbidExtraModel):
    user_url: AnyUrl
    user_slug: Optional[str] = Field(max_length=100)
    display_name: str = Field(max_length=100)
    avatar_url: Optional[AnyUrl] = None
    friends: Optional[List[SteamUser]] = None


UnexpectedSteamAPIResponseFormatException: HTTPException = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail="unexpected steam api response format",
)
