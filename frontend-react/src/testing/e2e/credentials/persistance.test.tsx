import { expect, test } from "@playwright/test";

const baseUrl = "localhost:5174";

test("reload page to assert that created credentials are persist", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/credentials`);

  // add credentials with instagram enabled
  await page.getByRole("textbox", { name: "title" }).fill("my-new-credentials");
  await page.getByRole("checkbox", { name: "instagram" }).check();
  await page.getByRole("textbox", { name: "instagram login" }).fill("my-instagram-login");
  await page.getByRole("textbox", { name: "instagram password" }).fill("my-instagram-password");
  await page.getByRole("button", { name: "add" }).click();

  await page.screenshot({ path: "screenshots/credentials-with-instagram-enabled.png" });

  // check that these are available before page reloading
  await expect(page.getByText("my-new-credentials")).toBeVisible();
  await expect(page.getByText("my-instagram-login")).toBeVisible();
  await expect(page.getByText("my-instagram-password")).toBeVisible();

  await page.reload();

  // check that these are available before page reloading
  await expect(page.getByText("my-new-credentials")).toBeVisible();
  await expect(page.getByText("my-instagram-login")).toBeVisible();
  await expect(page.getByText("my-instagram-password")).toBeVisible();
});
