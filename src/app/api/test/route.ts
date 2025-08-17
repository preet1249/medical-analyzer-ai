import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Test API called');
    
    const user = getUserFromRequest(request);
    console.log('User from request:', user);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        testData: {
          hasAuthHeader: !!request.headers.get('authorization'),
          hasCookie: !!request.cookies.get('auth-token'),
          cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]))
        }
      }, { status: 401 });
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected, fetching reports...');
    
    const reports = await Report.find({ userId: user.userId }).limit(5);
    console.log('Found reports:', reports.length);
    
    return NextResponse.json({
      success: true,
      data: {
        user,
        reportsCount: reports.length,
        reports: reports.map(r => ({
          id: r._id.toString(),
          title: r.title,
          createdAt: r.createdAt
        }))
      }
    });
    
  } catch (error: any) {
    console.error('Test API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}