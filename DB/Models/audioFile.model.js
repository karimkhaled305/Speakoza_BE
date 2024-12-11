const mongoose = require('mongoose');

const audioFileSchema = new mongoose.Schema({
  textId: { type: mongoose.Schema.Types.ObjectId, ref: 'Text', required: true },
  fileName: { type: String, required: true },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AudioFile', audioFileSchema);