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
import { BillingManagementComponent } from './components/billing-management/billing-management.component';
import { BillingManagementService } from './components/billing-management/billing-management.service';
import { CustomerManagementComponent } from './components/customer-management/customer-management.component';
import { CustomerManagementService } from './components/customer-management/customer-management.service';
import { CustomerManagementCreateComponent } from './components/customer-management-create/customer-management-create.component';
import { CustomerMangementCreateService } from './components/customer-management-create/customer-mangement-create.service';
import { BillingMangementCreateService } from './components/billing-mangenent-create/billing-mangement-create.service';
import { BillingMangenentCreateComponent } from './components/billing-mangenent-create/billing-mangenent-create.component';

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
        path: 'billing', 
        component: BillingManagementComponent, 
        canActivate: [AuthGuard],
        resolve: { 
          billings: BillingManagementService
        }
      },
      {
        path: 'billing/:id',
        component: BillingMangenentCreateComponent, 
        canActivate: [AuthGuard],
        resolve: { 
          billing: BillingMangementCreateService
        }
      },
      {
        path: 'customer',
        component: CustomerManagementComponent, 
        canActivate: [AuthGuard],
        resolve: { 
          customers: CustomerManagementService
        }
      },
      {
        path: 'customer/:id',
        component: CustomerManagementCreateComponent, 
        canActivate: [AuthGuard],
        resolve: { 
          customer: CustomerMangementCreateService
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
