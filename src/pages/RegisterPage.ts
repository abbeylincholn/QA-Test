import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/BasePage';

export interface NewUserDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: { day: string; month: string; year: string };
  address: {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    mobileNumber: string;
  };
}

export class RegisterPage extends BasePage {
  private readonly name: Locator;
  private readonly email: Locator;
  private readonly signupBtn: Locator;
  private readonly password: Locator;
  private readonly dobDay: Locator;
  private readonly dobMonth: Locator;
  private readonly dobYear: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly company: Locator;
  private readonly address1: Locator;
  private readonly address2: Locator;
  private readonly country: Locator;
  private readonly state: Locator;
  private readonly city: Locator;
  private readonly zipCode: Locator;
  private readonly mobile: Locator;
  private readonly createBtn: Locator;
  private readonly successMsg: Locator;
  private readonly continueBtn: Locator;
  private readonly loggedIn: Locator;
  private readonly emailExistsError: Locator;

  constructor(page: Page) {
    super(page);
    this.name      = page.locator('[data-qa="signup-name"]');
    this.email     = page.locator('[data-qa="signup-email"]');
    this.signupBtn = page.locator('[data-qa="signup-button"]');
    const form     = page.locator('.login-form');
    this.password    = form.locator('#password');
    this.dobDay      = form.locator('#days');
    this.dobMonth    = form.locator('#months');
    this.dobYear     = form.locator('#years');
    this.firstName   = form.locator('#first_name');
    this.lastName    = form.locator('#last_name');
    this.company     = form.locator('#company');
    this.address1    = form.locator('#address1');
    this.address2    = form.locator('#address2');
    this.country     = form.locator('#country');
    this.state       = form.locator('#state');
    this.city        = form.locator('#city');
    this.zipCode     = form.locator('#zipcode');
    this.mobile      = form.locator('#mobile_number');
    this.createBtn   = form.locator('[data-qa="create-account"]');
    this.successMsg  = page.locator('[data-qa="account-created"]');
    this.continueBtn = page.locator('[data-qa="continue-button"]');
    this.loggedIn    = page.locator('a:has-text("Logged in as")');
    this.emailExistsError = page.getByText('Email Address already exist!');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.dismissCookieConsent();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.name.fill(name);
    await this.email.fill(email);
    await this.signupBtn.click();
    const emailExists = await this.emailExistsError
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (emailExists) {
      throw new Error(
        `Registration failed: "${email}" is already registered. ` +
        `Update the email in TestData.json to a fresh address.`
      );
    }
    await this.password.waitFor({ state: 'visible' });
  }

  async fillAccountDetails(user: NewUserDetails): Promise<void> {
    await this.password.fill(user.password);
    await this.dobDay.selectOption(user.dateOfBirth.day);
    await this.dobMonth.selectOption(user.dateOfBirth.month);
    await this.dobYear.selectOption(user.dateOfBirth.year);
    await this.firstName.fill(user.address.firstName);
    await this.lastName.fill(user.address.lastName);
    await this.company.fill(user.address.company);
    await this.address1.fill(user.address.address1);
    await this.address2.fill(user.address.address2);
    await this.country.selectOption(user.address.country);
    await this.state.fill(user.address.state);
    await this.city.fill(user.address.city);
    await this.zipCode.fill(user.address.zipCode);
    await this.mobile.fill(user.address.mobileNumber);
    await this.createBtn.click();
  }

  async confirmAccountCreated(): Promise<void> {
    await expect(this.successMsg).toBeVisible();
    await this.continueBtn.click();
    await expect(this.loggedIn).toBeVisible();
  }
}
