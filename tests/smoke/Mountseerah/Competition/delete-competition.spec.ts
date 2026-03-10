import { test, expect } from "@playwright/test";
import { CompetitionListPage } from "../../../../pages/Mountseerah/Competition/CompetitionList.page";

test.describe("Delete Competition @smoke", () => {
  let competitionList: CompetitionListPage;

  test.beforeEach(async ({ page }) => {
    competitionList = new CompetitionListPage(page);
    // Auth is handled by global setup - using storageState
    await page.goto("/dashboard");
  });

  test("TC01: should deactivate competition with Yes, Deactive - 190x iterations", async ({ page }) => {
    for (let i = 1; i <= 190; i++) {
      console.log(`Running iteration ${i}/190`);

      // Navigate to competition list
      await competitionList.navigateToCompetitions();

      // Open menu for newest competition and deactivate
      await competitionList.deactivateNewestCompetition();

      // Assertion - verify success message and competition list still exists
      await expect(page.locator("#app")).toContainText("Success Delete Competition");
      await expect(page.getByRole("cell", { name: "Open menu" }).first()).toBeVisible();

      // Wait before next iteration
      await page.waitForTimeout(1000);
    }
  });

  test("TC02: should cancel deactivation with No, Check Again", async ({ page }) => {
    // Navigate to competition list
    await competitionList.navigateToCompetitions();

    // Open menu for newest competition but cancel deactivation
    await competitionList.newestCompetitionMenu.click();
    await page.waitForTimeout(500); // Wait for menu to render
    await competitionList.deactivateMenuItem.click();
    await competitionList.cancelDeactivateButton.click();

    // Assertions - verify competition still exists in list
    await expect(page.getByRole("cell", { name: "Open menu" }).first()).toBeVisible();
    await expect(competitionList.competitionLink).toBeVisible();
  });

  test("TC03: should handle deactivation with no competitions", async ({ page }) => {
    // Navigate to competition list when empty
    await competitionList.navigateToCompetitions();

    // Assertion - verify empty state or no competitions message
    // This test assumes the list might be empty
    const emptyState = page.getByText(/no competitions/i).or(
      page.getByText(/data not found/i)
    );

    // If empty state exists, verify it's visible
    if (await emptyState.count() > 0) {
      await expect(emptyState).toBeVisible();
    }
  });
});
