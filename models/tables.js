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

const tableSchema = new Schema({
  id: { type: String,unique: true, required: true , validate:idValidators },
  region_id: { type: String, required: true},
  order_id: { type: String , default: ''},
  actived: { type: Boolean , default: true,required: true}
});

// Export Module/Schema
module.exports = mongoose.model('Tables', tableSchema);