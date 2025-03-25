import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ChartComponent } from '../chart/chart.component';
import { NgForOf, NgIf } from '@angular/common';
import { ChartService } from '../../services/chart/chart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: jasmine.SpyObj<ChartService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUrls = [
    'src/app/mocks/charts/chart.html',
    'src/app/mocks/charts/chart.html'
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ChartService', ['getDashboardUrls']);
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    serviceSpy.getDashboardUrls.and.returnValue(of(mockUrls));
    authSpy.isLoggedIn.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, ChartComponent, NgForOf, NgIf],
      providers: [
        { provide: ChartService, useValue: serviceSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(ChartService) as jasmine.SpyObj<ChartService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login message when user is not authenticated', () => {
    authService.isLoggedIn.and.returnValue(of(false));
    component.ngOnInit();
    fixture.detectChanges();

    const loginMessage = fixture.debugElement.query(By.css('#should-connect'));
    expect(loginMessage.nativeElement.textContent).toBe('Please login to enable this feature');
  });

  it('should not load charts when user is not authenticated', () => {
    authService.isLoggedIn.and.returnValue(of(false));
    component.ngOnInit();
    fixture.detectChanges();

    expect(dashboardService.getDashboardUrls).not.toHaveBeenCalled();
  });

  it('should display "No chart available" message when urls array is empty', () => {
    dashboardService.getDashboardUrls.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('#no-charts-message'));
    expect(messageElement.nativeElement.textContent).toBe('No chart available');
  });

  it('should display charts when user is authenticated and urls array is not empty', () => {
    component.ngOnInit();
    fixture.detectChanges();

    const chartElements = fixture.debugElement.queryAll(By.css('app-chart'));
    expect(chartElements.length).toBe(2);
  });
});
