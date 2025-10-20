import { Page, Locator, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { Reporter } from "../utils/reporter";

export class SearchPage {
  readonly productResults: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly suggestionList: Locator;
  readonly suggestionItems: Locator;
  readonly noProductNoti: Locator;
  readonly loadMoreButton: Locator;

  constructor(private readonly page: Page) {
    this.productResults = page.locator("#js-product-list a.product-name.line-clamp-2");
    this.searchInput = page.locator("//input[@id='js-global-seach']");
    this.searchButton = page.locator("//button[@class='submit-search']");
    this.suggestionList = page.locator("//div[@class='content-suggestions']");
    this.suggestionItems = page.locator("//div[@class='content-suggestions']//a");
    this.noProductNoti = page.locator("//h2[contains(text(),'Ôi')]");
    this.loadMoreButton = page.locator("a.more-all.show-more-product");
  }

    async getProductCount(): Promise<number> {
    await allure.step("Get search results count", async () => {});
    try {
        return await this.productResults.count();
    } catch {
        return 0;
    }
    }

  async getNoProductNoti(): Promise<string> {
    await this.noProductNoti.waitFor({ state: "visible" });
    return (await this.noProductNoti.textContent())?.trim() ?? "";
  }

    async hasResults(): Promise<boolean> {
    await this.productResults.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    const count = await this.productResults.count();
    return count > 0;
    }


  async waitForSearchSuggestions(): Promise<void> {
    await allure.step("Wait for search suggestions", async () => {
      try {
        await this.suggestionList.waitFor({ state: "visible", timeout: 5000 });
        Reporter.logStep("Search suggestions loaded");
      } catch {
        Reporter.logStep("Search suggestions did not load");
      }
    });
  }

  async getSuggestionItems(): Promise<string[]> {
    let result: string[] = [];
    await allure.step("Get search suggestion items", async () => {
      await this.waitForSearchSuggestions();
      const items = await this.suggestionItems.allInnerTexts();
      result = items.map((t) => t.trim()).filter(Boolean);
    });
    return result;
  }

  async verifyAllResultsContainKeyword(keyword: string): Promise<void> {
    await allure.step(`Verify all search results contain keyword: ${keyword}`, async () => {
      const count = await this.productResults.count();
      if (count === 0) {
        throw new Error("No search results found to verify.");
      }

      for (let i = 0; i < count; i++) {
        const name = (await this.productResults.nth(i).innerText()).trim();
        Reporter.logStep(`Checking product: ${name}`);
        expect(name.toLowerCase()).toContain(keyword.toLowerCase());
      }

      Reporter.logStep(`All search results contain the keyword: ${keyword}`);
    });
  }

  async getAllProductNames(): Promise<string[]> {
    await this.productResults.first().waitFor({ state: "visible" });
    const names = await this.productResults.allInnerTexts();
    return names.map((t) => t.trim()).filter(Boolean);
  }

  async isLoadMoreButtonVisible(): Promise<boolean> {
    return this.loadMoreButton.isVisible();
  }

  async clickLoadMoreAndWait(): Promise<void> {
    if (!(await this.isLoadMoreButtonVisible())) {
      Reporter.logStep("Không tìm thấy nút 'Xem thêm'. Có thể đã hiển thị hết sản phẩm.");
      return;
    }

    const beforeCount = (await this.getAllProductNames()).length;
    await this.loadMoreButton.scrollIntoViewIfNeeded();
    await this.loadMoreButton.click();

    await this.page.waitForFunction(
    (args: (string | number)[]) => {
        const selector = args[0] as string;
        const before = args[1] as number;
        return document.querySelectorAll(selector).length > before;
    },
    ["#js-product-list a.product-name.line-clamp-2", beforeCount],
    { timeout: 5000 }
    );


    const afterCount = (await this.getAllProductNames()).length;
    Reporter.logStep(`Đã bấm 'Xem thêm' (${beforeCount} → ${afterCount})`);
  }

  async verifyLoadMoreWorks(): Promise<boolean> {
    if (!(await this.isLoadMoreButtonVisible())) {
      Reporter.logStep("Không có nút 'Xem thêm' trên trang (có thể ít sản phẩm).");
      return false;
    }

    const initialCount = (await this.getAllProductNames()).length;
    await this.clickLoadMoreAndWait();
    const newCount = (await this.getAllProductNames()).length;

    return newCount > initialCount;
  }
}
