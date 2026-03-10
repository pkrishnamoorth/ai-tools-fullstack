const express = require('express');
const auth = require('../middleware/auth');
const ToolHistory = require('../models/ToolHistory');
const router = express.Router();

// Log tool usage
router.post('/use', auth, async (req, res) => {
  try {
    const { toolId, toolName, category, input, output } = req.body;
    const history = new ToolHistory({
      userId: req.userId,
      toolId, toolName, category, input, output
    });
    await history.save();
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get tool usage stats
router.get('/stats', auth, async (req, res) => {
  try {
    const totalUsage = await ToolHistory.countDocuments({ userId: req.userId });
    const recentTools = await ToolHistory.find({ userId: req.userId })
      .sort({ usedAt: -1 }).limit(10);
    const categoryStats = await ToolHistory.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ totalUsage, recentTools, categoryStats });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
