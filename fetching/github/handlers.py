import httpx
from fastapi import APIRouter
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


@router.get("/{username}")
def get_user(username: str) -> GitHubUser:
    endpoint = f"{base_url}/{username}"
    response = httpx.get(endpoint, headers=headers)
    user = response.json()
    followers = [
        parse_summary_user(follower)
        for follower in httpx.get(f"{endpoint}/followers", headers=headers).json()
    ]
    followees = [
        parse_summary_user(followee)
        for followee in httpx.get(f"{endpoint}/following", headers=headers).json()
    ]
    return GitHubUser(
        username=username,
        user_url=user["html_url"],
        avatar_url=user["avatar_url"],
        followers=followers,
        followees=followees,
    )
