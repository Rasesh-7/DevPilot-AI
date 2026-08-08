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

  test('should render repository URL input and submit button', async ({ page }) => {
    // Scope to #home section to avoid strict mode violation from navbar button
    const heroSection = page.locator('#home');
    const input = heroSection.getByPlaceholder('Paste your GitHub repository URL...');
    await expect(input).toBeVisible();

    const analyzeBtn = heroSection.getByRole('button', { name: /Analyze Repository/i });
    await expect(analyzeBtn).toBeVisible();
  });

  test('should navigate to analyze page when valid repository URL is submitted', async ({ page }) => {
    const heroSection = page.locator('#home');
    const input = heroSection.getByPlaceholder('Paste your GitHub repository URL...');
    await input.fill('https://github.com/Rasesh-7/DevPilot-AI');

    const analyzeBtn = heroSection.getByRole('button', { name: /Analyze Repository/i });
    await analyzeBtn.click();

    await page.waitForURL(/\/analyze\?url=/);
    expect(page.url()).toContain('/analyze?url=https%3A%2F%2Fgithub.com%2FRasesh-7%2FDevPilot-AI');
  });

  test('should render features section and dashboard showcase section', async ({ page }) => {
    await expect(page.locator('#features')).toBeVisible();
    await expect(page.locator('#dashboard')).toBeVisible();
    // Actual heading text from features-section.tsx
    await expect(page.getByText('Everything you need to ship better code')).toBeVisible();
  });
});
