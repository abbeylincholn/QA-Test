import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;
  private readonly consent: Locator;
  private readonly consentRoot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.consent = page.locator('.fc-button.fc-cta-consent');
    this.consentRoot = page.locator('.fc-consent-root');
    page.route('**/*doubleclick.net/**', route => route.abort());
    page.route('**/*googlesyndication.com/**', route => route.abort());
    page.route('**/*googleadservices.com/**', route => route.abort());
    page.route('**/*google-analytics.com/**', route => route.abort());
  }

  async dismissCookieConsent(): Promise<void> {
    const visible = await this.consent.isVisible({ timeout: 3000 }).catch(() => false);
    if (visible) {
      await this.consent.click();
      await this.consentRoot.waitFor({ state: 'hidden' });
    }
  }

  async dismissAdIfPresent(): Promise<void> {
    try {
      const closeBtn = this.page.frameLocator('#ad_iframe').locator('#dismiss-button');
      const visible = await closeBtn.isVisible({ timeout: 3000 }).catch(() => false);
      if (visible) {
        await closeBtn.click();
        await this.page.waitForTimeout(500);
      }
    } catch { /* continue */ }
  }
}
