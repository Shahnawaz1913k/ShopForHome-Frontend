// In src/app/components/navbar/navbar.component.ts
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core'; // <-- Add OnInit
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy { // <-- Implement OnInit
  isScrolled = false;
  greeting: string = '';
  username: string | null = null;
  cartItemCount = 0 ;
  private cartSubscription : Subscription = new Subscription;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  constructor(private authService: AuthService, private router: Router, private cartService : CartService) {}

  // Add the ngOnInit lifecycle hook
  ngOnInit(): void {
    this.setGreeting();
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUsername();
    }

    this.cartSubscription = this.cartService.getCartItemCount().subscribe(count => {
    this.cartItemCount = count;
  });
  }

  setGreeting(): void {
    const currentHour = new Date().getHours(); // Gets the local hour (e.g., 14 for 2 PM)
    if (currentHour < 12) {
      this.greeting = 'Good morning';
    } else if (currentHour < 17) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

  getRole(): string | null {
    return this.authService.getRole();
  }
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.username = null; // Clear username on logout
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // ... (unsubscribe from authSubscription)
    this.cartSubscription.unsubscribe(); // <-- Unsubscribe from cart
  }
}