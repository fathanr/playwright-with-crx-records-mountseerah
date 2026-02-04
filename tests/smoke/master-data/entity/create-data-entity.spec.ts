import { test, expect } from "@playwright/test";
import { EntityDistrictPage } from "../../../../pages/master-data/entity/EntityDistrict.page";

test.describe("Create Entity District @smoke", () => {
  test("should create entity district", async ({ page }) => {
    await page.goto("/");

    const entityDistrictPage = new EntityDistrictPage(page);

    await entityDistrictPage.openModule();
    await entityDistrictPage.openCreateForm();

    await expect(page.getByTestId("entity-district-entity-field")).toBeVisible();

    await entityDistrictPage.create("ASTRA", "ASTRA", "ini description astra automation");

    await expect(page.getByTestId("create-btn")).toBeVisible();
  });
});
