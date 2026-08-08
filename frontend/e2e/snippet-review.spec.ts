import { test, expect } from '@playwright/test';

test.describe('Code Snippet Review & Analytics E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should render KPI metric cards for analytics', async ({ page }) => {
    await expect(page.getByText('Repositories Analyzed')).toBeVisible();
    await expect(page.getByText('Bugs Identified')).toBeVisible();
    await expect(page.getByText('Security Issues')).toBeVisible();
    await expect(page.getByText('Docs Compiled')).toBeVisible();
  });

  test('should render health chart / analytics components', async ({ page }) => {
    const dashboardHeading = page.getByRole('heading', { name: 'Code Review Dashboard' });
    await expect(dashboardHeading).toBeVisible();
  });
});
