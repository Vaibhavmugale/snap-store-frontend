import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserService } from './create-user.service';
import { User } from './create-user.module';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;
  userData!: User;
  showPassword = false;
  showConfirmPassword = false;
  isEdit:string='';


  constructor(
    private fb: FormBuilder,
    private _createUserService: CreateUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._createUserService.getUserObservable().subscribe(data => {
      if (data === false) {
        this.isEdit='new';
        this.createForm(new User());
      } else {
        this.isEdit='edit';
        this.userData = data;
        this.createForm(this.userData);
      }
    });
    
  }

  createForm(user: User): void {
    this.userForm = this.fb.group(
      {
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
      },
      { validator: this.passwordMatchValidator }
    );
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
      console.warn("Form is invalid. Please check required fields.");
      return;
    }
  
    const data = this.userForm.getRawValue();
    console.log(data)
    this._createUserService.addUser(data).subscribe({
      next: (response) => {
        if (response === true || response === "User created successfully!") {
          if(this.isEdit=='edit'){
          alert("User updated successfully!");
          }else{
          alert("User added successfully!");
          }
          this.router.navigateByUrl("/user");
          
        } else {
          alert("Unexpected response received.");
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409 && error.error === "Email already exists!") {
          alert("Email already exists!");
        } else if (error.status === 404) {
          alert("Resource not found!");
        } else {
          alert("Failed to add user. Please try again.");
        }
      }
    });
  }
  

}
