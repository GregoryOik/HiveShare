import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  type: 'welcome' | 'assignment' | 'marketing';
}

export async function sendEmail(data: EmailData) {
  console.log(`[EmailService] Queueing ${data.type} email to ${data.to} via Firestore...`);
  
  try {
    // This assumes the "Trigger Email" Firebase Extension is installed
    // and configured to listen to the 'mail' collection.
    await addDoc(collection(db, 'mail'), {
      to: data.to,
      message: {
        subject: data.subject,
        html: data.html,
      },
      type: data.type,
      timestamp: new Date()
    });

    console.log(`[EmailService] ${data.type} email queued successfully.`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Error queueing ${data.type} email:`, error);
    return false;
  }
}

export const emailTemplates = {
  welcome: (email: string) => ({
    to: email,
    subject: 'Welcome to the Hive! 🐝',
    type: 'welcome' as const,
    html: `
      <div style="font-family: sans-serif; color: #1a1208; line-height: 1.6;">
        <h1 style="color: #c8860a;">Welcome to HiveShare!</h1>
        <p>We're so glad you've joined our mission to protect bees in Laconia, Greece.</p>
        <p><strong>What's next?</strong></p>
        <ul>
          <li>Choose your membership level</li>
          <li>We'll assign you a specific hive</li>
          <li>Track your bees live from your apiary journal</li>
        </ul>
        <p>Happy sharing!<br>— The HiveShare Team</p>
      </div>
    `
  }),
  assignment: (email: string, hiveId: string) => ({
    to: email,
    subject: `Hive Assigned: Meet Hive #${hiveId}! 🍯`,
    type: 'assignment' as const,
    html: `
      <div style="font-family: sans-serif; color: #1a1208; line-height: 1.6;">
        <h1 style="color: #c8860a;">You've Been Assigned!</h1>
        <p>Great news! You have been officially assigned to <strong>Hive #${hiveId}</strong>.</p>
        <p>Your bees are hard at work, and you can now see their live vitality reports in your apiary journal. Your Welcome Jar will be prepared and shipped within the next 2 weeks.</p>
        <a href="https://oikonomakos.gr/dashboard" style="display: inline-block; background: #c8860a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Visit My Apiary Journal</a>
        <p>Thank you for supporting sustainable beekeeping!</p>
      </div>
    `
  })
};
