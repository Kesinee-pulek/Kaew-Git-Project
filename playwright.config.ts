import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:3000";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: "list",
  // The dev server compiles each route on first hit, which can exceed the 5s default.
  expect: { timeout: 15_000 },
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    {
      name: "edge",
      // Uses the installed Microsoft Edge, so no Playwright browser download is needed.
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: true,
  },
});
