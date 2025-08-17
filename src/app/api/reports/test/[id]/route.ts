import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    return NextResponse.json({
      success: true,
      message: 'Test route working',
      id: id,
      url: request.url
    });
    
  } catch (error: any) {
    console.error('Test route error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}