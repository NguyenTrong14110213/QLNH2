import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
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
    this.authService.socket.on('disconnect', () => {
      //this.flashMessagesService.show('Đã ngắt kết nối đến s!', {cssClass: 'alert-info'});   
      this.authService.authToken =null;
      this.authService.user =null;
      localStorage.clear();
      this.router.navigate(['/']);
  });
  }

}
