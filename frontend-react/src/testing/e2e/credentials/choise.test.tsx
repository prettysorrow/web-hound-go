import test, { expect } from "@playwright/test";

const baseUrl = "localhost:5174";

test("create and choise credentials", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/credentials`);

  // create new credentials
  await page.getByRole("textbox", { name: "title" }).fill("my-new-credentials");
  await page.getByRole("checkbox", { name: "instagram" }).check();
  await page.getByRole("textbox", { name: "instagram login" }).fill("my-instagram-login");
  await page.getByRole("textbox", { name: "instagram password" }).fill("my-instagram-password");
  await page.getByRole("button", { name: "add" }).click();

  // new credentials should appear inside the 'Your other credentials' section
  const otherCreds = page.locator("*", { hasText: "Your other credentials" });

  // assert that new credentials are visible inside the 'Your other credentials' section
  await expect(otherCreds.getByText("my-new-credentials")).toBeVisible();
  await expect(otherCreds.getByText("my-instagram-login")).toBeVisible();
  await expect(otherCreds.getByText("my-instagram-password")).toBeVisible();

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
  await expect(activeCreds.getByText("my-instagram-login")).toBeVisible();
  await expect(activeCreds.getByText("my-instagram-password")).toBeVisible();

  // take screenshot of the results
  await page.screenshot({ path: "screenshots/choisen-credentials-with-instagram-enabled.png" });
});
