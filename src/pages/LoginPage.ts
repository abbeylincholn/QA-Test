import { Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/BasePage';

export interface LoginCredentials {
  username: string;
  password: string;
}

export class LoginPage extends BasePage {
  private readonly email: Locator;
  private readonly password: Locator;
  private readonly loginBtn: Locator;
  private readonly loggedIn: Locator;
  private readonly form: Locator;

  constructor(page: Page) {
    super(page);
    const form = page.locator('.login-form');
    this.form     = form;
    this.email    = form.getByPlaceholder('Email Address');
    this.password = form.getByPlaceholder('Password');
    this.loginBtn = form.locator('[data-qa="login-button"]');
    this.loggedIn = page.locator('a:has-text("Logged in as")');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.dismissCookieConsent();
  }

  async loginWithValidCredentials(creds: LoginCredentials): Promise<void> {
    await this.form.waitFor({ state: 'visible' });
    await this.email.fill(creds.username);
    await this.password.fill(creds.password);
    await this.loginBtn.click();
    await this.loggedIn.waitFor({ state: 'visible' });
  }
}
