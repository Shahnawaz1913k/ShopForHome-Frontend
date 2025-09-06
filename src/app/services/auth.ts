import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { CartService } from './cart';
import { WishlistService } from './wishlist';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5026/api/auth'; // Switched back to https for security
  private isBrowser: boolean;


  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();
 
  private _cartService: CartService | undefined;
  private _wishlistService: WishlistService | undefined;


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    this.isLoggedIn$ = this.loggedIn.asObservable();
  }

  private get cartService(): CartService {
    if (!this._cartService) {
      this._cartService = this.injector.get(CartService);
    }
    return this._cartService;
  }

  private get wishlistService(): WishlistService { // <-- Add this getter
    if (!this._wishlistService) {
      this._wishlistService = this.injector.get(WishlistService);
    }
    return this._wishlistService;
  }

  private hasToken(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  // As a User, I should be able to register on the application.
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // As a User, I should be able to log in.
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' })
      .pipe(
        tap(token => {
          this.saveToken(token);
          this.loggedIn.next(true);
          this.cartService.loadCart();
          this.wishlistService.loadWishlist();

        })
      );
  }

  // As a User, I should be able to log out.
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
      this.loggedIn.next(false);
      this.cartService.clearCart();
      this.wishlistService.clearWishlist();
    }
  }

  saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // In src/app/services/auth.service.ts

  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        // Use bracket notation with the correct key from your token
        return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;

      } catch (error) {
        console.error("Failed to decode token", error);
        return null;
      }
    }
    return null;
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        // Use bracket notation with the correct key from your token
        return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;

      } catch (error) {
        console.error("Failed to decode token", error);
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }
}