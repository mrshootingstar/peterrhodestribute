interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface AdminEmailConfig {
  adminEmails: string[];
  resendApiKey: string;
}

/**
 * Parse admin emails from environment variable
 * Supports single email or comma-separated list
 */
export function parseAdminEmails(adminEmailString: string): string[] {
  if (!adminEmailString) return [];
  
  return adminEmailString
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
}

/**
 * Get admin email configuration from environment
 */
export function getAdminEmailConfig(): AdminEmailConfig {
  const env = process.env as any;
  const adminEmailString = env.ADMIN_EMAIL || '';
  const resendApiKey = env.RESEND_API_KEY || '';
  
  return {
    adminEmails: parseAdminEmails(adminEmailString),
    resendApiKey
  };
}

/**
 * Send email using Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const config = getAdminEmailConfig();
  
  if (!config.resendApiKey) {
    return { success: false, error: 'Resend API key not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || 'noreply@yourdomain.com', // You'll need to replace with your verified domain
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { success: false, error: `Resend API error: ${errorData}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to send email: ${error}` };
  }
}

/**
 * Send email to all configured admin emails
 */
export async function sendEmailToAdmins(subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  const config = getAdminEmailConfig();
  
  if (config.adminEmails.length === 0) {
    return { success: false, error: 'No admin emails configured' };
  }
  
  return sendEmail({
    to: config.adminEmails,
    subject,
    html
  });
}

/**
 * Generate HTML email template for tribute submission notification
 */
export function generateTributeNotificationEmail(tribute: {
  name: string;
  message: string;
  email?: string;
  phone?: string;
  image_url?: string;
  created_at: string;
}): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Tribute Submission</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #3b82f6;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f8fafc;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }
        .tribute-details {
          background-color: white;
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
        }
        .label {
          font-weight: bold;
          color: #475569;
        }
        .message {
          background-color: #f1f5f9;
          padding: 15px;
          border-left: 4px solid #3b82f6;
          margin: 10px 0;
          border-radius: 4px;
        }
        .footer {
          background-color: #1e293b;
          color: white;
          padding: 15px;
          text-align: center;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Tribute Submission</h1>
        <p>A new tribute has been submitted for Peter Frederick Rhodes</p>
      </div>
      
      <div class="content">
        <div class="tribute-details">
          <p><span class="label">Submitted by:</span> ${tribute.name}</p>
          <p><span class="label">Date:</span> ${formatDate(tribute.created_at)}</p>
          ${tribute.email ? `<p><span class="label">Email:</span> ${tribute.email}</p>` : ''}
          ${tribute.phone ? `<p><span class="label">Phone:</span> ${tribute.phone}</p>` : ''}
          ${tribute.image_url ? `<p><span class="label">Image:</span> <a href="${tribute.image_url}" target="_blank">View Image</a></p>` : ''}
        </div>
        
        <div class="message">
          <p><span class="label">Message:</span></p>
          <div>${tribute.message.replace(/\n/g, '<br>')}</div>
        </div>
        
        <p style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/admin/dashboard" class="button">
            Review in Admin Dashboard
          </a>
        </p>
      </div>
      
      <div class="footer">
        <p>This tribute is pending your review and approval.</p>
        <p>Please log in to the admin dashboard to approve or reject this submission.</p>
      </div>
    </body>
    </html>
  `;
} 