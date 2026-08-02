/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/testing/e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: "http://localhost:5174",
    headless: true,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 5000,
  },
  webServer: {
    command: "npm run dev",
    port: 5174,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
