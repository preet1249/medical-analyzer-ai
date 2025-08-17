import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== Report API Called ===');
    console.log('Full URL:', request.url);
    console.log('Params received:', params);
    
    const { id } = params;
    
    console.log('Report ID extracted:', id);
    
    // Basic validation
    if (!id) {
      console.log('ERROR: No ID provided');
      return NextResponse.json(
        { success: false, error: 'No report ID provided' },
        { status: 400 }
      );
    }
    
    // Check authentication
    console.log('Checking authentication...');
    const user = getUserFromRequest(request);
    console.log('Authenticated user:', user ? `${user.name} (${user.userId})` : 'None');
    
    if (!user) {
      console.log('Authentication failed');
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login again' },
        { status: 401 }
      );
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid report ID format' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Find the report
    console.log('Searching for report...');
    const report = await Report.findOne({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId: user.userId 
    });

    if (!report) {
      console.log('Report not found for user, checking if it exists for any user...');
      const anyReport = await Report.findById(id);
      console.log('Report exists for any user:', !!anyReport);
      
      if (anyReport) {
        console.log('Report belongs to different user');
        return NextResponse.json(
          { success: false, error: 'Report not found or access denied' },
          { status: 404 }
        );
      } else {
        console.log('Report does not exist at all');
        return NextResponse.json(
          { success: false, error: 'Report not found' },
          { status: 404 }
        );
      }
    }

    console.log('Report found successfully:', report.title);
    
    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error: any) {
    console.error('=== API Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}