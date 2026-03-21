import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#1A1208] text-white/80 font-body selection:bg-honey selection:text-white pb-20">
      <header className="border-b border-honey/20 bg-[#1A1208] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-honey hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-16">
        <h1 className="font-display text-4xl md:text-5xl text-honey mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <p className="mb-4">
            This Privacy Policy explains how HiveShare (Petros Oikonomakos) collects, uses, and protects your personal information. We are committed to ensuring your privacy is protected and compliant with the General Data Protection Regulation (GDPR).
          </p>

          <section>
            <h2 className="text-xl font-display text-white mb-4">1. Information We Collect</h2>
            <p className="mb-2">We collect the following types of information when you use our service:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Contact Information:</strong> Name, email address, and shipping address.</li>
              <li><strong>Payment Information:</strong> Processed securely via Stripe (we do not store your full credit card details).</li>
              <li><strong>Usage Data:</strong> Information about how you interact with the HiveShare dashboard.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">2. Why We Use Your Information</h2>
            <p className="mb-2">Your data is used strictly for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide access to the HiveShare dashboard and your assigned hive's data.</li>
              <li>To process your subscription payments and deliver your honey harvests.</li>
              <li>To send you important updates regarding your hive, harvests, and subscription status.</li>
              <li>To send commercial communications (only if you have explicitly opted in).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">3. Third-Party Services</h2>
            <p className="mb-2">We share your data only with trusted third parties necessary to operate our service:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Google / Firebase:</strong> For user authentication, database hosting, and dashboard functionality.</li>
              <li><strong>Stripe:</strong> For secure payment processing and subscription management.</li>
              <li><strong>Shipping Partners:</strong> To deliver your honey shipments.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">4. Your GDPR Rights & Data Deletion</h2>
            <p className="mb-2">Under the GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of any inaccurate data.</li>
              <li>Request the deletion of your personal data ("Right to be Forgotten").</li>
              <li>Withdraw your consent for marketing communications at any time (via the "unsubscribe" link in our emails).</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, or to request the complete deletion of your account and associated data, please contact us at <strong>gregory@oikonomakos.gr</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at:<br/><br/>
              HiveShare (Petros Oikonomakos)<br/>
              Sparta, Laconia, Greece<br/>
              gregory@oikonomakos.gr
            </p>
          </section>

          <div className="pt-8 border-t border-honey/20 text-xs text-white/40">
            Last updated: March 2026
          </div>
        </div>
      </main>
    </div>
  );
}
