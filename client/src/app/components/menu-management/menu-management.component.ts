import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CategoryFoodService } from '../../services/category-food.service';
import { FoodService } from '../../services/food.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu-management',
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {

  messageClass;
  message;
  messageClass2;
  message2;
  message3;
  form: FormGroup;
  form2: FormGroup;
  selectedImage = false;
  categoryFoods;
  foods;
  idFoodValid;
  idFoodMessage;
  nameFoodValid;
  nameFoodMessage;
  idCategoryValid;
  idCategoryMessage;
  nameCategoryValid;
  nameCategoryMessage;
  filesToUpload: Array<File> = [];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private categoryFoodService: CategoryFoodService,
    private foodService: FoodService
  ) {
    this.createCategoryFoodForm();
    this.createFoodForm();
  }

  validateNumber(controls){
    const regExp = new RegExp(/^[0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateNumber': true }
    }
  }

  // tạo danh mục
  createCategoryFoodForm() {
    this.form2 = this.formBuilder.group({
      // trường id 
      id: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3)
      ])],
      // trường name 
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3)
      ])]
    })
  }
  // tạo món
  createFoodForm() {
    this.form = this.formBuilder.group({
      // trường id 
      id: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3)
      ])],
      // trường name 
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3)
      ])],
      // trường mã danh mục
      category_id: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3)
      ])],
      // trường chú thích 
      description: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3)
      ])],
      // trường đơn giá
      price_unit: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(3),
        this.validateNumber
      ])],
      // trường đơn vị
      unit: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        Validators.minLength(1)
      ])]
    })
  }
  checkIdCategory(){
    this.categoryFoodService.checkIdCategory(this.form2.get('id').value).subscribe(data=>{
      if(!data.success){
       this.idCategoryValid = false;
       this.idCategoryMessage = data.message;
      }else{
       this.idCategoryValid = true;
       this.idCategoryMessage = data.message;
      }
    });
  }
  checkNameCategory(){
    this.categoryFoodService.checkIdCategory(this.form2.get('name').value).subscribe(data=>{
      if(!data.success){
       this.nameCategoryValid = false;
       this.nameCategoryMessage = data.message;
      }else{
       this.nameCategoryValid = true;
       this.nameCategoryMessage = data.message;
      }
    });
  }
  checkIdFood(){
    this.foodService.checkIdFood(this.form.get('id').value).subscribe(data=>{
      if(!data.success){
       this.idFoodValid = false;
       this.idFoodMessage = data.message;
      }else{
       this.idFoodValid = true;
       this.idFoodMessage = data.message;
      }
    });
  }
  checkNameFood(){
    this.foodService.checkNameFood(this.form.get('name').value).subscribe(data=>{
      if(!data.success){
       this.nameFoodValid = false;
       this.nameFoodMessage = data.message;
      }else{
       this.nameFoodValid = true;
       this.nameFoodMessage = data.message;
      }
    });
  }
  // Function to get all blogs from the database
   getAllCategoryFoods() {
    // Function to GET all blogs from database
    this.categoryFoodService.getAllCategoryFoods().subscribe(data => {
      this.categoryFoods = data.categoryfoods; // Assign array to use in HTML
    });
  }
  getAllFoods() {
    this.foodService.getAllFoods().subscribe(data => {
      this.foods = data.foods; // Assign array to use in HTML
    });
  }    

  onCategoryFoodSubmit() {
    const categoryFood = {
      id: this.form2.get('id').value,
      name: this.form2.get('name').value
    }
    this.categoryFoodService.createCategoryFood(categoryFood).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.authService.socket.emit("client-onCategoryFoodSubmit","tao danh muc");
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // Clear form data after two seconds
        setTimeout(() => {
          this.form2.reset(); // Reset all form fields
        }, 2000);
      }
    })
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    if(this.filesToUpload.length >0){
      this.selectedImage =true;
    }
  }

  onFoodSubmit() {
    
    const files: Array<File> = this.filesToUpload;
    const filenames: Array<String> = [];
    const formData:any = new FormData();
    for(let i =0; i < files.length; i++){
     const filename=Date.now() +'-'+ files[i]['name'];
     filenames.push(filename);
        formData.append("imgfood", files[i], filename);

    }
    this.foodService.uploadImageFood(formData).subscribe(data => {
      if (!data.success) {
        //this.messageClass = 'alert alert-danger';
        this.message3 = data.message;
      } else {
        //this.messageClass = 'alert alert-success';
        this.message3 = data.message;
      }
    })

    const food = {
      id: this.form.get('id').value,
      name: this.form.get('name').value,
      category_id:this.form.get('category_id').value,
      description: this.form.get('description').value,
      discount: '0',
      price_unit: this.form.get('price_unit').value,
      unit: this.form.get('unit').value,
      url_image: filenames
    }
    this.foodService.createFood(food).subscribe(data => {
      if (!data.success) {
        this.messageClass2 = 'alert alert-danger';
        this.message2 = data.message;
      } else {
        this.authService.socket.emit("client-onFoodSubmit","tao mon");
        this.messageClass2 = 'alert alert-success';
        this.message2 = data.message;
        // Clear form data after two seconds
        setTimeout(() => {
          this.form.reset(); // Reset all form fields
        }, 2000);
      }
    })
  }
  ngOnInit() {
    this.getAllCategoryFoods();
    this.getAllFoods();
    this.authService.socket.on("server-getAllCategoryFoods",(data)=>{
      this.getAllCategoryFoods();
      console.log(data);
    });
    this.authService.socket.on("server-getAllFoods",(data)=>{
      this.getAllFoods();
      console.log(data);
    })
  }

}
