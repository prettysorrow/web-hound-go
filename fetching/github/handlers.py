import httpx
from fastapi import APIRouter, HTTPException, Query
from github.dto import GitHubUser

base_url = "https://api.github.com/users"
headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "web-hound-go",
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


def github_get_json(url: str):
    try:
        response = httpx.get(url, headers=headers, timeout=10)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"github api error: {exc}")
    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"github api error {response.status_code}: {response.text[:300]}",
        )
    return response.json()


@router.get("/{username}")
def get_user(username: str, limit: int = Query(default=50, ge=1, le=100)) -> GitHubUser:
    endpoint = f"{base_url}/{username}"
    user = github_get_json(endpoint)
    followers_data = github_get_json(f"{endpoint}/followers?per_page={limit}")
    followees_data = github_get_json(f"{endpoint}/following?per_page={limit}")
    if not isinstance(followers_data, list) or not isinstance(followees_data, list):
        raise HTTPException(status_code=502, detail="unexpected github api response")
    followers = [parse_summary_user(follower) for follower in followers_data]
    followees = [parse_summary_user(followee) for followee in followees_data]
    return GitHubUser(
        username=username,
        user_url=user["html_url"],
        avatar_url=user["avatar_url"],
        followers=followers,
        followees=followees,
    )
