import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class FoodService {
 
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
  createFood(food){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'foods/createFood', food, this.options).map(res =>res.json());
  }

  uploadImageFood(formData){
    return this.http.post(this.domain + 'uploadImageFood', formData).map(res =>res.json());
  }

  getAllFoods(category_id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'foods/allFoods/' + category_id, this.options).map(res => res.json());
  }
  getFood(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'foods/food/' + id, this.options).map(res => res.json());
  }
  checkIdFood(id){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'foods/checkIdFood/' + id ,this.options).map(res=>res.json());
  }
  checkNameFood(name){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'foods/checkNameFood/' + name ,this.options).map(res=>res.json());
  }
  editFood(food) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'foods/updateFood/', food, this.options).map(res => res.json());
  }
  // Function to dislike a blog post
  deleteImage(id, url_image) {
    const foodData = { id: id,
      url_image:url_image };
    return this.http.put(this.domain + 'foods/deleteImage/' , foodData, this.options).map(res => res.json());
  }
 addImage(food) {
  console.log(food);
    return this.http.put(this.domain + 'foods/addImage/' , food, this.options).map(res => res.json());
  }
  editActivedFood(food) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'authentication/updateActivedFood/', food, this.options).map(res => res.json());
  }
}
