import { test, expect } from "@playwright/test";
import { allure } from "allure-playwright";
import { Reporter } from "../src/utils/reporter";
import { HomePage } from "../src/pages/HomePage";
import { SearchPage } from "../src/pages/SearchPage";
import searchData from "../tests/testdata/searchData.json";


test.describe("Search Functionality", () => {
  searchData.forEach(({ keyword }, index) => {
    test(`TID:SEARCH-${index + 1} Verify all search results contain keyword: ${keyword}`, async ({ page }) => {
      await allure.story("Product Search");
      await allure.severity("blocker");
      await allure.description(`Verify all search results contain keyword '${keyword}'`);


      const homePage = new HomePage(page);
      const searchPage = new SearchPage(page);


      await Reporter.logStep(`Step 1: Search for product '${keyword}'`);
      await page.goto("");
      await homePage.searchProduct(keyword);


      const hasResult = await searchPage.hasResults();
      expect(hasResult).toBeTruthy();


      const resultCount = await searchPage.getProductCount();
      allure.parameter("Results Count", resultCount.toString());


      await Reporter.logStep(`Step 2: Verify all results contain '${keyword}'`);
      await searchPage.verifyAllResultsContainKeyword(keyword);
    });
  });


  test("TID:SEARCH-LOADMORE Verify 'Xem thêm' button loads additional products", async ({ page }) => {
    await allure.story("Search - Load More Feature");
    await allure.severity("normal");
    await allure.description("Verify that clicking 'Xem thêm' loads more products instead of reloading the page.");


    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const keyword = "laptop";


    await Reporter.logStep(`Step 1: Search for keyword '${keyword}'`);
    await page.goto('');
    await homePage.searchProduct(keyword);


    expect(await searchPage.hasResults()).toBeTruthy();


    await Reporter.logStep("Step 2: Verify 'Xem thêm' button loads more products");
    const loadMoreWorks = await searchPage.verifyLoadMoreWorks();


    expect(loadMoreWorks).toBeTruthy();
    await Reporter.logStep(`'Xem thêm' hoạt động đúng cho từ khóa '${keyword}'`);
  });
});