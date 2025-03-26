/**
 * User model representing an
 * authenticated user
 */
export class User {
  /**
   * Unique identifier for the user
   */
  id: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * User's username or display name
   */
  username: string;

  constructor(id: string, email: string, username: string) {
    this.id = id;
    this.email = email;
    this.username = username;
  }
}
