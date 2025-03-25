import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dashboard } from '../../interfaces/dashboard.interface';
import { environment } from '../../../environments/environment';
import { DashboardException } from '../../exceptions/dashboard/dashboard.exception';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<Dashboard> {
    return this.http
      .post<Dashboard>(environment.api.lambdaUrl, {
        identityType: environment.api.identityType,
      })
      .pipe(
        catchError((error) => {
          throw new DashboardException('Failed to fetch dashboard data', error);
        })
      );
  }
}
