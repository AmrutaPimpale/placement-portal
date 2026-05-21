const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database (optional — app works without it using frontend dummy data)
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.log('No MONGODB_URI set. Running without database — frontend will use dummy data fallback.');
}

const app = express();

// Body parser
app.use(express.json());

// Enable CORS for all origins (Vercel deployment support)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/admin', require('./routes/admin'));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Campus Placement Portal API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

// Listen only if running locally (not in serverless environment)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
