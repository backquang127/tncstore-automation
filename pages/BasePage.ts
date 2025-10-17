import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = "") {
    await this.page.goto(path);
  }

  async click(element: Locator) {
    await element.click();
  }

  async fill(element: Locator, text: string) {
    await element.fill(text);
  }

  async verifyText(element: Locator, expectedText: string | RegExp) {
    await expect(element).toHaveText(expectedText);
  }
  
  async handleDialog(accept: boolean = true) {
  this.page.once("dialog", async (dialog) => {
    console.log(`Dialog detected: ${dialog.message()}`);
    if (accept) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  });
}

}