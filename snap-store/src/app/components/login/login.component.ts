import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule,FormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar // ✅ Use MatSnackBar here
  ) {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    console.log("Login function called!");
  
    if (this.loginForm.invalid) {
      console.warn("Form is invalid. Please check required fields.");
      return;
    }
  
    const data = this.loginForm.value;
  
    this.loginService.login(data).subscribe({
      next: (response) => {
        console.log("Login successful!", response);
  
        if (response && response.token && response.user) {
          localStorage.setItem("jwtToken", response.token);  // Store JWT token
          localStorage.setItem("user", JSON.stringify(response.user)); // Store user data
        } else {
          console.error("Login response does not contain necessary data.");
          return;
        }
  
        this.snackBar.open("Welcome to Snapstore!", "ok", {
          duration: 2000,
          verticalPosition: "top",
          horizontalPosition: "center",
          panelClass: ["success-snackbar"],
        });
  
        this.router.navigateByUrl("/dashboard");
      },
      error: (error) => {
        console.error("Error logging in:", error);
  
        let message = "Failed to login. Please try again later.";
        if (error.status === 401) {
          message = "Invalid credentials. Please try again.";
        } else if (error.status === 404) {
          message = "User not found. Please check your email.";
        }
        localStorage.removeItem('jwtToken');
         localStorage.removeItem('user');
        this.snackBar.open(message, "ok", {
          duration: 2000,
          verticalPosition: "top",
          horizontalPosition: "center",
          panelClass: ["error-snackbar"],
        });
      }
    });
  }  
}  
