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
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.products$.subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilterAndPagination();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  applyFilterAndPagination(): void {
    const search = this.searchText.toLowerCase().trim();
    const filtered = this.products.filter(product => {
      const formattedCreatedDate = this.formatDate(product.createdDate);
      const formattedModifiedDate = this.formatDate(product.modifiedDate);
      return product.productName.toLowerCase().includes(search) ||
        product.price.toString().includes(search) ||
        product.totalQty.toString().includes(search) ||
        product.remainingQty.toString().includes(search) ||
        product.discount.toString().includes(search) ||
        formattedCreatedDate.includes(search) ||
        formattedModifiedDate.includes(search);
    });

    this.filteredProducts = this.paginate(filtered);
  }

  filterProducts(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  paginate(data: any[]): any[] {
    const startIndex = this.currentPage === 1 ? 0 : 10 + (this.currentPage - 2) * 15;
    const size = this.currentPage === 1 ? 10 : 15;
    return data.slice(startIndex, startIndex + size);
  }

  nextPage(): void {
    const totalData = this.products.filter(product => {
      const formattedCreatedDate = this.formatDate(product.createdDate);
      const formattedModifiedDate = this.formatDate(product.modifiedDate);
      const search = this.searchText.toLowerCase().trim();
      return product.productName.toLowerCase().includes(search) ||
        product.price.toString().includes(search) ||
        product.totalQty.toString().includes(search) ||
        product.remainingQty.toString().includes(search) ||
        product.discount.toString().includes(search) ||
        formattedCreatedDate.includes(search) ||
        formattedModifiedDate.includes(search);
    });

    const nextStart = this.currentPage === 1 ? 10 : 10 + (this.currentPage - 1) * 15;
    if (nextStart < totalData.length) {
      this.currentPage++;
      this.filteredProducts = this.paginate(totalData);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPagination();
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }

  getSerialNumber(index: number): number {
    if (this.currentPage === 1) {
      return index + 1;
    } else {
      return 10 + (this.currentPage - 2) * 15 + index + 1;
    }
  }

}
