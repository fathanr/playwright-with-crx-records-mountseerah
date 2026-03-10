import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000,

  expect: {
    timeout: 10000,
  },

  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  globalSetup: "./tests/auth.setup.ts",

  use: {
    baseURL: process.env.BASE_URL,
    storageState: ".auth/user.json",
    trace: "on-first-retry",

    actionTimeout: 15000,
    navigationTimeout: 30000,

    // 🔥 Set viewport to null for maximized window (headed mode)
    viewport: null,

    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: null, // Override device viewport for maximized window
        deviceScaleFactor: undefined, // Override device scale factor for null viewport
        launchOptions: {
          args: [
            "--start-maximized",
          ],
        },
      },
    },
  ],
});
