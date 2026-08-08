import { test, expect } from '@playwright/test';

test.describe('Homepage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display page title and hero elements', async ({ page }) => {
    await expect(page).toHaveTitle(/DevPilot AI/i);
    await expect(page.locator('h1')).toContainText('Review Your Code with');
    await expect(page.getByText('Powered by AI · Built for developers')).toBeVisible();
  });

  test('should render navbar and brand logo', async ({ page }) => {
    const navbar = page.locator('header nav').first();
    await expect(navbar).toBeVisible();
    await expect(page.getByRole('link', { name: 'DevPilot AI' }).first()).toBeVisible();
  });

  test('should render features section and showcase cards', async ({ page }) => {
    await expect(page.locator('#features')).toBeVisible();
    await expect(page.locator('#dashboard')).toBeVisible();
    await expect(page.getByText('Everything you need to ship better code')).toBeVisible();
  });

  test('should render site footer with links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link', { name: 'DevPilot AI' })).toBeVisible();
  });
});
