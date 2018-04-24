/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose




const foodsSchema = new Schema({
  id: { type: String,unique: true, required: true },
  name: { type: String,unique: true, required: true},
  actived: { type: String ,default: '0'},
  date_created: { type: Date, default: Date.now() ,required: true},
  category_id: { type: String, required: true},
  description: {type: String },
  discount: { type: Number },
  price_unit: { type: Number , required: true},
  unit: {type:String, required: true},
  url_image:{type: Array}
});

// Export Module/Schema
module.exports = mongoose.model('Foods', foodsSchema);