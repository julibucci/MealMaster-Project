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

  createOrder(accessToken: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/paypal/create-order`, { accessToken });
  }

  capturePayment(accessToken: string, orderId: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/paypal/capture-payment`, { accessToken, orderId });
  }
}
