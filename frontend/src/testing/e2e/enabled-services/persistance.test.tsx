import { test, expect } from "@playwright/test";

const baseUrl = "localhost:5174";

test("choise enabled services and assert that them are persist", async ({ page }) => {
  await page.goto(`${baseUrl}/settings/searching`);

  let panel = page.locator("*", { hasText: "Enabled services" });

  // confugure enabled services
  await panel.getByRole("checkbox", { name: "github" }).check();
  await panel.getByRole("checkbox", { name: "instagram" }).check();
  await panel.getByRole("checkbox", { name: "steam" }).uncheck();

  // assert configuration is ok before page reloading
  await expect(panel.getByRole("checkbox", { name: "github" })).toBeChecked();
  await expect(panel.getByRole("checkbox", { name: "instagram" })).toBeChecked();
  await expect(panel.getByRole("checkbox", { name: "steam" })).not.toBeChecked();

  // reload page
  await page.reload();
  panel = page.locator("*", { hasText: "Enabled services" });

  // assert configuration is ok after page reloading
  await expect(panel.getByRole("checkbox", { name: "github" })).toBeChecked();
  await expect(panel.getByRole("checkbox", { name: "instagram" })).toBeChecked();
  await expect(panel.getByRole("checkbox", { name: "steam" })).not.toBeChecked();

  // take screenshot with results
  await page.screenshot({
    path: "screenshots/enabled-services-with-enabled-github-and-instagram.png",
  });
});
