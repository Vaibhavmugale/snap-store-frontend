import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  totalProducts = 120;
  totalCustomers = 87;
  totalBills = 243;
  totalUsers = 5;
}
