// In src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // <-- Import Inject, PLATFORM_ID
import { isPlatformBrowser } from '@angular/common';            // <-- Import isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // NOTE: Your backend is likely running on HTTPS, not HTTP. Double-check this URL.
  // It should probably be 'https://localhost:5026/api/auth'
  private apiUrl = 'http://localhost:5026/api/auth';
  
  private isBrowser: boolean;

  // Inject PLATFORM_ID to determine the execution environment
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // This flag will be true only when the code is running in a browser
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' });
  }

  saveToken(token: string): void {
    // Only access localStorage if in the browser
    if (this.isBrowser) {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    // Only access localStorage if in the browser
    if (this.isBrowser) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  getUsername(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // The username is stored in a 'claim'. The key for the name claim is typically
        // 'unique_name' for .NET JWTs.
        return decodedToken.unique_name || null;
      } catch (error) {
        console.error("Failed to decode token", error);
        return null;
      }
    }
    return null;
  }
  
  getRole(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // The role claim for .NET is typically 'role'
        return decodedToken.role || null;
      } catch (error) {
        console.error("Failed to decode token", error);
        return null;
      }
    }
    return null;
  }

  logout(): void {
    // Only access localStorage if in the browser
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
    }
  }

  isLoggedIn(): boolean {
    // This method is now safe because getToken() handles the platform check.
    return !!this.getToken();
  }
}