import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProductsMap: Map<number, { product: any; quantity: number }> = new Map();
  selectedProducts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  

  constructor(
    private fb: FormBuilder,
    private createBillingService: BillingMangementCreateService,
    private router: Router,
    private getCustomerService: CustomerManagementService,
    private modalService: NgbModal,
    private createCustomerService: CustomerMangementCreateService,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef
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

    this.productService.fetchProducts().subscribe(resp => {
      this.products = resp;
      this.filteredProducts = resp;
      this.filterProducts();
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
    console.log(product)
    if (product.quantity > product.totalQty) {
      alert("Entered quantity is more than remaining quantity.");
      product.quantity = product.totalQty;  
    }
  
    if (product.selected || product.quantity >= 0) {
      product.selected = true;
      this.selectedProductsMap.set(product.id, { product, quantity: product.quantity || 1 });
    } else {
      product.selected = false;
      this.selectedProductsMap.delete(product.id);
    }
    this.cdRef.markForCheck();
  }

  removeProduct(product: any): void {
    console.log(product);
    this.selectedProducts = this.selectedProducts.filter(p => p.id !== product.id);
    product.selected = false;
    product.quantity = 0;
    this.selectedProductsMap.delete(product.id);
    const mainProduct = this.products.find(p => p.id === product.id);
    if (mainProduct) {
      mainProduct.selected = false;
      mainProduct.quantity = 0;
    }
  }
  
  
  updateProductQuantity(product: any): void {
    if (product.quantity < 1) {
      product.quantity = 1;
    }
    console.log("Updated quantity:",product);
  }
  
  

toggleSelectAll(event: any): void {
  const isChecked = event.target.checked;
  this.filteredProducts.forEach(product => {
    product.selected = isChecked;
    product.quantity = isChecked ? 1 : 0;

    if (isChecked) {
      this.selectedProductsMap.set(product.id, { product, quantity: 1 });
    } else {
      this.selectedProductsMap.delete(product.id);
    }
  });
}

addSelectedProducts(): void {
  this.selectedProducts = Array.from(this.selectedProductsMap.values()).map(entry => ({
    ...entry.product,
    quantity: entry.quantity
  }));
  console.log("this.selectedProducts",this.selectedProducts)
  this.modalRef.close();
}


  
filterProducts(): void {
  const search = this.searchText.toLowerCase().trim();
  this.filteredProducts = this.products.filter(product => 
    product.productName.toLowerCase().includes(search) ||
    product.barcode.toLowerCase().includes(search) ||
    product.price.toString().includes(search) ||
    product.discount.toString().includes(search)
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
    alert(`Product Selected: ${product.productName}`);
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
