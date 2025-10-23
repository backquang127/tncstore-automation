import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly header: Locator; // Thêm locator cho header cố định
  readonly productListContainer: Locator;
  readonly productLinks: Locator;
  readonly firstProductLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- Định nghĩa các locators một cách rõ ràng ---
    this.searchBox = page.locator("#js-global-seach");
    this.searchButton = page.locator("button.submit-search");
    this.header = page.locator(".header-fixed");
    this.productListContainer = page.locator('#js-product-list');
    
    // Định nghĩa locator chung cho tất cả các link sản phẩm
    this.productLinks = this.productListContainer.locator("a.product-name");
    
    // Lấy sản phẩm đầu tiên từ locator chung ở trên
    this.firstProductLink = this.productLinks.first(); 
  }

  /**
   * Tạm thời ẩn header cố định để tránh lỗi bị che khuất khi click.
   */
  async hideStickyHeader() {
    if (await this.header.isVisible()) {
      await this.header.evaluate(element => element.style.display = 'none');
    }
  }

  /**
   * Hàm search được tối ưu hóa để chờ đợi một cách đáng tin cậy.
   * Nó chỉ hoàn thành sau khi danh sách sản phẩm đã được tải.
   */
  async searchProduct(productName: string) {
    await this.searchBox.fill(productName);
    await this.searchButton.click();

    // Chờ cho container chứa danh sách sản phẩm xuất hiện.
    // Đây là điểm chờ (checkpoint) quan trọng nhất và đáng tin cậy nhất.
    await this.productListContainer.waitFor({ state: 'visible', timeout: 20000 });
  }
  
  /**
   * Hàm click vào sản phẩm đầu tiên, đã được tối ưu hóa và đơn giản hóa.
   */
  async clickFirstProduct() {
    // 1. Đảm bảo có ít nhất một sản phẩm hiển thị.
    await expect(this.firstProductLink).toBeVisible({ timeout: 10000 });

    // 2. Ẩn header để tránh lỗi bị che.
    await this.hideStickyHeader();

    // 3. Click vào sản phẩm. Playwright sẽ tự động cuộn đến phần tử.
    await this.firstProductLink.click();
  }

  async navigateBack() {
    await this.page.goBack();
  }
}
