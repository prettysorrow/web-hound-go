import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:5174";

test("add new credentials", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/credentials`);

  await page.getByRole("textbox", { name: "title" }).fill("my-new-credentials");

  await page.getByRole("checkbox", { name: "telegram" }).check();
  await page.getByRole("textbox", { name: "api id" }).fill("my-api-id");
  await page.getByRole("textbox", { name: "api hash" }).fill("my-api-hash");

  await page.getByRole("button", { name: "add" }).click();

  await expect(page.getByText("my-new-credentials")).toBeVisible();
  await expect(page.getByText("my-api-id")).toBeVisible();
  await expect(page.getByText("my-api-hash")).toBeVisible();
});
