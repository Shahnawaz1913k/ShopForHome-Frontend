// In src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Adjust the port to match your backend API
  private productApiUrl = 'http://localhost:5026/api/Products';
  private categoryApiUrl = 'http://localhost:5026/api/Categories';

  constructor(private http: HttpClient) { }

  // Helper method to create headers that prevent caching
  private getAntiCacheHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  /**
   * Gets products, optionally filtered by category.
   * @param category The category name to filter by.
   */
  getProducts(category?: string): Observable<any[]> {
    let params = new HttpParams();
    if (category) {
      params = params.append('category', category);
    }
    // Add the anti-cache headers to the request
    return this.http.get<any[]>(this.productApiUrl, { params: params, headers: this.getAntiCacheHeaders() });
  }

  /**
   * Gets all available categories.
   */
  getCategories(): Observable<any[]> {
    // Add the anti-cache headers to the request
    return this.http.get<any[]>(this.categoryApiUrl, { headers: this.getAntiCacheHeaders() });
  }
}