import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductListComponent } from './components/product-list/product-list';
import { adminGuard } from './guards/admin-guard';
import { UserManagementComponent } from './components/admin/user-management/user-management';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout';
import { CartComponent } from './components/cart/cart';
import { ProductManagementComponent } from './components/admin/product-management/product-management';
import { StockManagementComponent } from './components/admin/stock-management/stock-management';
import { SalesReportsComponent } from './components/admin/sales-reports/sales-reports';
import { DiscountCouponsComponent } from './components/admin/discount-coupons/discount-coupons';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard], // Protect this whole section with our guard
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' }, // Default admin page
      { path: 'users', component: UserManagementComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'stock', component: StockManagementComponent },
      { path: 'reports', component: SalesReportsComponent },
      { path: 'coupons', component: DiscountCouponsComponent },
      // You can add more admin pages here later (e.g., 'products', 'reports')
    ]
  },
];
