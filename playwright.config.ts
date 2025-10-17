import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  retries: 1,

  use: {
    baseURL: "https://www.tncstore.vn/",
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "Google Chrome",
      use: {
        channel: "chrome",
        viewport: null, // Enable dynamic viewport
        launchOptions: {
          args: ["--start-maximized"], // Maximize window on launch
        },
      },
    },
  ],

  reporter: [
    ["list"],
    ["allure-playwright"],
    ["html", { open: "never" }],
  ],
});
