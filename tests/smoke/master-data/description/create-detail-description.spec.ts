import { test, expect } from "@playwright/test";
import { CreateDetailDescriptionPage } from "../../../../pages/master-data/description/CreateDetailDescription.page";

test.describe("Create Detail Description @smoke", () => {
  test("should create parent and child description rows", async ({ page }) => {
    await page.goto("/");
    
    const createDetailDescriptionPage = new CreateDetailDescriptionPage(page);
    
    await createDetailDescriptionPage.navigateToDescriptionDetail();
    await expect(createDetailDescriptionPage.addRowBtn).toBeVisible();
    
    // Add parent row
    await createDetailDescriptionPage.addParentRow("A199", "deskripsi a", "sub deskripsi a");
    await expect(createDetailDescriptionPage.addRowBtn).toBeVisible();
    
    // Add child row
    await createDetailDescriptionPage.addChildRow("A1999", "deskripsi b", "sub deskripsi c", "A199");
    await expect(createDetailDescriptionPage.addRowBtn).toBeVisible();
  });
});
