import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000, // 60s per test
  expect: {
    timeout: 10000 // 10s for assertions
  },
  reporter: [
    ["html", { open: "never" }],
    ["list"],
    ["junit", { outputFile: "test-results/junit.xml" }]
  ],
  globalSetup: "./tests/auth.setup.ts",
  use: {
    baseURL: "https://pamafix-dev.dot.co.id",
    storageState: ".auth/user.json",
    trace: "on-first-retry",
    actionTimeout: 15000, // 15s for actions
    navigationTimeout: 30000 // 30s for navigation
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
