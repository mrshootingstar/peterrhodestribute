import { NextRequest, NextResponse } from 'next/server';
import { sendEmailToAdmins, generateTributeNotificationEmail } from '../../utils/email';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const anonymous = formData.get('anonymous') === 'true';
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // If not anonymous, name is required
    if (!anonymous && !name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required when not submitting anonymously' },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Validate file size (10MB max)
      if (imageFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image file size must be less than 10MB' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPG and PNG files are allowed.' },
          { status: 400 }
        );
      }

      try {
        // Upload to CloudFlare R2
        const env = process.env as any;
        if (env.IMAGES) {
          const filename = `tribute-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${imageFile.type.split('/')[1]}`;
          const arrayBuffer = await imageFile.arrayBuffer();
          
          await env.IMAGES.put(filename, arrayBuffer, {
            httpMetadata: {
              contentType: imageFile.type,
            },
          });
          
          imageUrl = `/api/images/${filename}`;
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Save to database
    try {
      const env = process.env as any;
      if (env.DB) {
        const result = await env.DB.prepare(`
          INSERT INTO tributes (name, message, email, phone, image_url, approved)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          anonymous ? 'Anonymous' : name,
          message,
          email || null,
          phone || null,
          imageUrl,
          false // Requires admin approval
        ).run();

        // Send email notification to admins
        const tribute = {
          name: anonymous ? 'Anonymous' : name,
          message,
          email: email || undefined,
          phone: phone || undefined,
          image_url: imageUrl || undefined,
          created_at: new Date().toISOString()
        };

        try {
          const emailResult = await sendEmailToAdmins(
            `New Tribute Submission from ${tribute.name}`,
            generateTributeNotificationEmail(tribute)
          );

          if (!emailResult.success) {
            console.error('Failed to send admin notification email:', emailResult.error);
            // Don't fail the tribute submission if email fails
          }
        } catch (emailError) {
          console.error('Error sending admin notification email:', emailError);
          // Don't fail the tribute submission if email fails
        }

        return NextResponse.json({
          success: true,
          id: result.meta.last_row_id,
          message: 'Tribute submitted successfully and pending approval'
        });
      } else {
        throw new Error('Database not available');
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save tribute' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing tribute submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 