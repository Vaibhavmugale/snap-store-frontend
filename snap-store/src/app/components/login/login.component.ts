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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSnackBarModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.invalid) {
      this.snackBar.open('⚠️ Please fill all fields correctly.', 'Close', {
        duration: 2500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    const data = this.loginForm.value;

    this.loginService.login(data).subscribe({
      next: (response) => {
        if (response && response.token && response.user) {
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          this.snackBar.open('✅ Welcome back to Snap Store!', 'Close', {
            duration: 2500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['success-snackbar'],
          });

          this.router.navigateByUrl('/dashboard');
        } else {
          this.snackBar.open('❗ Unexpected response. Please try again.', 'Close', {
            duration: 2500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['error-snackbar'],
          });
        }
      },
      error: (error) => {
        console.error('Error logging in:', error);

        let message = '🚫 Failed to login. Please try again.';
        if (error.status === 401) {
          message = '❌ Invalid credentials. Please try again.';
        } else if (error.status === 404) {
          message = '🔍 User not found. Check your email.';
        }

        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');

        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
