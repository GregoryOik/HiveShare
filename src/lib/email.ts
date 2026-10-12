import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  type: 'welcome' | 'assignment' | 'order_confirmation' | 'order_alert' | 'shipping_update' | 'custom_note';
}

const ADMIN_EMAIL = 'gregorygate46@gmail.com';

export async function sendEmail(data: EmailData): Promise<boolean> {
  console.log(`[EmailService] Dispatching ${data.type} notification to ${data.to}...`);

  try {
    if (db) {
      await addDoc(collection(db, 'mail'), {
        to: data.to,
        message: {
          subject: data.subject,
          html: data.html,
        },
        type: data.type,
        timestamp: new Date().toISOString(),
      });
      console.log(`[EmailService] ${data.type} email queued in Firestore 'mail' collection.`);
    } else {
      console.log(`[EmailService Dev] Mock email delivered to ${data.to}: ${data.subject}`);
    }
    return true;
  } catch (error) {
    console.error(`[EmailService] Error queueing ${data.type} email:`, error);
    // Don't fail the user flow if mail queue encounters permission error in dev
    return false;
  }
}

// ─── Automated Email Templates ────────────────────────────────────────────────
export const emailTemplates = {
  // 1. Welcome Guardian after membership adoption
  welcome: (email: string, name: string, tier: string = 'Starter Guardianship', hiveId?: string) => ({
    to: email,
    subject: `🐝 GUARDIAN CONFIRMED: Welcome to the Mani Apiary, ${name}`,
    type: 'welcome' as const,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1208; background-color: #FFFDF7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #C8860A25;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-family: Georgia, serif; font-style: italic; font-size: 34px; color: #1A1208; margin: 0;">Hive<span style="color: #C8860A;">Share</span></h1>
          <p style="text-transform: uppercase; letter-spacing: 0.35em; font-size: 9px; font-weight: bold; color: #C8860A; margin-top: 6px;">Petros Oikonomakos Apiaries · Laconia, Greece</p>
        </div>

        <div style="background: #ffffff; padding: 35px; border-radius: 2px; border: 1px solid #C8860A15; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
          <h2 style="font-family: Georgia, serif; font-size: 24px; color: #1A1208; margin-top: 0;">Welcome, Guardian ${name}</h2>
          <p style="font-size: 14px; line-height: 1.7; color: #2A1B0A; opacity: 0.85;">
            Your sponsorship has been confirmed for <strong>${tier}</strong>. You are now officially connected to a living colony of bees on the sun-baked mountain slopes of Mani, Peloponnese.
          </p>

          <div style="margin: 25px 0; padding: 20px; background: #FFFDF5; border-left: 3px solid #C8860A;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: bold; color: #C8860A; text-transform: uppercase; letter-spacing: 0.2em;">Guardianship Summary:</p>
            <ul style="font-size: 13px; color: #2A1B0A; margin: 0; padding-left: 18px; line-height: 1.9;">
              <li><strong>Tier:</strong> ${tier}</li>
              <li><strong>Allocated Colony:</strong> ${hiveId ? `Hive #${hiveId}` : 'Sector Assignment Pending (within 24h)'}</li>
              <li><strong>Welcome Harvest:</strong> Shipped in protective glass within 2 weeks</li>
              <li><strong>Annual Harvests:</strong> 3 seasonal deliveries (Spring, Summer, Autumn)</li>
            </ul>
          </div>

          <a href="https://oikonomakos.gr/dashboard" style="display: block; text-align: center; background: #1A1208; color: #C8860A; padding: 18px 0; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.25em; margin: 30px 0; border-radius: 2px;">
            Access Live Apiary Journal →
          </a>

          <p style="font-size: 12px; color: #2A1B0A; opacity: 0.7; text-align: center; font-style: italic; margin-top: 25px; border-top: 1px solid #C8860A15; padding-top: 20px;">
            "Single-Origin Traceability. Unadulterated Purity. Ethical Nomadic Beekeeping."
          </p>
        </div>
      </div>
    `,
  }),

  // Colony Assignment notification
  assignment: (email: string, hiveId: string, region: string = 'Mani, Peloponnese') => ({
    to: email,
    subject: `📍 COLONY ASSIGNED: Your bees are active at Hive #${hiveId} (${region})`,
    type: 'assignment' as const,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1208; background-color: #FFFDF7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #C8860A25;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-family: Georgia, serif; font-style: italic; font-size: 34px; color: #1A1208; margin: 0;">Hive<span style="color: #C8860A;">Share</span></h1>
          <p style="text-transform: uppercase; letter-spacing: 0.35em; font-size: 9px; font-weight: bold; color: #C8860A; margin-top: 6px;">Apiary Colony Assignment Confirmation</p>
        </div>

        <div style="background: #ffffff; padding: 35px; border-radius: 2px; border: 1px solid #C8860A15;">
          <h2 style="font-family: Georgia, serif; font-size: 24px; color: #1A1208; margin-top: 0;">Hive #${hiveId} Assigned to You</h2>
          <p style="font-size: 14px; line-height: 1.7; color: #2A1B0A; opacity: 0.85;">
            Master beekeeper Petros has assigned your guardianship to <strong>Hive #${hiveId}</strong> in the ${region} mountain apiary.
          </p>

          <div style="margin: 25px 0; padding: 20px; background: #FFFDF5; border-left: 3px solid #C8860A;">
            <p style="margin: 0; font-size: 10px; font-weight: bold; color: #C8860A; text-transform: uppercase;">Colony Overview:</p>
            <ul style="font-size: 13px; color: #2A1B0A; margin: 8px 0 0 0; padding-left: 18px; line-height: 1.8;">
              <li><strong>Hive ID:</strong> ${hiveId}</li>
              <li><strong>Location:</strong> ${region}</li>
              <li><strong>Flora:</strong> Wild Thyme, Mountain Sage & Conifer Forest</li>
              <li><strong>Telemetry:</strong> Live IoT telemetry active in your dashboard</li>
            </ul>
          </div>

          <a href="https://oikonomakos.gr/dashboard" style="display: block; text-align: center; background: #1A1208; color: #C8860A; padding: 16px 0; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.25em; margin: 25px 0; border-radius: 2px;">
            Open Live Colony Telemetry →
          </a>
        </div>
      </div>
    `,
  }),

  // 2. Alert to Gregory when a new guardian joins
  adminNewGuardianAlert: (clientName: string, clientEmail: string, tier: string, address: string) => ({
    to: ADMIN_EMAIL,
    subject: `🚨 NEW GUARDIAN ADOPTION: ${clientName} (${tier})`,
    type: 'order_alert' as const,
    html: `
      <div style="font-family: sans-serif; color: #111; max-width: 550px; padding: 20px; border: 2px solid #C8860A;">
        <h2 style="color: #C8860A; margin-top: 0;">New Guardian Joined HiveShare!</h2>
        <p><strong>Name:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Tier:</strong> ${tier}</p>
        <p><strong>Shipping Address:</strong> ${address || 'Pending entry'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <a href="https://oikonomakos.gr/admin" style="display: inline-block; background: #111; color: #C8860A; padding: 10px 18px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase;">
          Open Admin CRM →
        </a>
      </div>
    `,
  }),

  // 3. Direct Jar Order Confirmation (to customer)
  jarOrderConfirmation: (orderRef: string, customerName: string, customerEmail: string, itemsDescription: string, total: number, address: string) => ({
    to: customerEmail,
    subject: `🍯 ORDER CONFIRMED [${orderRef}]: Petros is preparing your Greek Honey`,
    type: 'order_confirmation' as const,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1208; background-color: #FFFDF7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #C8860A25;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-family: Georgia, serif; font-style: italic; font-size: 34px; color: #1A1208; margin: 0;">Hive<span style="color: #C8860A;">Share</span></h1>
          <p style="text-transform: uppercase; letter-spacing: 0.35em; font-size: 9px; font-weight: bold; color: #C8860A; margin-top: 6px;">Single-Batch Honey Order Confirmation</p>
        </div>

        <div style="background: #ffffff; padding: 35px; border-radius: 2px; border: 1px solid #C8860A15;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #C8860A15; padding-bottom: 15px; margin-bottom: 20px;">
            <span style="font-size: 11px; font-family: monospace; color: #C8860A; font-weight: bold;">ORDER REF: ${orderRef}</span>
            <span style="font-size: 11px; color: #2A1B0A; opacity: 0.5;">${new Date().toLocaleDateString()}</span>
          </div>

          <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1A1208; margin-top: 0;">Thank you, ${customerName}</h2>
          <p style="font-size: 14px; line-height: 1.7; color: #2A1B0A; opacity: 0.85;">
            Your order has been registered at our apiary facility in Laconia, Greece. Petros will carefully bottle and package your selection in protective padded glass within 3–5 business days.
          </p>

          <div style="margin: 25px 0; padding: 20px; background: #FFFDF5; border-left: 3px solid #C8860A;">
            <p style="margin: 0 0 10px 0; font-size: 10px; font-weight: bold; color: #C8860A; text-transform: uppercase;">Order Items:</p>
            <p style="font-size: 14px; color: #2A1B0A; font-weight: bold; margin: 0 0 10px 0;">${itemsDescription}</p>
            <p style="font-size: 12px; color: #2A1B0A; margin: 0;"><strong>Shipping Destination:</strong> ${address}</p>
            <p style="font-size: 14px; color: #1A1208; font-weight: bold; margin: 15px 0 0 0; padding-top: 10px; border-top: 1px dashed #C8860A30;">
              Total Order Amount: €${total}.00
            </p>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #2A1B0A; opacity: 0.8;">
            As soon as the courier scans your package, you will receive an automatic dispatch notification with your tracking link.
          </p>

          <div style="text-align: center; margin-top: 30px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #C8860A;">
            Questions? Contact: info@oikonomakos.gr
          </div>
        </div>
      </div>
    `,
  }),

  // 4. Alert to Gregory when a new jar order is placed
  adminNewJarOrderAlert: (orderRef: string, customerName: string, customerEmail: string, items: string, total: number, address: string) => ({
    to: ADMIN_EMAIL,
    subject: `📦 NEW HONEY JAR ORDER: [${orderRef}] - €${total}`,
    type: 'order_alert' as const,
    html: `
      <div style="font-family: sans-serif; color: #111; max-width: 550px; padding: 20px; border: 2px solid #C8860A;">
        <h2 style="color: #C8860A; margin-top: 0;">New Single Jar Order Received!</h2>
        <p><strong>Order Reference:</strong> ${orderRef}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Items:</strong> ${items}</p>
        <p><strong>Total Value:</strong> €${total}.00</p>
        <p><strong>Courier Address:</strong> ${address}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <a href="https://oikonomakos.gr/admin" style="display: inline-block; background: #111; color: #C8860A; padding: 10px 18px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase;">
          Fulfill in Admin CRM →
        </a>
      </div>
    `,
  }),

  // 5. Automatic Status Update (Harvest Packed / Dispatched / Delivered)
  harvestStatusUpdated: (customerEmail: string, customerName: string, status: 'PACKED' | 'DISPATCHED' | 'DELIVERED', trackingCode?: string, carrier?: string) => {
    const statusTitles = {
      PACKED: '🏺 Your Raw Honey Harvest Has Been Packed in Glass!',
      DISPATCHED: '🚚 DISPATCHED: Your Greek Honey is on its way to you!',
      DELIVERED: '✨ Delivered: Enjoy your harvest from the Mani mountains!',
    };

    const statusDescriptions = {
      PACKED: 'Petros has extracted and hand-poured your raw honey into numbered jars at our Sparta extraction facility. It is currently being prepped for courier pickup.',
      DISPATCHED: `Your harvest package has been handed to ${carrier || 'our European courier'} and is en route to your shipping address.`,
      DELIVERED: 'Your honey package has been marked as delivered. We hope every spoonful brings you the golden warmth of the Laconian sun.',
    };

    return {
      to: customerEmail,
      subject: statusTitles[status] || `Harvest Status Updated: ${status}`,
      type: 'shipping_update' as const,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1208; background-color: #FFFDF7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #C8860A25;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: Georgia, serif; font-style: italic; font-size: 34px; color: #1A1208; margin: 0;">Hive<span style="color: #C8860A;">Share</span></h1>
            <p style="text-transform: uppercase; letter-spacing: 0.35em; font-size: 9px; font-weight: bold; color: #C8860A; margin-top: 6px;">Harvest Fulfillment Dispatch</p>
          </div>

          <div style="background: #ffffff; padding: 35px; border-radius: 2px; border: 1px solid #C8860A15;">
            <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1A1208; margin-top: 0;">Hello ${customerName},</h2>
            <p style="font-size: 14px; line-height: 1.7; color: #2A1B0A; opacity: 0.85;">
              ${statusDescriptions[status]}
            </p>

            <div style="margin: 25px 0; padding: 20px; background: #FFFDF5; border-left: 3px solid #C8860A;">
              <p style="margin: 0; font-size: 10px; font-weight: bold; color: #C8860A; text-transform: uppercase; letter-spacing: 0.15em;">Fulfillment Status:</p>
              <p style="font-size: 18px; color: #1A1208; font-weight: bold; margin: 5px 0 10px 0;">${status}</p>
              ${trackingCode ? `
                <p style="font-size: 13px; color: #2A1B0A; margin: 0;"><strong>Tracking Number:</strong> <span style="font-family: monospace; background: #eee; padding: 2px 6px;">${trackingCode}</span></p>
                <p style="font-size: 12px; color: #2A1B0A; margin: 5px 0 0 0;"><strong>Carrier:</strong> ${carrier || 'European Express Courier'}</p>
              ` : ''}
            </div>

            <p style="font-size: 13px; color: #2A1B0A; opacity: 0.8; line-height: 1.6;">
              Thank you for guarding the heritage bees of Mani with us.
            </p>

            <div style="text-align: center; margin-top: 30px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #C8860A;">
              Petros Oikonomakos Apiaries · Lagia, Mani
            </div>
          </div>
        </div>
      `,
    };
  },

  // 6. Direct Personal Email from Gregory
  customAdminMessage: (to: string, clientName: string, subject: string, message: string) => ({
    to,
    subject: `🐝 ${subject}`,
    type: 'custom_note' as const,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1208; background-color: #FFFDF7; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #C8860A25;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="font-family: Georgia, serif; font-style: italic; font-size: 30px; color: #1A1208; margin: 0;">Hive<span style="color: #C8860A;">Share</span></h1>
          <p style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 8px; font-weight: bold; color: #C8860A; margin-top: 5px;">A Message from the Apiary</p>
        </div>

        <div style="background: #ffffff; padding: 30px; border-radius: 2px; border: 1px solid #C8860A15;">
          <h3 style="font-family: Georgia, serif; font-size: 20px; margin-top: 0;">Dear ${clientName},</h3>
          <div style="font-size: 14px; line-height: 1.8; color: #2A1B0A; opacity: 0.9; white-space: pre-line;">
            ${message}
          </div>
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 11px; color: #888;">
            Sent by Gregory & Petros Oikonomakos · HiveShare Greece
          </div>
        </div>
      </div>
    `,
  }),
};
