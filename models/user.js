const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

const bcrypt= require('bcrypt-node');
let emailLengthChecker = (email) => {
  // Check if username exists
  if (!email) {
    return false; // Return error
  } else {
    // Check length of username string
    if (email.length >254) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

let validEmailChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};
const emailValidators=[{
  validator:emailLengthChecker,
  message: 'Email có tối đa là 254 ký tự!'
},
{
    validator: validEmailChecker,
    message:'Phải đúng định dạng email!'
  }
];

let usernameLengthChecker = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Check length of username string
    if (username.length >30) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};
// Validate Function to check if valid username format
let validUsername = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username); // Return regular expression test result (true or false)
  }
};

const usernameValidators = [
  {
    validator:usernameLengthChecker,
    message:'Tên người dùng có tối đa là 30 ký tự!'
  },
  {
    validator: validUsername,
    message: 'Tên người dùng không chứa ký tự đặt biệt!'
  }
];

// Validate Function to check username length
let identity_cardLengthChecker = (identity_card) => {
  // Check if username exists
  if (!identity_card) {
    return false; // Return error
  } else {
    // Check length of username string
    if (identity_card.length  = 9) {
      return true; // Return error if does not meet length requirement
    } else {
      return false; // Return as valid username
    }
  }
};

// Array of Username validators
const identity_cardValidators = [
  // First Username validator
  {
    validator: identity_cardLengthChecker,
    message: 'Số chứng minh phải 9 chữ số'
  }
];

// Validate Function to check username length
let fullnameLengthChecker = (fullname) => {
  // Check if username exists
  if (!fullname) {
    return false; // Return error
  } else {
    // Check length of username string
    if (fullname.length  > 30) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// Array of Username validators
const fullnameValidators = [
  // First Username validator
  {
    validator: fullnameLengthChecker,
    message: 'Họ tên có tối đa là 30 ký tự!'
  }
];
// Validate Function to check username length
let phoneLengthChecker = (phone) => {
  // Check if username exists
  if (!phone) {
    return false; // Return error
  } else {
    // Check length of username string
    if (phone.length  > 13) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// Array of Username validators
const phoneValidators = [
  // First Username validator
  {
    validator: phoneLengthChecker,
    message: 'Số điện thoại có tối đa là 13 chữ số!'
  }
];

// Validate Function to check username length
let addressLengthChecker = (address) => {
  // Check if username exists
  if (!address) {
    return false; // Return error
  } else {
    // Check length of username string
    if (address.length  > 100) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// Array of Username validators
const addressValidators = [
  // First Username validator
  {
    validator: addressLengthChecker,
    message: 'Địa chỉ có tối đa là 100 ký tự!'
  }
];
// User Model Definition
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
  username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
  password: { type: String, required: true },
  fullname: { type: String,required: true, validate:fullnameValidators},
  birthdate:{ type: Date, required: true },
  gender: { type: Boolean,required: true},
  identity_card: { type: String,required: true, validate:identity_cardValidators},
  phone: { type: String , required: true, validate:phoneLengthChecker},
  address:{ type: String, required: true, validate:addressValidators},
  url_profile: { type: String ,required: true},
  type_account: { type:Number,required: true },
  actived: { type: Boolean , default: true, required: true}
});

userSchema.pre('save', function(next){
  if(!this.isModified('password'))
  return next();

  bcrypt.hash(this.password, null, null,(err,hash)=>{
    if(err)return next(err);
    this.password=hash;
    next();
  });
});

userSchema.methods.comparePassword =function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);