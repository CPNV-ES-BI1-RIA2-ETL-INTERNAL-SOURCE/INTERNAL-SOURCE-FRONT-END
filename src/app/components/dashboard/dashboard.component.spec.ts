import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ChartComponent } from '../chart/chart.component';
import { NgForOf, NgIf } from '@angular/common';
import { ChartService } from '../../services/chart/chart.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {AuthService} from '../../services/authentication/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let chartService: jasmine.SpyObj<ChartService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUrls = [
    'src/app/mocks/charts/chart.html',
    'src/app/mocks/charts/chart.html'
  ];

  beforeEach(async () => {
    const chartServiceSpy = jasmine.createSpyObj('ChartService', ['getChartsUrls']);
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    chartServiceSpy.getChartsUrls.and.returnValue(of(mockUrls));
    authSpy.isAuthenticated.and.resolveTo(false);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, ChartComponent, NgForOf, NgIf],
      providers: [
        { provide: ChartService, useValue: chartServiceSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    chartService = TestBed.inject(ChartService) as jasmine.SpyObj<ChartService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login message when user is not authenticated', async () => {
    authService.isAuthenticated.and.resolveTo(false);
    await component.ngOnInit();
    fixture.detectChanges();

    const loginMessage = fixture.debugElement.query(By.css('#should-connect'));
    expect(loginMessage.nativeElement.textContent).toBe('Please login to enable this feature');
  });

  it('should not load charts when user is not authenticated', async () => {
    authService.isAuthenticated.and.resolveTo(false);
    await component.ngOnInit();
    fixture.detectChanges();

    expect(chartService.getChartsUrls).not.toHaveBeenCalled();
  });

  it('should display "No chart available" message when urls array is empty', async () => {
    authService.isAuthenticated.and.resolveTo(true);
    chartService.getChartsUrls.and.returnValue(of([]));
    
    await component.ngOnInit();
    
    component.isAuthenticated = true;
    
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('#no-charts-message'));
    expect(messageElement.nativeElement.textContent).toBe('No chart available');
  });

  it('should display charts when user is authenticated and urls array is not empty', async () => {
    authService.isAuthenticated.and.resolveTo(true);
    
    await component.ngOnInit();
    
    component.isAuthenticated = true;
    component.urls = [...mockUrls];
    
    fixture.detectChanges();

    const chartElements = fixture.debugElement.queryAll(By.css('app-chart'));
    expect(chartElements.length).toBe(2);
  });
});
