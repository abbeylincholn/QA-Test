import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './src/tests',
  timeout: 40_000,
  expect: { timeout: 8_000 },
  retries: 1,
  reporter: [
    ['line'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
   // ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false }]
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://automationexercise.com',
    browserName: 'chromium',
    headless: true,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    serviceWorkers: 'block',
    launchOptions: {
      args: ['--disable-extensions', '--disable-background-networking']
    }
  },
  projects: [
    {
      name: 'auth',
      testMatch: ['**/setup/auth.setup.ts'],
      use: { storageState: undefined }
    },
    {
      name: 'ui-tests',
      testMatch: [
        '**/e2e/add-to-cart.spec.ts',
        '**/e2e/search.spec.ts'
      ],      
      use: { storageState: { cookies: [], origins: [] } }
    },
    {
      name: 'register',
      testMatch: [
        '**/e2e/register.spec.ts',
        '**/e2e/checkout.spec.ts'
      ],
      use: { storageState: { cookies: [], origins: [] } }
    }
  ]
});
