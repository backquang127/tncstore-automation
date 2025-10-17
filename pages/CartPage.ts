import { Page, expect } from "@playwright/test";
import { Reporter } from "../utils/reporter";

export class CartPage {
  private readonly quantityInputs = "//input[contains(@class, 'js-buy-quantity')]";
  private readonly firstPlusSign = "(//a[@class='js-quantity-change'])[1]";
  private readonly firstMinusSign = "(//a[@class='js-quantity-change'])[2]";
  private readonly makePaymentButton = "//a[@class='button-send-cart']";
  private readonly confirmPurchaseButton = "//button[span[text()='Xác nhận mua hàng']]";
  private readonly firstProductName = "//div[@class='name-price']/child::a";
  private readonly missingPhoneError = "(//div[@class='note-error'])[2]";
  private readonly deleteProductButton = "//a[contains(@class, 'js-delete-item')]";
  private readonly emptyCartMessage = "//p[contains(text(),'Bạn chưa có sản phẩm vào giỏ hàng')]";
  private readonly totalCartPrice = ".js-total-cart-price";

  constructor(private readonly page: Page) {}

  async getCartSize(): Promise<number> {
    const inputs = this.page.locator(this.quantityInputs);
    await inputs.first().waitFor({ state: "visible" });
    const count = await inputs.count();
    return count;
  }

  async getFirstItemQuantity(): Promise<number> {
    const input = this.page.locator(this.quantityInputs).first();
    await input.waitFor({ state: "visible" });
    const value = await input.getAttribute("value");
    const quantity = parseInt(value || "0");
    await Reporter.logStep(` Current quantity of first item: ${quantity}`);
    return quantity;
  }

  async clickFirstPlusButton() {
    await this.page.locator(this.firstPlusSign).click();
  }

  async clickFirstMinusButton() {
    await this.page.locator(this.firstMinusSign).click();
  }

  async verifyFirstItemQuantity() {
    const quantity = await this.getFirstItemQuantity();
    expect(quantity).toBe(1);
    await Reporter.logStep("✅ Verified first item quantity is 1");
  }

  async checkItemQuantityIncrease() {
    const before = await this.getFirstItemQuantity();
    await this.clickFirstPlusButton();

    await this.page.waitForTimeout(1000);
    const after = await this.getFirstItemQuantity();

    expect(after).toBe(before + 1);
    await Reporter.logStep(`✅ Quantity increased from ${before} → ${after}`);
  }

  async checkItemQuantityDecrease() {
    const before = await this.getFirstItemQuantity();
    await this.clickFirstMinusButton();

    await this.page.waitForTimeout(1000);
    const after = await this.getFirstItemQuantity();

    expect(after).toBe(before - 1);
    await Reporter.logStep(`✅ Quantity decreased from ${before} → ${after}`);
  }

  async proceedToCheckout() {
    await Reporter.logStep("💳 Click Proceed to Checkout");
    await this.page.locator(this.makePaymentButton).click();
  }

  async clickOnConfirmPurchase() {
    await Reporter.logStep(" Click Confirm Purchase");
    await this.page.locator(this.confirmPurchaseButton).click();
  }

  async verifyMissingPhoneNumberError() {
    await this.clickOnConfirmPurchase();

    const alertPromise = this.page.waitForEvent("dialog").catch(() => null);
    const dialog = await alertPromise;
    if (dialog) {
      await dialog.accept();
      await Reporter.logStep(" Alert accepted");
    }

    const error = this.page.locator(this.missingPhoneError);
    await expect(error).toBeVisible();
    const text = await error.textContent();
    expect(text).toContain("Bạn chưa nhập SĐT");
    await Reporter.logStep(` Verified missing phone error: ${text}`);
  }

  async verifyMultipleProducts() {
    const count = await this.getCartSize();
    expect(count).toBeGreaterThanOrEqual(2);
  }

  async removeProduct() {
    const [dialog] = await Promise.all([
      this.page.waitForEvent("dialog"),
      this.page.locator(this.deleteProductButton).click(),
    ]);
    await dialog.accept();
    await Reporter.logStep("✅ Product removed successfully");
  }

  async getTotalCartPrice(): Promise<number> {
    const text = await this.page.locator(this.totalCartPrice).textContent();
    const value = parseFloat(text?.replace(/[^\d]/g, "") || "0");
    await Reporter.logStep(`Total cart price: ${value}`);
    return value;
  }

  async verifyTotalPriceChanged(totalBefore: number) {
    const totalPriceLocator = this.page.locator(this.totalCartPrice);
    await totalPriceLocator.scrollIntoViewIfNeeded();
    await totalPriceLocator.waitFor({ state: "visible" });

    const totalAfter = await this.getTotalCartPrice();
    expect(totalAfter).toBeLessThan(totalBefore);
    await Reporter.logStep(
      ` Total price decreased (Before: ${totalBefore} → After: ${totalAfter})`
    );
  }

  async verifyCartIsEmpty() {
    const msg = this.page.locator(this.emptyCartMessage);
    await expect(msg).toBeVisible();
    await Reporter.logStep(" Verified cart is empty");
  }

  async removeProductByName(productName: string) {
    const deleteButtonXPath = `//div[contains(@class,'item-cart')][.//a[contains(@class,'name') and contains(., "${productName}")]]//a[contains(@class,'js-delete-item')]`;

    const deleteButton = this.page.locator(deleteButtonXPath);
    await deleteButton.scrollIntoViewIfNeeded();

    console.log(`Attempting to remove product: ${productName}`);

    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await deleteButton.click();

    await expect(this.page.locator(`.item-cart:has-text("${productName}")`)).toHaveCount(0);
    console.log(`Removed product: ${productName}`);
  }

  async verifyProductRemoved(productName: string) {
  const productLocator = this.page.locator(
    `.list-product-cart a.name:has-text("${productName}")`
  );

  try {
    await this.page.waitForSelector(
      `.list-product-cart a.name:has-text("${productName}")`,
      { state: "detached", timeout: 5000 }
    );
    
    const count = await productLocator.count();
    expect(count).toBe(0);

    await Reporter.logStep(` Product "${productName}" has been removed successfully`);
  } catch (error) {
    await Reporter.logStep(` Product "${productName}" still exists or verification failed`);
    throw error;
  }
}

}
