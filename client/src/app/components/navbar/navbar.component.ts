import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
//import { FlashMessagesService } from 'angular2-flash-messages';
@Component({  
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
    //private flashMessagesService: FlashMessagesService
  ) { }

  onLogoutClick(){
    const user={
      username: JSON.parse(localStorage.getItem('user')).username
    }
    this.authService.logout(user).subscribe(data=>{
      if(!data.success){
        console.log(data.messages)
       }else{
        this.router.navigate(['/']);
       }
    });
    //this.flashMessagesService.show('Đăng xuất thành công!', {cssClass: 'alert-info'});   
;
  }
  ngOnInit() {
  }

}
