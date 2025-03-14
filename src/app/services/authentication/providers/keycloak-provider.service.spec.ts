import { TestBed } from '@angular/core/testing';
import { KeycloakProvider } from './keycloak-provider.service';
import Keycloak from 'keycloak-js';
import {
  LoginException,
  LogoutException,
  ProfileException,
} from '../../../exceptions/authentication/auth-exceptions';
import { User } from '../../../models/user.model';
import { createMockKeycloak } from '../../../mocks/authentication/auth-mocks';

/** Test suite for KeycloakProvider - verifies Keycloak integration and exception handling */
describe('KeycloakProvider', () => {
  let provider: KeycloakProvider;
  let mockKeycloak: jasmine.SpyObj<Keycloak>;
  const testProfile = {
    id: 'test-id',
    email: 'test@example.com',
    username: 'testuser',
  };

  beforeEach(() => {
    // Given - Common test setup
    mockKeycloak = createMockKeycloak();

    TestBed.configureTestingModule({
      providers: [
        KeycloakProvider,
        { provide: Keycloak, useValue: mockKeycloak },
      ],
    });

    provider = TestBed.inject(KeycloakProvider);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Authentication Status', () => {
    it('should check authentication status using Keycloak', async () => {
      // Given - User is authenticated
      mockKeycloak.authenticated = true;
      mockKeycloak.token = 'valid-token';

      // When - Provider checks authentication
      const result = await provider.isAuthenticated();

      // Then - Result should be true
      expect(result).toBeTrue();
    });

    it('should return false when not authenticated', async () => {
      // Given - User is not authenticated
      mockKeycloak.authenticated = false;
      mockKeycloak.token = undefined;

      // When - Provider checks authentication
      const result = await provider.isAuthenticated();

      // Then - Result should be false
      expect(result).toBeFalse();
    });
  });

  describe('User Management', () => {
    it('should get user profile when authenticated', async () => {
      // Given - User is authenticated
      mockKeycloak.authenticated = true;
      mockKeycloak.loadUserProfile.and.resolveTo(testProfile);

      // When - Provider gets user
      const user = await provider.getUser();

      // Then - user should be an instance of User
      expect(user).toBeInstanceOf(User);
    });

    it('should return null when not authenticated', async () => {
      // Given - User is not authenticated
      mockKeycloak.authenticated = false;

      // When - Provider gets user
      const user = await provider.getUser();

      // Then - User should be null
      expect(user).toBeNull();
    });

    it('should handle profile loading errors', async () => {
      // Given - User is authenticated but profile loading fails
      mockKeycloak.authenticated = true;
      mockKeycloak.loadUserProfile.and.rejectWith(
        new Error('Profile load failed')
      );

      // When/Then - GetUser should throw ProfileException
      await expectAsync(provider.getUser()).toBeRejectedWithError(
        ProfileException
      );
    });
  });

  describe('Login/Logout', () => {
    it('should handle login process using Keycloak', async () => {
      // Given - Login will succeed
      mockKeycloak.login.and.resolveTo();

      // When - Provider logs in
      await provider.login();

      // Then - Keycloak login should be called
      expect(mockKeycloak.login).toHaveBeenCalledWith({
        redirectUri: window.location.origin,
      });
    });

    it('should handle login failures', async () => {
      // Given - Login will fail
      mockKeycloak.login.and.rejectWith(new Error('Login failed'));

      // When/Then - Login should throw LoginException
      await expectAsync(provider.login()).toBeRejectedWithError(LoginException);
    });

    it('should handle logout process using Keycloak', async () => {
      // Given - Logout will succeed
      mockKeycloak.logout.and.resolveTo();

      // When - Provider logs out
      await provider.logout();

      // Then - Keycloak logout should be called
      expect(mockKeycloak.logout).toHaveBeenCalledWith({
        redirectUri: window.location.origin,
      });
    });

    it('should handle logout failures', async () => {
      // Given - Logout will fail
      mockKeycloak.logout.and.rejectWith(new Error('Logout failed'));

      // When/Then - Logout should throw LogoutException
      await expectAsync(provider.logout()).toBeRejectedWithError(
        LogoutException
      );
    });
  });
});
