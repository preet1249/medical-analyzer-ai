import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  const diagnosis: any = {
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
      currentUrl: request.url,
      headers: Object.fromEntries(request.headers.entries())
    };

    // 2. Environment Variables Check
    diagnosis.environment = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      mongoUriFormat: process.env.MONGODB_URI ? 'mongodb+srv://***' : 'missing'
    };

    // 3. MongoDB Connection Test
    try {
      console.log('Testing MongoDB connection...');
      
      // Test basic connection
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!, {
          serverSelectionTimeoutMS: 5000
        });
      }
      
      diagnosis.mongodb = {
        connected: mongoose.connection.readyState === 1,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        models: Object.keys(mongoose.models),
        ping: null as any
      };

      // Test database operations
      if (mongoose.connection.db) {
        const adminDB = mongoose.connection.db.admin();
        const dbStats = await adminDB.ping();
        diagnosis.mongodb.ping = dbStats;
      }

    } catch (mongoError: any) {
      diagnosis.mongodb = {
        error: mongoError.message,
        connected: false
      };
      diagnosis.errors.push(`MongoDB: ${mongoError.message}`);
    }

    // 4. Auth Token Check
    const authHeader = request.headers.get('authorization');
    const authCookie = request.cookies.get('auth-token');
    
    diagnosis.auth = {
      hasAuthHeader: !!authHeader,
      hasAuthCookie: !!authCookie,
      authHeaderFormat: authHeader ? authHeader.substring(0, 20) + '...' : 'none',
      cookieValue: authCookie ? authCookie.value.substring(0, 20) + '...' : 'none'
    };

    // 5. Models Test
    try {
      // Dynamic import to test models
      const { default: User } = await import('@/models/User');
      const { default: Report } = await import('@/models/Report');
      
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

    } catch (modelError: any) {
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
    } catch (objectIdError: any) {
      diagnosis.errors.push(`ObjectId: ${objectIdError.message}`);
    }

    console.log('=== DIAGNOSIS COMPLETE ===');
    console.log('Errors found:', diagnosis.errors.length);
    
    return NextResponse.json({
      success: diagnosis.errors.length === 0,
      diagnosis,
      summary: {
        status: diagnosis.errors.length === 0 ? 'HEALTHY' : 'ISSUES_FOUND',
        errorCount: diagnosis.errors.length,
        criticalIssues: diagnosis.errors
      }
    });

  } catch (error: any) {
    console.error('Diagnosis failed:', error);
    
    return NextResponse.json({
      success: false,
      diagnosis,
      fatalError: {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      }
    }, { status: 500 });
  }
}