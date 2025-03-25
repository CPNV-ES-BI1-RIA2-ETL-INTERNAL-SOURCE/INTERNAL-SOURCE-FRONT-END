import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// TODO : To replace with the real implementation
@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private chartsUrl = [];

  constructor() { }

  getChartsUrls(): Observable<string[]> {
    return of(this.chartsUrl);
  }
}
