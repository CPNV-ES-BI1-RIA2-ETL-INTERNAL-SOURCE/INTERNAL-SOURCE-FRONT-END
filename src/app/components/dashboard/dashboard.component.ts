import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../services/authentication/auth.service';
import {DashboardService} from '../../services/dashboard/dashboard.service';
import {Dashboard} from '../../interfaces/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  imports: [
    ChartComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

/**
 * @summary The dashboard component to diplay a charts in a dashboard.
 */
export class DashboardComponent implements OnInit {
  urls: string[] | null = null;
  isLoggedIn = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  /**
   * @summary ngOnInit  is called once, after the component constructor has been executed.
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    this.isLoggedIn = await this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.dashboardService.getDashboard().subscribe(dashboard => {
        this.urls = dashboard.urls;
      });
    }
  }
}
