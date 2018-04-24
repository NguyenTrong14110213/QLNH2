import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ){
 
    }
  // Function to check if user is authorized to view route
  canActivate() {
        if(this.authService.loggedIn()){
            this.router.navigate(['/']);
            return false;
        }else{
            return true;
        }
  }
}