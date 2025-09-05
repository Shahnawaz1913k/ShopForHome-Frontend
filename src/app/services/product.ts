import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productApiUrl = 'http://localhost:5026/api/Products';
  private categoryApiUrl = 'http://localhost:5026/api/Categories';


  constructor(private http: HttpClient) { }


  getProducts(category?: string): Observable<any[]> {
    let params = new HttpParams();
    if (category) {
      params = params.append('category', category);
    }
    return this.http.get<any[]>(this.productApiUrl, { params });
  }
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoryApiUrl);
  }
}