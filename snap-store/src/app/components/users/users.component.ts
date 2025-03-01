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
  filteredUsers: any[] = [];
  searchText: string = '';

  constructor(private _UsersService : UsersService) {}

  ngOnInit(): void {
    this._UsersService.users$.subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  filterUser(): void {
    const search = this.searchText.toLowerCase().trim();
    
    this.filteredUsers = this.users.filter(user => {
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
