import { Page, expect } from "@playwright/test";
import { Reporter } from "../utils/reporter";

export class ProductDetailPage {
  private readonly addToCartButton = "a:has-text('Thêm vào giỏ hàng')";
  private readonly cartIcon = "#js-header-cart";
  private readonly viewCartLink = "a.btn-goCart";
  private readonly loadingSpinner = "div.loading-spinner";
  private readonly quantityInput = "#js-buy-quantity";
  private readonly productName = "h1.name";
  private readonly successNotification = "div.text-24";
  private readonly decreaseButton = "a[data-value='-1']";
  private readonly originalPrice = "div.info-main-price del.old-price";
  private readonly salePrice = "div.info-main-price div.price";
  private readonly discountPercent = "div.info-main-price div.saleoff";
  private readonly similarProduct = "div.similar .owl-item.active:nth-child(2)";
  private readonly viewedProductsSection = "div.product-history .product-list";
  private readonly viewedProductNames = "a.product-name";

  constructor(private page: Page) {}

  async addToCart(quantity = 1) {
    await this.page.waitForSelector(this.addToCartButton, { state: "visible" });
    await this.setQuantity(quantity);
    await this.page.click(this.addToCartButton);
    await this.page.waitForTimeout(2000);
  }

  async setQuantity(quantity: number) {
    await this.page.fill(this.quantityInput, quantity.toString());
  }

  async goToCart() {
    await this.page.hover(this.cartIcon);
    await this.page.waitForSelector(this.viewCartLink, { state: "visible" });
    await this.page.click(this.viewCartLink);
  }

  async getProductName(): Promise<string> {
    await this.page.waitForSelector(this.productName);
    const name = await this.page.textContent(this.productName);
    await Reporter.logStep(`Product name found: ${name}`);
    return name?.trim() || "";
  }

  async verifyDiscountCalculation() {
    const originalPrice = await this.getOriginalPrice();
    const salePrice = await this.getSalePrice();
    const discountPercent = await this.getDiscountPercent();

    const expectedSale = originalPrice - (originalPrice * discountPercent) / 100;
    expect(Math.round(salePrice)).toBeCloseTo(Math.round(expectedSale), 0);

    await Reporter.logStep(
      ` Verified discount calculation: ${originalPrice}đ - ${discountPercent}% = ${salePrice}đ`
    );
  }

  async getOriginalPrice(): Promise<number> {
    const text = await this.page.textContent(this.originalPrice);
    return parseFloat(text?.replace(/[^\d]/g, "") || "0");
  }

  async getSalePrice(): Promise<number> {
    const text = await this.page.textContent(this.salePrice);
    return parseFloat(text?.replace(/[^\d]/g, "") || "0");
  }

  async getDiscountPercent(): Promise<number> {
    const text = await this.page.textContent(this.discountPercent);
    return parseFloat(text?.replace(/[^\d]/g, "") || "0");
  }

  async clickSimilarProduct() {
    await Reporter.logStep("Click first similar product");
    await this.page.click(this.similarProduct);
  }

  async isProductInViewedList(productName: string): Promise<boolean> {
    await this.page.waitForSelector(this.viewedProductsSection);
    const names = await this.page.$$eval(this.viewedProductNames, (els) =>
      els.map((e) => e.textContent?.trim() || "")
    );
    return names.some((name) => name.includes(productName));
  }
}
