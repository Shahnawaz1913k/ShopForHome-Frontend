// In src/app/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getRole() === 'Admin') {
    // User is logged in and is an Admin, allow access
    return true;
  } else {
    // Not an Admin, redirect to the login page
    alert('You do not have permission to access this page.');
    router.navigate(['/login']);
    return false;
  }
};