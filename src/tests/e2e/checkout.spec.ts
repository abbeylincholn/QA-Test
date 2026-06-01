import { test } from '@playwright/test';
import { LoginPage } from 'pages/LoginPage';
import { ProductsPage } from 'pages/ProductsPage';
import { CartPage } from 'pages/CartPage';
import { CheckoutPage } from 'pages/CheckoutPage';
import data from 'utils/TestData.json' assert { type: 'json' };

test('a logged in user can add a product and complete the checkout', async ({ page }) => {
  const loginPage    = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage     = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  const { payment, newUser, products, search } = data;
  const items = products.productsToAdd2;

  await loginPage.goto();
  await loginPage.loginWithValidCredentials({
    username: process.env.USER!,
    password: process.env.PWORD!,
  });

  await cartPage.clearCart();
  await productsPage.goto();
  await productsPage.searchFor(search.productName2);

  for (let i = 0; i < items.length; i++) {
    await productsPage.addProductToCart(items[i]);
    i === items.length - 1
      ? await productsPage.goToCart()
      : await productsPage.continueShopping();
  }

  await cartPage.expectCartHasItems(items.length);
  await cartPage.expectProductInCart(search.productName2);
  await cartPage.proceedToCheckout();

  await checkoutPage.expectDeliveryAddressContains(`${newUser.address.firstName} ${newUser.address.lastName}`);
  await checkoutPage.expectDeliveryAddressContains(newUser.address.company);
  await checkoutPage.expectDeliveryAddressContains(newUser.address.address1);
  await checkoutPage.expectDeliveryAddressContains(newUser.address.city);
  await checkoutPage.expectDeliveryAddressContains(newUser.address.state);
  await checkoutPage.expectDeliveryAddressContains(newUser.address.zipCode);
  await checkoutPage.expectDeliveryAddressContains(newUser.address.mobileNumber);

  await checkoutPage.clickPlaceOrder();
  await checkoutPage.fillPaymentDetails(payment);
  await checkoutPage.expectOrderPlaced();
});
