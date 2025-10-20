import { Page, Locator, expect } from "@playwright/test";
import { Reporter } from "../utils/reporter";

export class LoginPage {
  readonly page: Page;
  readonly accountButton: Locator;
  readonly loginPopup: Locator;
  readonly loginEmailField: Locator;
  readonly loginPasswordField: Locator;
  readonly loginButton: Locator;
  readonly logoutLink: Locator;
  readonly createAccountLink: Locator;
  readonly emailErrorMessage: Locator;
  readonly passwordErrorMessage: Locator;
  readonly generalErrorMessage: Locator;
  readonly loggedInUserName: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountButton = page.locator(
      "//a[contains(@class,'item') and contains(@class,'account')]//span[contains(@class,'hover-txt')]"
    );
    this.loginPopup = page.locator("#js-form-holder");
    this.loginEmailField = page.locator("//input[@id='js-login-email']");
    this.loginPasswordField = page.locator("//input[@id='js-login-password']");
    this.loginButton = page.locator("//a[@class='btn-submit']");
    this.logoutLink = page.locator(
      "//a[contains(text(),'Đăng xuất') or contains(text(),'Logout')]"
    );
    this.createAccountLink = page.locator(
      "//*[@id='js-form-login']/div[2]/div[4]/a"
    );
    this.emailErrorMessage = page.locator("//span[@id='js-login-email-error']");
    this.passwordErrorMessage = page.locator(
      "//span[@id='js-login-password-error']"
    );
    this.generalErrorMessage = page.locator(
      "//div[contains(@class,'error-message')]"
    );
    this.loggedInUserName = page.locator(
      "//span[@class='hover-txt line-clamp-1']"
    );
  }

  async openLoginPopup() {
    await Reporter.logStep("Open login popup");
    await this.accountButton.waitFor({ state: "visible" });
    await this.accountButton.click();

    await expect(this.loginPopup).toBeVisible({
      timeout: 5000,
    });
  }

  async setEmail(email: string) {
    await Reporter.logStep(`Set login email: ${email}`);
    await this.loginEmailField.waitFor({ state: "visible" });
    await this.loginEmailField.fill(email);
  }

  async setPassword(password: string) {
    await Reporter.logStep("Set login password");
    await this.loginPasswordField.waitFor({ state: "visible" });
    await this.loginPasswordField.fill(password);
  }

  async submitLogin() {
    await Reporter.logStep("Submit login form");
    await this.loginButton.waitFor({ state: "visible" });
    await this.loginButton.click();
  }

  async performLogin(email: string, password: string) {
    await Reporter.logStep(`Perform login with email: ${email}`);
    await this.openLoginPopup();
    await this.setEmail(email);
    await this.setPassword(password);
    await this.submitLogin();
  }

  async isLoginSuccessful(): Promise<boolean> {
    await Reporter.logStep("Verify login success");
    try {
      await this.loggedInUserName.waitFor({ state: "visible", timeout: 8000 });
      const accountText =
        (await this.loggedInUserName.textContent())?.trim() || "";
      const success: boolean =
        accountText !== "" && accountText !== "Tài khoản" && accountText !== "Account";
      return success;
    } catch {
      await Reporter.logStep("Login failed or username not visible");
      return false;
    }
  }

  async navigateToRegister() {
    await Reporter.logStep("Navigate to register form");
    await this.openLoginPopup();
    await this.createAccountLink.waitFor({ state: "visible" });
    await this.createAccountLink.click();
  }
}
