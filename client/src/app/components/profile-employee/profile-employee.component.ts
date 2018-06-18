import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms/src/model';

@Component({
  selector: 'app-profile-employee',
  templateUrl: './profile-employee.component.html',
  styleUrls: ['./profile-employee.component.css']
})
export class ProfileEmployeeComponent implements OnInit {
  currentUrl;
  form: FormGroup;
  form1: FormGroup;
  employee;
  selectedType;
  selectedGender;
  message;
  messageClass;
  email;
  fullname;
  gender;
  identity_card;
  phone;
  address;
  birthdate;
  type_account;
  actived;
  checkChange =false;
  constructor(
    private authService:AuthService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
  ) { 
    this.createForm();  
    this.createForm1();
  }
  createForm1(){
    this.form1 = this.formBuilder.group({
      actived:['',Validators.required]
    })
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
  changeFullname(){
    this.fullname = this.form.get('fullname').value;
    this.checkChange =true;
  }
  changeEmail(){
    this.email = this.form.get('email').value;
    this.checkChange =true;
  }
  changeIdentity_card(){
    this.identity_card = this.form.get('identity_card').value;
    this.checkChange =true;
  }
  changeGender(){
    this.gender = this.form.get('gender').value;
    this.checkChange =true;
  }
  changeType_account(){
    this.type_account = this.form.get('type_account').value;
    this.checkChange =true;
  }
  changePhone(){
    this.phone = this.form.get('phone').value;
    this.checkChange =true;
  } 
  changeAddress(){
    this.address =this.form.get('address').value;
    this.checkChange =true;
  }
  changeBirthDate(){
    this.birthdate =this.form.get('birthdate').value;
    console.log(this.birthdate);
    this.checkChange =true;
  }
  changePassword(){
    this.checkChange =true;
  }
  editEmployee(){
      const employee = {  
        username: this.employee.username,
        email: this.email,
        identity_card:this.identity_card,
        phone: this.phone,
        gender: this.gender,
        fullname: this.fullname,
        type_account: this.type_account,
        address: this.address,
        birthdate: this.birthdate
      }
      console.log(employee);
  
      this.authService.editEmployee(employee).subscribe(data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
        } else {
          this.authService.socket.emit("client-loadEmployee","sửa thông tin nhân viên.");
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          this.checkChange = false;
          // Clear form data after two seconds
          setTimeout(() => {
          //  this.form.reset(); // Reset all form fields
            this.messageClass = false; // Erase error/success message
            this.message='';
          }, 2000);
        }
      });
      }
      changeActived(){
        console.log(this.form1.get('actived').value);
        const employee = {  
          username: this.employee.username,
          actived: this.form1.get('actived').value
        }
        console.log(employee);
        
            this.authService.editActivedEmployee(employee).subscribe(data => {
              if (!data.success) {
                this.messageClass = 'alert alert-danger';
                this.message = data.message;
              } else {
                this.authService.socket.emit("client-loadEmployee","cap nhat trang thai");
                this.messageClass = 'alert alert-success';
                this.message = data.message;
                this.checkChange = false;
                // Clear form data after two seconds
                setTimeout(() => {
                //  this.form.reset(); // Reset all form fields
                  this.messageClass = false; // Erase error/success message
                  this.message='';
                }, 2000);
              }
            });
      }
      editPassword(){
        const employee = {  
        username: this.employee.username,
        password: this.form.get('password').value
      }
      console.log(employee);
      
          this.authService.editPassword(employee).subscribe(data => {
            if (!data.success) {
              this.messageClass = 'alert alert-danger';
              this.message = data.message;
            } else {
              this.messageClass = 'alert alert-success';
              this.message = data.message;
              this.checkChange = false;
              // Clear form data after two seconds
              setTimeout(() => {
              //  this.form.reset(); // Reset all form fields
                this.messageClass = false; // Erase error/success message
                this.message='';
              }, 2000);
            }
          });
      }
      getValue(){
          this.fullname =this.employee.fullname;
          this.type_account =this.employee.type_account;
          this.phone =this.employee.phone;
          this.identity_card =this.employee.identity_card;
          this.email =this.employee.email;
          this.gender =this.employee.gender;
          this.address= this.employee.address;
          this.birthdate =this.employee.birthdate;
      }
  ngOnInit() {
    this.currentUrl =this.activatedRouter.snapshot.params;
    this.authService.socket.on("server-update-employee", data=>{
      console.log(data.user.username);
    })
    this.authService.getEmployee(this.currentUrl.username).subscribe(data=>{
      this.employee =data.employee;
      this.selectedType =this.employee.type_account;
      this.selectedGender= this.employee.gender;

      this.getValue();
    });

  }

}
