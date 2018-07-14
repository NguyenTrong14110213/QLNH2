/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


let getTime = (time_created) => {
  datenow = new Date();
  yyyy = datenow.getFullYear();
  MM = datenow.getMonth()+1;
  if(MM<10)MM = '0' + MM;
  dd =datenow.getDate();
  if(dd<10) dd ='0' +dd;
  hh = datenow.getHours();
  if(hh<10) hh ='0' +hh;
  mm = datenow.getMinutes();
  if(mm<10) mm ='0' +mm;
  time =  yyyy+'-'+MM+'-'+dd+'T'+hh+':'+mm+':00.000Z'; 
  return time;
};


const orderSchema = new Schema({
  id: { type: String,unique: true, required: true },
  customer_username: { type: String },
  customer_fullname: { type: String },
  waiter_username : { type: String, required: true },
  waiter_fullname : { type: String, required: true },
  cashier_username : { type: String },
  cashier_fullname : { type: String },
  flag_status: { type: Number , required: true },
  time_created: { type: Date, default: getTime ,required: true }, 
  flag_set_table:{ type: Boolean, required: true},
  time_set_table:{ type: Date},
  paid_cost:{type: Number},
  final_cost:{type: Number},
  description:{type: String },
  detail_orders:{type:Array},
  // detail_orders:[{
  //   food_id:{type: String},
  //   food_name:{type: String},
  //   price_unit:{type: String},
  //   discount:{type: String},
  //   count:{type: String},
  // }],
  number_customer:{type: Number, required:true},
  region_id:{type: Array},
  tables:{ type: Array },
  delegacy: {type:Array}    
});

// Export Module/Schema
module.exports = mongoose.model('Orders', orderSchema);