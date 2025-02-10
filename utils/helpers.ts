import { test, expect, Page } from '@playwright/test';


async function acceptCookies(page: Page) {
  const acceptButton = page.locator('#onetrust-accept-btn-handler'); 
  await acceptButton.waitFor()
  if (await acceptButton.isVisible()) {
      await acceptButton.click();
  }
  await expect(page.locator('#cookie-banner')).not.toBeVisible(); 
}

async function acceptAge(page: Page) {
  const acceptButton = page.locator('[class*="confirmBtn"]'); 
  if (await acceptButton.isVisible()) {
      await acceptButton.click();
  }
  await expect(page.locator('#cookie-banner')).not.toBeVisible(); 
}

export async function setupPage(page: Page, baseUrl: string) {
    await page.goto(baseUrl);
    await acceptCookies(page);
    await acceptAge(page);
    await page.waitForLoadState('load');
}

export async function openProductPage(page: Page, SKU: string, language: string, productName: string) {
    const shopLinkText = translations[language].shop;
    await page.goto(`${page.url()}/${shopLinkText}`);
    const itemLocator = page.locator(`[data-sku="${SKU}"]`);
    await itemLocator.waitFor()
    await itemLocator.click();
    const buttonAddToCard = page.locator('[data-testid="pdpAddToProduct"]');
    await buttonAddToCard.waitFor();
    const productPageName = page.locator('//div[contains(@class, "productInfo")]/div[@class="product-heading"]');
    expect(productPageName).toContainText(productName);
}

export const translations = {
    en: { shop: 'shop'},
    pl: { shop: 'sklep'}
};
