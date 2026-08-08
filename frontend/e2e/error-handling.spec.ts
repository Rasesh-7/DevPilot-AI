import { test, expect } from '@playwright/test';

test.describe('Error Handling & Form Validation E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should require URL input when submitting empty form', async ({ page }) => {
    const heroSection = page.locator('#home');
    const input = heroSection.getByPlaceholder('Paste your GitHub repository URL...');
    
    // Attempt submit with empty input
    const analyzeBtn = heroSection.getByRole('button', { name: /Analyze Repository/i });
    await analyzeBtn.click();

    // Verify browser validation or staying on homepage
    expect(page.url()).not.toContain('/analyze?url=http');
  });

  test('should handle navigation gracefully on non-existent routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345');
    // Should render 404 / fallback page without crashing
    expect(response?.status()).toBe(404);
  });
});
