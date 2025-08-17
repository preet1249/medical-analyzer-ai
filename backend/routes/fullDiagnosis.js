const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    server: {},
    environment: {},
    mongodb: {},
    auth: {},
    models: {},
    errors: []
  };

  try {
    // 1. Server Environment Check
    console.log('=== FULL DIAGNOSIS STARTED ===');
    
    diagnosis.server = {
      nodeVersion: process.version,
      platform: process.platform,
      port: process.env.PORT || 'default',
      currentUrl: req.originalUrl,
      headers: req.headers
    };

    // 2. Environment Variables Check
    diagnosis.environment = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
      FRONTEND_URL: process.env.FRONTEND_URL,
      mongoUriFormat: process.env.MONGODB_URI ? 'mongodb+srv://***' : 'missing'
    };

    // 3. MongoDB Connection Test
    try {
      console.log('Testing MongoDB connection...');
      
      const connectDB = require('../lib/mongodb');
      await connectDB();
      
      diagnosis.mongodb = {
        connected: mongoose.connection.readyState === 1,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        models: Object.keys(mongoose.models),
        ping: null
      };

      // Test database operations
      if (mongoose.connection.db) {
        const adminDB = mongoose.connection.db.admin();
        const dbStats = await adminDB.ping();
        diagnosis.mongodb.ping = dbStats;
      }

    } catch (mongoError) {
      diagnosis.mongodb = {
        error: mongoError.message,
        connected: false
      };
      diagnosis.errors.push(`MongoDB: ${mongoError.message}`);
    }

    // 4. Auth Token Check
    const authHeader = req.headers.authorization;
    const authCookie = req.cookies['auth-token'];
    
    diagnosis.auth = {
      hasAuthHeader: !!authHeader,
      hasAuthCookie: !!authCookie,
      authHeaderFormat: authHeader ? authHeader.substring(0, 20) + '...' : 'none',
      cookieValue: authCookie ? authCookie.substring(0, 20) + '...' : 'none'
    };

    // 5. Models Test
    try {
      const User = require('../models/User');
      const Report = require('../models/Report');
      
      diagnosis.models = {
        userModelLoaded: !!User,
        reportModelLoaded: !!Report,
        userSchema: !!User.schema,
        reportSchema: !!Report.schema
      };

      // Test model operations if connected
      if (mongoose.connection.readyState === 1) {
        const userCount = await User.countDocuments();
        const reportCount = await Report.countDocuments();
        
        diagnosis.models.userCount = userCount;
        diagnosis.models.reportCount = reportCount;
      }

    } catch (modelError) {
      diagnosis.models = {
        error: modelError.message
      };
      diagnosis.errors.push(`Models: ${modelError.message}`);
    }

    // 6. API Routes Test
    try {
      // Test if we can create a simple ObjectId
      const testId = new mongoose.Types.ObjectId();
      diagnosis.models.objectIdTest = {
        created: testId.toString(),
        valid: mongoose.Types.ObjectId.isValid(testId.toString())
      };
    } catch (objectIdError) {
      diagnosis.errors.push(`ObjectId: ${objectIdError.message}`);
    }

    console.log('=== DIAGNOSIS COMPLETE ===');
    console.log('Errors found:', diagnosis.errors.length);
    
    res.json({
      success: diagnosis.errors.length === 0,
      diagnosis,
      summary: {
        status: diagnosis.errors.length === 0 ? 'HEALTHY' : 'ISSUES_FOUND',
        errorCount: diagnosis.errors.length,
        criticalIssues: diagnosis.errors
      }
    });

  } catch (error) {
    console.error('Diagnosis failed:', error);
    
    res.status(500).json({
      success: false,
      diagnosis,
      fatalError: {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      }
    });
  }
});

module.exports = router;