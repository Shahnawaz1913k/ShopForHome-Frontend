import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Define separate base URLs for each controller for clarity
  private usersApiUrl = 'http://localhost:5026/api/Users';
  private productsApiUrl = 'http://localhost:5026/api/Products';
  private reportsApiUrl = 'http://localhost:5026/api/SalesReports';
  private couponsApiUrl = 'http://localhost:5026/api/Coupons';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // --- User Methods ---
  // As an Admin, I should be able to create, read, update, and delete user accounts. [cite: 35]
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.usersApiUrl, { headers: this.getAuthHeaders() });
  }

  addUser(user: any): Observable<any> {
    const { id, ...userData } = user;
    return this.http.post(this.usersApiUrl, userData, { headers: this.getAuthHeaders() });
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.usersApiUrl}/${user.id}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.usersApiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Product Methods ---
  // As an Admin, I should be able to create, read, update, and delete products in the catalog. 
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.productsApiUrl, { headers: this.getAuthHeaders() });
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.productsApiUrl, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put(`${this.productsApiUrl}/${product.id}`, product, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.productsApiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Sales Report Methods ---
  // As an Admin, I should be able to generate sales reports for a specified duration. 
  getSalesReport(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get(this.reportsApiUrl, { headers: this.getAuthHeaders(), params: params });
  }

  // --- Coupon Methods ---
  // As an Admin, I should be able to create and assign discount coupons to specific sets of users. 
  getCoupons(): Observable<any[]> {
    // Assuming a GET endpoint exists to fetch all coupons
    return this.http.get<any[]>(this.couponsApiUrl, { headers: this.getAuthHeaders() });
  }

  createCoupon(coupon: any): Observable<any> {
    return this.http.post(this.couponsApiUrl, coupon, { headers: this.getAuthHeaders() });
  }

  assignCoupon(assignment: { couponCode: string, userIds: number[] }): Observable<any> {
    return this.http.post(`${this.couponsApiUrl}/assign`, assignment, { headers: this.getAuthHeaders() });
  }
}