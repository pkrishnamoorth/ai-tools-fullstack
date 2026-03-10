const express = require('express');
const auth = require('../middleware/auth');
const FavoriteTool = require('../models/FavoriteTool');
const router = express.Router();

// Get favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await FavoriteTool.find({ userId: req.userId }).sort({ addedAt: -1 });
    res.json({ favorites });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Add favorite
router.post('/', auth, async (req, res) => {
  try {
    const { toolId, toolName, category } = req.body;
    const existing = await FavoriteTool.findOne({ userId: req.userId, toolId });
    if (existing) return res.status(400).json({ error: 'Already favorited.' });
    const fav = new FavoriteTool({ userId: req.userId, toolId, toolName, category });
    await fav.save();
    res.json({ favorite: fav });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Remove favorite
router.delete('/:toolId', auth, async (req, res) => {
  try {
    await FavoriteTool.findOneAndDelete({ userId: req.userId, toolId: req.params.toolId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
