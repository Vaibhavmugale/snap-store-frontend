import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard: any = {};  // 👈 changed from any[] to any
  totalProducts = 0;
  totalCustomers = 0;
  totalBills = 0;

  constructor(private productService: DashboardService) {}

  ngOnInit(): void {
    this.productService.dashboard$.subscribe({
      next: (data) => {
        this.dashboard = data || {};
        this.totalProducts = this.dashboard.totalProducts ?? 0;
        this.totalCustomers = this.dashboard.totalCustomer ?? 0;
        this.totalBills = this.dashboard.totalBills ?? 0;
      },
      error: (err) => {
        console.error('Error fetching dashboard:', err);
      }
    });
  }
}
