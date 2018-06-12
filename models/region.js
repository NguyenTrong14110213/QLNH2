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
    message:'Mã khu vực có tối đa là 30 ký tự!'
  },
  {
    validator: validId,
    message: 'Mã khu vực không chứa ký tự đặt biệt!'
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
const nameValidators = [
  {
    validator:nameLengthChecker,
    message:'Tên khu vực có tối đa là 30 ký tự!'
  }
  
];
const regionSchema = new Schema({
  id: { type: String,unique: true, required: true , validate:idValidators},
  name: { type: String,unique: true, required: true, validate:nameValidators},
  description: {type: String , validate:descriptionValidators },
  actived: { type: Boolean , default: true,required: true}
});

// Export Module/Schema
module.exports = mongoose.model('Regions', regionSchema);