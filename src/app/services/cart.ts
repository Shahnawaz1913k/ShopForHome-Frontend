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

    if (this.isBrowser) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cartItems.next(JSON.parse(storedCart));
      }
    }

    if (this.isBrowser && this.authService.getToken()) {
      this.loadCart();
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private updateCartAndStorage(items: any[]): void {
    this.cartItems.next(items);
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }
  
  loadCart(): void {
    if (!this.authService.getToken() || !this.isBrowser) { return; }
    
    const headers = this.getAuthHeaders()
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');

    this.http.get<any[]>(this.apiUrl, { headers: headers })
      .subscribe(items => {
        this.updateCartAndStorage(items);
      });
  }

  addToCart(product: any): void {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1
      };
      currentItems.push(newItem);
    }
    this.updateCartAndStorage(currentItems);

    const payload = { productId: product.id, quantity: 1 };
    this.http.post(`${this.apiUrl}/add`, payload, { headers: this.getAuthHeaders() })
      .subscribe({
        error: (err) => {
          console.error("Backend sync failed for addToCart:", err);
          this.loadCart();
        }
      });
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItems.getValue();
    const itemToUpdate = currentItems.find(i => i.productId === productId);

    if (!itemToUpdate) return;
    
    if (quantity > 0) {
        itemToUpdate.quantity = quantity;
        this.updateCartAndStorage(currentItems);
    } else {
        this.removeFromCart(productId);
        return;
    }
    
    const payload = { productId, quantity };
    this.http.post(`${this.apiUrl}/update-quantity`, payload, { headers: this.getAuthHeaders() })
        .subscribe({
          error: (err) => {
            console.error("Backend sync failed for updateQuantity:", err);
            this.loadCart();
          }
        });
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.getValue().filter(i => i.productId !== productId);
    this.updateCartAndStorage(currentItems);

    this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getAuthHeaders() })
      .subscribe({
        error: (err) => {
          console.error("Backend sync failed for removeFromCart:", err);
          this.loadCart();
        }
      });
  }

  clearCart(): void {
    this.cartItems.next([]);
    if (this.isBrowser) {
      localStorage.removeItem('cart');
    }
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }
}