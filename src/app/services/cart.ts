import { Injectable, Inject, PLATFORM_ID, signal, computed, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthService } from './auth';
import { NotificationService } from './notification';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5026/api/cart'; // Ensure this URL is correct
  private isBrowser: boolean;
  
  private cartItems = signal<any[]>([]);
  public readonly items = this.cartItems.asReadonly();

  public readonly itemCount = computed(() => 
    this.items().reduce((count, item) => count + item.quantity, 0)
  );

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone : NgZone
  ) {

    //console.log('%c A NEW CartService instance was created!', 'color: red; font-weight: bold;');

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
         this.cartItems.set(JSON.parse(storedCart)); 
    }
  }

  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Helper to update both the signal and localStorage
  private updateCartAndStorage(items: any[]): void {
    // 3. Run the signal update inside Angular's zone to guarantee change detection
    this.zone.run(() => {
      this.cartItems.set(items);
    });

    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }
  
  loadCart(): void {
    if (!this.authService.getToken() || !this.isBrowser) { return; }
    this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .subscribe(items => this.updateCartAndStorage(items));
  }

  addToCart(product: any): void {
    // 3. Read the signal's value by calling it as a function
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem = { productId: product.id, productName: product.name, price: product.price, quantity: 1 };
      currentItems.push(newItem);
    }
    this.updateCartAndStorage(currentItems);
    this.notificationService.show('Product added to cart!');

    const payload = { productId: product.id, quantity: 1 };
    this.http.post(`${this.apiUrl}/add`, payload, { headers: this.getAuthHeaders() })
      .subscribe({ error: (err) => this.loadCart() });
  }

updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItems();
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
        .subscribe({ error: (err) => this.loadCart() });
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems().filter(i => i.productId !== productId);
    this.updateCartAndStorage(currentItems);

    this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getAuthHeaders() })
      .subscribe({ error: (err) => this.loadCart() });
  }

  clearCart(): void {
    this.updateCartAndStorage([]);
    if (this.isBrowser) {
        localStorage.removeItem('cart');
    }
  }
  getCartItemCount(): Observable<number> {
    const cartItems$ = this.cartItems.asReadonly();
    return new Observable(subscriber => {
        subscriber.next(cartItems$().reduce((count, item) => count + item.quantity, 0));
    });
  }
  // This can still return an observable for components that haven't been refactored yet, like the navbar
  
}