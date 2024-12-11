const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Text', textSchema);