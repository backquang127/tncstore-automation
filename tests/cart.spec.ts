import { test, expect, Page } from "@playwright/test";
import { HomePage } from "../src/pages/HomePage";
import { ProductDetailPage } from "../src/pages/ProductDetailPage";
import { CartPage } from "../src/pages/CartPage";

test.describe("Cart Functionality", () => {
  let firstProductName: string;

  // 'beforeEach' sẽ chạy lại trước mỗi test, đảm bảo mỗi test có một giỏ hàng "sạch"
  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    const productDetailPage = new ProductDetailPage(page);

    await test.step("Setup: Add two products to cart", async () => {
      await page.goto('/');
      // Thêm sản phẩm 1
      await homePage.searchProduct("laptop");
      await homePage.clickFirstProduct();
      firstProductName = await productDetailPage.getProductName();
      await productDetailPage.addToCart();
      // Thêm sản phẩm 2
      await page.goto('/');
      await homePage.searchProduct("mouse");
      await homePage.clickFirstProduct();
      await productDetailPage.addToCart();
      
      await productDetailPage.goToCart();
    });
  });

  test("TID:CART-01 Add two products and remove the first one", async ({ page }) => {
    const cartPage = new CartPage(page);
    await test.step("Verify and remove product", async () => {
      await cartPage.verifyMultipleProducts();
      await cartPage.removeProductByName(firstProductName);
      await cartPage.verifyProductRemoved(firstProductName);
    });
  });

  test("TID:CART-02 Add multiple products, remove one, and verify total", async ({ page }) => {
    const cartPage = new CartPage(page);
    await test.step("Verify, remove product, and check total", async () => {
      await cartPage.verifyMultipleProducts();
      const totalBefore = await cartPage.getTotalCartPrice();
      await cartPage.removeProductByName(firstProductName);
      await cartPage.verifyProductRemoved(firstProductName);
      await cartPage.verifyTotalPriceChanged(totalBefore);
    });
  });
});

