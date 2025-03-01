import { Routes } from '@angular/router';
import { ProductComponent } from "./components/product/product.component";
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { ProductService } from "./components/product/product.service";
import { CreateProductService } from './components/create-product/create-product.service';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateUserService } from './components/create-user/create-user.service';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard
import { UsersComponent } from './components/users/users.component';
import { UsersService } from './components/users/users.service';

export const routes: Routes = [
  {   
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  {   
    path: 'login', 
    component: LoginComponent, 
  },
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'product', 
        component: ProductComponent, 
        canActivate: [AuthGuard],
        resolve: { 
          products: ProductService
        }
      },
      {
        path: 'product/:id',
        component: CreateProductComponent, 
        canActivate: [AuthGuard],
        resolve: { 
          product: CreateProductService
        }
      },
      {
        path: 'user/:id',
        component: CreateUserComponent, 
        canActivate: [AuthGuard],
        resolve: { 
          users: CreateUserService
        }
      },
      {
        path: 'user',
        component: UsersComponent, 
        canActivate: [AuthGuard],
        resolve: { 
          users: UsersService
        }
      }
    ]
  }
];
