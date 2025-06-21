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
  filteredBillings: any[] = [];
  searchText: string = '';
  selectedBilling: string = '';
  currentPage: number = 1;
  pageSize: number = 10;


  constructor(private _BillingsService: BillingManagementService) { }

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
    const filtered = this.billings.filter(billing => {
      const formattedCreatedDate = this.formatDate(billing.createdDate);
      return billing.customerName.toLowerCase().includes(search) ||
        billing.customerEmail.toLowerCase().includes(search) ||
        billing.customerPhone.toLowerCase().includes(search) ||
        billing.totalQty.toString().includes(search) ||
        billing.totalAmount.toString().includes(search) ||
        formattedCreatedDate.includes(search);
    });
    this.filteredBillings = this.paginate(filtered);
  }

  paginate(data: any[]): any[] {
    const startIndex = this.currentPage === 1 ? 0 : 10 + (this.currentPage - 2) * 15;
    const size = this.currentPage === 1 ? 10 : 15;
    return data.slice(startIndex, startIndex + size);
  }

  nextPage(): void {
    const totalData = this.billings.filter(billing => {
      const formattedCreatedDate = this.formatDate(billing.createdDate);
      const search = this.searchText.toLowerCase().trim();
      return billing.customerName.toLowerCase().includes(search) ||
        billing.customerEmail.toLowerCase().includes(search) ||
        billing.customerPhone.toLowerCase().includes(search) ||
        billing.totalQty.toString().includes(search) ||
        billing.totalAmount.toString().includes(search) ||
        formattedCreatedDate.includes(search);
    });

    const nextStart = this.currentPage === 1 ? 10 : 10 + (this.currentPage - 1) * 15;
    if (nextStart < totalData.length) {
      this.currentPage++;
      this.filteredBillings = this.paginate(totalData);
    }
  }

  filterBillings(): void {
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
