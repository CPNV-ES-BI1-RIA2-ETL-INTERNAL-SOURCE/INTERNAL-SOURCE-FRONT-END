import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { environment } from '../../../environments/environment';
import { DashboardException } from '../../exceptions/dashboard/dashboard.exception';
import { MOCK_LAMBDA_RESPONSE } from '../../mocks/lambda-response';
import { CacheService } from '../cache/cache.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  let cacheService: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        CacheService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService);
  });

  afterEach(() => {
    httpMock.verify();
    cacheService.clear();
  });

  it('should successfully fetch dashboard URLs from lambda', () => {
    // When
    service.getDashboard().subscribe((response) => {
      // Then
      expect(response).toEqual(MOCK_LAMBDA_RESPONSE);
    });

    httpMock.expectOne(environment.api.lambdaUrl).flush(MOCK_LAMBDA_RESPONSE);
  });

  it('should throw DashboardException when request fails', () => {
    // Given
    const errorEvent = new ProgressEvent('error');

    // When
    service.getDashboard().subscribe({
      error: (error) => {
        // Then
        expect(error).toBeInstanceOf(DashboardException);
      },
    });

    httpMock.expectOne(environment.api.lambdaUrl).error(errorEvent);
  });

  it('should return cached data without making HTTP request', () => {
    // Given
    cacheService.set(environment.cache.keys.dashboard, MOCK_LAMBDA_RESPONSE);

    // When
    service.getDashboard().subscribe((response) => {
      // Then
      expect(response).toEqual(MOCK_LAMBDA_RESPONSE);
    });

    // Verify no HTTP request was made
    httpMock.expectNone(environment.api.lambdaUrl);
  });

  it('should fetch from API and cache the response', () => {
    // When
    service.getDashboard().subscribe();

    // Then
    httpMock.expectOne(environment.api.lambdaUrl).flush(MOCK_LAMBDA_RESPONSE);

    // Verify data was cached
    const cachedData = cacheService.get(environment.cache.keys.dashboard);
    expect(cachedData).toEqual(MOCK_LAMBDA_RESPONSE);
  });

  it('should clear cache when clearCache is called', () => {
    // Given
    cacheService.set(environment.cache.keys.dashboard, MOCK_LAMBDA_RESPONSE);

    // When
    service.clearCache();

    // Then
    const cachedData = cacheService.get(environment.cache.keys.dashboard);
    expect(cachedData).toBeNull();
  });
});
