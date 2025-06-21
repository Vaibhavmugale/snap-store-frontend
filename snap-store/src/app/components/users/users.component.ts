import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgIf],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredAllData: any[] = [];
  filteredUsers: any[] = [];
  searchText: string = '';
  userType: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private _UsersService: UsersService) {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        this.userType = parsedUser.usertype;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  ngOnInit(): void {
    this._UsersService.users$.subscribe({
      next: (data) => {
        this.users = data;
        this.applyFilterAndPagination();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  applyFilterAndPagination(): void {
    const search = this.searchText.toLowerCase().trim();
    this.filteredAllData = this.users.filter((user) => {
      const typeStr = user.usertype === 1 ? 'admin' : 'normal user';
      return (
        user.userName.toLowerCase().includes(search) ||
        user.emailId.toLowerCase().includes(search) ||
        user.mobileNo.toString().includes(search) ||
        typeStr.includes(search)
      );
    });

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredUsers = this.filteredAllData.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  filterUser(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  nextPage(): void {
    const nextStart = this.currentPage * this.pageSize;
    if (nextStart < this.filteredAllData.length) {
      this.currentPage++;
      this.applyFilterAndPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPagination();
    }
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
}
