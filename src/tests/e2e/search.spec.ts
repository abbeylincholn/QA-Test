import { test } from '@playwright/test';
import { ProductsPage } from 'pages/ProductsPage';
import data from 'utils/TestData.json' assert { type: 'json' };

test('searching for a product returns a results page with matching products', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const { search } = data;

  await productsPage.goto();
  await productsPage.searchFor(search.productName1);
  await productsPage.expectResultsVisible();
  await productsPage.expectAllResultsContain(search.expectedResultsContain);
});
