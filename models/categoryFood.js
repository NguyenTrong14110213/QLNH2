/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose




const categoryFoodSchema = new Schema({
  id: { type: String,unique: true, required: true },
  name: { type: String,unique: true, required: true},
  actived: { type: String , default: '0'},
});

// Export Module/Schema
module.exports = mongoose.model('CategoryFood', categoryFoodSchema);