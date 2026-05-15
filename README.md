# Interactive QA v2

Playwright test automation framework for [Automation Exercise](https://automationexercise.com) built with TypeScript and the Page Object Model.

---

## Project Structure

```
Interactive_QA_v2/
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env
└── src/
    ├── pages/
    │   ├── BasePage.ts
    │   ├── LoginPage.ts
    │   ├── RegisterPage.ts
    │   ├── ProductsPage.ts
    │   ├── CartPage.ts
    │   └── CheckoutPage.ts
    ├── tests/
    │   ├── setup/
    │   │   └── auth.setup.ts
    │   └── e2e/
    │       ├── search.spec.ts
    │       ├── add-to-cart.spec.ts
    │       ├── checkout.spec.ts
    │       └── register.spec.ts
    └── utils/
        └── TestData.json
```

---

## Setup

**1. Install dependencies**
```bash
yarn install
```

**2. Install Playwright browser**
```bash
npx playwright install chromium
```

**3. Create your `.env` file** in the project root
```
BASE_URL=https://automationexercise.com
AE_USERNAME=your_email@gmail.com
AE_PASSWORD=your_password
```

---

## Running Tests

**Run all tests**
```bash
npx playwright test
```

**Run only cart and search tests**
```bash
npx playwright test --project=ui-tests
```

**Run only register and checkout tests**
```bash
npx playwright test --project=register
```

**View HTML report**
```bash
npx playwright show-report
```

---

## Test Cases

| Test | File | Description |
|------|------|-------------|
| Search | `search.spec.ts` | Search for a product and verify results |
| Add to Cart (x2) | `add-to-cart.spec.ts` | Add two products and verify both appear in cart |
| Add to Cart (x1) | `add-to-cart.spec.ts` | Add one product and verify it appears in cart |
| Checkout | `checkout.spec.ts` | Login, add products and complete payment |
| Register | `register.spec.ts` | Register a new account and verify login |

---

## Notes

- The **register test** generates a unique email on every run using `Date.now()` so it never conflicts with existing accounts.
- The **checkout and auth tests** require valid credentials in your `.env` file.
- Google ads are automatically blocked on every test run.
