const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

const bcrypt= require('bcrypt-node');

let emailLengthChecker =(email)=>{
  if(!email){
    return false;
  } else{
    if(email.length <5 ||email.length >30){
      return false;
    }else{
      return true;
    }
  }
}
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
  validator: emailLengthChecker,
  message: 'E-mail nust be at least 5 characters but no more 30'},
  {
    validator: validEmailChecker,
    message:'Must be a valid e-mail'
  }
];
// Validate Function to check username length
let usernameLengthChecker = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Check length of username string
    if (username.length < 3 || username.length > 15) {
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

// Array of Username validators
const usernameValidators = [
  // First Username validator
  {
    validator: usernameLengthChecker,
    message: 'Username must be at least 3 characters but no more than 15'
  },
  // Second username validator
  {
    validator: validUsername,
    message: 'Username must not have any special characters'
  }
];


// User Model Definition
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
  username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
  password: { type: String, required: true },
  fullname: { type: String},
  gender: { type: String},
  identity_card: { type: Number},
  phone: { type: Number },
  url_profile: { type: String },
  type_account: { type:Number, default:0 }
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