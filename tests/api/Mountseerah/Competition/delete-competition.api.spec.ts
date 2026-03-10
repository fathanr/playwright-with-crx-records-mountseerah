import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test.describe("Competition API (Browser-based)", () => {
  const baseURL =
    process.env.BASE_URL || "https://mountserrah-backoffice.codespace.id";

  // Helper function to save API response to file
  function saveResponse(filename: string, data: any) {
    const responsesDir = path.join(process.cwd(), "tests/api-responses");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filepath = path.join(responsesDir, `${filename}_${timestamp}.json`);

    fs.mkdirSync(responsesDir, { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`💾 Saved to: ${path.basename(filepath)}`);
    return filepath;
  }

  test("GET /competition - should save competition list data", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      storageState: ".auth/user.json",
    });

    const page = await context.newPage();

    await page.goto(`${baseURL}/competition`);
    await page.waitForLoadState("networkidle");

    // Scrape data from the HTML table
    const competitions = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tbody tr");
      const data: any[] = [];

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 6) {
          data.push({
            no: cells[0].innerText.trim(),
            name: cells[1].innerText.trim(),
            organizer: cells[2].innerText.trim(),
            start_date: cells[3].innerText.trim(),
            end_date: cells[4].innerText.trim(),
            status: cells[5].innerText.trim(),
          });
        }
      });

      return data;
    });

    console.log(
      `✅ Scraped ${competitions.length} competitions from HTML table`,
    );

    // Save the scraped data
    saveResponse("competition-list-scraped", {
      url: `${baseURL}/competition}`,
      timestamp: new Date().toISOString(),
      total: competitions.length,
      source: "HTML table scrape",
      competitions: competitions,
    });

    console.log(`✅ Saved ${competitions.length} competitions`);

    await context.close();
  });

  test("POST /competition/delete - should save delete operation data - 100x iterations", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      storageState: ".auth/user.json",
    });

    const page = await context.newPage();

    // Helper to scrape table data
    const scrapeTable = async () => {
      return await page.evaluate(() => {
        const rows = document.querySelectorAll("table tbody tr");
        const data: any[] = [];
        rows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 6) {
            data.push({
              no: cells[0].innerText.trim(),
              name: cells[1].innerText.trim(),
              organizer: cells[2].innerText.trim(),
              start_date: cells[3].innerText.trim(),
              end_date: cells[4].innerText.trim(),
              status: cells[5].innerText.trim(),
            });
          }
        });
        return data;
      });
    };

    const deletedItems: any[] = [];

    // Run 100 iterations
    for (let i = 1; i <= 100; i++) {
      console.log(`\n🔄 Iteration ${i}/100`);

      await page.goto(`${baseURL}/competition`);
      await page.waitForLoadState("networkidle");

      // Scrape before delete
      const beforeList = await scrapeTable();

      if (beforeList.length === 0) {
        console.log("⚠️ No more competitions to delete");
        break;
      }

      // Get the last (newest) competition
      const toDelete = beforeList[beforeList.length - 1];
      console.log(`Deleting: ${toDelete.name} (Row #${toDelete.no})`);

      // Perform delete (last row = newest)
      await page.getByRole("cell", { name: "Open menu" }).last().click();
      await page.waitForTimeout(500);
      await page.getByRole("menuitem", { name: "Deactive" }).click();
      await page.getByRole("button", { name: "Yes, Deactive" }).click();
      await page.waitForLoadState("networkidle");

      // Reload to see updated list
      await page.reload();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000);

      // Scrape after delete
      const afterList = await scrapeTable();

      // Track deleted item
      deletedItems.push({
        iteration: i,
        name: toDelete.name,
        row: toDelete.no,
        before_count: beforeList.length,
        after_count: afterList.length,
      });

      console.log(
        `✅ Deleted: ${toDelete.name} | Before: ${beforeList.length}, After: ${afterList.length}`,
      );
    }

    // Save summary of all deletions
    saveResponse("competition-delete-100x-summary", {
      timestamp: new Date().toISOString(),
      total_iterations: deletedItems.length,
      deleted_items: deletedItems,
    });

    console.log(`\n✅ Total deletions: ${deletedItems.length}`);

    await context.close();
  });

  test("GET /competition - save formatted competition data", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      storageState: ".auth/user.json",
    });

    const page = await context.newPage();

    let competitionData = null;

    page.on("response", async (response) => {
      const url = response.url();
      if (url.includes("/competition") && !url.includes("delete")) {
        try {
          const data = await response.json();
          if (data.props?.competitions?.data) {
            competitionData = data;
          }
        } catch (e) {
          // Ignore
        }
      }
    });

    await page.goto(`${baseURL}/competition`);
    await page.waitForLoadState("networkidle");

    if (competitionData) {
      const competitions = (competitionData as any).props.competitions.data;

      // Format and save only essential data
      const formattedData = competitions.map((comp: any) => ({
        id: comp.id,
        competition_id: comp.competition_id,
        name: comp.name,
        organizer: comp.organizer,
        start_date: comp.start_date,
        end_date: comp.end_date,
        status: comp.status,
        banner_url: comp.banner,
      }));

      saveResponse("competition-list-formatted", {
        timestamp: new Date().toISOString(),
        total: formattedData.length,
        competitions: formattedData,
      });

      console.log(
        `✅ Saved formatted data for ${formattedData.length} competitions`,
      );
    }

    await context.close();
  });
});
