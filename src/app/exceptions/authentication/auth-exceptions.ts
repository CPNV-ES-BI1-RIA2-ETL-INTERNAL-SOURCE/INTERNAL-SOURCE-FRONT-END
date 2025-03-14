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
 * Thrown when trying to use an invalid or unsupported authentication provider
 */
export class InvalidProviderException extends AuthException {
  constructor(providerName: string) {
    super(`Invalid or unsupported authentication provider: ${providerName}`);
    this.name = 'InvalidProviderException';
    Object.setPrototypeOf(this, InvalidProviderException.prototype);
  }
}
