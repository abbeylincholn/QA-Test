import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/BasePage';

export class CartPage extends BasePage {
  private readonly table: Locator;
  private readonly rows: Locator;
  private readonly checkoutBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.table       = page.locator('#cart_info_table');
    this.rows        = page.locator('#cart_info_table tbody tr');
    this.checkoutBtn = page.locator('.check_out');
  }

  async goto(): Promise<void> {
    await this.page.goto('/view_cart');
    await this.dismissCookieConsent();
  }

  async expectCartHasItems(expected: number): Promise<void> {
    await expect(this.table).toBeVisible();
    expect(await this.rows.count()).toBe(expected);
  }

  async expectProductInCart(name: string): Promise<void> {
    await expect(this.rows.filter({ hasText: name }).first()).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutBtn.click();
    await this.page.waitForURL('**/checkout');
  }

  async clearCart(): Promise<void> {
    await this.page.goto('/view_cart');
    await this.dismissCookieConsent();
    const deleteBtns = this.page.locator('.cart_quantity_delete');
    const count = await deleteBtns.count();
    for (let i = 0; i < count; i++) {
      await deleteBtns.first().click();
      await this.page.waitForTimeout(500);
    }
  }
}
