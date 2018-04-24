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
  socket;
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
    this.socket = io.connect(this.domain);
  }
  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'authentication/profile', this.options).map(res=> res.json());
  }
  loggedIn(){
    return tokenNotExpired();
  }
}
 