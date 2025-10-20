import { allure } from "allure-playwright";

export class Reporter {
  static async logStep(message: string) {
    await allure.step(message, async () => {});
  }
}
