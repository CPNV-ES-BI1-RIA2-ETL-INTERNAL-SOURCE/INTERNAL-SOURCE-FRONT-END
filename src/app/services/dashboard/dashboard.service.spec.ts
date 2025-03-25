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

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
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
});
