import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminNotificationEmails, getSenderEmailAddress } from '../../../utils/email';

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

    const systemConfig = {
      resendApiKey: env.RESEND_API_KEY ? '******' + env.RESEND_API_KEY.slice(-4) : 'Not Set',
      adminEmail: getAdminNotificationEmails(),
      fromEmail: getSenderEmailAddress()
    };

    return NextResponse.json(systemConfig);

  } catch (error) {
    console.error('Error fetching admin secrets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch secrets' },
      { status: 500 }
    );
  }
} 