import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from 'pages/BasePage';

export class ProductsPage extends BasePage {
  private readonly searchInput: Locator;
  private readonly searchBtn: Locator;
  private readonly resultsHeading: Locator;
  private readonly productCards: Locator;
  private readonly modal: Locator;
  private readonly continueBtn: Locator;
  private readonly viewCartBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput    = page.locator('#search_product');
    this.searchBtn      = page.locator('#submit_search');
    this.resultsHeading = page.locator('.title').filter({ hasText: 'Searched Products' });
    this.productCards   = page.locator('.single-products');
    this.modal          = page.locator('.modal-dialog.modal-confirm');
    this.continueBtn    = this.modal.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartBtn    = this.modal.getByRole('link', { name: 'View Cart' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/products');
    await this.dismissCookieConsent();
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchBtn.click({ force: true });
    await expect(this.resultsHeading).toBeVisible();
  }

  async addProductToCart(idx: number): Promise<void> {
    const card = this.productCards.nth(idx);
    // Scroll card into view first so hover works reliably
    await card.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    // Trigger hover properly to activate the overlay
    await card.hover();
    await this.page.waitForTimeout(300);
    // Click the add to cart button that appears on hover
    const addBtn = card.locator('.product-overlay .add-to-cart');
    await addBtn.waitFor({ state: 'visible', timeout: 5000 });
    await addBtn.click();
    // Wait for modal confirmation to appear
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });
  }

  async continueShopping(): Promise<void> {
    await this.continueBtn.click();
    await expect(this.modal).toBeHidden();
  }

  async goToCart(): Promise<void> {
    await this.viewCartBtn.click();
    await this.page.waitForURL('**/view_cart**');
  }

  async expectResultsVisible(): Promise<void> {
    await expect(this.resultsHeading).toBeVisible();
    expect(await this.productCards.count()).toBeGreaterThan(0);
  }

  async expectAllResultsContain(keyword: string): Promise<void> {
    const count = await this.productCards.count();
    for (let i = 0; i < count; i++) {
      const text = await this.productCards.nth(i).locator('.productinfo p').innerText();
      expect(text.toLowerCase().replace(/[-\s]/g, '')).toContain(
        keyword.toLowerCase().replace(/[-\s]/g, '')
      );
    }
  }
}