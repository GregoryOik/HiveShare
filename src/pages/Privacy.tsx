import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-hive-bg flex flex-col selection:bg-honey selection:text-[#2A1B0A]">
      <header className="border-b border-honey/20 bg-hive-bg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-honey hover:text-[#2A1B0A] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-16 flex-1 mb-20">
        <h1 className="font-display text-4xl md:text-5xl text-honey mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-sm leading-relaxed text-[#2A1B0A]/70">
          <p className="mb-4 text-[#2A1B0A]/80">
            This Privacy Policy explains how HiveShare (operated by Petros Oikonomakos, sole proprietor) collects, uses, stores, and protects your personal information. We are committed to ensuring your privacy is protected in full compliance with the <strong>General Data Protection Regulation (EU) 2016/679 (GDPR)</strong> and Greek Law 4624/2019.
          </p>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">1. Data Controller</h2>
            <p className="mb-2 text-[#2A1B0A]/80">The data controller responsible for your personal data is:</p>
            <p className="text-[#2A1B0A]/80">
              <strong>Petros Oikonomakos</strong> (trading as HiveShare)<br/>
              Sparta, Laconia, 23100, Greece<br/>
              Email: <a href="mailto:gregory@oikonomakos.gr" className="text-honey hover:underline">gregory@oikonomakos.gr</a><br/>
              Website: <a href="https://oikonomakos.gr" className="text-honey hover:underline">oikonomakos.gr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">2. Information We Collect</h2>
            <p className="mb-2 text-[#2A1B0A]/80">We collect the following categories of personal data:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#2A1B0A]/80">
              <li><strong>Identity Data:</strong> Full name, display name, custom jar label.</li>
              <li><strong>Contact Data:</strong> Email address and physical shipping address.</li>
              <li><strong>Authentication Data:</strong> Google account ID or hashed password (we never store plaintext passwords).</li>
              <li><strong>Financial Data:</strong> Payment details are processed securely by <strong>Stripe, Inc.</strong> — we do not store your full credit card number, CVC, or bank details on our servers.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies (see Section 7).</li>
              <li><strong>Usage Data:</strong> Apiary journal interaction data, login timestamps, and feature usage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">3. Legal Basis for Processing (Article 6 GDPR)</h2>
            <p className="mb-2 text-[#2A1B0A]/80">We process your personal data on the following legal grounds:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#2A1B0A]/80">
              <li><strong>Contract Performance (Art. 6(1)(b)):</strong> To fulfil your subscription, assign your hive, deliver honey, and provide apiary journal access.</li>
              <li><strong>Legitimate Interest (Art. 6(1)(f)):</strong> To improve our service, prevent fraud, and ensure platform security.</li>
              <li><strong>Consent (Art. 6(1)(a)):</strong> For marketing communications and non-essential cookies. You may withdraw consent at any time.</li>
              <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> To comply with tax, accounting, and consumer protection laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">4. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-[#2A1B0A]/80">
              <li>To create and manage your HiveShare account.</li>
              <li>To assign you a hive and provide real-time apiary journal data.</li>
              <li>To process subscription payments via Stripe.</li>
              <li>To ship your seasonal honey harvests to your address.</li>
              <li>To send transactional emails (harvest notifications, subscription confirmations).</li>
              <li>To send marketing communications <strong>only if you have opted in</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">5. Third-Party Processors</h2>
            <p className="mb-2 text-[#2A1B0A]/80">We share your data only with trusted third parties necessary to operate our service, each bound by data processing agreements:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#2A1B0A]/80">
              <li><strong>Google / Firebase (USA):</strong> Authentication, database hosting, and cloud functions. Data transfers to the USA are covered by EU-US Data Privacy Framework.</li>
              <li><strong>Stripe, Inc. (USA):</strong> Payment processing and subscription billing. Stripe is PCI-DSS Level 1 certified.</li>
              <li><strong>Shipping Partners (EU):</strong> Name and address shared solely for honey delivery purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">6. Data Retention</h2>
            <p className="mb-2 text-[#2A1B0A]/80">We retain your personal data only as long as necessary:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#2A1B0A]/80">
              <li><strong>Account data:</strong> Retained for the duration of your account. Deleted within 30 days of account deletion request.</li>
              <li><strong>Transaction records:</strong> Retained for 7 years to comply with Greek tax law (Presidential Decree 186/1992).</li>
              <li><strong>Marketing preferences:</strong> Retained until you withdraw consent.</li>
              <li><strong>Server logs:</strong> Automatically deleted after 90 days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">7. Cookies</h2>
            <p className="mb-2 text-[#2A1B0A]/80">We use the following types of cookies:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#2A1B0A]/80">
              <li><strong>Essential Cookies:</strong> Required for authentication and remembering your session. These cannot be disabled.</li>
              <li><strong>Preference Cookies:</strong> Store your cookie consent choice and display settings.</li>
              <li><strong>Analytics Cookies (optional):</strong> Help us understand how visitors use our site. Only active if you select "Accept All" in our cookie banner.</li>
            </ul>
            <p className="mt-2 text-[#2A1B0A]/80">You can manage your cookie preferences at any time by clearing your browser data. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">8. Your Rights Under GDPR</h2>
            <p className="mb-2 text-[#2A1B0A]/80">As a data subject in the EU, you have the following rights:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#2A1B0A]/80">
              <li><strong>Right of Access (Art. 15):</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification (Art. 16):</strong> Correct any inaccurate data via your Settings page or by contacting us.</li>
              <li><strong>Right to Erasure (Art. 17):</strong> Request deletion of your account and all associated data ("Right to be Forgotten").</li>
              <li><strong>Right to Data Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Right to Restrict Processing (Art. 18):</strong> Limit how we use your data in certain circumstances.</li>
              <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interest.</li>
              <li><strong>Right to Withdraw Consent:</strong> For marketing communications, withdraw at any time via the "unsubscribe" link or your account settings.</li>
            </ul>
            <p className="mt-4 text-[#2A1B0A]/80">
              To exercise any of these rights, email us at <strong><a href="mailto:gregory@oikonomakos.gr" className="text-honey hover:underline">gregory@oikonomakos.gr</a></strong>. We will respond within 30 days as required by GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">9. Children's Privacy</h2>
            <p className="mb-2 text-[#2A1B0A]/80">
              Our service is not directed at children under 16 years of age. We do not knowingly collect personal data from minors. If we become aware that we have collected data from a child under 16 without parental consent, we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">10. Supervisory Authority</h2>
            <p className="mb-2 text-[#2A1B0A]/80">
              If you believe your data protection rights have been violated, you have the right to lodge a complaint with the <strong>Hellenic Data Protection Authority (HDPA)</strong>:
            </p>
            <p className="text-[#2A1B0A]/80">
              Hellenic Data Protection Authority<br/>
              Kifissias 1-3, 115 23 Athens, Greece<br/>
              Tel: +30 210 6475600<br/>
              Website: <a href="https://www.dpa.gr" className="text-honey hover:underline" target="_blank" rel="noopener noreferrer">www.dpa.gr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-[#2A1B0A] mb-4">11. Contact</h2>
            <p className="text-[#2A1B0A]/80">
              For any questions about this Privacy Policy or to exercise your data rights:<br/><br/>
              HiveShare (Petros Oikonomakos)<br/>
              Sparta, Laconia, 23100, Greece<br/>
              <a href="mailto:gregory@oikonomakos.gr" className="text-honey hover:underline">gregory@oikonomakos.gr</a>
            </p>
          </section>

          <div className="pt-8 border-t border-honey/20 text-xs text-[#2A1B0A]/40">
            Last updated: March 2026
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
