import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerManagementService } from './customer-management.service';

@Component({
  selector: 'app-customer-management',
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.css'
})
export class CustomerManagementComponent implements OnInit {
  customers: any[] = [];
  filteredCustomers: any[] = [];
  searchText: string = '';
  selectedCustomer: string = '';



  constructor(private _CustomersService : CustomerManagementService) {}

  ngOnInit(): void {
    this._CustomersService.customers$.subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = data;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
    });
  }

  filterCustomers(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredCustomers = this.customers.filter(customer => {
      const formattedCreatedDate = this.formatDate(customer.createdDate);
      const formattedModifiedDate = this.formatDate(customer.modifiedDate);
      return customer.customerName.toLowerCase().includes(search) ||
             customer.emailId.toLowerCase().includes(search) ||
             customer.mobileNo.toString().includes(search) ||
             formattedCreatedDate.includes(search) ||
             formattedModifiedDate.includes(search);
    });
  }
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }
}
