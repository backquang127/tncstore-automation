import { test, expect, TestInfo } from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";
import { HomePage } from "../src/pages/HomePage";
import { ProductDetailPage } from "../src/pages/ProductDetailPage";
import { CartPage } from "../src/pages/CartPage";
import { PopupHandler } from "../src/helpers/PopupHandler";
import { AuthenticationTestData } from "../src/data/AuthenticationTestData";
import { allure } from "allure-playwright";

test.describe("E-Commerce - End-to-End User Journey", () => {
  // Thêm 'testInfo' vào tham số của hàm test để lấy worker index
  test("TID:E2E-01: Login → Search → Add to Cart → Verify Cart", async ({ page }, testInfo: TestInfo) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const popupHandler = new PopupHandler(page);

    // Sử dụng một email duy nhất cho mỗi worker để tránh xung đột khi chạy song song.
    // Giả định bạn đã tạo hàm getUniqueEmailForWorker(testInfo) trong AuthenticationTestData.
    const email = AuthenticationTestData.getValidEmail();
    const password = AuthenticationTestData.getValidPassword();

    await test.step("Step 1: Go to homepage and dismiss popups", async () => {
      await page.goto('');
      await popupHandler.dismissAllPopups();
    });

    await test.step("Step 2: Login with unique credentials", async () => {
      await loginPage.performLogin(email, password);
      const loginSuccess = await loginPage.isLoginSuccessful();
      expect(loginSuccess, "Login action should be successful.").toBeTruthy();
    });

    await test.step("Step 3: Search for a product, add it to the cart", async () => {
      await homePage.searchProduct("laptop");
      await homePage.clickFirstProduct();
      
      const productName = await productDetailPage.getProductName();
      allure.parameter("Product Added", productName); // Ghi lại tên sản phẩm vào báo cáo
      
      await productDetailPage.addToCart();
      await productDetailPage.goToCart();
    });
    
    await test.step("Step 4: Verify cart contents", async () => {
      const cartSize = await cartPage.getCartSize();
      allure.parameter("Cart Item Count", cartSize.toString());
      expect(cartSize, "Cart should contain at least one item.").toBeGreaterThanOrEqual(1);
    });
  });
});
