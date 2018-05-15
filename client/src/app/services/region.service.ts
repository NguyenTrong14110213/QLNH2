import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
@Injectable()
export class RegionService {
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
  createRegion(region){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'region/createRegion', region, this.options).map(res =>res.json());
  }
  getAllRegion() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'region/allRegions', this.options).map(res => res.json());
  }
  checkNameRegion(name){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'region/checkNameRegion/' + name ,this.options).map(res=>res.json());
  }
  checkIdRegion(id){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'region/checkIdRegion/' + id ,this.options).map(res=>res.json());
  }
  editRegion(region) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'region/updateRegion/', region, this.options).map(res => res.json());
  }

  deleteRegion(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'region/deleteRegion/' + id, this.options).map(res => res.json());
  }
}
