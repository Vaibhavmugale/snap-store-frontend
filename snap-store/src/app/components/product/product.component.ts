import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  selectedBilling: string = '';
  selectedCustomer: string = '';
  selectedOrder: string = '';

  billingOptions: string[] = ['Billing 1', 'Billing 2', 'Billing 3'];
  customerOptions: string[] = ['Customer 1', 'Customer 2', 'Customer 3'];
  orderOptions: string[] = ['Order 1', 'Order 2', 'Order 3'];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.products$.subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  filterProducts(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product => {
      const formattedCreatedDate = this.formatDate(product.createdDate);
      const formattedModifiedDate = this.formatDate(product.modifiedDate);
      return product.productName.toLowerCase().includes(search) ||
             product.barcode.toLowerCase().includes(search) ||
             product.price.toString().includes(search) ||
             product.discount.toString().includes(search) ||
             formattedCreatedDate.includes(search) ||
             formattedModifiedDate.includes(search);
    });
  }
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }
  


  publish(): void {
    console.log('Publish clicked!');
  }
}
