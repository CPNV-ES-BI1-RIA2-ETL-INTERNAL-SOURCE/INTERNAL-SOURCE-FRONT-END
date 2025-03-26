import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Dashboard } from '../../interfaces/dashboard.interface';
import { environment } from '../../../environments/environment';
import { DashboardException } from '../../exceptions/dashboard/dashboard.exception';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getDashboard(): Observable<Dashboard> {
    const cachedData = this.cacheService.get<Dashboard>(
      environment.cache.keys.dashboard
    );

    if (cachedData) {
      return of(cachedData);
    }

    return this.http
      .post<Dashboard>(environment.api.lambdaUrl, {
        identityType: environment.api.identityType,
      })
      .pipe(
        tap((data) =>
          this.cacheService.set(environment.cache.keys.dashboard, data)
        ),
        catchError((error) => {
          throw new DashboardException('Failed to fetch dashboard data', error);
        })
      );
  }

  clearCache(): void {
    this.cacheService.remove(environment.cache.keys.dashboard);
  }
}
