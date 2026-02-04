import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.getByRole("menu").getByText("Master Data").click();
  await page
    .getByRole("link", { name: "Entity District", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Search" }).click();
  await page.getByRole("textbox", { name: "Search" }).fill("ASTRA");
  await page
    .getByTestId("edit-btn-ac3041eb-4a99-4a5d-9662-244675650e00")
    .click();
  await page.getByTestId("entity-district-entity-field").click();
  await page.getByTestId("entity-district-entity-field").fill("ASTRA EDITED");
  await page.getByTestId("entity-district-district-field").click();
  await page.getByTestId("entity-district-district-field").fill("ASTRA EDITED");
  await page.getByTestId("entity-district-description-field").click();
  await page
    .getByTestId("entity-district-description-field")
    .fill("ini description astra automation EDITED");
  await page.getByTestId("entity-district-save-btn").click();
});
