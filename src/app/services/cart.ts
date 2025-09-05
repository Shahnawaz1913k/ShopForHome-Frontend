import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5026/api/cart'; // Ensure this URL is correct
  private isBrowser: boolean;
  
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetches the user's cart from the backend and broadcasts it
  loadCart(): void {
    if (!this.authService.getToken() || !this.isBrowser) {
      return;
    }
    const headers = this.getAuthHeaders()
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');

    this.http.get<any[]>(this.apiUrl, { headers: headers })
      .subscribe(items => {
        this.cartItems.next(items);
      });
  }

  // Adds an item to the cart via the backend
  addToCart(product: any): void {
    const payload = { productId: product.id, quantity: 1 };
    this.http.post(`${this.apiUrl}/add`, payload, { headers: this.getAuthHeaders() })
      .subscribe(() => {
        this.loadCart(); // Refresh the cart from the backend after adding
      });
  }

  // Updates the quantity of an item
  updateQuantity(productId: number, quantity: number): void {
    const payload = { productId, quantity };
    this.http.post(`${this.apiUrl}/update-quantity`, payload, { headers: this.getAuthHeaders() })
        .subscribe(() => this.loadCart());
  }

  // Removes an item completely from the cart
  removeFromCart(productId: number): void {
    this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getAuthHeaders() })
      .subscribe(() => this.loadCart());
  }

  // Clears the cart locally (used on logout)
  clearCart(): void {
    this.cartItems.next([]);
  }

  // Gets the total number of items for the navbar badge
  getCartItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }
}