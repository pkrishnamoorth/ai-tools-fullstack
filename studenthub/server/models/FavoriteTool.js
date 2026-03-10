const mongoose = require('mongoose');

const favoriteToolSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toolId: { type: String, required: true },
  toolName: { type: String, required: true },
  category: { type: String },
  addedAt: { type: Date, default: Date.now }
});

favoriteToolSchema.index({ userId: 1, toolId: 1 }, { unique: true });

module.exports = mongoose.model('FavoriteTool', favoriteToolSchema);
