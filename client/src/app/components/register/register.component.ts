import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  prosessing =false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  identity_cardValid;
  identity_cardMessage;
  phoneValid;
  phoneMessage;
  checkChangeGender =false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.createForm();
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
      birthdate:['', Validators.compose([
        Validators.required
      ])],
      address:['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
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
      url_profile:'',
      type_account:''
    }, { validator: this.matchingPasswords('password', 'confirm')})
  }

disableForm(){
  this.form.controls['email'].disable();
  this.form.controls['username'].disable();
  this.form.controls['password'].disable();
  this.form.controls['confirm'].disable();
  this.form.controls['fullname'].disable();
  this.form.controls['gender'].disable();
  this.form.controls['identity_card'].disable();
  this.form.controls['phone'].disable();
}
enableForm(){
  this.form.controls['email'].enable();
  this.form.controls['username'].enable();
  this.form.controls['password'].enable();
  this.form.controls['confirm'].enable();
  this.form.controls['fullname'].enable();
  this.form.controls['gender'].enable();
  this.form.controls['identity_card'].enable();
  this.form.controls['phone'].enable();
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
  changeGender(){
    this.checkChangeGender =true;
  }
 onRegisterSubmit(){
   this.prosessing =true;
   this.disableForm();
   const user ={
     email: this.form.get('email').value,
     username: this.form.get('username').value,
     password: this.form.get('password').value,
     fullname: this.form.get('fullname').value,
     gender: this.form.get('gender').value,
     identity_card: this.form.get('identity_card').value,
     phone: this.form.get('phone').value,
     address: this.form.get('address').value,
     birthdate: this.form.get('birthdate').value,
     type_account: 0,
     url_profile: 'default.png'
   }
   this.authService.registerUser(user).subscribe(data =>{
    if(!data.success){
      this.messageClass ='alert alert-danger';
      this.message =data.message;
      this.prosessing =false;
      this.enableForm();
    }else{
      this.messageClass ='alert alert-success';
      this.message =data.message;
      this.checkChangeGender = false;
      setTimeout(()=>{
        this.router.navigate(['/login']);
      }, 2000)
    }
   });
 }

 checkEmail(){
   this.authService.checkEmail(this.form.get('email').value).subscribe(data=>{
     if(!data.success){
      this.emailValid = false;
      this.emailMessage = data.message;
     }else{
      this.emailValid = true;
      this.emailMessage = data.message;
     }
   });
 }
 checkUsername(){
  this.authService.checkUsername(this.form.get('username').value).subscribe(data=>{
    if(!data.success){
     this.usernameValid = false;
     this.usernameMessage = data.message;
    }else{
     this.usernameValid = true;
     this.usernameMessage = data.message;
    }
  });
}
checkIdentity_card(){
  this.authService.checkIdentity_card(this.form.get('identity_card').value).subscribe(data=>{
    if(!data.success){
     this.identity_cardValid = false;
     this.identity_cardMessage = data.message;
    }else{
     this.identity_cardValid = true;
     this.identity_cardMessage = data.message;
    }
  });
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
  ngOnInit() {
  }

}
