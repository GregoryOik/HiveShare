# Stripe Webhook Setup Guide

To automate your "Proper site" and have users upgraded to **Subscriber** status immediately after payment, you need to deploy a "Logic Bridge" (Firebase Cloud Function) that listens to Stripe.

### 1. Requirements
- You must have the [Firebase CLI](https://firebase.google.com/docs/cli) installed.
- Your Firebase project must be on the **Blaze (Pay-as-you-go)** plan to use Cloud Functions.

### 2. Implementation Logic
The code for this bridge is already provided in your project root as `stripe-webhook-function.txt`. It performs these steps:
1. Recepts the success event from Stripe.
2. Finds an available hive (status: `available`).
3. Updates the user's role to `subscriber`.
4. Links the Hive ID to that user record.
5. Marks the hive as `assigned`.

### 3. How to Deploy
1. Open your terminal in the `hiveshare` folder.
2. Initialize functions: `firebase init functions`.
3. Select "TypeScript".
4. Copy the code from `stripe-webhook-function.txt` into `functions/src/index.ts`.
5. Install dependencies: `cd functions && npm install stripe firebase-admin firebase-functions`.
6. Set your secrets:
   ```bash
   firebase functions:secrets:set STRIPE_SECRET_KEY=sk_test_...
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET=whsec_...
   ```
7. Deploy: `firebase deploy --only functions`.

### 4. Link Stripe to your new URL
1. Go to your [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks).
2. Add an endpoint pointing to your newly deployed Firebase Function URL (e.g., `https://us-central1-hiveshare-e87a2.cloudfunctions.net/handleStripeWebhook`).
3. Select the event: `checkout.session.completed`.

**Once this is active, your site will operate like a fully automated business!**
In the meantime, I have added a **"Role"** selector in your **Admin Central Station** so you can manually upgrade users who pay while you are setting up the automation.
