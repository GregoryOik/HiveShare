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
        
        <div className="space-y-12 text-sm leading-relaxed text-white/70">
          
          <section>
            <h2 className="text-2xl font-display text-white mb-6 border-b border-honey/20 pb-2">HIVESHARE SUBSCRIPTION AGREEMENT</h2>
            <p className="mb-4">
              <strong>Between:</strong> HiveShare (Petros Oikonomakos), Sparta, Laconia, Greece<br/>
              <strong>And:</strong> The Subscriber (as identified at registration)
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">1. SUBSCRIPTION PERIOD</h3>
            <p className="mb-4">
              This agreement commences on the date of payment and runs for 12 consecutive months. The subscription covers one full agricultural season including all scheduled harvests within that period.
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">2. AUTOMATIC RENEWAL</h3>
            <p className="mb-4">
              The subscription renews automatically for a further 12-month period unless the Subscriber cancels at least 14 days before the renewal date. The Subscriber will receive a renewal reminder by email 30 days before the renewal date. Renewal pricing may be updated with 30 days' notice.
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">3. RIGHT OF CANCELLATION</h3>
            <p className="mb-4">
              The Subscriber may cancel within 14 days of initial purchase for a full refund, in accordance with EU Consumer Rights Directive 2011/83/EU. After 14 days, the subscription is non-refundable as the hive assignment and agricultural cycle require upfront commitment. To cancel renewal, the Subscriber may do so at any time via email to gregory@oikonomakos.gr or through their account dashboard.
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">4. HONEY DELIVERY</h3>
            <p className="mb-4">
              HiveShare commits to three seasonal harvests per 12-month subscription period, approximately 500g each.
            </p>
            <p className="mb-4">
              Total annual allocation: approximately 1.5kg across three shipments.<br/>
              Exact weights may vary ±20% depending on seasonal yield. In low-yield years, HiveShare guarantees a minimum of 1kg total delivery or will issue a proportional credit toward the following season.<br/>
              Shipping is included for Netherlands and Germany. Other EU countries may incur additional shipping costs notified at checkout.
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">5. HIVE ASSIGNMENT</h3>
            <p className="mb-4">
              Each subscriber is assigned a specific numbered hive within the HiveShare apiary in Laconia, Greece. The subscriber does not acquire ownership of the physical hive, bees, or land. The subscription grants access to hive monitoring data and honey yield from the assigned hive for the duration of the agreement.
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">6. DASHBOARD ACCESS</h3>
            <p className="mb-4">
              Subscribers receive access to the HiveShare member portal throughout their subscription period, including live sensor data, apiary snapshots, and harvest notifications. Access terminates upon expiry or cancellation of the subscription.
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">7. FORCE MAJEURE</h3>
            <p className="mb-4">
              HiveShare is not liable for yield reduction or delivery delays caused by extreme weather, colony disease, or circumstances beyond reasonable control. In such cases, HiveShare will communicate transparently and offer credit or partial refund at its discretion.
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">8. GOVERNING LAW</h3>
            <p className="mb-4">
              This agreement is governed by Greek law and subject to EU consumer protection regulations. Disputes may be referred to the European Online Dispute Resolution platform at ec.europa.eu/odr.
            </p>

            <h3 className="text-lg font-display text-white mt-6 mb-2">9. CONTACT</h3>
            <p className="mb-4">
              HiveShare · Sparta, Laconia, Greece<br/>
              gregory@oikonomakos.gr<br/>
              www.oikonomakos.gr
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-white mb-6 border-b border-honey/20 pb-2">WEBSITE TERMS OF USE</h2>
            <p className="mb-4">
              By accessing and using the HiveShare website and dashboard, you agree to comply with these general rules of use. The platform is provided for personal, non-commercial use to monitor your assigned hive.
            </p>
            <p className="mb-4">
              <strong>Disclaimer:</strong> The information provided on the dashboard, including weight estimates, weather forecasts, and harvest predictions, are approximations based on sensor data and historical patterns. They do not constitute a binding guarantee of final honey yield. Beekeeping is subject to natural fluctuations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-white mb-6 border-b border-honey/20 pb-2">RETURN & REFUND POLICY</h2>
            <p className="mb-4">
              <strong>Digital Experience & Subscription:</strong> The HiveShare subscription includes immediate access to a digital tracking experience and the reservation of agricultural resources. Therefore, once the initial 14-day cancellation period has passed, the subscription is <strong>non-refundable</strong>. Partial refunds are only issued in exceptional cases (e.g., total apiary failure) at our sole discretion.
            </p>
            <p className="mb-4">
              <strong>Honey Deliveries:</strong> As honey is a perishable food product, we cannot accept returns of delivered honey jars for health and safety reasons. If your honey arrives damaged, broken, or there is a demonstrable issue with the delivery or product quality, please contact us within 7 days of receipt with photographic evidence, and we will arrange a replacement or proportional credit.
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
