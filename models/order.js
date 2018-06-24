/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


let idLengthChecker = (id) => {
  // Check if username exists
  if (!id) {
    return false; // Return error
  } else {
    // Check length of username string
    if (id.length >30) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};
// Validate Function to check if valid username format
let validId = (id) => {
  // Check if username exists
  if (!id) {
    return false; // Return error
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(id); // Return regular expression test result (true or false)
  }
};

const idValidators = [
  {
    validator:idLengthChecker,
    message:'Mã bàn có tối đa là 30 ký tự!'
  },
  {
    validator: validId,
    message: 'Mã bàn không chứa ký tự đặt biệt!'
  }
];
    


const orderSchema = new Schema({
  id: { type: String,unique: true, required: true , validate:idValidators },
  customer_username: { type: String },
  customer_fullname: { type: String },
  waiter_username : { type: String, required: true },
  waiter_fullname : { type: String, required: true },
  cashier_username : { type: String },
  cashier_fullname : { type: String },
  flag_status: { type: Number , required: true },
  time_created: { type: Date, default: Date.now() ,required: true },
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