import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import * as io from 'socket.io-client';

@Injectable()
export class AuthService {

  domain ="http://localhost:8080/";
   authToken;
   user;
   options;
  socket = io.connect(this.domain);
  constructor(
    private http: Http
  ) { }
  createAuthenticationHeaders(){
    this.loadToken();
    this.options =new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }
  // loadSocket(){
  //   this.socket = localStorage.getItem('socket');
  // }
  loadToken(){
    this.authToken = localStorage.getItem('token');
  }
  registerUser(user){
    return this.http.post(this.domain + 'authentication/register', user).map(res=>res.json());
  }
  checkUsername(username){
    return this.http.get(this.domain + 'authentication/checkUsername/'+ username).map(res=>res.json());
  }
  checkEmail(email){
    return this.http.get(this.domain + 'authentication/checkEmail/' + email ).map(res=>res.json());
  }
  checkIdentity_card(identity_card){
    return this.http.get(this.domain + 'authentication/checkIdentity_card/' + identity_card ).map(res=>res.json());
  }
  checkPhone(phone){
    return this.http.get(this.domain + 'authentication/checkPhone/' + phone ).map(res=>res.json());
  }
  login(user){
    return this.http.post(this.domain + 'authentication/login', user).map(res=>res.json());
  }
  logout(){
    this.authToken =null;
    this.user =null;
    localStorage.clear();
  }
  storeUserData(token, user){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    this.authToken= token;
    this.user =user;

  }
  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/profile', this.options).map(res=> res.json());
  }
  getAllEmployees(type_account){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/allEmployees/' + type_account, this.options).map(res => res.json());
  }
  getEmployee(username) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'authentication/employee/' + username, this.options).map(res => res.json());
  }
  deleteEmployee(username) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'authentication/deleteEmployee/' + username, this.options).map(res => res.json());
  }
  editEmployee(employee) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'authentication/updateEmployee/', employee, this.options).map(res => res.json());
  }
  editPassword(employee) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'authentication/updatePassword/', employee, this.options).map(res => res.json());
  }
  editActivedEmployee(employee) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'authentication/updateActivedEmployee/', employee, this.options).map(res => res.json());
  }
  loggedIn(){
    return tokenNotExpired();
  }
 
  accountCustomer(){
    if(this.loggedIn()){
      if(JSON.parse(localStorage.getItem('user')).type_account == 0) return true;
      else return false;
    }  else return false;
 
  }
  accountStaff(){
    if(this.loggedIn()){
      if(JSON.parse(localStorage.getItem('user')).type_account == 1) return true;
      else return false;
    }  else return false;

  }
  accountCashier(){
    if(this.loggedIn()){
      if(JSON.parse(localStorage.getItem('user')).type_account == 2) return true;
      else return false;
    }  else return false;
  }
  accountCook(){
    if(this.loggedIn()){
      console.log(JSON.parse(localStorage.getItem('user')).type_account);
      if(JSON.parse(localStorage.getItem('user')).type_account == 3) return true;
      else return false;
    }  else return false;
  }

  accountAdmin(){
    if(this.loggedIn()){
      console.log(JSON.parse(localStorage.getItem('user')).type_account);
      if(JSON.parse(localStorage.getItem('user')).type_account == 4) return true;
      else return false;
    }  else return false;
  }

}
 