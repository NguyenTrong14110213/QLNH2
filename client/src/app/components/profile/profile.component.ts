import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms/src/model';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  email;
  fullname;
  gender;
  identity_card;
  phone;
  address;
  birthdate;
  type_account;
  username;
  messageClass;
  message;
  checkChange =false;
  checkChangePassword =false;
  phoneMessage;
  phoneValid;
  url_profile;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { 
    this.createForm()
  }

  createForm(){
    this.form=this.formBuilder.group({
      email:['', Validators.compose([
        Validators.required,
        Validators.maxLength(254),
        this.validateEmail
      ])],
      username:['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        this.validateUsername
      ])],
      password:['', Validators.required],
      confirm:['', Validators.required],
      fullname:['', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],
      gender:['-1', Validators.required],
      identity_card:['', Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        this.validateNumber
      ])],
      phone:['', Validators.compose([
        Validators.required,
        Validators.maxLength(13),
        this.validateNumber
      ])],
      birthdate:['', Validators.compose([
        Validators.required
      ])],
      address:['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])],
      url_profile:'',
      type_account:''
    }, { validator: this.matchingPasswords('password', 'confirm')})
  }


  validateEmail(controls){
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateEmail': true }
    }
  }

  validateUsername(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateUsername': true }
    }
  }

  validateNumber(controls){
    const regExp = new RegExp(/^[0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateNumber': true }
    }
  }
  matchingPasswords(password, confirm){
    return(group: FormGroup)=>{
      if(group.controls[password].value === group.controls[confirm].value){
        return null;
      }else{
        return { 'matchingPasswords': true }
      }
    }
  }
  changePhone(){
    this.phone = this.form.get('phone').value
    this.checkChange =true;
  }
  changeEmail(){
    this.address = this.form.get('email').value
    this.checkChange =true;
  }
  changeAddress(){
    this.address = this.form.get('address').value
    this.checkChange =true;
  }
  changePassword(){
    if(this.form.get('password').value==""){
      this.checkChangePassword =false;
      console.log(this.checkChangePassword)
    }else{
      this.checkChangePassword =true;
      console.log(this.checkChangePassword)
    }
  }
  
  checkPhone(){
    this.authService.checkPhone(this.form.get('phone').value).subscribe(data=>{
      if(!data.success){
       this.phoneValid = false;
       this.phoneMessage = data.message;
      }else{
       this.phoneValid = true;
       this.phoneMessage = data.message;
      }
    });
  }
  editProfile(){
    const user = {  
      username: this.username,
      email: this.email,
      phone: this.phone,
      address: this.address
    }
    console.log(user);
    this.authService.editProfile(user).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.checkChange = false;
        setTimeout(() => {
          this.messageClass = false; 
          this.message='';
        }, 2000);
      }
    });
  }
  editPassword(){
    const user = {  
    username: this.username,
    password: this.form.get('password').value
  }
  console.log(user);
  
      this.authService.editPassword(user).subscribe(data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
        } else {
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          this.checkChangePassword = false;
          // Clear form data after two seconds
          setTimeout(() => {
          //  this.form.reset(); // Reset all form fields
            this.messageClass = false; // Erase error/success message
            this.message='';
          }, 2000);
        }
      });
  }
  ngOnInit() {
    this.authService.getProfile().subscribe(profile=>{  
      console.log(profile.user);
      this.username = profile.user.username;
      this.email =profile.user.email;
      this.fullname =profile.user.fullname;
      this.gender =profile.user.gender;
      this.identity_card = profile.user.identity_card;
      this.phone =profile.user.phone;
      this.address=profile.user.address;
      this.type_account =profile.user.type_account;
      this.birthdate =profile.user.birthdate;
      this.url_profile =profile.user.url_profile;
    });
  }

}
