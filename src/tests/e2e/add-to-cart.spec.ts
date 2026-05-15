import { test } from '@playwright/test';
import { ProductsPage } from 'pages/ProductsPage';
import { CartPage } from 'pages/CartPage';
import data from 'utils/TestData.json' assert { type: 'json' };

const { count, search, products } = data;

test('two products added to the cart both appear on the cart page', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const items = products.productsToAdd;

  await cartPage.clearCart();
  await productsPage.goto();

  for (let i = 0; i < items.length; i++) {
    await productsPage.addProductToCart(items[i]);
    i === items.length - 1
      ? await productsPage.goToCart()
      : await productsPage.continueShopping();
  }

  await cartPage.expectCartHasItems(items.length);
  await cartPage.expectProductInCart(search.productName1);
});

test('a single product added to the cart appears on the cart page', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  await cartPage.clearCart();
  await productsPage.goto();
  await productsPage.addProductToCart(products.secondProduct);
  await productsPage.goToCart();
  await cartPage.expectCartHasItems(count.expectedCartItems1);
});
