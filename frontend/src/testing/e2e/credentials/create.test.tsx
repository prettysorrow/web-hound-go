import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:5174";

test("add new credentials", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/credentials`);

  await page.getByRole("textbox", { name: "title" }).fill("my-new-credentials");

  await page.getByRole("checkbox", { name: "instagram" }).check();
  await page.getByRole("textbox", { name: "instagram login" }).fill("my-instagram-login");
  await page.getByRole("textbox", { name: "instagram password" }).fill("my-instagram-password");

  await page.getByRole("button", { name: "add" }).click();

  await expect(page.getByText("my-new-credentials")).toBeVisible();
  await expect(page.getByText("my-instagram-login")).toBeVisible();
  await expect(page.getByText("my-instagram-password")).toBeVisible();
});
