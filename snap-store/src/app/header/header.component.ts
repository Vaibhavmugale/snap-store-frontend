import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIf, RouterOutlet, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userName: string | null = null;
  userType: number =0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        this.userName = parsedUser.userName;
        this.userType = parsedUser.usertype;
        console.log(this.userType)
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }

  logOut() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // product() {
  //   this.router.navigateByUrl("/product");
  // }

  // home() {
  //   this.router.navigateByUrl("/dashboard");
  // }
}
