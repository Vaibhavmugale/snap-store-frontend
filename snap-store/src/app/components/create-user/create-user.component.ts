import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserService } from './create-user.service';
import { User } from './create-user.module';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;
  userData!: User;
  showPassword = false;
  showConfirmPassword = false;
  isEdit: string = '';
  userType: number = 0;

  constructor(
    private fb: FormBuilder,
    private _createUserService: CreateUserService,
    private router: Router
  ) {
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
    this._createUserService.getUserObservable().subscribe(data => {
      if (data === false) {
        this.isEdit = 'new';
        this.createForm(new User());
      } else {
        this.isEdit = 'edit';
        this.userData = data;
        this.createForm(this.userData);
      }
    });
  }

  createForm(user: User): void {
    this.userForm = this.fb.group({
      id: [user.id],
      userName: [user.userName, Validators.required],
      confirmPassword: [user.password2, Validators.required],
      password2: [user.password2, Validators.required],
      emailId: [user.emailId, [Validators.required, Validators.email]],
      mobileNo: [user.mobileNo, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      whatsappNo: [user.whatsappNo, [Validators.pattern('^[0-9]{10}$')]],
      companyName: [user.companyName || '', Validators.required],
      usertype: [user.usertype || 0, Validators.required],
      createdBy: [user.createdBy || 1],
      modifiedBy: [user.modifiedBy || 1],
      userStatus: [user.userStatus],
      createdDate: [user.createdDate || ''],
      showPassword: [false],
      showConfirmPassword: [false]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): any {
    const password = group.get('password2')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password2') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all required fields correctly.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const data = this.userForm.getRawValue();

    this._createUserService.addUser(data).subscribe({
      next: (response) => {
        const action = this.isEdit === 'edit' ? 'updated' : 'added';

        Swal.fire({
          icon: 'success',
          title: `User ${action} successfully!`,
          text: `The user has been ${action}.`,
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.router.navigateByUrl('/user');
        });
      },

      error: (error: HttpErrorResponse) => {
        if (error.status === 409 && error.error === 'Email already exists!') {
          Swal.fire({
            icon: 'error',
            title: 'Email Already Exists',
            text: 'Please use a different email address.',
            confirmButtonColor: '#d33',
          });
        } else if (error.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'User Not Found',
            text: 'The user could not be found.',
            confirmButtonColor: '#d33',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'Something went wrong. Please try again later.',
            confirmButtonColor: '#d33',
          });
        }
      }
    });
  }
}
