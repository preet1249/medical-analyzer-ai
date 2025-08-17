import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    console.log('User from request:', user);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
        debug: {
          cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])),
          headers: Object.fromEntries(request.headers.entries())
        }
      }, { status: 401 });
    }

    await connectDB();
    
    const allReports = await Report.find({}).select('_id userId title').limit(10);
    const userReports = await Report.find({ userId: user.userId });
    
    return NextResponse.json({
      success: true,
      debug: {
        user,
        totalReports: allReports.length,
        userReports: userReports.length,
        allReports,
        userReportsData: userReports
      }
    });
    
  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}