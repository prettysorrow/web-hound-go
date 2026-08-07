import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:5174";

test("search for alex on github and instagram", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/searching`);
  await page.getByRole("checkbox", { name: "github" }).check();
  await page.getByRole("checkbox", { name: "instagram" }).check();

  await page.goto(`${baseUrl}/settings/credentials`);
  await page.getByRole("textbox", { name: "title" }).fill("my-new-credentials");
  await page.getByRole("checkbox", { name: "Instagram" }).check();
  await page.getByRole("textbox", { name: "instagram login" }).fill("my-instagram-login");
  await page.getByRole("textbox", { name: "instagram password" }).fill("my-instagram-password");
  await page.getByRole("button", { name: "add" }).click();
  await page.getByRole("button", { name: "choise" }).click();

  await page.goto(`${baseUrl}/search`);
  await page.getByRole("textbox", { name: "username" }).fill("alex");
  await page.getByRole("button", { name: "search" }).click();

  await page.screenshot({ path: "screenshots/search-for-alex-on-github-and-instagram.png" });

  const github = page.locator("*", { hasText: "GitHub profile", hasNotText: "Instagram profile" });
  const githubFollowees = github.locator("*", { hasText: "Followees" });
  const githubFollowers = github.locator("*", { hasText: "Followers" });

  await expect(github.getByText("alex")).toBeVisible();
  await expect(githubFollowees.getByText("mike")).toBeVisible();
  await expect(githubFollowees.getByText("open_source")).toBeVisible();
  await expect(githubFollowees.getByText("react_ninja")).toBeVisible();
  await expect(githubFollowers.getByText("buddy")).toBeVisible();
  await expect(githubFollowers.getByText("js_lover")).toBeVisible();

  const instagram = page.locator("*", {
    hasText: "Instagram profile",
    hasNotText: "GitHub profile",
  });
  const instagramFollowees = instagram.locator("*", { hasText: "Followees" });
  const instagramFollowers = instagram.locator("*", { hasText: "Followers" });

  await expect(instagram.getByText("alex")).toBeVisible();
  await expect(instagramFollowees.getByText("buddy")).toBeVisible();
  await expect(instagramFollowees.getByText("wander")).toBeVisible();
  await expect(instagramFollowers.getByText("mike")).toBeVisible();
  await expect(instagramFollowers.getByText("nature")).toBeVisible();
  await expect(instagramFollowers.getByText("city")).toBeVisible();
});
