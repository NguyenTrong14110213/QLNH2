/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


const orderSchema = new Schema({
  id: { type: String,unique: true, required: true },
  customer_username: { type: String },
  customer_fullname: { type: String },
  waiter_username : { type: String, required: true },
  waiter_fullname : { type: String, required: true },
  cashier_username : { type: String },
  cashier_fullname : { type: String },
  flag_status: { type: Number , required: true },
  time_created: { type: String, default: new Date() ,required: true }, //"Sun Jul 01 2018 23:44:52 GMT+0700 (SE Asia Standard Time)"
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
  region_id:{type:String},
  region_name:{type:String},
  tables:{ type: Array }
});

// Export Module/Schema
module.exports = mongoose.model('Orders', orderSchema);