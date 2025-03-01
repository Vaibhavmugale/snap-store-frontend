import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  selectedBilling: string = '';
  selectedCustomer: string = '';
  selectedOrder: string = '';

  billingOptions: string[] = ['Billing 1', 'Billing 2', 'Billing 3'];
  customerOptions: string[] = ['Customer 1', 'Customer 2', 'Customer 3'];
  orderOptions: string[] = ['Order 1', 'Order 2', 'Order 3'];

  constructor(private _UsersService : UsersService) {}

  ngOnInit(): void {
    this._UsersService.users$.subscribe({
      next: (data) => {
        this.users = data;
        this.filteredProducts = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  filterUser(): void {
    const search = this.searchText.toLowerCase().trim();
    
    this.filteredProducts = this.users.filter(user => {
      const userType = user.usertype === 1 ? 'admin' : 'normal user';
  
      return user.userName.toLowerCase().includes(search) ||
             user.emailId.toLowerCase().includes(search) ||
             user.mobileNo.toString().includes(search) ||
             userType.includes(search);
    });
  }
  

  publish(): void {
    console.log('Publish clicked!');
  }
}
