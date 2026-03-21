import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#1A1208] text-white/80 font-body selection:bg-honey selection:text-white pb-20">
      <header className="border-b border-honey/20 bg-[#1A1208] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <a href="https://oikonomakos.gr/" className="flex items-center gap-2 text-honey hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-medium">Back to Home</span>
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-16">
        <h1 className="font-display text-4xl md:text-5xl text-honey mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="text-xl font-display text-white mb-4">1. Information We Collect</h2>
            <p>
              When you use HiveShare, we collect information you provide directly to us, such as when you create an account, subscribe to a hive, or communicate with us. This may include your name, email address, shipping address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, offers, and events offered by HiveShare.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">3. Information Sharing</h2>
            <p>
              We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., payment processors, shipping partners). We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">5. Your Choices</h2>
            <p>
              You may update, correct, or delete your account information at any time by logging into your account or contacting us. You may also opt out of receiving promotional communications from us by following the instructions in those communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@hiveshare.example.com.
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
