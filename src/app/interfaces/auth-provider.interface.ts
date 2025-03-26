import { User } from '../models/user.model';
/**
 * Interface defining the contract for authentication providers
 * This ensures all providers implement the same methods regardless of the underlying authentication system
 */
export interface AuthProvider {
  /**
   * Initiates the login process for the provider
   */
  login(): Promise<void>;

  /**
   * Logs the user out of the system
   */
  logout(): Promise<void>;

  /**
   * Retrieves the currently authenticated user
   * @returns The authenticated User or null if not authenticated
   */
  getUser(): Promise<User | null>;

  /**
   * Checks if the user is currently authenticated
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): Promise<boolean>;
}
