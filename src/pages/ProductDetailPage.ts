import { Page, Locator, expect } from "@playwright/test";
import { Reporter } from "../utils/reporter";

export class ProductDetailPage {
  readonly addToCartButton: Locator;
  readonly cartIcon: Locator;
  readonly viewCartLink: Locator;
  readonly buyNowLink: Locator;
  readonly loadingSpinner: Locator;
  readonly quantityInput: Locator;
  readonly productName: Locator;
  readonly successNotification: Locator;
  readonly decreaseButton: Locator;
  readonly originalPrice: Locator;
  readonly salePrice: Locator;
  readonly discountPercent: Locator;
  readonly similarProduct: Locator;
  readonly viewedProductsSection: Locator;
  readonly viewedProductNames: Locator;

  constructor(private page: Page) {
    this.addToCartButton = page.locator("a:has-text('Thêm vào giỏ hàng')");
    this.cartIcon = page.locator("#js-header-cart");

    this.viewCartLink = page.getByRole("link", { name: "Xem giỏ hàng", exact: true });
    this.buyNowLink = page.getByRole("link", { name: "Mua hàng", exact: true });

    this.loadingSpinner = page.locator("div.loading-spinner");
    this.quantityInput = page.locator("#js-buy-quantity");
    this.productName = page.locator("h1.name");
    this.successNotification = page.locator("div.text-24");
    this.decreaseButton = page.locator("a[data-value='-1']");
    this.originalPrice = page.locator("div.info-main-price del.old-price");
    this.salePrice = page.locator("div.info-main-price div.price");
    this.discountPercent = page.locator("div.info-main-price div.saleoff");
    this.similarProduct = page.locator("div.similar .owl-item.active:nth-child(2)");
    this.viewedProductsSection = page.locator("div.product-history .product-list");
    this.viewedProductNames = page.locator("a.product-name");
  }

  async addToCart(quantity = 1) {
    await Reporter.logStep("Adding product to cart");
    await this.addToCartButton.waitFor({ state: "visible" });
    await this.setQuantity(quantity);
    await this.addToCartButton.click();
    await this.successNotification.waitFor({ state: "visible" });
  }

  async setQuantity(quantity: number) {
    await Reporter.logStep(`Setting quantity: ${quantity}`);
    await this.quantityInput.fill(quantity.toString());
  }

  async goToCart() {
    await Reporter.logStep("Navigating to cart");
    await this.cartIcon.hover();
    await this.viewCartLink.waitFor({ state: "visible" });
    await this.viewCartLink.click();
  }

  async getProductName(): Promise<string> {
    await this.productName.waitFor({ state: "visible" });
    const name = (await this.productName.textContent())?.trim() || "";
    await Reporter.logStep(`Product name found: ${name}`);
    return name;
  }

  async verifyDiscountCalculation() {
    const originalPrice = await this.getOriginalPrice();
    const salePrice = await this.getSalePrice();
    const discountPercent = await this.getDiscountPercent();

    const expectedSale = originalPrice - (originalPrice * discountPercent) / 100;
    expect(Math.round(salePrice)).toBeCloseTo(Math.round(expectedSale), 0);

    await Reporter.logStep(
      `Verified discount calculation: ${originalPrice}đ - ${discountPercent}% = ${salePrice}đ`
    );
  }

  async getOriginalPrice(): Promise<number> {
    const text = (await this.originalPrice.textContent()) || "";
    return parseFloat(text.replace(/[^\d]/g, "") || "0");
  }

  async getSalePrice(): Promise<number> {
    const text = (await this.salePrice.textContent()) || "";
    return parseFloat(text.replace(/[^\d]/g, "") || "0");
  }

  async getDiscountPercent(): Promise<number> {
    const text = (await this.discountPercent.textContent()) || "";
    return parseFloat(text.replace(/[^\d]/g, "") || "0");
  }

  async clickSimilarProduct() {
    await Reporter.logStep("Clicking first similar product");
    await this.similarProduct.click();
  }

  async isProductInViewedList(productName: string): Promise<boolean> {
    await Reporter.logStep(`Checking if '${productName}' is in viewed list`);
    await this.viewedProductsSection.waitFor({ state: "visible" });
    const names = await this.page.$$eval("a.product-name", (els) =>
      els.map((e) => e.textContent?.trim() || "")
    );
    return names.some((name) => name.includes(productName));
  }
}
