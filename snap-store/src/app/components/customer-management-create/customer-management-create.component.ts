import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { CustomerMangementCreateService } from './customer-mangement-create.service';
import { Customer } from './customer-management-create.module';

@Component({
  selector: 'app-customer-management-create',
   imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customer-management-create.component.html',
  styleUrl: './customer-management-create.component.css'
})
export class CustomerManagementCreateComponent implements OnInit {
  customerForm!: FormGroup;
  customerData!: Customer;
  userId:number=0;
  isEdit:string='';

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
        this.isEdit='new';
      } else {
        this.isEdit='edit';
        this.customerData = data;
        this.createForm(this.customerData);
      }
    });
  }

  createForm(customer: Customer): void {
    this.customerForm = this.fb.group({
      id: [customer.id],
      customerName: [customer.customerName, Validators.required],
      emailId: [customer.emailId, Validators.required],
      mobileNo: [customer.mobileNo, Validators.required],
      whatsappNo: [customer.whatsappNo, Validators.required],
      createdBy: [customer.createdBy || 1],
      createdDate: [customer.createdDate || '']
    });
}


onSubmit(): void {
  if (this.customerForm.invalid) {
    console.warn("Form is invalid. Please check required fields.");
    return;
  }

  const data = this.customerForm.getRawValue();
  data.userId=this.userId;
  
  this.createCustomerService.addCustomer(data).subscribe({
    next: (response) => {
      if(this.isEdit=='edit'){
        alert("Customer Updated successfully!");
        }else{
          alert("Customer added successfully!");
        }
      this.router.navigateByUrl("/customer");
    },

    error: (error) => {
      console.error("Error adding customer:", error);
      alert("Failed to add customer. Please try again.");
    }
  });
}

}
