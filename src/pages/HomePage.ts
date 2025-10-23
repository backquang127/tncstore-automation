import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly header: Locator;
  readonly productListContainer: Locator;
  readonly productLinks: Locator;
  readonly firstProductLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchBox = page.locator("#js-global-seach");
    this.searchButton = page.locator("button.submit-search");
    this.header = page.locator(".header-fixed");
    this.productListContainer = page.locator('#js-product-list');

    this.productLinks = this.productListContainer.locator("a.product-name");

    this.firstProductLink = this.productLinks.first(); 
  }

  async hideStickyHeader() {
    if (await this.header.isVisible()) {
      await this.header.evaluate(element => element.style.display = 'none');
    }
  }

  async searchProduct(productName: string) {
    await this.searchBox.fill(productName);
    await this.searchButton.click();

    // // Chờ cho container chứa danh sách sản phẩm xuất hiện.
    // // Đây là điểm chờ (checkpoint) quan trọng nhất và đáng tin cậy nhất.
    // await this.productListContainer.waitFor({ state: 'visible', timeout: 20000 });
  }

  async clickFirstProduct() {
    await expect(this.firstProductLink).toBeVisible({ timeout: 10000 });
    await this.hideStickyHeader();
    await this.firstProductLink.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    await this.firstProductLink.click();
  }

  async navigateBack() {
    await this.page.goBack();
  }
}
