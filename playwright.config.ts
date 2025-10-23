import { defineConfig, devices } from "@playwright/test";
import path from "path";

// Biến này sẽ là `true` khi chạy trên GitHub Actions và `false` khi chạy trên máy bạn
const isCI = !!process.env.CI;

const REPORTS_DIR = path.join(__dirname, "reports");

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  
  // Chỉ chạy lại 1 lần nếu là môi trường CI, không chạy lại ở local
  retries: isCI ? 1 : 0,

  fullyParallel: true,
  
  // Dùng 5 workers trong CI, ở local Playwright sẽ tự quyết định số worker tối ưu
  workers: isCI ? 3 : undefined, 

  outputDir: path.join(REPORTS_DIR, "test-results"),

  use: {
    baseURL: "https://www.tncstore.vn/",
    
    // QUAN TRỌNG: Tự động chạy headless trong môi trường CI
    headless: isCI,
    
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Thêm trace để dễ debug hơn khi test fail trong CI
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: "Google Chrome",
      use: {
      channel:"chrome",
      headless: true,
      viewport: { width: 1920, height: 1080 },
      launchOptions: {
        args: ['--start-maximized'],
      },
    }
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
