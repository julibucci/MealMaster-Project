import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private backendUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getAccessToken(): Observable<any> {
    return this.http.get(`${this.backendUrl}/paypal/access-token`);
  }

  createProduct(name: string, description: string, accessToken: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/paypal/product`, { name, description, accessToken });
  }

  createPlan(productId: string, planName: string, price: string, accessToken: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/paypal/plan`, { productId, planName, price, accessToken });
  }
}
