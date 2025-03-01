import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProductService } from './create-product.service';
import { Product } from './create-product.module';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  productData!: Product;

  constructor(
    private fb: FormBuilder,
    private createProductService: CreateProductService
  ) {}

  ngOnInit(): void {
    this.createProductService.getProductObservable().subscribe(data => {
      if (data === false) {
        this.createForm(new Product());
      } else {
        this.productData = data;
        this.createForm(this.productData);
      }
    });
  }

  createForm(product: Product): void {
    this.productForm = this.fb.group({
      id: [product.id],
      productName: [product.productName, Validators.required],
      description: [product.description],
      barcode: [product.barcode],
      expireDate: [product.expireDate],
      manufactureDate: [product.manufactureDate],
      price: [product.price, [Validators.required, Validators.min(0)]],
      discount: [product.discount],
      gst: [product.gst],
      remainingQty: [product.remainingQty],
      totalQty: [product.totalQty, [Validators.required, Validators.min(1)]],
      createdBy: [product.createdBy || 1],
      modifiedBy: [product.modifiedBy || 1],
      companyId: [product.companyId || 1],
      createdDate: [product.createdDate || '']
    });
}



onSubmit(): void {
  if (this.productForm.invalid) {
    console.warn("Form is invalid. Please check required fields.");
    return;
  }

  const data = this.productForm.getRawValue();

  this.createProductService.addProduct(data).subscribe({
    next: (response) => {
      alert("Product added successfully!");
    },
    error: (error) => {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  });
}

}
