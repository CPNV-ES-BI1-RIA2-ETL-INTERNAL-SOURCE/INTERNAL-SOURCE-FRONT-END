import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import {NgForOf, NgIf} from '@angular/common';
import { ChartService } from '../../services/chart/chart.service';
import {AuthService} from '../../services/authentication/auth.service';

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
export class DashboardComponent implements OnInit {
  urls: string[] = [];
  isAuthenticated: boolean = false;
  isLoggedIn = false;

  constructor(
    private dashboardService: ChartService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isAuthenticated();
    console.log(this.isLoggedIn)
    if (this.isAuthenticated) {
      this.dashboardService.getChartsUrls().subscribe(urls => {
        this.urls = urls;
      });
    }
  }
}
