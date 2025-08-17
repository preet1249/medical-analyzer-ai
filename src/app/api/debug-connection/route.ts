import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG CONNECTION TEST ===');
    
    // Test 1: Check environment variables
    console.log('1. Environment check:');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Test 2: Check authentication
    console.log('2. Authentication check:');
    const user = getUserFromRequest(request);
    console.log('User from request:', user ? `${user.name} (${user.userId})` : 'None');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No authentication found',
        debug: {
          hasAuthHeader: !!request.headers.get('authorization'),
          hasCookie: !!request.cookies.get('auth-token'),
          cookieValue: request.cookies.get('auth-token')?.value?.substring(0, 20) + '...'
        }
      });
    }
    
    // Test 3: MongoDB connection
    console.log('3. MongoDB connection test:');
    await connectDB();
    console.log('MongoDB connected successfully');
    
    // Test 4: Check database collections
    console.log('4. Database collections check:');
    const userCount = await User.countDocuments();
    const reportCount = await Report.countDocuments();
    console.log(`Users in DB: ${userCount}`);
    console.log(`Reports in DB: ${reportCount}`);
    
    // Test 5: Check user's reports
    console.log('5. User reports check:');
    const userReports = await Report.find({ userId: user.userId }).limit(5);
    console.log(`User's reports: ${userReports.length}`);
    
    // Test 6: Check ObjectId validity
    console.log('6. ObjectId test:');
    const testId = '68a1c8ac11bf5cde17bd149d';
    console.log(`Testing ID: ${testId}`);
    console.log(`Is valid ObjectId: ${mongoose.Types.ObjectId.isValid(testId)}`);
    
    if (mongoose.Types.ObjectId.isValid(testId)) {
      const testReport = await Report.findById(testId);
      console.log(`Test report exists: ${!!testReport}`);
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        user: user,
        database: {
          userCount,
          reportCount,
          userReports: userReports.length,
          userReportIds: userReports.map(r => r._id.toString())
        },
        mongodb: {
          connected: mongoose.connection.readyState === 1,
          state: mongoose.connection.readyState
        }
      }
    });
    
  } catch (error: any) {
    console.error('=== DEBUG ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      type: error.constructor.name
    }, { status: 500 });
  }
}