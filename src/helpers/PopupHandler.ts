import { Page, Locator } from "@playwright/test";

/**
 * Handles popup dismissal and JavaScript alert handling in Playwright
 */
export class PopupHandler {
  private page: Page;

  // Selectors giống bản Java
  private readonly POPUP_CLOSE_BTN_1_XPATH =
    "//div[@class='widget-header--inner widget-header--inner--collapsed']//span[@class='widget-header--button-close-icon']";
  private readonly POPUP_CLOSE_BTN_2_XPATH =
    "//div[@class='widget-preview--btn-close']";
  private readonly POPUP_CLOSE_BTN_1_CSS =
    "div.widget-header--inner.widget-header--inner--collapsed span.widget-header--button-close-icon";
  private readonly POPUP_CLOSE_BTN_2_CSS = ".widget-preview--btn-close";

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Attempts to dismiss all known popups on the page
   */
  async dismissAllPopups() {
    await this.tryClosePopup(this.POPUP_CLOSE_BTN_1_XPATH);
    await this.tryClosePopup(this.POPUP_CLOSE_BTN_2_XPATH);
    await this.tryClosePopup(this.POPUP_CLOSE_BTN_1_CSS);
    await this.tryClosePopup(this.POPUP_CLOSE_BTN_2_CSS);
  }

  /**
   * Try closing a popup by given selector
   * @param selector - XPath or CSS selector
   */
  private async tryClosePopup(selector: string) {
    try {
      const elements: Locator = this.page.locator(selector);
      const count = await elements.count();

      for (let i = 0; i < count; i++) {
        const btn = elements.nth(i);
        const visible = await btn.isVisible();
        const enabled = await btn.isEnabled();

        if (visible && enabled) {
          await btn.click({ timeout: 2000 });
          console.log(`✅ Closed popup with selector: ${selector}`);
        }
      }
    } catch (err: any) {
      console.warn(`⚠️ Could not close popup ${selector}: ${err.message}`);
    }
  }

  /**
   * Waits for JavaScript alert to be present and returns its message
   * @param timeoutSeconds Timeout in seconds
   * @returns alert text or null
   */
  async waitForAlert(timeoutSeconds: number): Promise<string | null> {
    try {
      const dialogPromise = new Promise<string>((resolve) => {
        this.page.once("dialog", async (dialog) => {
          resolve(dialog.message());
        });
      });

      const result = await Promise.race([
        dialogPromise,
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), timeoutSeconds * 1000)
        ),
      ]);

      if (result) console.log(`🔔 Alert detected: ${result}`);
      return result;
    } catch (err: any) {
      console.warn(`⚠️ No alert present after ${timeoutSeconds}s`);
      return null;
    }
  }

  /**
   * Accepts (clicks OK on) JavaScript alert and returns its text
   * @param timeoutSeconds timeout in seconds
   * @returns alert text or null
   */
  async getAlertTextAndAccept(timeoutSeconds: number): Promise<string | null> {
    try {
      const dialogPromise = new Promise<string>((resolve) => {
        this.page.once("dialog", async (dialog) => {
          const msg = dialog.message();
          console.log(`🔔 Alert text: ${msg}`);
          await dialog.accept();
          console.log("✅ Alert accepted");
          resolve(msg);
        });
      });

      const result = await Promise.race([
        dialogPromise,
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), timeoutSeconds * 1000)
        ),
      ]);

      return result;
    } catch (err: any) {
      console.error(`❌ Failed to get alert text and accept: ${err.message}`);
      return null;
    }
  }

  /**
   * Accept alert without reading its text
   * @param timeoutSeconds timeout in seconds
   */
  async acceptAlert(timeoutSeconds: number): Promise<void> {
    try {
      this.page.once("dialog", async (dialog) => {
        console.log(`🔔 Alert found: ${dialog.message()}`);
        await dialog.accept();
        console.log("✅ Alert accepted");
      });

      await this.page.waitForTimeout(timeoutSeconds * 1000);
    } catch (err: any) {
      console.error(`❌ Failed to accept alert: ${err.message}`);
    }
  }
}
