import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
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
        <h1 className="font-display text-4xl md:text-5xl text-honey mb-8">Terms and Conditions</h1>
        
        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="text-xl font-display text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using HiveShare ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">2. Description of Service</h2>
            <p>
              HiveShare provides a platform for users to virtually adopt beehives, monitor their telemetry data (including weight, temperature, and humidity), and receive a portion of the honey harvested from the adopted hive.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">3. Agricultural Risks and Yields</h2>
            <p>
              Beekeeping is an agricultural practice subject to natural variables including weather, disease, and environmental factors. 
              <strong> You acknowledge that honey yields are estimates, not guarantees.</strong> In the event of a poor harvest or hive failure, HiveShare will make reasonable efforts to provide honey from a reserve or an alternate hive, but cannot guarantee the exact quantity or floral source originally estimated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">4. Subscriptions and Payments</h2>
            <p>
              Subscriptions are billed on an annual basis. Payments are non-refundable once the harvest season has commenced. You may cancel your subscription for the following year at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">5. Data Accuracy</h2>
            <p>
              While we strive to provide accurate real-time telemetry from our hives, sensor malfunctions or connectivity issues may occasionally result in inaccurate or delayed data. HiveShare is not liable for any discrepancies in the data provided on the dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">6. Limitation of Liability</h2>
            <p>
              HiveShare shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display text-white mb-4">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through a notice on the platform.
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
