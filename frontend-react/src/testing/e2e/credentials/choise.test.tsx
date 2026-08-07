import test, { expect } from "@playwright/test";

const baseUrl = "localhost:5174";

test("create and choise credentials", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/credentials`);

  // create new credentials
  await page.getByRole("textbox", { name: "title" }).fill("my-new-credentials");
  await page.getByRole("checkbox", { name: "telegram" }).check();
  await page.getByRole("textbox", { name: "api id" }).fill("my-telegram-api-id");
  await page.getByRole("textbox", { name: "api hash" }).fill("my-telegram-api-hash");
  await page.getByRole("button", { name: "add" }).click();

  // new credentials should appear inside the 'Your other credentials' section
  const otherCreds = page.locator("*", { hasText: "Your other credentials" });

  // assert that new credentials are visible inside the 'Your other credentials' section
  await expect(otherCreds.getByText("my-new-credentials")).toBeVisible();
  await expect(otherCreds.getByText("my-telegram-api-id")).toBeVisible();
  await expect(otherCreds.getByText("my-telegram-api-hash")).toBeVisible();

  // set new credentials as the active one
  await otherCreds
    .locator("*", { hasText: "my-new-credentials" })
    .getByRole("button", { name: "choise" })
    .click();

  // assert that the section with other credentials is empty now
  await expect(page.getByText("You have no other credentials")).toBeVisible();

  // now new credentials should appear inside the 'Your active credentials' section
  const activeCreds = page.locator("*", { hasText: "Your active credentials" });
  await expect(activeCreds.getByText("my-new-credentials")).toBeVisible();
  await expect(activeCreds.getByText("my-telegram-api-id")).toBeVisible();
  await expect(activeCreds.getByText("my-telegram-api-hash")).toBeVisible();

  // take screenshot of the results
  await page.screenshot({ path: "screenshots/choisen-credentials-with-telegram-enabled.png" });
});
