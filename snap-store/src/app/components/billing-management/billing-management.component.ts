import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BillingManagementService } from './billing-management.service';

@Component({
  selector: 'app-billing-management',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './billing-management.component.html',
  styleUrl: './billing-management.component.css'
})
export class BillingManagementComponent implements OnInit {
  billings: any[] = [];
  filteredAllBillings: any[] = [];
  filteredBillings: any[] = [];
  searchText: string = '';
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private _BillingsService: BillingManagementService) {}

  ngOnInit(): void {
    this._BillingsService.billings$.subscribe({
      next: (data) => {
        this.billings = data;
        this.applyFilterAndPagination();
      },
      error: (err) => {
        console.error('Error fetching billings:', err);
      }
    });
  }

  applyFilterAndPagination(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredAllBillings = this.billings.filter(billing => {
      const formattedCreatedDate = this.formatDate(billing.createdDate);
      return billing.customerName.toLowerCase().includes(search) ||
        billing.customerEmail.toLowerCase().includes(search) ||
        billing.customerPhone.toLowerCase().includes(search) ||
        billing.totalQty.toString().includes(search) ||
        billing.totalAmount.toString().includes(search) ||
        formattedCreatedDate.includes(search);
    });

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredBillings = this.filteredAllBillings.slice(startIndex, startIndex + this.pageSize);
  }

  paginate(data: any[]): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return data.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    const nextStart = this.currentPage * this.pageSize;
    if (nextStart < this.filteredAllBillings.length) {
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

  filterBillings(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
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
