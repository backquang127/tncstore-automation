import { Page, Locator, expect } from "@playwright/test";
import { Reporter } from "../utils/reporter";

export class HomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly productTitleLinks: Locator;
  readonly firstProductLink: Locator;
  readonly loadingSpinner: Locator;
  readonly resultTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchBox = page.locator("#js-global-seach");
    this.searchButton = page.locator("button.submit-search");
    this.productTitleLinks = page.locator("#js-product-list a.product-name");
    this.firstProductLink = page.locator(
      "(//div[@id='js-product-list']//a[contains(@class,'product-name')])[1]"
    );
    this.loadingSpinner = page.locator("//div[contains(@class,'success-form')]");
    this.resultTitle = page.locator("h1:has-text('Kết quả tìm kiếm')");
  }

  async searchProduct(productName: string) {

    await this.searchBox.waitFor({ state: "visible" });
    await this.searchBox.fill(productName);

    if (await this.loadingSpinner.isVisible().catch(() => false)) {
      await this.loadingSpinner.waitFor({ state: "hidden" });
    }

    await this.searchButton.click();
    await this.page.waitForSelector("h1:has-text('Kết quả tìm kiếm')");
  }
  
  async typeSearch(productName: string) {
    await Reporter.logStep(` Type product name: ${productName}`);
    await this.searchBox.waitFor({ state: "visible" });
    await this.searchBox.fill(productName);
  }

  async clickFirstProduct() {

    await this.productTitleLinks.first().waitFor({ state: "visible" });
    const count = await this.productTitleLinks.count();

    if (count === 0) {
      await Reporter.logStep(" No products found on homepage");
      throw new Error("No products found on homepage");
    }

    await this.firstProductLink.click();
  }

  async navigateBack() {
    await this.page.goBack();
  }
}
