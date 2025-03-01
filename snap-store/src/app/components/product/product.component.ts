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
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  publish(): void {
    console.log('Publish clicked!');
  }
}
