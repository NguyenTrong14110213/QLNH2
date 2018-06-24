import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  form1:FormGroup;
  currentUrl;
  food;
  categoryFoods;
  selectedState;
  messageClass;
  message;
  filesToUpload;
  selectedImage = false;
  id;
  name;
  category_id;
  description;
  discount;
  inventory;
  price_unit;
  unit;
  checkChange = false;
  private imageName;

  images: Array<String> = [];
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private foodService: FoodService,
    private categoryFoodService: CategoryFoodService
  ) { 
    this.createFoodForm();
    this.createForm1();
  }


  validateNumber(controls) {
    const regExp = new RegExp(/^[0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateNumber': true }
    }
  }
  createForm1(){
    this.form1 = this.formBuilder.group({
      actived:['',Validators.required]
    })
  }
  // tạo món
  createFoodForm() {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
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
      // trường đơn giá
      price_unit: ['', Validators.compose([
        Validators.required,
        this.validateNumber
      ])],
      // trường đơn giá
      discount: ['', Validators.compose([
        Validators.required,
        this.validateNumber
      ])],
      inventory: ['', Validators.compose([
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

  getAllCategoryFoods() {
    // Function to GET all blogs from database
    this.categoryFoodService.getAllCategoryFoods().subscribe(data => {
      this.categoryFoods = data.categoryfoods; // Assign array to use in HTML
    });
  }
  getImageName(imageName){
    this.imageName =imageName;
    console.log(this.imageName);
  }
  deleteImage(id) {
    console.log(id + " " + this.imageName);
    this.foodService.deleteImage(id, this.imageName).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          //  this.form.reset(); // Reset all form fields
          this.messageClass = false; // Erase error/success message
          this.message = '';
        }, 2000);
      }

    });
  }
  changeName() {
    this.name = this.form.get('name').value;
    this.checkChange = true;
  }
  changeCategory() {
    this.category_id = this.form.get('category_id').value;
    this.checkChange = true;
  }
  changeDescription() {
    this.description = this.form.get('description').value;
    this.checkChange = true;
  }
  changePriceUnit() {
    this.price_unit = this.form.get('price_unit').value;

    this.checkChange = true;
  }
  changeDiscount() {
    this.discount = this.form.get('discount').value;
    this.checkChange = true;
  }
  changeInventory() {
    this.inventory = this.form.get('inventory').value;
    this.checkChange = true;
  }
  changeUnit() {
    this.unit = this.form.get('unit').value;
    this.checkChange = true;
  }


  getValue(data) {
    this.food = data.food;
    this.images = data.food.url_image;
    this.selectedState = data.food.category_id;
   
    this.name = this.food.name;
    this.category_id = this.food.category_id;
    this.description = this.food.description;
    this.discount = this.food.discount;
    this.inventory =this.food.inventory;
    this.price_unit = this.food.price_unit;
    this.unit = this.food.unit
  }
  editFood() {
    const food = {
      id: this.food.id,
      name: this.name,
      category_id: this.category_id,
      description: this.description,
      discount: this.discount,
      inventory: this.inventory,
      price_unit: this.price_unit,
      unit: this.unit,
    }
    console.log(food);

    this.foodService.editFood(food).subscribe(data => {
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
          this.message = '';
        }, 2000);
      }
    });
  }
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    if (this.filesToUpload.length > 0) {
      this.selectedImage = true;
    }
  }
  addImge() {
    console.log("click");
    const files: Array<File> = this.filesToUpload;
    const filenames: Array<String> = [];
    const formData: any = new FormData();
    for (let i = 0; i < files.length; i++) {
      const filename = Date.now() + '-' + files[i]['name'];
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
            this.selectedImage = false;
            this.message = data.message;
            setTimeout(() => {
              //  this.form.reset(); // Reset all form fields
              this.messageClass = false; // Erase error/success message
              this.message = '';
            }, 2000);
          }
        });
      }
    });
  }

  changeActived(){
    console.log(this.form1.get('actived').value);
    const food = {  
      id: this.food.id,
      actived: this.form1.get('actived').value
    }
        this.foodService.editActivedFood(food).subscribe(data => {
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

  ngOnInit() {
    this.currentUrl = this.activatedRouter.snapshot.params;
    this.foodService.getFood(this.currentUrl.id).subscribe(data => {

      this.getValue(data);
    });
    this.authService.socket.on("server-add-food", (data) => {
      this.foodService.getFood(this.currentUrl.id).subscribe(data => {
        this.getValue(data);
      });
    });
    this.authService.socket.on("server-update-food", (data) => {
      this.foodService.getFood(this.currentUrl.id).subscribe(data => {
        this.getValue(data);
      });
    });
    this.authService.socket.on("server-update-active-food", (data) => {
      this.foodService.getFood(this.currentUrl.id).subscribe(data => {
        this.getValue(data);
      });
    });
    this.authService.socket.on("server-delete-food", (data) => {
      this.foodService.getFood(this.currentUrl.id).subscribe(data => {
        this.getValue(data);
      });
    });
    this.authService.socket.on("server-delete-image-food", (data) => {
      this.foodService.getFood(this.currentUrl.id).subscribe(data => {
        this.getValue(data);
      });
    });
    this.authService.socket.on("server-add-image-food", (data) => {
      this.foodService.getFood(this.currentUrl.id).subscribe(data => {
        this.getValue(data);
      });
    });
    this.getAllCategoryFoods();
  }

}
