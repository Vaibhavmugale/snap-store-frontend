import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerManagementService } from './customer-management.service';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.css',
})
export class CustomerManagementComponent implements OnInit {
  customers: any[] = [];
  filteredAllData: any[] = [];
  filteredCustomers: any[] = [];
  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private _CustomersService: CustomerManagementService) {}

  ngOnInit(): void {
    this._CustomersService.customers$.subscribe({
      next: (data) => {
        this.customers = data;
        this.applyFilterAndPagination();
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      },
    });
  }

  applyFilterAndPagination(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredAllData = this.customers.filter((customer) => {
      const created = this.formatDate(customer.createdDate);
      const modified = this.formatDate(customer.modifiedDate);
      return (
        customer.customerName.toLowerCase().includes(search) ||
        customer.emailId.toLowerCase().includes(search) ||
        customer.mobileNo.toString().includes(search) ||
        created.includes(search) ||
        modified.includes(search)
      );
    });

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredCustomers = this.filteredAllData.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  filterCustomers(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  nextPage(): void {
    const nextStart = this.currentPage * this.pageSize;
    if (nextStart < this.filteredAllData.length) {
      this.currentPage++;
      this.applyFilterAndPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPagination();
    }
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }
}
