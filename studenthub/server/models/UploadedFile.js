const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String },
  size: { type: Number },
  path: { type: String },
  toolUsed: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UploadedFile', uploadedFileSchema);
