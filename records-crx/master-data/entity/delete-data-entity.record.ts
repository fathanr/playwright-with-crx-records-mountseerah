import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.getByRole("menu").getByText("Master Data").click();
  await page
    .getByRole("link", { name: "Entity District", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("ASTRA");
  await page
    .getByTestId("delete-btn-ac3041eb-4a99-4a5d-9662-244675650e00")
    .click();
  await page.getByRole("button", { name: "OK" }).click();
});
