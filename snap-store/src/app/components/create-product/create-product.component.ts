import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProductService } from './create-product.service';
import { Product } from './create-product.module';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  productData!: Product;
  userId: number = 0;
  pageType: String = "";
  productList: Product[] = [];


  constructor(
    private fb: FormBuilder,
    private createProductService: CreateProductService,
    private router: Router,
    private productService: ProductService
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      const User = JSON.parse(user);
      this.userId = User?.id;
    }
  }

  ngOnInit(): void {
    this.createProductService.getProductObservable().subscribe(data => {
      if (data === false) {
        this.pageType = "New";
        this.createForm(new Product());
        this.productService.fetchProducts().subscribe(products => {
          this.productList = products;
        });
      } else {
        this.productData = data;
        this.pageType = "Edit";
        this.createForm(this.productData);
      }
    });
  }

  createForm(product: Product): void {
    this.productForm = this.fb.group({
      id: [product.id],
      productName: [product.productName, Validators.required],
      description: [product.description],
      mrp: [product.mrp, [Validators.required, Validators.min(0)]],
      expireDate: [this.convertToDate(product.expireDate)],
      manufactureDate: [this.convertToDate(product.manufactureDate)],
      price: [product.price, [Validators.required, Validators.min(0)]],
      discount: [product.discount],
      gst: [product.gst],
      updateQty: [0],
      remainingQty: [product.remainingQty],
      totalQty: [product.totalQty, [Validators.required, Validators.min(1)]],
      createdBy: [product.createdBy || 1],
      modifiedBy: [product.modifiedBy || 1],
      companyId: [product.companyId || 1],
      createdDate: [product.createdDate || '']
    });
  }

  private convertToDate(dateString: string | null): string | null {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : null;
  }


  onSubmit(): void {
    if (this.productForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        text: 'Please fill all required fields.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const data = this.productForm.getRawValue();
    data.userId = this.userId;

    if (this.pageType === 'New') {
      data.remainingQty = data.totalQty;
    } else {
      if (data.updateQty) {
        data.remainingQty = data.updateQty + data.remainingQty;
        data.totalQty = data.updateQty + data.totalQty;
      }
    }
    if (this.pageType === 'New' && this.isDuplicateProduct(data.productName)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Duplicate Product Found. Please check.',
        confirmButtonColor: '#dc3545'
      });
      return; // stop creation
    }

    this.createProductService.addProduct(data).subscribe({
      next: () => {
        const action = this.pageType === 'New' ? 'added' : 'updated';
        Swal.fire({
          icon: 'success',
          title: `Product ${action} successfully!`,
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigateByUrl('/product');
        });
      },
      error: (error) => {
        console.error("Error saving product:", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Something went wrong. Please try again.',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }
  isFormValid(): boolean {
    const form = this.productForm;
    return form.valid &&
      !!form.get('productName')?.value?.trim() &&
      form.get('mrp')?.value > 0 &&
      form.get('price')?.value > 0 &&
      form.get('totalQty')?.value > 0;
  }

  isDuplicateProduct(name: string): boolean {
    return this.productList.some(product =>
      product.productName?.trim().toLowerCase() === name?.trim().toLowerCase()
    );
  }
}
