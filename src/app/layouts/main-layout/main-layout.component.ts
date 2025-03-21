import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {User} from '../../models/user.model';
import {AuthService} from '../../services/authentication/auth.service';
import {ErrorDialogComponent} from '../../components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-main-layout',
    imports: [
        RouterOutlet,
        ErrorDialogComponent
    ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})

/**
 * @summary The main layout component
 */
export class MainLayoutComponent implements OnInit {
  title = 'ria-frontend';
  isLoggedIn = false;
  user: User | null = null;
  errorMessage: string | null = null;
  showErrorDialog = false;

  private readonly authService = inject(AuthService);

  /**
   * @summary ngOnInit  is called once, after the component constructor has been executed.
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    try {
      this.isLoggedIn = await this.authService.isAuthenticated();
      if (this.isLoggedIn) this.user = await this.authService.getUser();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @summary Logs in the user and sets the authentication state.
   * @returns {Promise<void>} A promise that resolves when the login process is complete.
   */
  async login() {
    this.errorMessage = null;
    try {
      await this.authService.login();
      this.isLoggedIn = await this.authService.isAuthenticated();
      if (this.isLoggedIn) this.user = await this.authService.getUser();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @summary Logs out the user and unsets the authentication state.
   * @returns {Promise<void>} A promise that resolves when the logout process is complete.
   */
  async logout() {
    this.errorMessage = null;
    try {
      await this.authService.logout();
      this.user = null;
      this.isLoggedIn = false;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown) {
    if (error instanceof Error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'An unknown error occurred';
    }
    this.showErrorDialog = true;
    console.error('Authentication error:', error);
  }

  /**
   * @summary allow to close the dialog.
   * @return {void} Does not return anything.
   */
  closeErrorDialog() {
    this.showErrorDialog = false;
  }
}
