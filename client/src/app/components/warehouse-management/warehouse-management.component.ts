import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CategoryMaterialsService } from '../../services/category-materials.service';
import { AuthService } from '../../services/auth.service';
import { MaterialsService } from '../../services/materials.service';

@Component({
  selector: 'app-warehouse-management',
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.css']
})
export class WarehouseManagementComponent implements OnInit {
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
  form4: FormGroup;
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
  idCategoryMaterials;
  nameCategoryMaterials;
  categoryMaterials;
  materials;
  materials2;
  category_id = 0;
  category_id2;
  selectedState;
  _id;
  id;
  name;
  category;
  price_unit;
  unit;
  time;
  count;
  checkChange =false;
  keyWord ='';
  constructor(
    private authService: AuthService,
    private categoryMaterialsService: CategoryMaterialsService,
    private materialsService: MaterialsService,
    private formBuilder: FormBuilder
  ) {
    this.createCategoryMaterialsForm();
    this.createCategoryMaterialsForm2();
    this.createMaterialsForm();
    this.createMaterialsForm2();
  }

  validateId(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateId': true }
    }
  }
  // tạo danh mục
  createCategoryMaterialsForm() {
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
  // tạo danh mục
  createCategoryMaterialsForm2() {
    this.form3 = this.formBuilder.group({
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
  // tạo 
  createMaterialsForm() {
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
      count: ['', Validators.compose([
        Validators.required
      ])],
      price_unit: ['', Validators.compose([
        Validators.required
      ])],
      // trường đơn vị
      unit: ['', Validators.compose([
        Validators.required
      ])],
      // trường đơn vị
      time: ['', Validators.compose([
        Validators.required
      ])]
    })
  }
   // tạo 
   createMaterialsForm2() {
    this.form4 = this.formBuilder.group({
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
      count: ['', Validators.compose([
        Validators.required
      ])],
      price_unit: ['', Validators.compose([
        Validators.required
      ])],
      // trường đơn vị
      unit: ['', Validators.compose([
        Validators.required
      ])],
      // trường đơn vị
      time: ['', Validators.compose([
        Validators.required
      ])]
    })
  }
  checkIdCategory() {
    this.categoryMaterialsService.checkIdCategory(this.form2.get('id').value).subscribe(data => {
      if (!data.success) {
        this.idCategoryValid = false;
        this.idCategoryMessage = data.message;
      } else {
        this.idCategoryValid = true;
        this.idCategoryMessage = data.message;
      }
    });
  }
  
  checkNameCategory() {
    this.categoryMaterialsService.checkNameCategory(this.form2.get('name').value).subscribe(data => {
      if (!data.success) {
        this.nameCategoryValid = false;
        this.nameCategoryMessage = data.message;
      } else {
        this.nameCategoryValid = true;
        this.nameCategoryMessage = data.message;
      }
    });
  }
  checkNameCategory2() {
    this.categoryMaterialsService.checkNameCategory(this.form3.get('name').value).subscribe(data => {
      if (!data.success) {
        this.nameCategoryValid = false;
        this.nameCategoryMessage = data.message;
      } else {
        this.nameCategoryValid = true;
        this.nameCategoryMessage = data.message;
      }
    });
  }
  getCategoryId(category_id) {
    this.category_id = category_id;
    this.getAllMaterials(this.category_id)
    console.log(this.category_id);
  }

  getCategoryId2(category_id) {
    this.category_id2 = category_id;
  }
  getCategoryMaterials(idCategoryMaterials, nameCategoryMaterials) {
    this.idCategoryMaterials = idCategoryMaterials;
    this.nameCategoryMaterials = nameCategoryMaterials;
  }
  getAllCategoryMaterials() {
    this.categoryMaterialsService.getAllCategoryMaterials().subscribe(data => {
      this.categoryMaterials = data.categoryMaterials;
      console.log(this.categoryMaterials)
    })
  }
  editCategoryMaterials() {
    const categoryMaterials = {
      id: this.idCategoryMaterials,
      name: this.form3.get('name').value
    }
    console.log(categoryMaterials)
    this.categoryMaterialsService.editCategoryMaterials(categoryMaterials).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // Clear form data after two seconds
        setTimeout(() => {
          this.messageClass = false;
          this.message = '';
        }, 2000);
      }
    })
  }
  deleteCategoryMaterials(category_id) {

    this.categoryMaterialsService.deleteCategoryMaterials(category_id).subscribe(data => {
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
        this.message0 = '';
      }, 2000);
    })
  }
  onCategoryMaterialsSubmit() {
    const categoryMaterials = {
      id: this.form2.get('id').value,
      name: this.form2.get('name').value
    }
    this.categoryMaterialsService.createCategoryMaterials(categoryMaterials).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // Clear form data after two seconds
        setTimeout(() => {
          this.form2.reset(); // Reset all form fields
          this.messageClass = false;
          this.message = '';
        }, 2000);
      }
    });
  }
  onMaterialsSubmit() {
    const materials = {
      id: this.form.get('id').value,
      name: this.form.get('name').value,
      category_id: this.form.get('category_id').value,
      count: this.form.get('count').value,
      time: this.form.get('time').value,
      price_unit: this.form.get('price_unit').value,
      unit: this.form.get('unit').value
    }
    
    console.log(materials);
    this.materialsService.createMaterials(materials).subscribe(data=>{
      if (!data.success) {
        this.messageClass2 = 'alert alert-danger';
        this.message2 = data.message;
      } else {
        this.messageClass2 = 'alert alert-success';
        this.message2 = data.message;
        // Clear form data after two seconds
        setTimeout(() => {
          this.form2.reset(); // Reset all form fields
          this.messageClass2= false;
          this.message2='';
        }, 2000);
      }
    })
  }
  getAllMaterials(category_id){
    this.materialsService.getAllMaterials(category_id).subscribe(data=>{
        this.materials = data.materials;
        console.log(this.materials)
    })
  }
  getIdMaterials(_id){
    this.materialsService.getMaterials(_id).subscribe(data=>{
      this.materials2 =data.materials;
      this.selectedState =data.materials.category_id
      console.log( this.materials2)
      this.getValue(this.materials2)
    })
  }
  getValue(materials){
    this._id =materials._id;
    this.id =materials.id;
    this.name =materials.name;
    this.category =materials.category_id;
    this.price_unit =materials.price_unit;
    this.unit =materials.unit;
    this.time =materials.time;
    this.count =materials.count;
  }
  changeId(){
    this.id = this.form4.get('id').value;
    this.checkChange =true;
  }
  changeName(){
    this.name = this.form4.get('name').value;
    this.checkChange =true;
  }
  changeCount(){
    this.count = this.form4.get('count').value;
    this.checkChange =true;
  }
  changeCategory(){
    this.category = this.form4.get('category_id').value;
    this.checkChange =true;
  }
  changePriceUnit(){
    this.price_unit = this.form4.get('price_unit').value;
    this.checkChange =true;
  }
  changeUnit(){
    this.unit = this.form4.get('unit').value;
    this.checkChange =true;
  }
 changeTime(){
  this.time = this.form4.get('time').value;
  console.log(this.time);
  this.checkChange =true;
 }
 
 
  editMaterials(){
    const materials={
      _id: this._id,
      id: this.id,
      name: this.name,
      category_id: this.category,
      price_unit: this.price_unit,
      unit: this.unit,
      time: this.time,
      count: this.count
    }
    this.materialsService.editMaterials(materials).subscribe(data =>{
      this.checkChange =false;
      if (!data.success) {
        this.messageClass2 = 'alert alert-danger';
        this.message2 = data.message;
      } else {
    
        this.messageClass2 = 'alert alert-success';
        this.message2 = data.message;
        // Clear form data after two seconds
        setTimeout(() => {
          this.form2.reset(); // Reset all form fields
          this.messageClass2= false;
          this.message2='';
        }, 2000);
      }
    })
  }
  get_id(_id){
    this._id =_id;
   }
   deleteMaterial(){
    console.log(this._id);
    this.materialsService.deleteMaterials(this._id).subscribe(data=>{
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
        this.message0 = '';
      }, 2000);
    })
  }
  getKeyWord(keyWord){
    this.keyWord =keyWord.value
  }
  findMaterials(){
    console.log("keyword:"+ this.keyWord)
    this.materialsService.findMaterials(this.keyWord).subscribe(data=>{
      this.materials = data.materials;
      console.log(data);
    })
  }
  ngOnInit() {
    this.authService.socket.on("server-update-categoryMaterials", data => {
      this.getAllCategoryMaterials();
    })
    this.authService.socket.on("server-delete-categoryMaterials", data => {
      this.getAllCategoryMaterials();
    })
    this.authService.socket.on("server-add-categoryMaterials", data => {
      this.getAllCategoryMaterials();
    })
    this.authService.socket.on("server-add-materials", data =>{
      this.getAllMaterials(this.category_id)
    })
    this.authService.socket.on("server-delete-materials", data =>{
      this.getAllMaterials(this.category_id)
    })
    this.authService.socket.on("server-update-materials", data =>{
      console.log("update nguyên liệu " + this.category_id)

      this.getAllMaterials(this.category_id)
    })
    this.getAllCategoryMaterials();
    this.getAllMaterials(0);
  }

}
