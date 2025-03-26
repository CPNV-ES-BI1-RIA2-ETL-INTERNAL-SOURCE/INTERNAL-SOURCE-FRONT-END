import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Keycloak from 'keycloak-js';
import { AuthProvider } from '../../../interfaces/auth-provider.interface';
import { User } from '../../../models/user.model';
import {
  AuthInitializationException,
  LoginException,
  LogoutException,
  ProfileException,
} from '../../../exceptions/authentication/auth.exceptions';

/**
 * Keycloak implementation of the AuthProvider interface.
 * Manages authentication with Keycloak and provides user information.
 */
@Injectable({
  providedIn: 'root',
})
export class KeycloakProvider implements AuthProvider {
  private readonly keycloak = inject(Keycloak);
  private readonly currentUser = new BehaviorSubject<User | null>(null);
  private initialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initiates the login process using Keycloak
   * @throws LoginException if login fails
   */
  public async login(): Promise<void> {
    try {
      await this.keycloak.login({
        redirectUri: window.location.origin,
      });
      await this.refreshUserProfile();
    } catch (error) {
      throw new LoginException(`Login failed: ${error}`);
    }
  }

  /**
   * Logs the user out of Keycloak
   * @throws LogoutException if logout fails
   */
  public async logout(): Promise<void> {
    try {
      this.currentUser.next(null);
      await this.keycloak.logout({
        redirectUri: window.location.origin,
      });
    } catch (error) {
      throw new LogoutException(`Logout failed: ${error}`);
    }
  }

  /**
   * Gets the currently authenticated user
   * @returns The authenticated user or null if not authenticated
   * @throws ProfileException if fetching user profile fails
   */
  public async getUser(): Promise<User | null> {
    try {
      if (!this.keycloak.authenticated) {
        this.currentUser.next(null);
        return null;
      }

      const userProfile = await this.keycloak.loadUserProfile();
      const user = this.createUserFromProfile(userProfile);
      this.currentUser.next(user);
      return user;
    } catch (error) {
      this.currentUser.next(null);
      throw new ProfileException(`Failed to get user profile: ${error}`);
    }
  }

  /**
   * Checks if the user is authenticated with Keycloak
   * @returns True if authenticated, false otherwise
   */
  public async isAuthenticated(): Promise<boolean> {
    return this.keycloak.authenticated ?? false;
  }

  /**
   * Ensures the provider is initialized before performing operations
   * @private
   */
  private async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      this.setupAuthEventHandlers();
      await this.refreshUserProfile();
      this.initialized = true;
    } catch (error) {
      throw new AuthInitializationException(
        `Failed to initialize authentication: ${error}`
      );
    }
  }

  /**
   * Sets up Keycloak event handlers for authentication state changes
   */
  private setupAuthEventHandlers(): void {
    this.keycloak.onAuthSuccess = () => this.refreshUserProfile();
    this.keycloak.onAuthError = () => this.currentUser.next(null);
    this.keycloak.onAuthRefreshSuccess = () => this.refreshUserProfile();
    this.keycloak.onTokenExpired = () => this.refreshUserProfile();
  }

  /**
   * Updates the current user profile from Keycloak
   */
  private async refreshUserProfile(): Promise<void> {
    try {
      // Use direct property check instead of isAuthenticated to avoid recursion
      if (this.keycloak.authenticated) {
        const profile = await this.keycloak.loadUserProfile();
        this.currentUser.next(this.createUserFromProfile(profile));
      } else {
        this.currentUser.next(null);
      }
    } catch {
      // Reset current user on error but don't propagate the error here
      this.currentUser.next(null);
    }
  }

  /**
   * Creates a User object from a Keycloak profile
   */
  private createUserFromProfile(profile: Keycloak.KeycloakProfile): User {
    return new User(
      profile.id ?? '',
      profile.email ?? '',
      profile.username ?? ''
    );
  }
}
