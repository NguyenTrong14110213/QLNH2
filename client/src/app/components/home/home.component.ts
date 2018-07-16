import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'
import { FoodService } from '../../services/food.service';
import { ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CategoryFoodService } from '../../services/category-food.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  constructor() {  }
  
  ngOnInit() {
  }


}
