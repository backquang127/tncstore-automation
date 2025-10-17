# TNCStore Automation

Tự động hóa kiểm thử UI cho tncstore.vn sử dụng Playwright + TypeScript và Allure.

## Tóm tắt
- Test runner: Playwright (cấu hình ở [playwright.config.ts](playwright.config.ts)).  
- Test/specs nằm trong thư mục [tests](tests). Ví dụ: [tests/cart.spec.ts](tests/cart.spec.ts).  
- Page Object pattern trong [pages](pages) — ví dụ các lớp: [`CartPage`](pages/CartPage.ts), [`ProductDetailPage`](pages/ProductDetailPage.ts), [`HomePage`](pages/HomePage.ts).  
- Báo cáo: Allure (kết quả → `allure-results`, báo cáo được generate sang `allure-report`).

## Yêu cầu
- Node.js (LTS)
- npm

## Cài đặt
```bash
npm install
