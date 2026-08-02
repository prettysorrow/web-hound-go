import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:5174";

test("search for alice", async ({ page }) => {
  await page.goto(`${baseUrl}/search`);

  await page.getByRole("checkbox", { name: "github" }).click();
  await page.getByRole("textbox", { name: "username" }).fill("alice");
  await page.getByRole("button", { name: "search" }).click();

  await expect(page.getByText("GitHub Results:")).toBeVisible();
  await expect(page.getByText("Followees")).toBeVisible();
  await expect(page.getByText("Followers")).toBeVisible();
});
