const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const toolRoutes = require('./routes/tools');
const aiRoutes = require('./routes/ai');
const pdfRoutes = require('./routes/pdf');
const imageRoutes = require('./routes/image');
const historyRoutes = require('./routes/history');
const favoriteRoutes = require('./routes/favorites');

const app = express();

// Trust proxy for hosting environments
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://studenthub-live.vercel.app', // Example prod URL
  'https://studenthub-live.netlify.app' // Example prod URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

console.log('⏳ Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Atlas connection failed:', err.message);
    console.log('ℹ️  If using Atlas, ensure your current IP address is whitelisted in Network Access (0.0.0.0/0 for all IPs).');
    console.log('🔄 Fallback: Connecting to Local MongoDB Database (mongodb://127.0.0.1:27017/studenthub)...');
    
    mongoose.connect('mongodb://127.0.0.1:27017/studenthub', {
      serverSelectionTimeoutMS: 5000
    })
    .then(() => {
      console.log('✅ Connected to Local MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (Local DB)`);
      });
    })
    .catch((localErr) => {
      console.error('❌ Local MongoDB connection also failed:', localErr.message);
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (Offline Mode)`);
      });
    });
  });

// Handle connection drops
mongoose.connection.on('error', err => {
  console.error('📡 MongoDB Connection Error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB Disconnected');
});

module.exports = app;

