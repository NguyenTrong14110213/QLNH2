import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
@Injectable()
export class TableService {
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
  createTable(table){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'table/createTable', table, this.options).map(res =>res.json());
  }
  getAllTables(region_id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'table/allTables/' + region_id, this.options).map(res => res.json());
  }
  checkIdTable(id){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'table/checkIdTable/' + id ,this.options).map(res=>res.json());
  }
  editActivedTable(table) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'authentication/updateActivedTable/', table, this.options).map(res => res.json());
  }
  deleteTable(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'table/deleteTable/' + id, this.options).map(res => res.json());
  }
}
