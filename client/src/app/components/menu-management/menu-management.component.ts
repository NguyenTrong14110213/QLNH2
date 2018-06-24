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
  messageClass0;
  message0;
  messageClass;
  message;
  messageClass2;
  message2;
  message3;
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
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
  idCategoryFood;
  nameCategoryFood;
  category_id='';
  category_id2;
  filesToUpload: Array<File> = [];

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private categoryFoodService: CategoryFoodService,
    private foodService: FoodService
  ) {
    this.createCategoryFoodForm();
    this.createCategoryFoodForm3();
    this.createFoodForm();
  }
  validateId(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateId': true }
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
  createCategoryFoodForm3() {
    this.form3 = this.formBuilder.group({
      // trường id 
      id: ['',Validators.required],
      // trường name 
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])]
    })
  }
  // tạo danh mục
  createCategoryFoodForm() {
    this.form2 = this.formBuilder.group({
      // trường id 
      id: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        this.validateId
      ])],
      // trường name 
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
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
        this.validateId
      ])],
      // trường name 
      name: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],
      // trường mã danh mục
      category_id: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],
      // trường chú thích 
      description: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(200)
      ])],
      discount: ['', Validators.compose([
        Validators.required,
        this.validateNumber
      ])],
      inventory: ['', Validators.compose([
        Validators.required,
        this.validateNumber
      ])],
      // trường đơn giá
      price_unit: ['', Validators.compose([
        Validators.required,
        this.validateNumber
      ])],
      // trường đơn vị
      unit: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
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
    this.categoryFoodService.checkNameCategory(this.form2.get('name').value).subscribe(data=>{
      if(!data.success){
       this.nameCategoryValid = false;
       this.nameCategoryMessage = data.message;
      }else{
       this.nameCategoryValid = true;
       this.nameCategoryMessage = data.message;
      }
    });
  }
  checkNameCategory2(){
    this.categoryFoodService.checkNameCategory(this.form3.get('name').value).subscribe(data=>{
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
  getCategoryId(category_id){
    this.category_id =category_id;
    console.log(this.category_id);
    this.getAllFoods(this.category_id);
  }

  getCategoryId2(category_id){
    this.category_id2=category_id;
  }
   getAllCategoryFoods() {
    // Function to GET all blogs from database
    this.categoryFoodService.getAllCategoryFoods().subscribe(data => {
      this.categoryFoods = data.categoryfoods; // Assign array to use in HTML
    });
  }
  getAllFoods(category_id) {
    this.foodService.getAllFoods(category_id).subscribe(data => {
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
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // Clear form data after two seconds
        setTimeout(() => {
          this.form2.reset(); // Reset all form fields
          this.messageClass= false;
          this.message='';
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
        this.messageClass2 = 'alert alert-danger';
        this.message3 = data.message;
      } else {
        this.messageClass2 = 'alert alert-success';
        this.message3 = data.message;
        const food = {
          id: this.form.get('id').value,
          name: this.form.get('name').value,
          category_id:this.form.get('category_id').value,
          description: this.form.get('description').value,
          discount: this.form.get('discount').value,
          inventory:this.form.get('inventory').value,
          price_unit: this.form.get('price_unit').value,
          unit: this.form.get('unit').value,
          url_image: filenames
        }
        this.foodService.createFood(food).subscribe(data => {
          if (!data.success) {
            this.message2 = data.message;
          } else {
            this.message2 = data.message;
            // Clear form data after two seconds
            setTimeout(() => {
              this.form.reset(); // Reset all form fields
              this.messageClass2 = false; // Erase error/success message
              this.message3='';
              this.message2='';
            }, 2000);
          }
        })
      }
    }) 
  }

  deleteCategoryFood(id) {
    this.categoryFoodService.deleteCategoryFood(id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.messageClass0 = 'alert alert-danger'; // Return error bootstrap class
        this.message0 = data.message; // Return error message
      } else {
        this.messageClass0 = 'alert alert-success'; // Return bootstrap success class
        this.message0 = data.message; // Return success message
        // After two second timeout, route to blog page
      }
      setTimeout(() => {
        this.messageClass0 = false; // Erase error/success message
        this.message0='';
      }, 2000);
    });
  }
  getCategoryFood(id,name){
    this.idCategoryFood =id;
    this.nameCategoryFood =name;
  }

  editCategoryFood(){

    const categoryFood = {
      id:  this.idCategoryFood,
      name: this.form3.get('name').value
    }
    this.categoryFoodService.editCategoryFood(categoryFood).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // Clear form data after two seconds
        setTimeout(() => {
          this.messageClass= false;
          this.message='';
        }, 2000);
      }
    })
  }
  ngOnInit() {
    this.getAllCategoryFoods();
    this.getAllFoods(0);
    this.authService.socket.on("server-add-categoryFood",(data)=>{
      this.getAllCategoryFoods();
    });
    this.authService.socket.on("server-delete-categoryFood",(data)=>{
      this.getAllCategoryFoods();
    });
    this.authService.socket.on("server-update-categoryFood",(data)=>{
      this.getAllCategoryFoods();
    });

    this.authService.socket.on("server-add-food",(data)=>{
      this.getAllFoods(this.category_id);
    });
    this.authService.socket.on("server-delete-food",(data)=>{
      this.getAllFoods(this.category_id);
    });
    this.authService.socket.on("server-update-food",(data)=>{
      this.getAllFoods(this.category_id);
    });
  }

}
