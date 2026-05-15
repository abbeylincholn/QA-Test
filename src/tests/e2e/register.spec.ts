import { test, expect } from '@playwright/test';
import { RegisterPage } from 'pages/RegisterPage';
import data from 'utils/TestData.json' assert { type: 'json' };

test('a new user can register and is logged in after account creation', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const user = {
    ...data.newUser,
    email: `abbey.test+${Date.now()}@gmail.com`
  };

  await registerPage.goto();
  await registerPage.startSignup(user.firstName, user.email);
  await registerPage.fillAccountDetails(user);
  await registerPage.confirmAccountCreated();
  await expect(page.locator('a:has-text("Logged in as")')).toContainText(user.firstName);
});