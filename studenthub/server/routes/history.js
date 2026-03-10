const express = require('express');
const auth = require('../middleware/auth');
const ToolHistory = require('../models/ToolHistory');
const AIChat = require('../models/AIChat');
const router = express.Router();

// Get all history
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const toolHistory = await ToolHistory.find({ userId: req.userId })
      .sort({ usedAt: -1 }).limit(limit);
    const chatHistory = await AIChat.find({ userId: req.userId })
      .select('title toolContext createdAt updatedAt')
      .sort({ updatedAt: -1 }).limit(20);
    res.json({ toolHistory, chatHistory });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Clear history
router.delete('/clear', auth, async (req, res) => {
  try {
    await ToolHistory.deleteMany({ userId: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
