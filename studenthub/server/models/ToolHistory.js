const mongoose = require('mongoose');

const toolHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toolId: { type: String, required: true },
  toolName: { type: String, required: true },
  category: { type: String, required: true },
  input: { type: mongoose.Schema.Types.Mixed },
  output: { type: mongoose.Schema.Types.Mixed },
  usedAt: { type: Date, default: Date.now }
});

toolHistorySchema.index({ userId: 1, usedAt: -1 });

module.exports = mongoose.model('ToolHistory', toolHistorySchema);
