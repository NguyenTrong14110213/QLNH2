import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegionService } from '../../services/region.service';
import { AuthService } from '../../services/auth.service';
import { get } from 'selenium-webdriver/http';
import { TableService } from '../../services/table.service';
@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.css']
})
export class TableManagementComponent implements OnInit {

  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  messageClass0;
  message0;
  messageClass;
  message;
  messageClass2;
  message2;
  nameRegionMessage;
  idRegionMessage;
  idRegionValid;
  idTableMessage;
  idTableValid;
  nameRegionValid;
  region_id;
  region_id2;
  idRegion;
  nameRegion;
  table_id;
  regions;
  tables;

  constructor( 
    private formBuilder: FormBuilder,
    private regionService: RegionService,
    private authService:AuthService,
    private tableService: TableService
  ) {
    this.createRegionForm();
    this.createRegionForm3();
    this.createTableForm();
  }

  validateId(controls){
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if(regExp.test(controls.value)){
      return null;
    }else{
      return { 'validateId': true }
    }
  }
  createRegionForm() {
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
  createTableForm() {
    this.form = this.formBuilder.group({
      // trường id 
      id: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30),
        this.validateId
      ])],
      // trường name 
      region_id: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])]
    })
  }
  createRegionForm3() {
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
  checkIdRegion(){
    this.regionService.checkIdRegion(this.form2.get('id').value).subscribe(data=>{
      if(!data.success){
       this.idRegionValid = false;
       this.idRegionMessage = data.message;
      }else{
       this.idRegionValid = true;
       this.idRegionMessage = data.message;
      }
    });
  }
  checkNameRegion(){
    this.regionService.checkNameRegion(this.form2.get('name').value).subscribe(data=>{
      if(!data.success){
       this.nameRegionValid = false;
       this.nameRegionMessage = data.message;
      }else{
       this.nameRegionValid = true;
       this.nameRegionMessage = data.message;
      }
    });
  }
  checkNameRegion2(){
    this.regionService.checkNameRegion(this.form3.get('name').value).subscribe(data=>{
      if(!data.success){
       this.nameRegionValid = false;
       this.nameRegionMessage = data.message;
      }else{
       this.nameRegionValid = true;
       this.nameRegionMessage = data.message;
      }
    });
  }
  checkIdTable(){
    this.tableService.checkIdTable(this.form.get('id').value).subscribe(data=>{
      if(!data.success){
       this.idTableValid = false;
       this.idTableMessage = data.message;
      }else{
       this.idTableValid = true;
       this.idTableMessage = data.message;
      }
    });
  }
  createRegion(){
    const region = {
      id: this.form2.get('id').value,
      name: this.form2.get('name').value
    }
    this.regionService.createRegion(region).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
      //  this.authService.socket.emit("client-loadRegion","tao khu vực");
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.authService.socket.emit("client-loadRegions","tao khu vực");
        // Clear form data after two seconds
        setTimeout(() => {
          this.form2.reset(); // Reset all form fields
          this.messageClass= false;
          this.message='';
        }, 2000);
      }
    })
  }
  createTable(){
    const table = {
      id: this.form.get('id').value,
      region_id: this.form.get('region_id').value
    }
    this.tableService.createTable(table).subscribe(data => {
      if (!data.success) {
        this.messageClass2 = 'alert alert-danger';
        this.message2 = data.message;
      } else {
      //  this.authService.socket.emit("client-loadRegion","tao khu vực");
        this.messageClass2 = 'alert alert-success';
        this.message2 = data.message;
        this.authService.socket.emit("client-loadTables","tao ban");
        // Clear form data after two seconds
        setTimeout(() => {
          this.form.reset(); // Reset all form fields
          this.messageClass2= false;
          this.message2='';
        }, 2000);
      }
    })
  }
  getRegionId(region_id){
    this.getAllTable(region_id);
    this.region_id =region_id;
  }

  getRegionId2(region_id2){
    this.region_id2=region_id2;
  }
  getRegion(id, name){
    this.idRegion = id;
    this.nameRegion =name;
  }
  getTableId(table_id){
    this.table_id =table_id;
  }
  editRegion(){
    const region = {
      id:  this.idRegion,
      name: this.form3.get('name').value
    }
    this.regionService.editRegion(region).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
       //this.authService.socket.emit("client-loadCategoryFoods","xóa danh mục.");
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.authService.socket.emit("client-loadRegions","sua ten khu vuc");
        // Clear form data after two seconds
        setTimeout(() => {
          this.messageClass= false;
          this.message='';
        }, 2000);
      }
    })
  }
  deleteRegion(id){
    this.regionService.deleteRegion(id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.messageClass0 = 'alert alert-danger'; // Return error bootstrap class
        this.message0 = data.message; // Return error message
      } else {
       // this.authService.socket.emit("client-loadCategoryFoods","cập nhật danh mục");
        this.messageClass0 = 'alert alert-success'; // Return bootstrap success class
        this.message0 = data.message; // Return success message
        this.authService.socket.emit("client-loadRegions","xoa khu vuc");
      }
      setTimeout(() => {
        this.messageClass0 = false; // Erase error/success message
        this.message0='';
      }, 2000);
    });
  }
  deleteTable(id){
    this.tableService.deleteTable(id).subscribe(data=>{
            // Check if delete request worked
      if (!data.success) {
        this.messageClass0 = 'alert alert-danger'; // Return error bootstrap class
        this.message0 = data.message; // Return error message
      } else {
       // this.authService.socket.emit("client-loadCategoryFoods","cập nhật danh mục");
        this.messageClass0 = 'alert alert-success'; // Return bootstrap success class
        this.message0 = data.message; // Return success message
        this.authService.socket.emit("client-loadTables","xoa ban");
      }
      setTimeout(() => {
        this.messageClass0 = false; // Erase error/success message
        this.message0='';
      }, 2000);
    })
  }
  changeActived(id, active){
    console.log(id + " " +active);
    const table = {  
      id: id,
      actived: active
    }
        this.tableService.editActivedTable(table).subscribe(data => {
          if (!data.success) {
            this.messageClass = 'alert alert-danger';
            this.message = data.message;
          } else {
        //   this.authService.socket.emit("client-loadTables","cap nhat trang thai");
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
  getAllRegion(){
    this.regionService.getAllRegion().subscribe(data=>{
      this.regions =data.region;
    })
  }
  getAllTable(region_id){
    this.tableService.getAllTables(region_id).subscribe(data=>{
      this.tables =data.tables;
    })
  }
  ngOnInit() {
    this.getAllRegion();
    this.getAllTable(0);
    this.authService.socket.on("server-add-table", (data)=>{
      this.getAllTable(this.region_id);
    });
    this.authService.socket.on("server-update_active-table", (data)=>{
      this.getAllTable(this.region_id);
    });
    this.authService.socket.on("server-delete-table", (data)=>{
      this.getAllTable(this.region_id);
    });

    this.authService.socket.on("server-add-region", (data)=>{
      this.getAllRegion();
    });
    this.authService.socket.on("server-update-region", (data)=>{
      this.getAllRegion();
    });
    this.authService.socket.on("server-delete-region", (data)=>{
      this.getAllRegion();
    });
  }

}
