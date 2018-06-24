import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class OrderService {
  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }
  createOrder(order){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'order/createOrder', order, this.options).map(res =>res.json());
  }
  getAllOrders(region_id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'order/allOrders/' + region_id, this.options).map(res => res.json());
  }
  getOrder(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'order/getOrder/' + id, this.options).map(res => res.json());
  }
  editStatusOrder(order) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'authentication/updateStatusOrder/', order, this.options).map(res => res.json());
  }
  
}
