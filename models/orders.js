import { type } from 'os';

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


let descriptionLengthChecker = (description) => {
    // Check if username exists
    if (!description) {
      return false; // Return error
    } else {
      // Check length of username string
      if (description.length >200) {
        return false; // Return error if does not meet length requirement
      } else {
        return true; // Return as valid username
      }
    }
  };
  
  const descriptionValidators = [
    {
      validator:nameLengthChecker,
      message:'Mô tả món có tối đa là 200 ký tự!'
    }
    
  ];

const tableSchema = new Schema({
  id: { type: String,unique: true, required: true , validate:idValidators },
  username: { type: String, required: true },
  flag_status: { type: Number , required: true },
  time_creadted: { type: Date, default: Date.now() ,required: true },
  time_begin:{type: Date, required: true },
  time_end:{type: Date, required: true },
  paid_cost:{type: Number, required: true },
  final_cost:{type: Number, required: true},
  description:{type: String, required: true, validate:descriptionValidators},
  detail_orders:[{
    food_id:{type: String, required:true },
    food_name:{type: String, required:true },
    price_unit:{type: String, required:true},
    discount:{type: String, required:true },
    count:{type: String, required:true },
    compensation:{type: String, required:true},
    status:{type: String, required:true}
  }],
  tables:{ type: Array }
});

// Export Module/Schema
module.exports = mongoose.model('Orders', tableSchema);