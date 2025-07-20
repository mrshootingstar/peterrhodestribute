import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const env = process.env as any;
    
    if (!env.DB) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    // Get approved tributes ordered by creation date (most recent first)
    const result = await env.DB.prepare(`
      SELECT id, name, message, image_url, created_at, approved_at
      FROM tributes 
      WHERE approved = true 
      ORDER BY created_at DESC
    `).all();

    return NextResponse.json({
      tributes: result.results || []
    });

  } catch (error) {
    console.error('Error fetching approved tributes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tributes' },
      { status: 500 }
    );
  }
} 