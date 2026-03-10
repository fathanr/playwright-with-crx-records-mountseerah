import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://mountserrah-backoffice.codespace.id/login");
  await page.goto("https://mountserrah-backoffice.codespace.id/dashboard");
  await page.getByRole("link", { name: "Competition" }).click();
  // Delete Competition with Yes, Deactive
  await page.getByRole("cell", { name: "Open menu" }).first().click();
  await page.getByRole("menuitem", { name: "Deactive" }).click();
  await page.getByRole("button", { name: "Yes, Deactive" }).click();
  await expect(page.locator("#app")).toMatchAriaSnapshot(
    `- text: Success Delete Competition`,
  );
  // Delete Competition with No, Check Again
  await page.getByRole("cell", { name: "Open menu" }).first().click();
  await page.getByRole("menuitem", { name: "Deactive" }).click();
  await page.getByRole("button", { name: "No, Check Again" }).click();
});
