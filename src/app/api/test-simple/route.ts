import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Simple test API called');
    
    return NextResponse.json({
      success: true,
      message: 'Simple API working',
      timestamp: new Date().toISOString(),
      url: request.url
    });
    
  } catch (error: any) {
    console.error('Simple test API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}