import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { UiService } from '../../services/ui';
import { Observable, map } from 'rxjs';

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

  isLoggedIn$: Observable<boolean>;
  username$: Observable<string | null>;
  userRole$: Observable<string | null>;
  cartItemCount$: Observable<number>;
  cartItemCount; 

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cartService: CartService,
    private uiService: UiService
  ) {

    //console.log('Navbar is using CartService:', this.cartService);
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.username$ = this.isLoggedIn$.pipe(
      map(loggedIn => loggedIn ? this.authService.getUsername() : null)
    );
    this.userRole$ = this.isLoggedIn$.pipe(
      map(loggedIn => loggedIn ? this.authService.getRole() : null)
    );
    this.cartItemCount$ = this.cartService.getCartItemCount();
    this.cartItemCount = this.cartService.itemCount;
    this.setGreeting();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }
  
  openCartPanel(): void {
    this.uiService.openCartPanel();
  }

  openWishlist(): void {
    this.uiService.openWishlistPanel();
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  private setGreeting(): void {
    const currentHour = new Date().getHours();
    if (currentHour < 12) { this.greeting = 'Good Morning'; }
    else if (currentHour < 17) { this.greeting = 'Good Afternoon'; }
    else { this.greeting = 'Good Evening'; }
  }
}