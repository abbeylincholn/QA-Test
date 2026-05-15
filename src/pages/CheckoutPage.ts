import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/BasePage';

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  cardCvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class CheckoutPage extends BasePage {
  private readonly deliveryAddr: Locator;
  private readonly billingAddr: Locator;
  private readonly placeOrderBtn: Locator;
  private readonly cardName: Locator;
  private readonly cardNumber: Locator;
  private readonly cardCvc: Locator;
  private readonly expiryMonth: Locator;
  private readonly expiryYear: Locator;
  private readonly payBtn: Locator;
  private readonly orderSuccess: Locator;

  constructor(page: Page) {
    super(page);
    this.deliveryAddr  = this.page.locator('#address_delivery');
    this.billingAddr   = this.page.locator('#address_invoice');
    this.placeOrderBtn = this.page.locator('.check_out');
    this.cardName      = this.page.locator('[data-qa="name-on-card"]');
    this.cardNumber    = this.page.locator('[data-qa="card-number"]');
    this.cardCvc       = this.page.locator('[data-qa="cvc"]');
    this.expiryMonth   = this.page.locator('[data-qa="expiry-month"]');
    this.expiryYear    = this.page.locator('[data-qa="expiry-year"]');
    this.payBtn        = this.page.locator('[data-qa="pay-button"]');
    this.orderSuccess  = this.page.locator('[data-qa="order-placed"]');
  }

  async expectDeliveryAddressContains(val: string): Promise<void> {
    await expect(this.deliveryAddr).toBeVisible();
    await expect(this.billingAddr).toBeVisible();
    await expect(this.deliveryAddr).toContainText(val);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderBtn.waitFor({ state: 'visible' });
    await this.placeOrderBtn.scrollIntoViewIfNeeded();
    await this.dismissAdIfPresent();
    await this.placeOrderBtn.click({ force: true });
    await this.cardName.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillPaymentDetails(payment: PaymentDetails): Promise<void> {
    await this.cardName.fill(payment.cardName);
    await this.cardNumber.fill(payment.cardNumber);
    await this.cardCvc.fill(payment.cardCvc);
    await this.expiryMonth.fill(payment.expiryMonth);
    await this.expiryYear.fill(payment.expiryYear);
    await this.payBtn.click();
  }

  async expectOrderPlaced(): Promise<void> {
    await this.orderSuccess.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.orderSuccess).toBeVisible();
  }
}
