import { Resend } from 'resend';

interface Tribute {
  name: string;
  message: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
}

export async function sendTributeNotificationEmail(tribute: Tribute, env: any) {
  try {
    const resend = new Resend(env.RESEND_API_KEY);

    const recipientEmails = (env.TRIBUTE_NOTIFICATION_EMAILS || '').split(',').filter(Boolean);

    if (recipientEmails.length === 0) {
      console.log('No recipient emails configured. Skipping email notification.');
      return;
    }

    const subject = `New Tribute Submission from ${tribute.name}`;
    const body = `
      <h1>New Tribute Submission</h1>
      <p><strong>Name:</strong> ${tribute.name}</p>
      <p><strong>Message:</strong></p>
      <p>${tribute.message.replace(/\n/g, '<br>')}</p>
      ${tribute.email ? `<p><strong>Email:</strong> ${tribute.email}</p>` : ''}
      ${tribute.phone ? `<p><strong>Phone:</strong> ${tribute.phone}</p>` : ''}
      ${tribute.imageUrl ? `<p><strong>Image:</strong> <a href="${tribute.imageUrl}">${tribute.imageUrl}</a></p>` : ''}
      <br>
      <p>This email was sent because a new tribute was submitted on the website.</p>
    `;

    await resend.emails.send({
      from: 'tributes@noreply.peterrhodes.com',
      to: recipientEmails,
      subject: subject,
      html: body,
    });

    console.log('Tribute notification email sent successfully.');

  } catch (error) {
    console.error('Failed to send tribute notification email:', error);
  }
} 