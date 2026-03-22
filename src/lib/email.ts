const FORMSPREE_ID = 'xbdzbpyn'; // From previous hero form

export interface EmailData {
  to: string;
  subject: string;
  message: string;
  type: 'welcome' | 'assignment' | 'marketing';
  customerName?: string;
  hiveId?: string;
}

export async function sendEmail(data: EmailData) {
  console.log(`[EmailService] Sending ${data.type} email to ${data.to}...`);
  
  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: data.to,
        _subject: data.subject,
        message: data.message,
        type: data.type,
        customerName: data.customerName || 'Explorer',
        hiveId: data.hiveId || 'Pending',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email through Formspree');
    }

    console.log(`[EmailService] ${data.type} email sent successfully.`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Error sending ${data.type} email:`, error);
    return false;
  }
}

export const emailTemplates = {
  welcome: (email: string) => ({
    to: email,
    subject: 'Welcome to the Hive! 🐝',
    type: 'welcome' as const,
    message: `Welcome to HiveShare! We're so glad you've joined our mission to protect bees in Laconia, Greece.\n\nNext Steps:\n1. Choose your membership tier.\n2. We'll assign you a specific hive.\n3. Track your bees live from your dashboard.\n\nHappy sharing!`
  }),
  assignment: (email: string, hiveId: string) => ({
    to: email,
    subject: `Hive Assigned: Meet Hive #${hiveId}! 🍯`,
    type: 'assignment' as const,
    hiveId,
    message: `Great news! You have been officially assigned to Hive #${hiveId}.\n\nYour bees are hard at work, and you can now see their live weight and temperature data in your dashboard. Your Welcome Jar will be prepared and shipped within the next 2 weeks.\n\nView Your Hive: https://oikonomakos.gr/dashboard`
  })
};
