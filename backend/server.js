const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://medical-report-analyzer-d26v.vercel.app',
    'https://medical-report-analyzes.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/full-diagnosis', require('./routes/fullDiagnosis'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medical Report Analyzer API is running' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Medical Report Analyzer API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      reports: '/api/reports',
      upload: '/api/upload',
      analyze: '/api/analyze',
      diagnosis: '/api/full-diagnosis'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});