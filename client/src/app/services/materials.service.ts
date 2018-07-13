import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class MaterialsService {
  
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
   createMaterials(materials){
     this.createAuthenticationHeaders(); // Create headers
     return this.http.post(this.domain + 'materials/createMaterials', materials, this.options).map(res =>res.json());
   }
   getAllMaterials(category_id) {
     this.createAuthenticationHeaders(); // Create headers
     return this.http.get(this.domain + 'materials/allMaterials/' + category_id, this.options).map(res => res.json());
   }
   getMaterials(_id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'materials/getMaterials/' + _id, this.options).map(res => res.json());
  }
  findMaterials(keyWord){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'materials/findMaterials/' + keyWord, this.options).map(res => res.json());
  }
   editMaterials(materials) {
     this.createAuthenticationHeaders(); // Create headers
     return this.http.put(this.domain + 'materials/updateMaterials/', materials, this.options).map(res => res.json());
   }
   deleteMaterials(_id){
     this.createAuthenticationHeaders(); // Create headers
     return this.http.delete(this.domain + 'materials/deleteMaterials/' + _id, this.options).map(res => res.json());
   }
   getExpenditureMonth(MM,yyyy){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'materials/getExpenditureMonth/' + MM +'/'+ yyyy, this.options).map(res => res.json());
  }
  getExpenditureYear(yyyy){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'materials/getExpenditureYear/' + yyyy, this.options).map(res => res.json());
  }
  getExpenditureMinYear(){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'materials/getExpenditureMinYear' , this.options).map(res => res.json());
  }
  getMaterialsOfMonth(MM,yyyy){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'materials/getMaterialsOfMonth/' + MM +'/'+ yyyy, this.options).map(res => res.json());
  }
  getMaterialsOfDay(dd,MM,yyyy){
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'materials/getMaterialsOfDay/'+dd+ '/' + MM +'/'+ yyyy, this.options).map(res => res.json());
  }
   
 }
 