import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function validateAdminSession() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('admin_session')?.value;

  if (!sessionId) {
    return false;
  }

  const env = process.env as any;
  if (!env.DB) {
    return false;
  }

  // Check if session exists and is not expired
  const result = await env.DB.prepare(`
    SELECT id FROM admin_sessions 
    WHERE id = ? AND expires_at > datetime('now')
  `).bind(sessionId).first();

  return !!result;
}

export async function GET(request: NextRequest) {
  try {
    // Validate admin session
    const isValidAdmin = await validateAdminSession();
    if (!isValidAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const env = process.env as any;
    if (!env.DB) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    // Get all tributes (pending and approved)
    const result = await env.DB.prepare(`
      SELECT id, name, message, email, phone, image_url, approved, created_at, approved_at, admin_notes
      FROM tributes 
      ORDER BY created_at DESC
    `).all();

    return NextResponse.json({
      tributes: result.results || []
    });

  } catch (error) {
    console.error('Error fetching admin tributes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tributes' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Validate admin session
    const isValidAdmin = await validateAdminSession();
    if (!isValidAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, approved, admin_notes } = await request.json();

    if (!id || typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const env = process.env as any;
    if (!env.DB) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    // Update tribute approval status
    const now = new Date().toISOString();
    await env.DB.prepare(`
      UPDATE tributes 
      SET approved = ?, approved_at = ?, admin_notes = ?
      WHERE id = ?
    `).bind(approved, approved ? now : null, admin_notes || null, id).run();

    return NextResponse.json({
      success: true,
      message: `Tribute ${approved ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Error updating tribute status:', error);
    return NextResponse.json(
      { error: 'Failed to update tribute' },
      { status: 500 }
    );
  }
} 