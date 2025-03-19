import { test, expect } from '@playwright/test';

// Define User interface to match the app's User model
interface User {
  id: string;
  email: string;
  username: string;
}

// Define AuthService interface matching the application service
interface AuthService {
  isAuthenticated(): Promise<boolean>;
  getUser(): Promise<User | null>;
  login(): Promise<void>;
  logout(): Promise<void>;
}

// Extend Window interface for our mocks
declare global {
  interface Window {
    mockAuthService: AuthService;
    createTestUser: () => User;
    inject: (token: any) => any;
  }
}

test.describe('App Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Add our mocks before page load
    await page.addInitScript(() => {
      // Create test user function (from auth-mocks.ts)
      window.createTestUser = () => ({
        id: 'test-id',
        email: 'test@example.com',
        username: 'testuser'
      });

      // Default mock auth service (following createMockAuthService pattern)
      window.mockAuthService = {
        isAuthenticated: async () => false,
        getUser: async () => null,
        login: async () => {},
        logout: async () => {}
      };

      // Mock inject function to return our mock service
      const originalInject = window.inject;
      window.inject = (token: any) => {
        if (token.name === 'AuthService') {
          return window.mockAuthService;
        }
        return originalInject ? originalInject(token) : null;
      };
    });

    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should show error dialog when server returns error during login', async ({ page }) => {
    // Given
    // Configure mock to throw error on login (similar to Jasmine spy setup)
    await page.evaluate(() => {
      window.mockAuthService.login = async () => {
        throw new Error('Authentication server unavailable');
      };
    });

    // When
    await page.click('#login-button');

    //Then
    const errorElement = page.locator('#error');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText('Authentication server unavailable');
  });

  test('should replace login button with logout button after successful login', async ({ page }) => {
    // Given
    await page.evaluate(() => {
      let isAuthenticated = false;
      const testUser = window.createTestUser();

      window.mockAuthService.isAuthenticated = async () => isAuthenticated;
      window.mockAuthService.getUser = async () => isAuthenticated ? testUser : null;
      window.mockAuthService.login = async () => {
        isAuthenticated = true;
      };
    });

    // When
    await page.click('#login-button');

    //Then
    await expect(page.locator('p:has-text("Welcome")')).toBeVisible();
    await expect(page.locator('p:has-text("testuser")')).toBeVisible();
    await expect(page.locator('#logout-button')).toBeVisible();
    await expect(page.locator('#login-button')).not.toBeVisible();
  });

  test('should return to login button after successful logout', async ({ page }) => {
    // Given
    await page.evaluate(() => {
      let isAuthenticated = true;
      const testUser = window.createTestUser();

      window.mockAuthService.isAuthenticated = async () => isAuthenticated;
      window.mockAuthService.getUser = async () => isAuthenticated ? testUser : null;
      window.mockAuthService.logout = async () => {
        isAuthenticated = false;
      };
    });

    // Reload to apply authenticated state
    await page.reload({ waitUntil: 'networkidle' });

    // Verify we start authenticated
    await expect(page.locator('#logout-button')).toBeVisible();

    // When
    await page.click('#logout-button');

    //Then
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page.locator('#logout-button')).not.toBeVisible();
  });

  test('should show error dialog when server fails during logout', async ({ page }) => {
    // Given
    await page.evaluate(() => {
      window.mockAuthService.isAuthenticated = async () => true;
      window.mockAuthService.getUser = async () => window.createTestUser();
      window.mockAuthService.logout = async () => {
        throw new Error('Logout service unavailable');
      };
    });

    // Reload to apply authenticated state
    await page.reload({ waitUntil: 'networkidle' });

    // When
    await page.click('#logout-button');

    //Then
    const errorElement = page.locator('#error');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText('Logout service unavailable');
    await expect(page.locator('#logout-button')).toBeVisible();
  });
});
