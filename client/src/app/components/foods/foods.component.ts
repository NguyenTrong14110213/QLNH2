import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { CategoryFoodService } from '../../services/category-food.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css']
})
export class FoodsComponent implements OnInit {

  form: FormGroup;
  currentUrl;
  food;
  categoryFoods;
  selectedState;
  messageClass;
  message;
  filesToUpload;
  selectedImage =false;
  id;
  name;
  category_id;
  description;
  discount;
  price_unit;
  unit;

  images: Array<String> = [];
  constructor(
    private authService:AuthService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private foodService: FoodService,
    private categoryFoodService:CategoryFoodService
  ) { this.createFoodForm();}


  validateNumber(controls){
    const regExp = new RegExp(/^[0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateNumber': true }
    }
  }
    // tạo món
    createFoodForm() {
      this.form = this.formBuilder.group({
        id: ['',Validators.required],
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
           // trường đơn giá
           discount: ['', Validators.compose([
            Validators.required,
            Validators.maxLength(30),
            Validators.minLength(1),
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

    getAllCategoryFoods() {
      // Function to GET all blogs from database
      this.categoryFoodService.getAllCategoryFoods().subscribe(data => {
        this.categoryFoods = data.categoryfoods; // Assign array to use in HTML
      });
    }
    deleteImage(id, url_image){
      console.log(id + " " + url_image);
      this.foodService.deleteImage(id, url_image).subscribe(data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
        }else {
          this.authService.socket.emit("client-loadFoods","xóa ảnh.");
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          setTimeout(() => {
            //  this.form.reset(); // Reset all form fields
              this.messageClass = false; // Erase error/success message
              this.message='';
            }, 2000);
          }

      });
    }
    editFood(){
      console.log("click");
    this.id =this.food.id;
    if(this.form.get('name').value){
      this.name = this.form.get('name').value;
    }else{
      this.name =this.food.name;
    }
    if(this.form.get('category_id').value){
      this.category_id =this.form.get('category_id').value;
    }else{
      this.category_id =this.food.category_id;
    }
    if(this.form.get('description').value){
      this.description =this.form.get('description').value;
    }else{
      this.description =this.food.description;
    }
    if(this.form.get('discount').value){
      this.discount =this.form.get('discount').value;
    }else{
      this.discount =this.food.discount;
    }
    if(this.form.get('price_unit').value){
      this.price_unit=this.form.get('price_unit').value;
    }else{
      this.price_unit =this.food.price_unit;
    }
    if(this.form.get('unit').value){
      this.unit =this.form.get('unit').value;
    }else{
      this.unit=this.food.unit
    }

      const food = {
        
        id: this.id,
        name: this.name,
        category_id:this.category_id,
        description: this.description,
        discount: this.discount,
        price_unit: this.price_unit,
        unit: this.unit,
      }
      console.log(food);
  
      this.foodService.editFood(food).subscribe(data => {
        if (!data.success) {
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
        } else {
          this.authService.socket.emit("client-loadFoods","sửa thông tin món.");
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          // Clear form data after two seconds
          setTimeout(() => {
          //  this.form.reset(); // Reset all form fields
            this.messageClass = false; // Erase error/success message
            this.message='';
          }, 2000);
        }
      });
      }
      fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        if(this.filesToUpload.length >0){
          this.selectedImage =true;
        }
      }
      addImge() {
        console.log("click");
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
            this.messageClass = 'alert alert-danger';
            this.message = data.message;
          } else {
            this.messageClass = 'alert alert-success';
            this.message = data.message;  
            const food = {
              id: this.food.id,
              url_image: filenames
            }
            this.foodService.addImage(food).subscribe(data => {
              if (!data.success) {
                this.message = data.message;
              } else {
                this.authService.socket.emit("client-loadFoods","thêm ảnh");
                this.message = data.message;  
                setTimeout(() => {
                  //  this.form.reset(); // Reset all form fields
                    this.messageClass = false; // Erase error/success message
                    this.message='';
                  }, 2000);
              }
              });
            }
        });
      }
      
    
  ngOnInit() {
    this.currentUrl =this.activatedRouter.snapshot.params;
    this.foodService.getFood(this.currentUrl.id).subscribe(data=>{
      this.food =data.food;
      this.images =data.food.url_image;
      this.selectedState = data.food.category_id;
    });
    this.authService.socket.on("server-loadFoods",(data)=>{
      this.foodService.getFood(this.currentUrl.id).subscribe(data=>{
        this.food =data.food;
        this.images =data.food.url_image;
        this.selectedState = data.food.category_id;
      });
      console.log(data);
    });
    this.getAllCategoryFoods();
  }

}
