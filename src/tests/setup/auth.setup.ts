import { test as setup } from '@playwright/test';
import { LoginPage } from 'pages/LoginPage';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginWithValidCredentials({
    username: process.env.USER!,
    password: process.env.PWORD!
  });
  await page.context().storageState({ path: 'storageState.json' });
});
