import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class CategoryMaterialsService {

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
  createCategoryMaterials(categoryMaterials){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'categoryMaterials/createCategoryMaterials', categoryMaterials, this.options).map(res =>res.json());
  }
  getAllCategoryMaterials() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'categoryMaterials/allCategoryMaterials', this.options).map(res => res.json());
  }

  checkNameCategory(name){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'categoryMaterials/checkNameCategory/' + name ,this.options).map(res=>res.json());
  }
  checkIdCategory(id){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'categoryMaterials/checkIdCategory/' + id ,this.options).map(res=>res.json());
  }

  editCategoryMaterials(categoryMaterials) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'categoryMaterials/updateCategoryMaterials/', categoryMaterials, this.options).map(res => res.json());
  }

  deleteCategoryMaterials(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'categoryMaterials/deleteCategoryMaterials/' + id, this.options).map(res => res.json());
  }

}