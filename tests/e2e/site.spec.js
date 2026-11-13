import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/experiences', '/projects', '/certifications'];

test.describe('Portfolio site smoke tests', () => {
  for (const route of ROUTES) {
    test(`renders ${route} with header and footer`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();

      await expect(page.locator('.modern-navbar')).toBeVisible();
      await expect(page.locator('.modern-footer')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('navbar links change the route', async ({ page }) => {
    await page.goto('/');
    await page.locator('.navbar-nav a[href="/projects"]').first().click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.locator('.modern-footer')).toBeVisible();
  });

  test('AI chat widget has been removed', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.chat-toggle-btn')).toHaveCount(0);
  });
});
