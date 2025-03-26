/**
 * Base class for all authentication related exceptions
 */
export class AuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthException';
    Object.setPrototypeOf(this, AuthException.prototype);
  }
}

/**
 * Thrown when authentication initialization fails
 */
export class AuthInitializationException extends AuthException {
  constructor(message: string) {
    super(message);
    this.name = 'AuthInitializationException';
    Object.setPrototypeOf(this, AuthInitializationException.prototype);
  }
}

/**
 * Thrown when a login attempt fails
 */
export class LoginException extends AuthException {
  constructor(message: string) {
    super(message);
    this.name = 'LoginException';
    Object.setPrototypeOf(this, LoginException.prototype);
  }
}

/**
 * Thrown when a logout attempt fails
 */
export class LogoutException extends AuthException {
  constructor(message: string) {
    super(message);
    this.name = 'LogoutException';
    Object.setPrototypeOf(this, LogoutException.prototype);
  }
}

/**
 * Thrown when profile information is unavailable or invalid
 */
export class ProfileException extends AuthException {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileException';
    Object.setPrototypeOf(this, ProfileException.prototype);
  }
}

/**
 * Thrown when trying to use an invalid or unsupported authentication provider
 */
export class InvalidProviderException extends AuthException {
  constructor(providerName: string) {
    super(`Invalid or unsupported authentication provider: ${providerName}`);
    this.name = 'InvalidProviderException';
    Object.setPrototypeOf(this, InvalidProviderException.prototype);
  }
}
