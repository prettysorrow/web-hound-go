import { expect, test } from "@playwright/test";

const baseUrl = "localhost:5174";

test("reload page to assert that created credentials are persist", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/credentials`);

  // add credentials with telegram enabled
  await page.getByRole("textbox", { name: "title" }).fill("my-new-credentials");
  await page.getByRole("checkbox", { name: "telegram" }).check();
  await page.getByRole("textbox", { name: "api id" }).fill("my-telegram-api-id");
  await page.getByRole("textbox", { name: "api hash" }).fill("my-telegram-api-hash");
  await page.getByRole("button", { name: "add" }).click();

  await page.screenshot({ path: "screenshots/credentials-with-telegram-enabled.png" });

  // check that these are available before page reloading
  await expect(page.getByText("my-new-credentials")).toBeVisible();
  await expect(page.getByText("my-telegram-api-id")).toBeVisible();
  await expect(page.getByText("my-telegram-api-hash")).toBeVisible();

  await page.reload();

  // check that these are available before page reloading
  await expect(page.getByText("my-new-credentials")).toBeVisible();
  await expect(page.getByText("my-telegram-api-id")).toBeVisible();
  await expect(page.getByText("my-telegram-api-hash")).toBeVisible();
});
