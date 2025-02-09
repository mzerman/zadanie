import { test, expect, Page } from '@playwright/test';
import { setupPage, translations, openProductPage } from '../utils/helpers';
import exp from 'constants';


const locales = [
    { SKU: 'ploom-x-advanced', productName: 'Ploom X Advance', language: 'en', baseUrl: 'https://www.ploom.co.uk/en' },
    { SKU: '16155629', productName: 'Panel wymienny Rose Shimmer', language: 'pl', baseUrl: 'https://www.ploom.pl/pl/' }
];


    locales.forEach(({ SKU, productName, language, baseUrl }) => {
        test.describe(`Tests for ${language.toUpperCase()} - ${baseUrl}`, () => {
test('Verify if it is possible to add a product' + productName + ', SKU: ' + SKU + 'to the cart. For url: '+baseUrl, {tag: '@test'},async ({ page }) => {
    await setupPage(page, baseUrl);
    await openProductPage(page,SKU,language,productName);
    const buttonAddToCard = page.locator('[data-testid="pdpAddToProduct"]');
    await buttonAddToCard.waitFor();
    await buttonAddToCard.click();
    const basketNumber = page.locator('[class*="CartMiniContentContainer-module-iconLabel"]');
    await basketNumber.waitFor();
    expect(basketNumber).toHaveText("1")
    await page.locator('[data-testid="miniCartCheckoutButton"]').click()
    const basketProductName = page.getByTestId('regular-cart-list').locator('a').nth(1);
    await basketProductName.waitFor()
    expect(basketProductName).toContainText(productName);
    });
});
});


locales.forEach(({ SKU, productName, language, baseUrl }) => {
    test.describe(`Tests for ${language.toUpperCase()} - ${baseUrl}`, () => {
test('Verify if it is possible to remove a product from the cart. ' + productName + ', SKU: ' + SKU + 'to the cart. For url: '+baseUrl, {tag: '@test'},async ({ page }) => {
await setupPage(page, baseUrl);
await openProductPage(page,SKU,language,productName)
const buttonAddToCard = page.locator('[data-testid="pdpAddToProduct"]');
await buttonAddToCard.waitFor();
await buttonAddToCard.click();
await page.locator('[data-testid="miniCartCheckoutButton"]').click();
const basketProductName = page.getByTestId('regular-cart-list').locator('a').nth(1);
await basketProductName.waitFor();
expect(basketProductName).toContainText(productName);

await page.locator('[data-testid="cartRemoveButton"]').nth(1).click();
await page.locator('[data-testid="remove-item-submit-button"]').click();
expect(basketProductName).not.toBeDisabled();
});
});
});


locales.forEach(({ SKU, productName, language, baseUrl }) => {
    test.describe(`Tests for ${language.toUpperCase()} - ${baseUrl}`, () => {
test('Verify if there are any broken links on the product page.' + productName + ', SKU: ' + SKU + 'to the cart. For url: '+baseUrl, {tag: '@test'},async ({ page }) => {
await setupPage(page, baseUrl);
await openProductPage(page,SKU,language,productName)
    const links = await page.locator('a').all();
    for (const link of links) {
        let href = await link.getAttribute('href');
        if (!href || href.startsWith('#')) continue;
        if (href.startsWith('/')) {
            href = `${baseUrl.replace(/\/en$/, '')}${href}`; 
        }
        const response = await page.request.get(href);
        const status = response.status();
        console.log(`Checking: ${href} - Status: ${status}`);
        expect(status).toBeLessThan(400);
    }
    });
});
});


locales.forEach(({ SKU, productName, language, baseUrl }) => {
    test.describe(`Tests for ${language.toUpperCase()} - ${baseUrl}`, () => {
test('Verify if there are any broken images on the product page.' + productName + ', SKU: ' + SKU + 'to the cart. For url: '+baseUrl, {tag: '@test'},async ({ page }) => {
await setupPage(page, baseUrl);
await openProductPage(page,SKU,language,productName)
const images = await page.locator('img').all();
for (const image of images) {
    const src = await image.getAttribute('src');
    if (!src) {
        console.warn(`empty picture. Skip check`);
        continue;
    }
    const imageURL = src.startsWith('/') ? `${baseUrl}${src}` : src;
    console.log(`Checking image: ${imageURL}`);
    const response = await page.request.get(imageURL);
    expect(response.status()).toBeLessThan(400);
    }
    });
});
});