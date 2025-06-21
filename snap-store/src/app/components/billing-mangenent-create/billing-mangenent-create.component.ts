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
import Swal from 'sweetalert2';

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
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProductsSet: Set<any> = new Set();
  selectedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalAmount = 0;
  totalDisc = 0;
  totalGst = 0;
  totalQty = 0;

  constructor(
    private fb: FormBuilder,
    private createBillingService: BillingMangementCreateService,
    private router: Router,
    private getCustomerService: CustomerManagementService,
    private modalService: NgbModal,
    private createCustomerService: CustomerMangementCreateService,
    private productService: ProductService
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      const User = JSON.parse(user);
      this.userId = User?.id;
    }
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      whatsappNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });

  }

  ngOnInit(): void {
    this.createForm(new Billing());

    this.getCustomerService.fetchCustomer().subscribe(resp => {
      this.customers = resp;
    });

    this.productService.fetchProducts().subscribe(resp => {
      this.products = resp;
      this.filteredProducts = resp;
      this.filterProducts();
    });
  }

  createForm(billing: Billing): void {
    this.billingForm = this.fb.group({
      id: [billing.id],
      totalAmount: [billing.totalAmount],
      totalGst: [billing.totalGst],
      totalDisc: [billing.totalDisc],
      customerId: [null, Validators.required],
      totalQty: [billing.totalQty],
      createdBy: [this.userId],
      modifiedBy: [this.userId],
      companyId: [billing.companyId || 1],
      userId: [billing.userId || this.userId],
      createdDate: [billing.createdDate || ''],
      selectedProducts: [null, Validators.required],
      quantity: [billing.quantity],
      price: [billing.price]
    });
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  openProductModal(content: any) {
    this.modalRef = this.modalService.open(content, { size: 'xl', centered: true });
  }

  autoSelectProduct(product: any): void {
    product.selected = product.quantity > 0;
  }

  updateSelection(product: any): void {
    if (product.quantity > product.remainingQty || product.remainingQty===0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Entered quantity is more than remaining quantity.',
        confirmButtonColor: '#3085d6'
      });
      product.quantity = 0;
      product.selected = false;
    } else {
      if (product?.selected  && product.remainingQty > 0) {
        product.selected = true;
        product.quantity = 1;
        this.selectedProductsSet.add(product);
      } else {
        this.selectedProductsSet.delete(product);
         product.quantity = 0;
          product.selected = false;
      }
    }
  }

   updateEnter(product: any): void {
    if (product.quantity > product.remainingQty  || product.remainingQty===0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Entered quantity is more than remaining quantity.',
        confirmButtonColor: '#3085d6'
      });
      product.quantity = 0;
    } else {
      if (!product?.selected  && product.remainingQty > 0) {
        product.selected = true;
        this.selectedProductsSet.add(product);
      }
    }
  }

  removeProduct(product: any): void {
    product.selected = false;
    this.selectedProductsSet.delete(product);
  }

  onCustomerChange(customer: any) {
    this.selectedCustomer = customer || null;
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;

    this.filteredProducts.forEach(product => {
      product.selected = isChecked;
      product.quantity = isChecked ? 1 : 0;

      if (isChecked) {
        this.selectedProductsSet.add(product);
      } else {
        this.selectedProductsSet.delete(product);
      }
    });
  }

  addSelectedProducts(): void {
    this.selectedProducts = Array.from(this.selectedProductsSet);

    this.totalAmount = 0;
    this.totalGst = 0;
    this.totalDisc = 0;
    this.totalQty = 0;

    this.selectedProducts.forEach(product => {
      let baseTotal = product.price * product.quantity;
      const discount = product.discount || 0;
      const discountedAmount = baseTotal * (discount / 100);
      const afterDiscount = baseTotal - discountedAmount;
      const gst = product.gst || 0;
      const gstAmount = afterDiscount * (gst / 100);
      const total = parseFloat((afterDiscount + gstAmount).toFixed(2));
      product.total = total;
      const quantity = product.quantity || 0;

      this.totalAmount = parseFloat((total + this.totalAmount).toFixed(2));
      this.totalGst = parseFloat((gstAmount + this.totalGst).toFixed(2));
      this.totalDisc = parseFloat((discountedAmount + this.totalDisc).toFixed(2));
      this.totalQty = parseFloat((this.totalQty + quantity).toFixed(2));
    });
    this.modalRef.close();
  }

  filterProducts(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product =>
      product.productName.toLowerCase().includes(search) ||
      product.price.toString().includes(search) ||
      product.quantity.toString().includes(search)
    );
    this.currentPage = 1;
    this.updateTotalPages();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get paginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  selectProduct(product: any): void {
    Swal.fire({
      icon: 'info',
      title: 'Product Selected',
      text: `Product Selected: ${product.productName}`,
      timer: 1500,
      showConfirmButton: false
    });
    this.modalRef.close();
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
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Customer added successfully!',
          confirmButtonColor: '#3085d6'
        });

        if (this.modalRef) {
          this.modalRef.close();
        }

        this.getCustomerService.fetchCustomer().subscribe(resp => {
          this.customers = resp;

          this.selectedCustomer = this.customers.find(e =>
            e.customerName.trim() === data.customerName.trim()
          );

          if (this.selectedCustomer) {
            this.billingForm.get('customerId')?.setValue(this.selectedCustomer.id);
          }
        });
      },

      error: (error) => {
        console.error("Error adding customer:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add customer. Please try again.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }


  saveBilling(): void {
    const data = this.billingForm.getRawValue();
    data.totalAmount = this.totalAmount;
    data.totalGst = this.totalGst;
    data.totalDisc = this.totalDisc;
    data.totalQty = this.totalQty;
    data.selectedProducts = this.selectedProducts;

    this.createBillingService.addBilling(data).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Billing created successfully!',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigateByUrl('/billing');
        });
      },

      error: (error) => {
        console.error("Error create billing:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create billing. Please try again.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
