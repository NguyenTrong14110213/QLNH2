/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


const tableSchema = new Schema({
  id: { type: String,unique: true, required: true },
  region_id: { type: String, required: true},
  order_id: { type: String , default: ''},
  actived: { type: String , default: '0'}
});

// Export Module/Schema
module.exports = mongoose.model('Tables', tableSchema);