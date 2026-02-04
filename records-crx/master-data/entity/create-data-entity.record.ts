import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.getByText("Master Data").click();
  await page.getByRole("link", { name: "Entity District" }).click();
  await page.getByTestId("create-btn").click();
  await page
    .locator("div")
    .filter({
      hasText: /^Master Data\/Entity Districts\/Create Entity District$/,
    })
    .click();
  await page.getByTestId("entity-district-entity-field").click();
  await page.getByTestId("entity-district-entity-field").fill("ASTRA");
  await page.getByTestId("entity-district-district-field").click();
  await page.getByTestId("entity-district-district-field").fill("ASTRA");
  await page.getByTestId("entity-district-description-field").click();
  await page
    .getByTestId("entity-district-description-field")
    .fill("ini description astra automation");
  await page.getByTestId("entity-district-save-btn").click();
});
