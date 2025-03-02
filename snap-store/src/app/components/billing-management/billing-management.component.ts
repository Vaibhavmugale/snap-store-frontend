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



  constructor(private _BillingsService : BillingManagementService) {}

  ngOnInit(): void {
    this._BillingsService.billings$.subscribe({
      next: (data) => {
        this.billings = data;
        this.filteredBillings = data;
      },
      error: (err) => {
        console.error('Error fetching billings:', err);
      }
    });
  }

  filterBillings(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredBillings = this.billings.filter(billing => {
      const formattedCreatedDate = this.formatDate(billing.createdDate);
      const formattedModifiedDate = this.formatDate(billing.modifiedDate);
      return billing.billingName.toLowerCase().includes(search) ||
             billing.emailId.toLowerCase().includes(search) ||
             billing.mobileNo.toString().includes(search) ||
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
