import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { Reporter } from "../utils/reporter";

test("Add two products and remove the first one", async ({ page }) => {
  const homePage = new HomePage(page);
  const productDetailPage = new ProductDetailPage(page);
  const cartPage = new CartPage(page);

  await Reporter.logStep("Step 1: Search product and add first product");
  await page.goto('');
  await homePage.searchProduct("laptop");
  await homePage.clickFirstProduct();

  const firstProductName = await productDetailPage.getProductName();
  await productDetailPage.addToCart();
  await homePage.navigateBack();

  await Reporter.logStep("Step 2: Add second product");
  await homePage.searchProduct("mouse");
  await homePage.clickFirstProduct();

  const secondProductName = await productDetailPage.getProductName();
  await productDetailPage.addToCart();
  await productDetailPage.goToCart();

  await Reporter.logStep("Step 3: Check cart");
  await cartPage.verifyMultipleProducts();

  await Reporter.logStep("Step 4: Remove first product");
  await cartPage.removeProductByName(firstProductName);
  await cartPage.verifyProductRemoved(firstProductName);
});

test("Add multiple products to cart, remove one, and verify total price", async ({ page }) => {
  const homePage = new HomePage(page);
  const productDetailPage = new ProductDetailPage(page);
  const cartPage = new CartPage(page);

  await Reporter.logStep("Step 1: Search and add first product");
  await page.goto('');
  await homePage.searchProduct("laptop");
  await homePage.clickFirstProduct();
  const firstProductName = await productDetailPage.getProductName();
  await productDetailPage.addToCart();
  await homePage.navigateBack();

  await Reporter.logStep("Step 2: Add second product");
  await homePage.searchProduct("mouse");
  await homePage.clickFirstProduct();
  const secondProductName = await productDetailPage.getProductName();
  await productDetailPage.addToCart();
  await productDetailPage.goToCart();

  await Reporter.logStep("Step 3: Verify both products are in cart");
  await cartPage.verifyMultipleProducts();

  await Reporter.logStep("Step 4: Remove first product and check total");
  const totalBefore = await cartPage.getTotalCartPrice();
  await cartPage.removeProductByName(firstProductName);
  await cartPage.verifyProductRemoved(firstProductName);
  await cartPage.verifyTotalPriceChanged(totalBefore);
});
