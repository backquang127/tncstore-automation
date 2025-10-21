import { defineConfig, devices } from "@playwright/test";
import path from "path";

const REPORTS_DIR = path.join(__dirname, "reports");

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  retries: 1,

  fullyParallel: true,
  workers: 5,

  outputDir: path.join(REPORTS_DIR, "test-results"),

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
    ['allure-playwright', {
      detail: false,
      // Di chuyển thư mục allure-results vào trong reports
      resultsDir: path.join(REPORTS_DIR, "allure-results"),
    }],
    ["html", { 
      open: "never",
      // Di chuyển thư mục playwright-report vào trong reports
      outputFolder: path.join(REPORTS_DIR, "playwright-report"),
    }],
  ],
});
