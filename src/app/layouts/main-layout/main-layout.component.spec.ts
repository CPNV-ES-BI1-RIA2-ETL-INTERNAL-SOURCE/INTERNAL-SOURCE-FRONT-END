import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../services/authentication/auth.service';
import { createMockAuthService } from '../../mocks/authentication/auth-mocks';
import { createTestUser } from '../../mocks/authentication/auth-mocks';
import { By } from '@angular/platform-browser';
import {LoginException, LogoutException} from '../../exceptions/authentication/auth.exceptions';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  const testUser = createTestUser();

  beforeEach(async () => {
    mockAuthService = createMockAuthService();

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Authentication UI States', () => {
    it('should show error dialog when server returns error during login', async () => {
      // Given
      mockAuthService.login.and.rejectWith(new LoginException('Authentication server unavailable'));

      // When
      await component.login();
      fixture.detectChanges();

      // Then
      const errorElement = fixture.debugElement.query(By.css('#error'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain('Authentication server unavailable');
    });

    it('should replace login button with logout button after successful login', async () => {
      // Given
      mockAuthService.isAuthenticated.and.resolveTo(false);
      mockAuthService.getUser.and.resolveTo(null);
      mockAuthService.login.and.resolveTo();
      mockAuthService.isAuthenticated.and.resolveTo(true);
      mockAuthService.getUser.and.resolveTo(testUser);

      // When
      await component.login();
      fixture.detectChanges();

      // Then
      const logoutButton = fixture.debugElement.query(By.css('#logout-button'));
      const loginButton = fixture.debugElement.query(By.css('#login-button'));

      expect(logoutButton).toBeTruthy();
      expect(loginButton).toBeFalsy();
    });

    it('should show a welcome message after successful login', async () => {
      // Given
      mockAuthService.isAuthenticated.and.resolveTo(false);
      mockAuthService.getUser.and.resolveTo(null);
      mockAuthService.login.and.resolveTo();
      mockAuthService.isAuthenticated.and.resolveTo(true);
      mockAuthService.getUser.and.resolveTo(testUser);

      // When
      await component.login();
      fixture.detectChanges();

      // Then
      const usernameMessage = fixture.debugElement.query(By.css('#welcome-user'));
      expect(usernameMessage.nativeElement.textContent).toContain('Welcome, testuser');
    });

    it('should return to login button after successful logout', async () => {
      // Given
      mockAuthService.isAuthenticated.and.resolveTo(true);
      mockAuthService.getUser.and.resolveTo(testUser);
      mockAuthService.logout.and.resolveTo();
      mockAuthService.isAuthenticated.and.resolveTo(false);
      mockAuthService.getUser.and.resolveTo(null);

      // When
      await component.logout();
      fixture.detectChanges();

      // Then
      const loginButton = fixture.debugElement.query(By.css('#login-button'));
      const logoutButton = fixture.debugElement.query(By.css('#logout-button'));

      expect(loginButton).toBeTruthy();
      expect(logoutButton).toBeFalsy();
    });

    it('should show error dialog when server fails during logout', async () => {
      // Given
      mockAuthService.isAuthenticated.and.resolveTo(true);
      mockAuthService.getUser.and.resolveTo(testUser);
      mockAuthService.logout.and.rejectWith(new LogoutException('Logout service unavailable'));

      // When
      await component.logout();
      fixture.detectChanges();

      // Then
      const errorElement = fixture.debugElement.query(By.css('#error'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain('Logout service unavailable');
    });
  });
});
