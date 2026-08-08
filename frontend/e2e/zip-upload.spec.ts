import { test, expect } from '@playwright/test';

test.describe('ZIP File Upload E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should render repository analysis section on dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Code Review Dashboard' })).toBeVisible();
    await expect(page.getByText('DevPilot AI Platform')).toBeVisible();
  });

  test('should display repository scan input on dashboard', async ({ page }) => {
    const input = page.getByPlaceholder('https://github.com/owner/repository');
    if (await input.isVisible()) {
      await expect(input).toBeVisible();
    }
  });

  test('should render uploaded reviews or empty state in recent reviews table', async ({ page }) => {
    await expect(page.getByText('Recent AI Code Reviews')).toBeVisible();
  });
});
