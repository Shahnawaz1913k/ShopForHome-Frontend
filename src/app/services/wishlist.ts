import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth';
import { NotificationService } from './notification';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:5026/api/wishlist'; // Use https
  private isBrowser: boolean;

  // Use a signal for reactive state management
  private wishlistItems = signal<any[]>([]);
  // Expose a read-only version of the signal to components
  public readonly items = this.wishlistItems.asReadonly();

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Load initial state from localStorage
    if (this.isBrowser) {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        this.wishlistItems.set(JSON.parse(storedWishlist));
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Helper to update both the signal and localStorage
  private updateWishlistAndStorage(items: any[]): void {
    this.wishlistItems.set(items);
    if (this.isBrowser) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }

  loadWishlist(): void {
    if (!this.authService.getToken() || !this.isBrowser) return;
    this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .subscribe(items => this.updateWishlistAndStorage(items));
  }

  //[cite_start]// As a User, I should have a wishlist option where I can save products. [cite: 25]
  addToWishlist(product: any): void {
    // Read the signal's value by calling it as a function
    const currentItems = this.wishlistItems(); 
    const alreadyExists = currentItems.find(item => item.id === product.id);

    if (alreadyExists) {
      this.notificationService.show('This item is already in your wishlist.');
      return;
    }

    const newItems = [...currentItems, product];
    this.updateWishlistAndStorage(newItems); // Update state
    this.notificationService.show('Product added to your wishlist!');

    // Sync with backend
    this.http.post(`${this.apiUrl}/${product.id}`, {}, { headers: this.getAuthHeaders() })
      .subscribe({
        error: (err) => {
          console.error("Backend sync failed for addToWishlist:", err);
          this.loadWishlist(); // Revert on failure
        }
      });
  }

  removeFromWishlist(productId: number): void {
    const currentItems = this.wishlistItems().filter(item => item.id !== productId);
    this.updateWishlistAndStorage(currentItems);

    // Sync with backend
    this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        error: (err) => {
          console.error("Backend sync failed for removeFromWishlist:", err);
          this.loadWishlist(); // Revert on failure
        }
      });
  }

  // Clears the wishlist on logout
  clearWishlist(): void {
    this.updateWishlistAndStorage([]);
    if (this.isBrowser) {
        localStorage.removeItem('wishlist');
    }
  }
}