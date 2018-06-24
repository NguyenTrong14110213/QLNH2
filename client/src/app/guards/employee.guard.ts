import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class EmployeeGuard implements CanActivate {
    redirectUrl;
    constructor(
        private authService: AuthService,
        private router: Router
    ){
 
    }
  // Function to check if user is authorized to view route
  canActivate(
      router: ActivatedRouteSnapshot,
      state: RouterStateSnapshot

  ) {
        if(this.authService.accountAdmin())return true;
        else{
                this.redirectUrl = state.url;
                this.router.navigate(['/login']);
                return false;
            }
          
        }
  }
