const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const aiChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Chat' },
  messages: [messageSchema],
  toolContext: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

aiChatSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('AIChat', aiChatSchema);
