import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const env = process.env as any;
    const adminPasswordHash = env.TRIBUTE_ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      return NextResponse.json(
        { error: 'Admin authentication not configured' },
        { status: 500 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, adminPasswordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO admin_sessions (id, expires_at)
        VALUES (?, ?)
      `).bind(sessionId, expiresAt.toISOString()).run();
    }

    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
    });

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 