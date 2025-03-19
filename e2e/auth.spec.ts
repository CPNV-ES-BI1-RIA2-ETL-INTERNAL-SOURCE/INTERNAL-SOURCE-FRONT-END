import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.goto('/', { waitUntil: 'networkidle' });
    // Wait for the login button to be visible
    await page.waitForSelector('[data-testid="login-button"]', { timeout: 10000 });
  });

  test('shows error message when login fails with wrong credentials', async ({ page }) => {
    // Given: An unauthenticated user
    await expect(page).toHaveURL('/');

    // When: entering wrong credentials
    await page.click('[data-testid="login-button"]');
    
    // Then: A message with the auth error should be displayed
    const errorMessage = await page.locator('[data-testid="login-error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Authentication Failed');
  });

  test('shows error message when logout fails', async ({ page }) => {
    // Given: An authenticated user
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'test.user@example.com',
        username: 'test.user'
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="logout-button"]', { timeout: 10000 });

    // When: trying to logout with a failing server
    await page.click('[data-testid="logout-button"]');
    
    // Then: A message with the auth error should be displayed
    const errorMessage = await page.locator('[data-testid="logout-error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Logout Failed');
  });

  test('shows error message when login server is down', async ({ page }) => {
    // Given: An unauthenticated user
    await expect(page).toHaveURL('/');

    // When: clicking login with server down
    await page.click('[data-testid="login-button"]');
    
    // Then: An internal server error message should be displayed
    const errorMessage = await page.locator('[data-testid="server-error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Internal Server Error');
  });

  test('successful login and logout flow', async ({ page }) => {
    // Given: An unauthenticated user
    await expect(page).toHaveURL('/');

    // When: logging in successfully
    await page.click('[data-testid="login-button"]');
    
    // Then: User should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
    await page.waitForLoadState('networkidle');

    // When: logging out successfully
    await page.click('[data-testid="logout-button"]');
    
    // Then: User should be redirected to home page
    await expect(page).toHaveURL('/');
    await page.waitForLoadState('networkidle');
  });
}); 