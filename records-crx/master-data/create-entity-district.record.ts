import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://pamafix-dev.dot.co.id/auth/old-login");
  await page.getByRole("textbox", { name: "Email or User ID" }).click();
  await page
    .getByRole("textbox", { name: "Email or User ID" })
    .fill("admin@dot.co.id");
  await page.getByRole("textbox", { name: "Email or User ID" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("rahasia123!");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("button", { name: "MR bill-icon" }).click();
  await page.getByRole("button", { name: "user admin mr" }).click();
  await page.getByRole("button", { name: "OK" }).click();
  await page.getByText("Master Data").click();
  await page.getByRole("link", { name: "Entity District" }).click();
  await page.getByTestId("create-btn").click();
  await page.getByTestId("entity-district-entity-field").click();
  await page.getByTestId("entity-district-entity-field").fill("PAMA");
  await page.getByTestId("entity-district-district-field").click();
  await page.getByTestId("entity-district-district-field").fill("KPP 2");
  await page.getByTestId("entity-district-description-field").click();
  await page
    .getByTestId("entity-district-description-field")
    .fill("deskripsi kpp2");
  await page.getByTestId("entity-district-save-btn").click();
  await page
    .locator("div")
    .filter({ hasText: "Successfully created Entity" })
    .nth(4)
    .click();
});
