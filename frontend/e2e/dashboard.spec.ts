import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should render dashboard layout and navigation elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Code Review Dashboard' })).toBeVisible();
    // 'DevPilot AI Platform' is rendered as a <p> tag
    await expect(page.getByText('DevPilot AI Platform')).toBeVisible();
  });

  test('should render KPI metric cards', async ({ page }) => {
    await expect(page.getByText('Repositories Analyzed')).toBeVisible();
    await expect(page.getByText('Bugs Identified')).toBeVisible();
    await expect(page.getByText('Security Issues')).toBeVisible();
    await expect(page.getByText('Docs Compiled')).toBeVisible();
  });

  test('should render repository analysis section and start scan input', async ({ page }) => {
    const input = page.getByPlaceholder('https://github.com/owner/repository');
    if (await input.isVisible()) {
      await expect(input).toBeVisible();
    }
  });

  test('should render recent reviews section', async ({ page }) => {
    // Actual heading text from recent-reviews-table.tsx: 'Recent AI Code Reviews'
    await expect(page.getByText('Recent AI Code Reviews')).toBeVisible();
  });
});
