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
  welcome: (email: string, name: string) => ({
    to: email,
    subject: `GUARDIAN_ACTIVATION: Welcome to the Mani Apiary Grid, ${name} 🐝`,
    type: 'welcome' as const,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; color: #1a1208; line-height: 1.8; background-color: #fdfaf3; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #c8860a20;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-family: serif; font-style: italic; font-weight: 300; font-size: 36px; color: #1a1208; margin: 0; letter-spacing: -0.02em;">Hive<span style="color: #c8860a;">Share</span></h1>
          <p style="text-transform: uppercase; letter-spacing: 0.4em; font-size: 9px; font-weight: 900; color: #c8860a; margin-top: 8px; opacity: 0.8;">Vertical Agritech · Laconia Division</p>
        </div>
        
        <div style="background: white; padding: 45px; border-radius: 2px; box-shadow: 0 20px 50px rgba(0,0,0,0.03); border: 1px solid #c8860a10;">
          <h2 style="font-family: serif; font-size: 26px; margin-bottom: 25px; color: #1a1208;">Greetings, Guardian ${name}</h2>
          <p style="font-size: 14px; color: #2a1b0a; opacity: 0.85;">
            Your identity has been successfully verified and linked to our nomadic apiary infrastructure. By joining HiveShare, you are directly supporting a mature colony of <em>Apis mellifera macedonica</em> in the rugged slopes of the Mani mountains.
          </p>
          
          <div style="margin: 35px 0; padding: 25px; border-left: 2px solid #c8860a; background: #fdfaf3; border-radius: 0 4px 4px 0;">
            <p style="margin: 0; font-size: 11px; font-weight: 900; color: #c8860a; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Operational Briefing:</p>
            <ul style="font-size: 13px; color: #2a1b0a; margin: 0; padding-left: 18px; line-height: 2;">
              <li><strong>Telemetry Link:</strong> Access real-time gravimetric data.</li>
              <li><strong>Biological Audit:</strong> View master beekeeper health logs.</li>
              <li><strong>Certification:</strong> Download your co-ownership credentials.</li>
            </ul>
          </div>

          <a href="https://oikonomakos.gr/dashboard" style="display: block; width: 100%; text-align: center; background: #1a1208; color: #c8860a; padding: 20px 0; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em; margin: 35px 0; border-radius: 2px;">Enter Command Journal</a>
          
          <p style="font-size: 11px; color: #2a1b0a60; text-align: center; font-style: italic; border-top: 1px solid #f0e6d2; pt: 25px;">
            "Single-Origin Traceability. Unadulterated Purity. Ethical Agriculture."
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; font-size: 9px; color: #1a120840; text-transform: uppercase; letter-spacing: 0.2em;">
          HiveShare Authority · Sparta Processing Facility · TRACES_REGISTERED_ESTABLISHMENT
        </div>
      </div>
    `
  }),
  assignment: (email: string, hiveId: string, sector: string) => ({
    to: email,
    subject: `DISPATCH: Hive #${hiveId} Successfully Linked [Sector: ${sector}] 🍯`,
    type: 'assignment' as const,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; color: #1a1208; line-height: 1.8; background-color: #fdfaf3; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #c8860a20;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-family: serif; font-style: italic; font-weight: 300; font-size: 36px; color: #1a1208; margin: 0; letter-spacing: -0.02em;">Hive<span style="color: #c8860a;">Share</span></h1>
          <p style="text-transform: uppercase; letter-spacing: 0.4em; font-size: 9px; font-weight: 900; color: #c8860a; margin-top: 8px; opacity: 0.8;">Apiary Assignment Confirmed</p>
        </div>
        
        <div style="background: white; padding: 45px; border-radius: 2px; border-top: 4px solid #1a1208; box-shadow: 0 20px 50px rgba(0,0,0,0.03);">
          <h2 style="font-family: serif; font-size: 26px; margin-bottom: 25px; color: #1a1208;">Unit Assignment: Sector ${sector}</h2>
          <p style="font-size: 14px; color: #2a1b0a; opacity: 0.85;">
            Synchronization is complete. Your account is now linked to the real-time telemetry stream of <strong>Hive #${hiveId}</strong>. Your bees are currently foraging on the high-altitude thyme blooms of the Taygetos range.
          </p>
          
          <div style="background: #1a1208; color: #c8860a; padding: 30px; margin: 35px 0; text-align: center; border-radius: 2px;">
             <span style="display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.4em; opacity: 0.7; margin-bottom: 15px; color: white;">Global Traceability ID</span>
             <span style="font-size: 36px; font-weight: 900; letter-spacing: 0.15em;">HIVE_#${hiveId}</span>
          </div>

          <p style="font-size: 13px; color: #2a1b0a; opacity: 0.8; margin-bottom: 35px;">
            Your first allocation of premium Greek honey (Spring Thyme, Summer Wildflower, or Autumn Pine) is being scheduled for processing at our Sparta facility.
          </p>

          <div style="text-align: center; space-y: 20px;">
            <a href="https://oikonomakos.gr/dashboard" style="display: block; background: #c8860a; color: white; padding: 20px 0; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.25em; border-radius: 2px; box-shadow: 0 10px 30px rgba(200,134,10,0.3);">Download Adoption Certificate</a>
            <p style="margin-top: 20px;">
              <a href="https://oikonomakos.gr/dashboard" style="color: #1a1208; text-decoration: none; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1.5px solid #c8860a;">Access Live Vitality Metrics →</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; font-size: 9px; color: #1a120840; text-transform: uppercase; letter-spacing: 0.2em;">
          ISO 22000 & HACCP CERTIFIED · SPARTA DIVISION · LACONIA
        </div>
      </div>
    `
  })
};
