import { AuthProvider } from '../../interfaces/auth-provider.interface';
import { User } from '../../models/user.model';

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

