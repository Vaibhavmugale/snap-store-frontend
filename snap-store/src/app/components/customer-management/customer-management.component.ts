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
  currentPage: number = 1;
  pageSize: number = 10;


  constructor(private _CustomersService: CustomerManagementService) { }

  ngOnInit(): void {
    this._CustomersService.customers$.subscribe({
      next: (data) => {
        this.customers = data;
        this.applyFilterAndPagination();
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
    });
  }

  applyFilterAndPagination(): void {
    const search = this.searchText.toLowerCase().trim();
    const filtered = this.customers.filter(customer => {
      const formattedCreatedDate = this.formatDate(customer.createdDate);
      const formattedModifiedDate = this.formatDate(customer.modifiedDate);
      return customer.customerName.toLowerCase().includes(search) ||
        customer.emailId.toLowerCase().includes(search) ||
        customer.mobileNo.toString().includes(search) ||
        formattedCreatedDate.includes(search) ||
        formattedModifiedDate.includes(search);
    });
    this.filteredCustomers = this.paginate(filtered);
  }
  paginate(data: any[]): any[] {
    const startIndex = this.currentPage === 1 ? 0 : 10 + (this.currentPage - 2) * 15;
    const size = this.currentPage === 1 ? 10 : 15;
    return data.slice(startIndex, startIndex + size);
  }

  nextPage(): void {
    const search = this.searchText.toLowerCase().trim();
    const totalData = this.customers.filter(customer => {
      const formattedCreatedDate = this.formatDate(customer.createdDate);
      const formattedModifiedDate = this.formatDate(customer.modifiedDate);
      return customer.customerName.toLowerCase().includes(search) ||
        customer.emailId.toLowerCase().includes(search) ||
        customer.mobileNo.toString().includes(search) ||
        formattedCreatedDate.includes(search) ||
        formattedModifiedDate.includes(search);
    });
    const nextStart = this.currentPage === 1 ? 10 : 10 + (this.currentPage - 1) * 15;
    if (nextStart < totalData.length) {
      this.currentPage++;
      this.filteredCustomers = this.paginate(totalData);
    }
  }

  filterCustomers(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPagination();
    }
  }

  getSerialNumber(index: number): number {
    if (this.currentPage === 1) {
      return index + 1;
    } else {
      return 10 + (this.currentPage - 2) * 15 + index + 1;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }
}
