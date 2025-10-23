import { test, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { HomePage } from "../src/pages/HomePage";
import { SearchPage } from "../src/pages/SearchPage";
import searchData from "../tests/testdata/searchData.json";

test.describe("Search Functionality", () => {
  // --- Test case 1: Data-driven test for search results ---
  searchData.forEach(({ keyword }, index) => {
    test(`TID:SEARCH-${index + 1} Verify all search results contain keyword: ${keyword}`, async ({ page }) => {
      await allure.story("Product Search");
      await allure.severity("blocker");
      await allure.description(`Verify all search results for the keyword '${keyword}' are relevant.`);

      const homePage = new HomePage(page);
      const searchPage = new SearchPage(page);

      await test.step(`Step 1: Search for product '${keyword}'`, async () => {
        await page.goto("");
        await homePage.searchProduct(keyword);
      });

      await test.step(`Step 2: Verify that search results are displayed`, async () => {
        const hasResult = await searchPage.hasResults();
        expect(hasResult, `Search for '${keyword}' should return results.`).toBeTruthy();
        
        const resultCount = await searchPage.getProductCount();
        allure.parameter("Results Count", resultCount.toString());
      });

      await test.step(`Step 3: Verify all displayed results contain the keyword '${keyword}'`, async () => {
        await searchPage.verifyAllResultsContainKeyword(keyword);
      });
    });
  });

  // --- Test case 2: Verify 'Load More' functionality ---
  test("TID:SEARCH-LOADMORE Verify 'Xem thêm' button loads additional products", async ({ page }) => {
    await allure.story("Search - Load More Feature");
    await allure.severity("normal");
    await allure.description("Verify that clicking 'Xem thêm' loads more products instead of reloading the page.");

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const keyword = "laptop";

    await test.step(`Step 1: Search for keyword '${keyword}' and ensure results are shown`, async () => {
      await page.goto('');
      await homePage.searchProduct(keyword);
      await expect(searchPage.productResults.first(), "Search should display at least one product.").toBeVisible();
    });

    await test.step("Step 2: Verify 'Xem thêm' button loads more products", async () => {
      const loadMoreWorks = await searchPage.verifyLoadMoreWorks();
      expect(loadMoreWorks, "'Xem thêm' button should load more products correctly.").toBeTruthy();
    });
  });
});
