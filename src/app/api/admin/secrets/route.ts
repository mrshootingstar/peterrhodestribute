import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

async function validateAdminSession() {
  const cookieStore = await cookies();
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

    // Debug logging
    console.log('Debug - Environment variables check:');
    console.log('ADMIN_EMAIL exists:', !!env.ADMIN_EMAIL);
    console.log('FROM_EMAIL exists:', !!env.FROM_EMAIL);
    console.log('RESEND_API_KEY exists:', !!env.RESEND_API_KEY);

    const response = {
      resendApiKey: env.RESEND_API_KEY ? '******' + env.RESEND_API_KEY.slice(-4) : 'Not Set',
      adminEmail: env.ADMIN_EMAIL || 'Not Set',
      fromEmail: env.FROM_EMAIL || 'Not Set'
    };

    console.log('Debug - API response:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching admin secrets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch secrets' },
      { status: 500 }
    );
  }
} 