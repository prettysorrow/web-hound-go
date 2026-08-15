import httpx
from fastapi import APIRouter, HTTPException
from github.dto import GitHubUser

base_url = "https://api.github.com/users"
headers = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
}


router = APIRouter(
    prefix="/api/fetching/github/users", tags=["fetching", "github", "users"]
)


def parse_summary_user(user) -> GitHubUser:
    return GitHubUser(
        username=user["login"],
        user_url=user["html_url"],
        avatar_url=user["avatar_url"],
        followees=None,
        followers=None,
    )


def get_json(url: str, not_found_message: str):
    response = httpx.get(url, headers=headers)
    if response.status_code == 404:
        raise HTTPException(status_code=404, detail=not_found_message)
    response.raise_for_status()
    return response.json()


@router.get("/{username}")
def get_user(username: str) -> GitHubUser:
    user = get_json(f"{base_url}/{username}", f"github user '{username}' not found")
    followers = [
        parse_summary_user(follower)
        for follower in get_json(
            f"{base_url}/{username}/followers", f"github user '{username}' not found"
        )
    ]
    followees = [
        parse_summary_user(followee)
        for followee in get_json(
            f"{base_url}/{username}/following", f"github user '{username}' not found"
        )
    ]
    return GitHubUser(
        username=username,
        user_url=user["html_url"],
        avatar_url=user["avatar_url"],
        followers=followers,
        followees=followees,
    )
