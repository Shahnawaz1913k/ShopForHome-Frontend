import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Observable } from 'rxjs'; // We will work with Observables directly

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  isScrolled = false;
  greeting: string = '';

  // Expose the observables directly to the template
  isLoggedIn$: Observable<boolean>;
  cartItemCount$: Observable<number>;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cartService: CartService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.cartItemCount$ = this.cartService.getCartItemCount();
    this.setGreeting();
  }

  // We no longer need ngOnInit or ngOnDestroy for these subscriptions

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  // We can get these directly in the template now when needed
  getUsername(): string | null {
    return this.authService.getUsername();
  }
  
  getRole(): string | null {
    return this.authService.getRole();
  }

  private setGreeting(): void {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      this.greeting = 'Good morning';
    } else if (currentHour < 17) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }
}