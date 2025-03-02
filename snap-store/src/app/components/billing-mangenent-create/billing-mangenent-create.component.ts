import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BillingMangementCreateService } from './billing-mangement-create.service';
import { Billing } from './billing-management-module';
import { CustomerManagementService } from '../customer-management/customer-management.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductService } from '../product/product.service';
import { NgbModal, NgbModalRef, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerMangementCreateService } from '../customer-management-create/customer-mangement-create.service';

@Component({
  selector: 'app-billing-mangenent-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, NgbModalModule],
  templateUrl: './billing-mangenent-create.component.html',
  styleUrl: './billing-mangenent-create.component.css'
})
export class BillingMangenentCreateComponent implements OnInit {
  billingForm!: FormGroup;
  billingData!: Billing;
  userId: number = 0;
  customers: any[] = [];
  selectedCustomer: any = null;
  searchText: string = "";
  customerForm!: FormGroup;
  public modalRef!: NgbModalRef;

  constructor(
    private fb: FormBuilder,
    private createBillingService: BillingMangementCreateService,
    private router: Router,
    private getCustomerService: CustomerManagementService,
    private getProductService: ProductService,
    private modalService: NgbModal,
    private createCustomerService: CustomerMangementCreateService
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      const User = JSON.parse(user);
      this.userId = User?.id;
    }
  }

  ngOnInit(): void {
    this.createBillingService.getBillingObservable().subscribe(data => {
      if (data === false) {
        this.createForm(new Billing());
      } else {
        this.billingData = data;
        this.createForm(this.billingData);
      }
    });

    this.getCustomerService.fetchCustomer().subscribe(resp => {
      this.customers = resp;
    });

    this.initCustomerForm();
  }

  createForm(billing: Billing): void {
    this.billingForm = this.fb.group({
      id: [billing.id],
      billingName: [billing.billingName, Validators.required],
      description: [billing.description],
      barcode: [billing.barcode],
      expireDate: [this.convertToDate(billing.expireDate)],
      manufactureDate: [this.convertToDate(billing.manufactureDate)],
      price: [billing.price, [Validators.required, Validators.min(0)]],
      discount: [billing.discount],
      gst: [billing.gst],
      remainingQty: [billing.remainingQty],
      totalQty: [billing.totalQty, [Validators.required, Validators.min(1)]],
      createdBy: [billing.createdBy || 1],
      modifiedBy: [billing.modifiedBy || 1],
      companyId: [billing.companyId || 1],
      createdDate: [billing.createdDate || '']
    });
  }

  private convertToDate(dateString: string | null): string | null {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : null;
  }

  onSubmit(): void {
    if (this.billingForm.invalid) {
      console.warn("Form is invalid. Please check required fields.");
      return;
    }
    const data = this.billingForm.getRawValue();
    data.userId = this.userId;

    this.createBillingService.addBilling(data).subscribe({
      next: () => {
        alert("Billing added successfully!");
        this.router.navigateByUrl("/billing");
      },
      error: (error) => {
        console.error("Error adding billing:", error);
        alert("Failed to add billing. Please try again.");
      }
    });
  }

  initCustomerForm(): void {
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      whatsappNo: ['', Validators.required]
    });
  }

  openCustomerModal(content: any): void {
    this.modalRef = this.modalService.open(content, { centered: true });
  }

saveCustomer(): void {
  if (this.customerForm.invalid) {
    return;
  }

  const data = this.customerForm.getRawValue();
  data.userId = this.userId;

  this.createCustomerService.addCustomer(data).subscribe({
    next: (response) => {
      alert("Customer added successfully!");

      if (this.modalRef) {
        this.modalRef.close();
      }

      this.getCustomerService.fetchCustomer().subscribe(resp => {
        this.customers = resp;

        this.selectedCustomer = this.customers.find(e => 
          e.customerName.trim() === data.customerName.trim()
        );
      });
    },

    error: (error) => {
      console.error("Error adding customer:", error);
      alert("Failed to add customer. Please try again.");
    }
  });
}
}
