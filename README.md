# 🧪 Playwright E2E Testing Framework (TypeScript + Allure Report)

<div align="center">

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Allure](https://img.shields.io/badge/Allure_Report-FF6600?style=for-the-badge&logo=qameta&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

**Framework tự động hóa kiểm thử End-to-End cho [TNC Store](https://www.tncstore.vn)**

[Features](#-features) • [Installation](#️-installation) • [Usage](#-usage) • [Project Structure](#️-project-structure) • [Configuration](#️-configuration)

</div>

---

## 📖 Overview

Framework kiểm thử tự động E2E được xây dựng với **Playwright + TypeScript**, tích hợp **Allure Report** và **custom Reporter** để tạo báo cáo chi tiết, dễ đọc và dễ theo dõi.

### 🎯 Target Website
- **Website**: [TNC Store](https://www.tncstore.vn) - Cửa hàng PC Gaming, Laptop, và Linh kiện máy tính

---

## ✨ Features

- ✅ **Page Object Model (POM)** - Cấu trúc code rõ ràng, dễ bảo trì
- ✅ **TypeScript** - Type-safe, IntelliSense support
- ✅ **Allure Report** - Báo cáo HTML đẹp mắt với screenshots & videos
- ✅ **Custom Reporter** - Log steps chi tiết, tập trung vào business logic
- ✅ **Auto Screenshot/Video** - Tự động capture khi test fail
- ✅ **Retry Mechanism** - Tự động retry khi test không ổn định
- ✅ **Multi-browser Support** - Chromium, Firefox, WebKit

---

## ⚙️ Tech Stack

| Technology | Description |
|------------|-------------|
| 🎭 **Playwright** | Framework test tự động hỗ trợ Chromium, Firefox, WebKit |
| 💻 **TypeScript** | Ngôn ngữ có type checking, dễ maintain |
| 📊 **Allure Report** | Công cụ tạo báo cáo test đẹp mắt với rich metadata |
| ⚡ **Node.js** | Runtime environment cho test execution |

---

## 🏗️ Project Structure

📦 project-root
├── 📁 pages/ # Page Object Models
│ ├── HomePage.ts
│ ├── CartPage.ts
│ └── ProductDetailPage.ts
├── 📁 tests/ # Test suites
│ └── e2e/
│ └── cart.spec.ts
├── 📁 utils/ # Helper utilities
│ ├── Reporter.ts # Custom Allure logger
│ └── constants.ts
├── 📁 allure-results/ # Raw test results (auto-generated)
├── 📁 allure-report/ # HTML report (auto-generated)
├── 📄 playwright.config.ts # Playwright configuration
├── 📄 allure.properties # Allure settings
├── 📄 package.json # Dependencies & scripts
├── 📄 tsconfig.json # TypeScript configuration

---

## 🛠️ Installation

### Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x

### Steps

1. Clone repository
git clone <repository-url>
cd<project-folder>

2. Install dependencies
npm install

3. Install Playwright browsers
npx playwright install

---

## 🚀 Usage

### Run Tests

Run all tests
npm test

Run specific test file
npx playwright test tests/e2e/cart.spec.ts

Run in headed mode (see browser)
npx playwright test --headed

Run on specific browser
npx playwright test --project=chromium

### Generate & View Allure Report

Generate report from results
npm run report:generate

Open report in browser
npm run report:open

Run tests + Generate + Open report (all-in-one)
npm run test:report

---

## 📊 Custom Reporter Usage

File: `utils/Reporter.ts`


**✨ Benefits**: Allure report chỉ hiển thị các step quan trọng, loại bỏ noise từ internal Playwright actions.

---

## ⚙️ Configuration

### playwright.config.ts


**✨ Benefits**: Allure report chỉ hiển thị các step quan trọng, loại bỏ noise từ internal Playwright actions.

---

## ⚙️ Configuration

### playwright.config.ts


---

## 🧹 Clean Old Results

Trước khi chạy lại test suite mới:

Clean all generated folders
npm run clean

Or manually
rm -rf allure-results allure-report test-results

---

## 🔍 Debugging

Run with Playwright Inspector
npx playwright test --debug

Run specific test with trace
npx playwright test --trace on

Show report for failed tests
npx playwright show-report

---

## 🎨 Allure Report Features

- 📸 **Screenshots** - Auto capture on failure
- 🎥 **Videos** - Record test execution
- 📝 **Custom Steps** - Business-focused test logs
- 🏷️ **Tags & Categories** - Organize tests by features
- 📊 **Trends** - Track test stability over time
- 🔗 **Issue Tracking** - Link to JIRA/TMS

---

## 🧠 Best Practices

- ✅ Sử dụng **Page Object Model** cho tất cả page interactions
- ✅ Gọi `Reporter.logStep()` cho các business steps quan trọng
- ✅ Dùng **descriptive test names** và **comments** khi cần thiết
- ✅ Chạy `npm run clean` trước khi generate báo cáo mới
- ✅ Commit code nhưng **không commit** `allure-results/` và `allure-report/`
- ✅ Sử dụng `.env` file cho sensitive data (credentials, API keys)

---

## 🚧 Roadmap

- [ ] Thêm support cho **mobile testing** (iOS/Android)
- [ ] Tích hợp **CI/CD** (GitHub Actions / Jenkins)
- [ ] Upload Allure report lên **cloud storage**
- [ ] Thêm **API testing** với Playwright
- [ ] Visual regression testing với **Playwright Visual Comparisons**
- [ ] Parallel execution optimization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Lê Quang Bách**  
Automation Tester — FPT Software

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourprofile)

---

<div align="center">

### ✨ Clean tests. Clear reports. Confident releases. ✨

Made with ❤️ using Playwright + TypeScript + Allure

</div>
