import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from './product.service';

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

  constructor(private productService: ProductService) {}

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

  filterProducts(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  applyFilterAndPagination(): void {
    const filtered = this.getFilteredList();
    this.filteredProducts = this.paginate(filtered);
  }

  getFilteredList(): any[] {
    const search = this.searchText.toLowerCase().trim();
    return this.products.filter(product => {
      const created = this.formatDate(product.createdDate);
      const modified = this.formatDate(product.modifiedDate);
      return product.productName.toLowerCase().includes(search) ||
        product.price.toString().includes(search) ||
        product.discount.toString().includes(search) ||
        product.totalQty.toString().includes(search) ||
        product.remainingQty.toString().includes(search) ||
        created.includes(search) ||
        modified.includes(search);
    });
  }

  paginate(data: any[]): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return data.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    const totalFiltered = this.getFilteredList();
    const totalPages = Math.ceil(totalFiltered.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.filteredProducts = this.paginate(totalFiltered);
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
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
}
