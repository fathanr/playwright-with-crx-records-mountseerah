import { test, expect } from "@playwright/test";
import { CompetitionListPage } from "../../../../pages/Mountseerah/Competition/CompetitionList.page";

test.describe("Network Monitoring - Capture API Endpoints", () => {
  let competitionList: CompetitionListPage;

  test.beforeEach(async ({ page }) => {
    competitionList = new CompetitionListPage(page);
    await page.goto("/dashboard");
  });

  test("Capture API calls during competition deletion", async ({ page }) => {
    const apiCalls: any[] = [];

    // Monitor all requests
    page.on('request', async (request) => {
      const url = request.url();
      // Filter for API calls
      if (url.includes('/api/') || url.includes('competition')) {
        const callData = {
          method: request.method(),
          url: url,
          headers: request.headers(),
          postData: request.postData()
        };
        apiCalls.push(callData);

        console.log(`\n📤 API Request:`);
        console.log(`  Method: ${request.method()}`);
        console.log(`  URL: ${url}`);
        if (request.postData()) {
          console.log(`  Body: ${request.postData()}`);
        }
      }
    });

    // Monitor responses
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('/api/') || url.includes('competition')) {
        console.log(`\n📥 API Response:`);
        console.log(`  URL: ${url}`);
        console.log(`  Status: ${response.status()}`);
        try {
          const body = await response.json();
          console.log(`  Body: ${JSON.stringify(body, null, 2)}`);
        } catch (e) {
          const text = await response.text();
          console.log(`  Body: ${text}`);
        }
      }
    });

    // Navigate to competition list
    await competitionList.navigateToCompetitions();

    // Wait for list API to complete
    await page.waitForTimeout(2000);

    // Open menu for first competition and deactivate
    await competitionList.openFirstCompetitionMenu();
    await page.waitForTimeout(500);
    await competitionList.deactivateMenuItem.click();

    // Wait for dialog
    await page.waitForTimeout(1000);

    await competitionList.confirmDeactivateButton.click();

    // Wait for delete API to complete
    await page.waitForTimeout(2000);

    // Print summary
    console.log(`\n\n✅ Total API calls captured: ${apiCalls.length}`);
    console.log('='.repeat(80));
    console.log('API CALLS SUMMARY:');
    console.log('='.repeat(80));
    apiCalls.forEach((call, index) => {
      console.log(`\n${index + 1}. ${call.method} - ${call.url}`);
      if (call.postData) {
        console.log(`   Body: ${call.postData}`);
      }
    });
  });
});
