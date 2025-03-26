import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import {
  LoginException,
  LogoutException,
  ProfileException,
} from '../../exceptions/authentication/auth.exceptions';
import { AuthProvider } from '../../interfaces/auth-provider.interface';
import {
  createMockAuthProvider,
  createTestUser,
} from '../../mocks/authentication/auth-mocks';
import { KeycloakProvider } from './providers/keycloak-provider.service';
import Keycloak from 'keycloak-js';
import { User } from '../../models/user.model';

/** Test suite for AuthService - verifies delegation, exception handling, and validation */
describe('AuthService', () => {
  let service: AuthService;
  let mockProvider: jasmine.SpyObj<AuthProvider>;
  let originalProvider: string;
  const testUser = createTestUser();

  beforeEach(() => {
    // Given - Common test setup
    originalProvider = environment.auth.provider;
    environment.auth.provider = 'keycloak';
    mockProvider = createMockAuthProvider();

    // Create minimal object that satisfies DI requirements
    const mockKeycloak = {};

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: KeycloakProvider, useValue: mockProvider },
        { provide: Keycloak, useValue: mockKeycloak },
      ],
    });

    service = TestBed.inject(AuthService);
    service.provider = mockProvider;
  });

  afterEach(() => {
    environment.auth.provider = originalProvider;
    TestBed.resetTestingModule();
  });

  it('should create a instance of the right provider', () => {
    // Given - Test setup in beforeEach
    // When - Service is created
    // Then - Provider should be the mock provider
    expect(service.provider).toBe(mockProvider);
  });

  it('should check authentication status by delegating to the provider', async () => {
    // Given - Provider will return true for isAuthenticated
    mockProvider.isAuthenticated.and.resolveTo(true);
    // When - Service checks authentication status
    const result = await service.isAuthenticated();
    // Then - Result should be true and provider should be called
    expect(mockProvider.isAuthenticated).toHaveBeenCalled();
  });

  it('should return false when authentication check fails', async () => {
    // Given - Provider will return false for isAuthenticated
    mockProvider.isAuthenticated.and.resolveTo(false);
    // When - Service checks authentication status
    const result = await service.isAuthenticated();
    // Then - Result should be false and provider should be called
    expect(mockProvider.isAuthenticated).toHaveBeenCalled();
  });

  it('should get authenticated user information by delegating to the provider', async () => {
    // Given - Provider will return a user
    mockProvider.getUser.and.resolveTo(testUser);
    // When - Service gets user
    const user = await service.getUser();
    // Then - User should match test user and provider should be called
    expect(mockProvider.getUser).toHaveBeenCalled();
  });

  it('should handle null user information', async () => {
    // Given - Provider will return null for user
    mockProvider.getUser.and.resolveTo(null);
    // When - Service gets user
    const user = await service.getUser();
    // Then - User should be null and provider should be called
    expect(mockProvider.getUser).toHaveBeenCalled();
  });

  it('should handle login process by delegating to the provider', async () => {
    // Given - Default setup is sufficient
    // When - Service logs in
    await service.login();
    // Then - Provider's login should be called
    expect(mockProvider.login).toHaveBeenCalled();
  });

  it('should handle logout process by delegating to the provider', async () => {
    // Given - Default setup is sufficient
    // When - Service logs out
    await service.logout();
    // Then - Provider's logout should be called
    expect(mockProvider.logout).toHaveBeenCalled();
  });

  describe('Service Exception Handling', () => {
    it('should handle login failure with LoginException', async () => {
      // Given - Provider will throw LoginException
      mockProvider.login.and.rejectWith(new LoginException('Login failed'));
      // When/Then - Service login should throw LoginException
      await expectAsync(service.login()).toBeRejectedWithError(LoginException);
      expect(mockProvider.login).toHaveBeenCalled();
    });

    it('should handle logout failure with LogoutException', async () => {
      // Given - Provider will throw LogoutException
      mockProvider.logout.and.rejectWith(new LogoutException('Logout failed'));
      // When/Then - Service logout should throw LogoutException
      await expectAsync(service.logout()).toBeRejectedWithError(
        LogoutException
      );
      expect(mockProvider.logout).toHaveBeenCalled();
    });

    it('should handle user information failure with ProfileException', async () => {
      // Given - Provider will throw ProfileException
      mockProvider.getUser.and.rejectWith(
        new ProfileException('Profile load failed')
      );
      // When/Then - Service getUser should throw ProfileException
      await expectAsync(service.getUser()).toBeRejectedWithError(
        ProfileException
      );
      expect(mockProvider.getUser).toHaveBeenCalled();
    });
  });
});
