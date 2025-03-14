import { Injectable } from '@angular/core';
import { AuthProvider } from '../../interfaces/auth-provider.interface';
import { InvalidProviderException } from '../../exceptions/authentication/auth-exceptions';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

/**
 * Authentication service that uses the Factory Pattern to create
 * and manage different authentication providers
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private providers: { [key: string]: new () => AuthProvider } = {
    keycloak: KeycloakProvider,
  };
  public provider: AuthProvider;

  /**
   * Create an instance of the AuthService with a specific provider
   */
  constructor() {
    if (!this.isProviderValid(environment.auth.provider)) {
      throw new InvalidProviderException(environment.auth.provider);
    }
    this.provider = new this.providers[environment.auth.provider]();
  }

  private isProviderValid(providerName: string): boolean {
    return Object.keys(this.providers).includes(providerName);
  }

  /**
   * Get the underlying provider instance
   * @returns The configured authentication provider
   */
  public getProvider(): AuthProvider {
    return this.provider;
  }

  /**
   * Log in the user using the configured provider
   * @returns Promise that resolves when login is complete
   */
  public login(): Promise<void> {
    return this.provider.login();
  }

  /**
   * Log out the user using the configured provider
   * @returns Promise that resolves when logout is complete
   */
  public async logout(): Promise<void> {
    return this.provider.logout();
  }

  /**
   * Get the current user's information
   * @returns The user object if authenticated, null otherwise
   */
  public async getUser(): Promise<User | null> {
    return this.provider.getUser();
  }

  /**
   * Check if the user is currently authenticated
   * @returns true if authenticated, false otherwise
   */
  public async isAuthenticated(): Promise<boolean> {
    return this.provider.isAuthenticated();
  }
}
