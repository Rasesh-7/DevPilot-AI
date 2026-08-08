import { test, expect } from '@playwright/test';

test.describe('GitHub Repository Analysis E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render repository URL input and submit button', async ({ page }) => {
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

  test('should display analysis loading state elements when analyzing', async ({ page }) => {
    await page.goto('/analyze?url=https%3A%2F%2Fgithub.com%2FRasesh-7%2FDevPilot-AI');
    // Check loading text / spinner
    const statusText = page.getByText(/Analyzing repository|Fetching repository structure|DevPilot AI/i);
    await expect(statusText.first()).toBeVisible();
  });
});
