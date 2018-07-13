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
    message:'Mã món có tối đa là 30 ký tự!'
  },
  {
    validator: validId,
    message: 'Mã món không chứa ký tự đặt biệt!'
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
    message:'Tên món có tối đa là 30 ký tự!'
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

let unitLengthChecker = (unit) => {
  // Check if username exists
  if (!unit) {
    return false; // Return error
  } else {
    // Check length of username string
    if (unit.length >30) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

const unitValidators = [
  {
    validator:unitLengthChecker,
    message:'Đơn vị có tối đa 30 ký tự!'
  }
];
// 2018-07-09T15:23:15.669Z

  let getTime = (date_created) => {
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




const foodsSchema = new Schema({
  id: { type: String,unique: true, required: true ,validate:idValidators},
  name: { type: String,unique: true, required: true, validate:nameValidators },
  actived: { type: Boolean , default: false},
  date_created: { type: Date ,default: getTime , required: true},
  category_id: { type: String, required: true},
  description: {type: String , validate:descriptionValidators },
  discount: { type: String },
  inventory: { type :String},
  price_unit: { type: String, required: true},
  unit: {type:String,required:true, validate:unitValidators},
  url_image:{type: Array }
});

// Export Module/Schema
module.exports = mongoose.model('Foods', foodsSchema);