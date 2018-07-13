import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { RegionService } from '../../services/region.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  private messageClass;
  private message;
  private orders;
  private order;
  private id;
  private detail_order;
  private regions;
  private region_id;
  private excess_cash=0;
  btnPay = false;
  keyWord;
  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private regionService: RegionService
    
  ) { }
  createOrder(){
    const tables22: Array<String> = [];
    tables22.push("1");
    tables22.push("2");
    const detail_orders1=[{
      "food_id":"M01",
      "food_name":"Cá quả hấp",
      "price_unit":"10000",
      "discount":"0",
      "count":"1",
      "status":"1"
    },{
      "food_id":"M02",
      "food_name":"Thịt luộc",
      "price_unit":"20000",
      "discount":"0",
      "count":"1",
      "status":"1"
    }]
    console.log(detail_orders1);
    const order={
      id: "12",
      customer_username:"1",
      customer_fullname:  "Nguyễn Văn F",
      waiter_username :  "KH01",
      waiter_fullname :  "Nguyễn Văn C",
      cashier_username :  "",
      cashier_fullname :  "",
      flag_status:  "1",
      flag_set_table: "true",
      paid_cost: "5000",
      final_cost: "30000",
      description: "",
      detail_orders:detail_orders1,
      number_customer:"3",
      tables:["2","8"],
      region_id:"KV02",
      region_name:"Khu vưc 1"
    }
    this.orderService.createOrder(order).subscribe(data=>{
      console.log(data.message);
    })
  }
  changeCategory(region_id){
     this.getAllOrders(region_id.value);
  }
  
  getAllOrders(region_id){
    this.orderService.getAllOrders(region_id).subscribe(data=>{
      this.orders =data.order;
      console.log("danh sách order: "+region_id);
    })
  }
  getAllRegion(){
    this.regionService.getAllRegion().subscribe(data=>{
      this.regions =data.region;
    })
  }
  getDetailOrder(id){
    this.id=id;
  this.orderService.getOrder(id).subscribe(data=>{
    this.order =data.order;
    this.detail_order = data.order.detail_orders;
    if(this.order.flag_status == 5 ){
      this.btnPay = true;
    }else this.btnPay = false;
  })
  }
  editStatusOrder(){
    const order = {
      id:  this.id,
      flag_status: 6
    }
    if(this.id){
      console.log("mã hóa đơn:"+ this.id);
      this.orderService.editStatusOrder(order).subscribe(data=>{
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Return error bootstrap class
          this.message = data.message; // Return error message
        } else {
          this.messageClass = 'alert alert-success'; // Return bootstrap success class
          this.message = data.message; // Return success message
          // After two second timeout, route to blog page
        }
        setTimeout(() => {
          this.messageClass = false; // Erase error/success message
          this.message='';
        }, 2000);
      });
    }

  }
  
  getKeyWord(keyWord){
    this.keyWord =keyWord.value
  }
  findOrder(){
    console.log("keyword:"+ this.keyWord)
    this.orderService.findOrder(this.keyWord).subscribe(data=>{
      this.orders =data.order;
      console.log(data);
    })
  }
  onKey(guest_money){
    console.log(guest_money.value);
    var paid_cost = this.order.paid_cost
    if(!paid_cost) paid_cost =0;
    
    var result = parseInt(guest_money.value) + parseInt(paid_cost) - parseInt(this.order.final_cost);  
    if(result) this.excess_cash =result;
    else this.excess_cash =0;
  }


  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('bill').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();

    popupWin.document.write(`
    <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
          <link rel="icon" type="image/x-icon" href="favicon.ico">
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
  ngOnInit() {
    this.authService.socket.on("server-update-status-order",(data)=>{
      this.getAllOrders(0);
    });
    
    this.getAllRegion();
    this.getAllOrders(0);
  }

}
