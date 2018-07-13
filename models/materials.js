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
    message:'Mã loại nguyên liệu có tối đa là 30 ký tự!'
  },
  {
    validator: validId,
    message: 'Mã nguyên liệu không chứa ký tự đặt biệt!'
  }
];


let nameLengthChecker = (name) => {
  // Check if username exists
  if (!name) {
    return false; // Return error
  } else {
    // Check length of username string
    if (name.length >30) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

const nameValidators = [
  {
    validator:nameLengthChecker,
    message:'Tên nguyên liệu có tối đa là 30 ký tự!'
  }
];



const materialsSchema = new Schema({
  id: { type: String, required: true , validate:idValidators},
  name: { type: String, required: true, validate:nameValidators},
  category_id: { type: String, required:true },
  count:{ type: Number, required:true },
  price_unit:{ type: Number, required:true },
  unit:{type: String, required:true },
  time:{ type: Date, required: true}
});

// Export Module/Schema
module.exports = mongoose.model('Materials', materialsSchema);