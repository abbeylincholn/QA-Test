import { test as setup } from '@playwright/test';
import { LoginPage } from 'pages/LoginPage';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginWithValidCredentials({
    username: process.env.AE_USERNAME!,
    password: process.env.AE_PASSWORD!,
  });
  await page.context().storageState({ path: 'storageState.json' });
});
