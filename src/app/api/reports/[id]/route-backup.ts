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
    console.log('=== BACKUP Report API Called ===');
    console.log('Full URL:', request.url);
    console.log('Params received:', params);
    
    const { id } = params;
    console.log('Report ID from params:', id);
    
    // Basic validation
    if (!id) {
      console.log('No ID provided');
      return NextResponse.json(
        { success: false, error: 'No report ID provided' },
        { status: 400 }
      );
    }
    
    // Check authentication
    const user = getUserFromRequest(request);
    console.log('User check:', user ? `Found: ${user.name}` : 'Not found');
    
    if (!user) {
      console.log('Authentication failed - returning 401');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId:', id);
      return NextResponse.json(
        { success: false, error: 'Invalid report ID format' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected');

    // Find report
    console.log('Searching for report...');
    const report = await Report.findOne({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId: user.userId 
    });

    console.log('Report search result:', !!report);

    if (!report) {
      console.log('Report not found');
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    console.log('Report found successfully');
    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error: any) {
    console.error('=== BACKUP API ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
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