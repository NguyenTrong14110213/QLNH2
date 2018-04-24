import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'
import { FoodService } from '../../services/food.service';
import { ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  filesToUpload: Array<File> = [];
  form: FormGroup;
  messageClass;
  message;
 
  constructor(
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private http: Http
  ) {  this.createForm() }

  createForm(){
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  upload() {

  }
  
  ngOnInit() {
  }


}
