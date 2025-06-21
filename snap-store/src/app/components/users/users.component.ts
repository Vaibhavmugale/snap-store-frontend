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
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
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
        console.error("Error parsing user data:", error);
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
      }
    });
  }

  applyFilterAndPagination(): void {
    const search = this.searchText.toLowerCase().trim();

    const filtered = this.users.filter(user => {
      const userType = user.usertype === 1 ? 'admin' : 'normal user';

      return user.userName.toLowerCase().includes(search) ||
        user.emailId.toLowerCase().includes(search) ||
        user.mobileNo.toString().includes(search) ||
        userType.includes(search);
    });
    this.filteredUsers = this.paginate(filtered);
  }

  paginate(data: any[]): any[] {
    const startIndex = this.currentPage === 1 ? 0 : 10 + (this.currentPage - 2) * 15;
    const size = this.currentPage === 1 ? 10 : 15;
    return data.slice(startIndex, startIndex + size);
  }

  nextPage(): void {
    const totalData = this.users.filter(user => {
      const userType = user.usertype === 1 ? 'admin' : 'normal user';
      const search = this.searchText.toLowerCase().trim();
      return user.userName.toLowerCase().includes(search) ||
        user.emailId.toLowerCase().includes(search) ||
        user.mobileNo.toString().includes(search) ||
        userType.includes(search);
    });

    const nextStart = this.currentPage === 1 ? 10 : 10 + (this.currentPage - 1) * 15;
    if (nextStart < totalData.length) {
      this.currentPage++;
      this.filteredUsers = this.paginate(totalData);
    }
  }

  filterUser(): void {
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilterAndPagination();
    }
  }

  getSerialNumber(index: number): number {
    if (this.currentPage === 1) {
      return index + 1;
    } else {
      return 10 + (this.currentPage - 2) * 15 + index + 1;
    }

  }
}
