import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class CategoryFoodService {
  
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
  createCategoryFood(categoryFood){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'categoryFood/createCategoryFood', categoryFood, this.options).map(res =>res.json());
  }
  getAllCategoryFoods() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'categoryFood/allCategoryFoods', this.options).map(res => res.json());
  }
  checkNameCategory(name){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'categoryFood/checkNameCategory/' + name ,this.options).map(res=>res.json());
  }
  checkIdCategory(id){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'categoryFood/checkIdCategory/' + id ,this.options).map(res=>res.json());
  }
  // Function to edit/update blog post
  editCategoryFood(categoryFood) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'categoryFood/updateCategoryFood/', categoryFood, this.options).map(res => res.json());
  }

  // Function to delete a blog
  deleteCategoryFood(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'categoryFood/deleteCategoryFood/' + id, this.options).map(res => res.json());
  }

}
