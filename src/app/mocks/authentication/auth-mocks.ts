import { AuthProvider } from '../../interfaces/auth-provider.interface';
import { User } from '../../models/user.model';
import Keycloak from 'keycloak-js';

/** Creates a mock AuthProvider with Jasmine spies for all required methods */
export function createMockAuthProvider(): jasmine.SpyObj<AuthProvider> {
  const mockProvider = jasmine.createSpyObj<AuthProvider>('AuthProvider', [
    'login',
    'logout',
    'getUser',
    'isAuthenticated',
  ]);

  mockProvider.isAuthenticated.and.resolveTo(false);
  mockProvider.getUser.and.resolveTo(null);
  mockProvider.login.and.resolveTo();
  mockProvider.logout.and.resolveTo();

  return mockProvider;
}

/** Creates a test user with predefined values */
export function createTestUser(): User {
  return new User('test-id', 'test@example.com', 'testuser');
}

/** Creates a mock Keycloak instance with all required methods and properties */
export function createMockKeycloak(): jasmine.SpyObj<Keycloak> {
  const mock = jasmine.createSpyObj<Keycloak>('Keycloak', [
    'login',
    'logout',
    'loadUserProfile',
    'init',
  ]);

  // Default property values
  mock.authenticated = false;
  mock.token = undefined;

  // Event handlers - using undefined instead of null to match TypeScript expectations
  mock.onAuthSuccess = undefined;
  mock.onAuthError = undefined;
  mock.onAuthRefreshSuccess = undefined;
  mock.onTokenExpired = undefined;

  // Default method implementations
  mock.login.and.resolveTo();
  mock.logout.and.resolveTo();
  mock.loadUserProfile.and.resolveTo({
    id: 'test-id',
    email: 'test@example.com',
    username: 'testuser',
  });
  mock.init.and.resolveTo(true);

  return mock;
}
