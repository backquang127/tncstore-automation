import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";
import { HomePage } from "../src/pages/HomePage";
import { ProductDetailPage } from "../src/pages/ProductDetailPage";
import { CartPage } from "../src/pages/CartPage";
import { Reporter } from "../src/utils/reporter";
import { PopupHandler } from "../src/helpers/PopupHandler";
import { AuthenticationTestData } from "../src/data/AuthenticationTestData";
import { allure } from "allure-playwright";

test.describe("E-Commerce - End-to-End User Journey", () => {
  test("E2E-01: Login → Search → Add to Cart → Verify Cart", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productDetailPage = new ProductDetailPage(page);
    const cartPage = new CartPage(page);
    const popupHandler = new PopupHandler(page);

    const email = AuthenticationTestData.getValidEmail();
    const password = AuthenticationTestData.getValidPassword();

      await Reporter.logStep("Step 1: Dismiss all popups");
      await page.goto('');
      await popupHandler.dismissAllPopups();

      await Reporter.logStep("Step 2: Login with valid credentials");
      await loginPage.performLogin(email, password);
      const loginSuccess = await loginPage.isLoginSuccessful();
      expect(loginSuccess).toBeTruthy();

      await Reporter.logStep("Step 3: Search product and add first item to cart");
      await homePage.searchProduct("laptop");
      await homePage.clickFirstProduct();
      await productDetailPage.addToCart();
      const firstProductName = await productDetailPage.getProductName();
      await productDetailPage.goToCart();

      await Reporter.logStep("Step 4: Verify cart contents");
      const cartSize = await cartPage.getCartSize();
      await allure.parameter("Cart Size", cartSize.toString());
      expect(cartSize).toBeGreaterThanOrEqual(1);
  });
});
