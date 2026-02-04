import type { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  get emailInput() {
    return this.page.getByTestId("email-input").or(
      this.page.getByRole("textbox", { name: /email|user id/i })
    );
  }

  get passwordInput() {
    return this.page.getByTestId("password-input").or(
      this.page.getByRole("textbox", { name: /password/i })
    );
  }

  get loginButton() {
    return this.page.getByTestId("login-button").or(
      this.page.getByRole("button", { name: /login/i })
    );
  }

  get mrBillButton() {
    return this.page.getByTestId("mr-bill-button").or(
      this.page.getByRole("button", { name: "MR bill-icon" })
    );
  }

  get adminMrButton() {
    return this.page.getByTestId("admin-mr-button").or(
      this.page.getByRole("button", { name: "user admin mr" })
    );
  }

  get confirmButton() {
    return this.page.getByTestId("confirm-button").or(
      this.page.getByRole("button", { name: "OK" })
    );
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.mrBillButton.click();
    await this.adminMrButton.click();
    await this.confirmButton.click();
    
    // Wait for navigation away from login
    await this.page.waitForURL(url => !url.toString().includes('/auth/'));
    await this.page.waitForLoadState('networkidle');
  }
}
