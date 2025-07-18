import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const env = process.env as any;

    if (!env.IMAGES) {
      return NextResponse.json(
        { error: 'Image storage not available' },
        { status: 500 }
      );
    }

    // Get image from R2
    const object = await env.IMAGES.get(filename);

    if (!object) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Return the image with appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    return new NextResponse(object.body, {
      headers,
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
} 