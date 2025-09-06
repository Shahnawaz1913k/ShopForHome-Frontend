import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productApiUrl = 'http://localhost:5026/api/Products';
  private categoryApiUrl = 'http://localhost:5026/api/Categories';

  constructor(private http: HttpClient) { }

  // This helper method creates headers that command the browser not to cache the response.
  private getAntiCacheHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  /**
   * Gets products, optionally filtered by category.
   * This allows a user to browse products based on categories.
   */
  getProducts(category?: string): Observable<any[]> {
    let params = new HttpParams();
    if (category) {
      params = params.append('category', category);
    }
    // We add the anti-cache headers to the request.
    return this.http.get<any[]>(this.productApiUrl, { params: params, headers: this.getAntiCacheHeaders() });
  }

  /**
   * Gets all available categories.
   */
  getCategories(): Observable<any[]> {
    // We also add the anti-cache headers here for consistency.
    return this.http.get<any[]>(this.categoryApiUrl, { headers: this.getAntiCacheHeaders() });
  }
}