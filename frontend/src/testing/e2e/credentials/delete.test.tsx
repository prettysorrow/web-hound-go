import test, { expect } from "@playwright/test";

const baseUrl = "localhost:5174";

test("create and then delete credentials", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/credentials`);

  // add new credentials with instagram enabled
  await page.getByRole("textbox", { name: "title" }).fill("my-new-credentials");
  await page.getByRole("checkbox", { name: "instagram" }).check();
  await page.getByRole("textbox", { name: "instagram login" }).fill("my-instagram-login");
  await page.getByRole("textbox", { name: "instagram password" }).fill("my-instagram-password");
  await page.getByRole("button", { name: "add" }).click();

  // assert that new credentials are visible
  await expect(page.getByText("my-new-credentials")).toBeVisible();
  await expect(page.getByText("my-instagram-login")).toBeVisible();
  await expect(page.getByText("my-instagram-password")).toBeVisible();

  // delete new credentials
  await page
    .locator("*", { hasText: "my-new-credentials" })
    .getByRole("button", { name: "delete" })
    .click();

  // assert that new credentials are not visible
  await expect(page.getByText("my-new-credentials")).not.toBeVisible();
  await expect(page.getByText("my-instagram-login")).not.toBeVisible();
  await expect(page.getByText("my-instagram-password")).not.toBeVisible();
});
