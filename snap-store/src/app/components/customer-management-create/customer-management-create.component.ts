// customer-management-create.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerMangementCreateService } from './customer-mangement-create.service';
import { Customer } from './customer-management-create.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-management-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-management-create.component.html',
  styleUrl: './customer-management-create.component.css'
})
export class CustomerManagementCreateComponent implements OnInit {
  customerForm!: FormGroup;
  customerData!: Customer;
  userId: number = 0;
  isEdit: string = '';

  constructor(
    private fb: FormBuilder,
    private createCustomerService: CustomerMangementCreateService,
    private router: Router
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      const User = JSON.parse(user);
      this.userId = User?.id;
    }
  }

  ngOnInit(): void {
    this.createCustomerService.getCustomerObservable().subscribe(data => {
      if (data === false) {
        this.createForm(new Customer());
        this.isEdit = 'new';
      } else {
        this.customerData = data;
        this.isEdit = 'edit';
        this.createForm(this.customerData);
      }
    });
  }

  createForm(customer: Customer): void {
this.customerForm = this.fb.group({
  id: [customer.id],
  customerName: [customer.customerName, Validators.required],
  emailId: [customer.emailId, [Validators.required, Validators.email]],
  mobileNo: [
    customer.mobileNo,
    [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]
  ],
  whatsappNo: [
    customer.whatsappNo,
    [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]
  ],
  createdBy: [customer.createdBy || 1],
  createdDate: [customer.createdDate || '']
});

  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all required fields.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const data = this.customerForm.getRawValue();
    data.userId = this.userId;

    this.createCustomerService.addCustomer(data).subscribe({
      next: () => {
        const action = this.isEdit === 'edit' ? 'updated' : 'added';
        Swal.fire({
          icon: 'success',
          title: `Customer ${action} successfully!`,
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigateByUrl('/customer');
        });
      },
      error: (error) => {
        console.error('Error adding customer:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Failed to save customer. Please try again.',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }
}
