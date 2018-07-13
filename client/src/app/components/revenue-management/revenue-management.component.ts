import { Component, OnInit } from '@angular/core';
import { MaterialsService } from '../../services/materials.service';
import { OrderService } from '../../services/order.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms'
import { FormControl } from '@angular/forms/src/model';
@Component({
  selector: 'app-revenue-management',
  templateUrl: './revenue-management.component.html',
  styleUrls: ['./revenue-management.component.css']
})
export class RevenueManagementComponent implements OnInit {

  barChartLabels = [];
  barChartType = 'bar';
  barChartLegend = true;
  viewOfMonth = true;
  barChartData = [
    { data: [], label: 'Chi tiêu VNĐ' },
    { data: [], label: 'Doanh thu VNĐ' }
  ];
  yyyy = new Date().getFullYear();
  MM = new Date().getMonth() +1;
  dd = new Date().getDate();

  yyyyChart= new Date().getFullYear();;
  MMChart= new Date().getMonth() +1;

  revenueOfMonth;
  revenueOfYear;
  expenditureMonth;
  expenditureYear;

  foods;
  materials;

  time;
  revenue;
  expenditure; 
  profitChart; 
  amountCustomers;

  profitMonth = 0;  
  profitYear = 0; 
  profit = 0; 

  changeOption = false;
  listYear=[];

  labelYear = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
  labelMonth =[];

  form: FormGroup;
  form2: FormGroup;
  
  constructor(
    private materialsService: MaterialsService,
    private orderService: OrderService,
    private formBuilder: FormBuilder
  ) {this.createForm();
  this.createForm2() }

  createForm(){
    this.form = this.formBuilder.group({
      year:['']
    })
  }
  createForm2(){
    this.form2 = this.formBuilder.group({
      month:['']
    })
  }
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };



  // events
  public chartHovered(e: any): void {
    console.log(e);
  }

  public chartClicked(event){
    var label =event.active[0]._model.label;
    var MM;
    var dd;
    if(label.length > 5){
      MM = label.substring(5)
      this.time = MM + '-' + this.yyyyChart;
      this.getFoodOfMonth(MM, this.yyyyChart);
      this.getMaterialsOfMonth(MM, this.yyyyChart);
      this.getAmountCustomersOfMonth(MM, this.yyyyChart);
      this.revenue = this.revenueOfYear[MM-1];
      this.expenditure =this.expenditureYear[MM-1];
      this.profitChart = this.revenue - this.expenditure;
    
    }else{
      dd = label
      this.time = dd+ '-' + this.MMChart + '-' + this.yyyyChart;
      this.getFoodOfDay(dd, this.MMChart, this.yyyyChart);
      this.getMaterialsOfDay(dd, this.MMChart , this.yyyyChart);
      this.getAmountCustomersOfDay(dd, this.MMChart , this.yyyyChart);
      this.revenue = this.revenueOfMonth[dd-1];
      this.expenditure =this.expenditureMonth[dd-1];
      this.profitChart = this.revenue - this.expenditure;
    }
  }

  changeView(event){
    this.changeOption =true;
    if(event.value == 0) this.viewOfMonth = true;
    else this.viewOfMonth = false;
    console.log(this.viewOfMonth);
  }

  changeMonth(event){
    this.changeOption =true;
    this.MM = event.value;
    console.log("xem theo thang", + event.value);
    this.getMonth();
  }
  changeYear(event){
    this.changeOption =true;
    this.yyyy = event.value;
      this.getMonth();
      this.getYear();
  }
  getMonth() {
    this.profitMonth =0
    let data3=[];
    let data4=[];
    this.labelMonth =[];
    let time = new Date(this.yyyy,this.MM,0).getDate();
    console.log("so ngay: "+ time)
    for (var i = 0; i < time; i++) {
      this.labelMonth[i] = i+1;
      data3[i] = 0;
      data4[i] = 0;
    }
    this.materialsService.getExpenditureMonth(this.MM, this.yyyy).subscribe(data => {
      if(data.materials.length == 0 ) this.expenditureMonth = data3;
      else {
        for (var i = 0; i < data.materials.length; i++) {
          data3[data.materials[i]._id.day - 1] = data.materials[i].total;
          this.profitMonth -= data.materials[i].total;
        }
        this.expenditureMonth = data3;
      }
    })
    this.orderService.getRevenueOfMonth(this.MM, this.yyyy).subscribe(data => {
      if(data.order.length == 0 )  this.revenueOfMonth = data4;
      else {
        for (var i = 0; i < data.order.length; i++) {
          data4[data.order[i]._id.day - 1] = data.order[i].total;
          this.profitMonth += data.order[i].total;
        }
        this.revenueOfMonth = data4;
      }
    })

    
  }
  getYear() {
    this.profitYear =0
    let data1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let data2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  
    this.materialsService.getExpenditureYear(this.yyyy).subscribe(data => {
      
      if(data.materials.length == 0 )  this.expenditureYear = data1;
      else {
        for (var i = 0; i < data.materials.length; i++) {
          data1[data.materials[i]._id.month - 1] = data.materials[i].total;
          this.profitYear -=data.materials[i].total;
        }
        this.expenditureYear = data1;
      }
     
    })
    this.orderService.getRevenueOfYear(this.yyyy).subscribe(data => {
      if(data.order.length == 0 )  this.revenueOfYear = data2;
      else {
        for (var i = 0; i < data.order.length; i++) {
          data2[data.order[i]._id.month - 1] = data.order[i].total;
          this.profitYear +=data.order[i].total;
        }
        this.revenueOfYear = data2;
      }      
    })
  }
  getListYear(){
    var min1;
    var min2;
    var yearNow = new Date().getFullYear();
    this.materialsService.getExpenditureMinYear().subscribe(data=>{
        min1 =data.materials[0]._id;
    })
    this.orderService.getRevenueMinYear().subscribe(data=>{
      min2 =data.order[0]._id;
    })

    setTimeout(() => {
      if(min1 < min2){
        console.log("min1:", min1)
        var j =0;
        for(var i =yearNow; i>= min1 ; i--){
          this.listYear[j] = i;
          console.log("min:", i)
          j++;
        }
      }else{
        console.log("min2:", min2)
        console.log("yearNow:", yearNow)
        var j =0;
        for(var i =yearNow; i>= min2 ; i--){
          this.listYear[j] = i;
          console.log("min:", i)
          j++;
        }
      }
      console.log("danh sach năm:", this.listYear)
    
    }, 1000);
    
  }
  
  showChart(){
    this.changeOption =false;
    if(this.viewOfMonth){
      this.yyyyChart =this.yyyy;
      this.MMChart = this.MM;
      this.showMonth();
    }else{
      this.yyyyChart =this.yyyy;
      this.showYear();
    }
  }
  showMonth(){
    this.profit = this.profitMonth;
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = this.expenditureMonth; 
    clone[1].data = this.revenueOfMonth;
 
    this.barChartData = clone;

    this.barChartLabels.length = 0;
    for (let i = 0; i <this.labelMonth.length; i++) {
      this.barChartLabels.push(this.labelMonth[i]);
    }
  }
  showYear(){
    this.profit =this.profitYear
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = this.expenditureYear; 
    clone[1].data = this.revenueOfYear;
 
    this.barChartData = clone;

    this.barChartLabels.length = 0;
    for (let i = 0; i <this.labelYear.length; i++) {
      this.barChartLabels.push(this.labelYear[i]);
    }
  }
  getFoodOfMonth(MM,yyyy){
    this.orderService.getFoodOfMonth(MM,yyyy).subscribe(data=>{
      this.foods = data.order;
    })
  }
  getFoodOfDay(dd,MM,yyyy){
    this.orderService.getFoodOfDay(dd,MM,yyyy).subscribe(data=>{
      this.foods = data.order;
    })
  }
  getMaterialsOfMonth(MM,yyyy){
    this.materialsService.getMaterialsOfMonth(MM,yyyy).subscribe(data=>{
      this.materials = data.materials;
    })
  }
  getMaterialsOfDay(dd,MM,yyyy){
    this.materialsService.getMaterialsOfDay(dd,MM,yyyy).subscribe(data=>{
      this.materials = data.materials;
    })
  }
  getAmountCustomersOfMonth(MM,yyyy){
    this.amountCustomers =0;
    this.orderService.getAmountCustomersOfMonth(MM, yyyy).subscribe(data =>{
      this.amountCustomers = data.order[0].total;
    })
  }
  getAmountCustomersOfDay(dd, MM,yyyy){
    this.amountCustomers =0;
    this.orderService.getAmountCustomersOfDay(dd, MM, yyyy).subscribe(data =>{
      this.amountCustomers = data.order[0].total;
    })
  }
 
  ngOnInit() {
    this.getMonth();
    this.getYear();
    this.getListYear();

    for (let i = 0; i <this.labelMonth.length; i++) {
      this.barChartLabels.push(this.labelMonth[i]);
    }
    if(this.revenueOfMonth){
      console.log("data 0:",this.revenueOfMonth);
    }
    setTimeout(() => {
      this.barChartData = [
        { data: this.expenditureMonth, label: 'Chi tiêu VNĐ' },
        { data: this.revenueOfMonth, label: 'Doanh thu VNĐ' }
      ];
      this.profit =this.profitMonth
    }, 1000);
  
  }

}
