import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface EmailSystemConfig {
  adminEmails: string[];
  resendApiKey: string;
}

/**
 * Validate and sanitize a single email address
 */
function validateAndSanitizeEmail(email: string): string | null {
  if (!email || typeof email !== 'string') return null;
  
  // Trim and normalize
  const trimmedEmail = email.trim().toLowerCase();
  
  // Validate email format
  if (!validator.isEmail(trimmedEmail)) {
    console.warn(`Invalid email format: ${email}`);
    return null;
  }
  
  // Additional length check
  if (trimmedEmail.length > 254) {
    console.warn(`Email too long: ${email}`);
    return null;
  }
  
  return trimmedEmail;
}

/**
 * Parse admin emails from environment variable
 * Supports single email or comma-separated list
 * Validates and sanitizes all emails
 */
export function parseAdminEmails(adminEmailString: string): string[] {
  if (!adminEmailString) return [];
  
  return adminEmailString
    .split(',')
    .map(email => validateAndSanitizeEmail(email))
    .filter((email): email is string => email !== null);
}

// Configuration - UPDATE THESE WITH YOUR ACTUAL EMAIL ADDRESSES
const ADMIN_NOTIFICATION_EMAILS = 'admin@yourdomain.com'; // Who receives notifications (comma-separated for multiple)
const SENDER_EMAIL_ADDRESS = 'noreply@yourdomain.com'; // Must be verified in Resend

/**
 * Get the admin notification emails (for use in other modules)
 */
export function getAdminNotificationEmails(): string {
  return ADMIN_NOTIFICATION_EMAILS;
}

/**
 * Get the sender email address (for use in other modules)
 */
export function getSenderEmailAddress(): string {
  return SENDER_EMAIL_ADDRESS;
}

/**
 * Get admin email configuration
 */
export function getAdminEmailConfig(): EmailSystemConfig {
  const env = process.env as any;
  const resendApiKey = env.RESEND_API_KEY || '';
  
  return {
    adminEmails: parseAdminEmails(ADMIN_NOTIFICATION_EMAILS),
    resendApiKey
  };
}

/**
 * Get the configured sender email address
 */
export function getSenderEmail(): string {
  return SENDER_EMAIL_ADDRESS;
}

/**
 * Sanitize email content
 */
function sanitizeEmailContent(html: string): string {
  // Sanitize HTML content while preserving email-safe elements
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'div', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'ul', 'ol', 'li', 'span', 'table', 'tr', 'td', 'th', 'tbody', 'thead'],
    ALLOWED_ATTR: ['href', 'target', 'style', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });
}

/**
 * Send email using Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const config = getAdminEmailConfig();
  
  if (!config.resendApiKey) {
    return { success: false, error: 'Resend API key not configured' };
  }

  // Validate and sanitize email addresses
  const toEmails = Array.isArray(options.to) ? options.to : [options.to];
  const sanitizedToEmails = toEmails
    .map(email => validateAndSanitizeEmail(email))
    .filter((email): email is string => email !== null);

  if (sanitizedToEmails.length === 0) {
    return { success: false, error: 'No valid recipient email addresses' };
  }

  // Sanitize subject and HTML content
  const sanitizedSubject = validator.escape(options.subject.substring(0, 998)); // Email subject length limit
  const sanitizedHtml = sanitizeEmailContent(options.html);

  // Validate sender email if provided
  let senderEmail = options.from || getSenderEmail();
  const sanitizedSenderEmail = validateAndSanitizeEmail(senderEmail);
  if (!sanitizedSenderEmail) {
    return { success: false, error: 'Invalid sender email address' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sanitizedSenderEmail,
        to: sanitizedToEmails,
        subject: sanitizedSubject,
        html: sanitizedHtml,
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

  // Sanitize all user-provided content
  const sanitizedTribute = {
    name: validator.escape(tribute.name.substring(0, 100)), // Limit name length
    message: validator.escape(tribute.message.substring(0, 5000)), // Limit message length
    email: tribute.email ? validator.escape(tribute.email.substring(0, 254)) : undefined,
    phone: tribute.phone ? validator.escape(tribute.phone.substring(0, 20)) : undefined,
    image_url: tribute.image_url ? validator.escape(tribute.image_url.substring(0, 500)) : undefined,
    created_at: tribute.created_at
  };

  // Validate image URL if provided
  if (sanitizedTribute.image_url && !validator.isURL(sanitizedTribute.image_url, { protocols: ['http', 'https'] })) {
    sanitizedTribute.image_url = undefined; // Remove invalid URLs
  }

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
          <p><span class="label">Submitted by:</span> ${sanitizedTribute.name}</p>
          <p><span class="label">Date:</span> ${formatDate(sanitizedTribute.created_at)}</p>
          ${sanitizedTribute.email ? `<p><span class="label">Email:</span> ${sanitizedTribute.email}</p>` : ''}
          ${sanitizedTribute.phone ? `<p><span class="label">Phone:</span> ${sanitizedTribute.phone}</p>` : ''}
          ${sanitizedTribute.image_url ? `<p><span class="label">Image:</span> <a href="${sanitizedTribute.image_url}" target="_blank">View Image</a></p>` : ''}
        </div>
        
        <div class="message">
          <p><span class="label">Message:</span></p>
          <div>${sanitizedTribute.message.replace(/\n/g, '<br>')}</div>
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