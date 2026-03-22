import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export default function Terms() {
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
        <h1 className="font-display text-4xl md:text-5xl text-honey mb-8">Terms and Conditions</h1>
        
        <div className="space-y-12 text-sm leading-relaxed text-[#2A1B0A]/70">
          
          <section>
            <h2 className="text-2xl font-display text-[#2A1B0A] mb-6 border-b border-honey/20 pb-2">HIVESHARE SUBSCRIPTION AGREEMENT</h2>
            <p className="mb-4 text-[#2A1B0A]/80">
              <strong>Between:</strong> HiveShare (Petros Oikonomakos, sole proprietor), Sparta, Laconia, 23100, Greece<br/>
              <strong>VAT:</strong> [To be added upon registration]<br/>
              <strong>And:</strong> The Subscriber (as identified at registration)
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">1. SUBSCRIPTION PERIOD</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              This agreement commences on the date of payment and runs for 12 consecutive months. The subscription covers one full agricultural season including all scheduled harvests within that period.
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">2. PRICING & PLANS</h3>
            <div className="mb-4 text-[#2A1B0A]/80 space-y-2">
              <p><strong>Starter Membership:</strong> €80/year — Includes shared hive adoption, live apiary journal access, 2.5kg annual honey allocation (3 seasonal harvests).</p>
              <p><strong>Premium Membership:</strong> €200/year — Everything in Starter plus exclusive hive, named jar labels, Digital Certificate of Adoption, detailed live vitality reports (temperature, acoustic data), a handwritten note from the beekeeper, and 5kg annual honey allocation (1kg welcome jar + 3 seasonal harvests).</p>
              <p>All prices include VAT where applicable. Free EU shipping is included in every membership. Non-EU shipping may incur additional fees communicated before purchase.</p>
            </div>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">3. AUTOMATIC RENEWAL</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              The subscription renews automatically for a further 12-month period unless the Subscriber cancels at least 14 days before the renewal date. The Subscriber will receive a renewal reminder by email 30 days before the renewal date. Renewal pricing may be updated with 30 days' notice.
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">4. RIGHT OF CANCELLATION (EU Consumer Rights Directive 2011/83/EU)</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              The Subscriber has the right to withdraw from this contract within <strong>14 calendar days</strong> of purchase without giving any reason, in accordance with Articles 9–16 of EU Directive 2011/83/EU.
            </p>
            <p className="mb-4 text-[#2A1B0A]/80 font-medium">
              Important: If the Welcome Honey Jar has already been shipped before the withdrawal request, the Subscriber agrees that the cost of the honey and shipping (approximately €25) will be deducted from the refund, as permitted under Article 14(3) of the Directive.
            </p>
            <p className="mb-4 text-[#2A1B0A]/80">
              After 14 days, the subscription is non-refundable as the hive assignment and agricultural cycle require upfront commitment. To cancel renewal, the Subscriber may do so at any time via email to <a href="mailto:gregory@oikonomakos.gr" className="text-honey hover:underline">gregory@oikonomakos.gr</a> or through their apiary journal under Settings.
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">5. MODEL WITHDRAWAL FORM</h3>
            <div className="bg-[#0D0903] border border-honey/10 p-4 rounded-[2px] mb-4">
              <p className="mb-2 text-[#2A1B0A]/50 text-xs italic">
                (Complete and return this form only if you wish to withdraw from the contract)
              </p>
              <p className="text-[#2A1B0A]/60 text-xs leading-relaxed">
                To: HiveShare (Petros Oikonomakos), Sparta, Laconia, 23100, Greece — <a href="mailto:gregory@oikonomakos.gr" className="text-honey hover:underline">gregory@oikonomakos.gr</a><br/><br/>
                I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the provision of the following service: HiveShare Subscription<br/><br/>
                Ordered on (*) / received on (*):<br/>
                Name of consumer(s):<br/>
                Address of consumer(s):<br/>
                Signature of consumer(s) (only if this form is notified on paper):<br/>
                Date:<br/><br/>
                (*) Delete as appropriate.
              </p>
            </div>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">6. HONEY DELIVERY</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              HiveShare commits to three seasonal harvests per 12-month subscription period. Starter members receive approximately 800g per harvest (2.5kg total). Premium members receive approximately 1.3kg per harvest (5kg total), plus a 1kg Welcome Jar shipped upon subscription.
            </p>
            <p className="mb-4 text-[#2A1B0A]/80 italic">
              Exact weights may vary ±20% depending on seasonal yield. In low-yield years, HiveShare guarantees a minimum of 2kg (Starter) or 4kg (Premium) total delivery, or will issue a proportional credit toward the following season. Shipping is included for EU countries. Delivery typically takes 5–10 business days. The Subscriber will be notified by email before each shipment.
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">7. HIVE ASSIGNMENT</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              Each subscriber is assigned a specific numbered hive within the HiveShare apiary in Laconia, Greece. The subscriber does not acquire ownership of the physical hive, bees, or land. The subscription grants access to hive monitoring data and honey yield from the assigned hive for the duration of the agreement.
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">8. APIARY JOURNAL ACCESS</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              Subscribers receive access to the HiveShare member portal throughout their subscription period, including live sensor data, apiary snapshots, and harvest notifications. Access terminates upon expiry or cancellation of the subscription. The Subscriber acknowledges that sensor data is provided "as is" and may contain inaccuracies due to hardware limitations.
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">9. FORCE MAJEURE</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              HiveShare is not liable for yield reduction or delivery delays caused by extreme weather, colony disease, natural disasters, pandemics, or circumstances beyond reasonable control. In such cases, HiveShare will communicate transparently and offer credit or partial refund at its discretion.
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">10. LIABILITY LIMITATION</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              HiveShare's total liability under this agreement shall not exceed the total subscription fee paid by the Subscriber in the relevant year. This limitation does not affect statutory consumer rights that cannot be excluded under EU or Greek law.
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">11. GOVERNING LAW & DISPUTE RESOLUTION</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              This agreement is governed by <strong>Greek law</strong> and subject to <strong>EU consumer protection regulations</strong>. Any disputes shall be submitted to the competent courts of Sparta, Greece, without prejudice to mandatory consumer protection provisions that may grant jurisdiction to the courts of the Subscriber's place of residence.
            </p>
            <p className="mb-4 text-[#2A1B0A]/80">
              <strong>Online Dispute Resolution:</strong> The European Commission provides an Online Dispute Resolution (ODR) platform for consumers at:{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-honey hover:underline">
                https://ec.europa.eu/consumers/odr
              </a>
            </p>

            <h3 className="text-lg font-display text-[#2A1B0A] mt-6 mb-2">12. CONTACT</h3>
            <p className="mb-4 text-[#2A1B0A]/80">
              HiveShare (Petros Oikonomakos)<br/>
              Sparta, Laconia, 23100, Greece<br/>
              <a href="mailto:gregory@oikonomakos.gr" className="text-honey hover:underline">gregory@oikonomakos.gr</a><br/>
              <a href="https://oikonomakos.gr" className="text-honey hover:underline">www.oikonomakos.gr</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-[#2A1B0A] mb-6 border-b border-honey/20 pb-2">WEBSITE TERMS OF USE</h2>
            <p className="mb-4 text-[#2A1B0A]/80">
              By accessing and using the HiveShare website and apiary journal, you agree to comply with these general rules of use. The platform is provided for personal, non-commercial use to monitor your assigned hive.
            </p>
            <p className="mb-4 text-[#2A1B0A]/80">
              <strong>Intellectual Property:</strong> All content on this website, including logos, text, images, and software, is the property of HiveShare and protected by copyright law. Reproduction without permission is prohibited.
            </p>
            <p className="mb-4 text-[#2A1B0A]/80 text-italic">
              <strong>Disclaimer:</strong> The information provided on the apiary journal, including weight estimates, weather forecasts, and harvest predictions, are approximations based on sensor data and historical patterns. They do not constitute a binding guarantee of final honey yield. Beekeeping is subject to natural fluctuations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-[#2A1B0A] mb-6 border-b border-honey/20 pb-2">RETURN & REFUND POLICY</h2>
            <p className="mb-4 text-[#2A1B0A]/80">
              <strong>14-Day Cooling-Off Period:</strong> You may cancel your subscription within 14 days of purchase for a full refund, minus the cost of any honey already shipped (approx. €25). See Section 4 above.
            </p>
            <p className="mb-4 text-[#2A1B0A]/80">
              <strong>After 14 Days:</strong> The HiveShare subscription includes immediate access to a digital tracking experience and the reservation of agricultural resources. Therefore, once the initial 14-day cancellation period has passed, the subscription is <strong>non-refundable</strong>. Partial refunds are only issued in exceptional cases (e.g., total apiary failure) at our sole discretion.
            </p>
            <p className="mb-4 text-[#2A1B0A]/80">
              <strong>Damaged Deliveries:</strong> As honey is a perishable food product, we cannot accept returns of delivered honey jars for health and safety reasons. If your honey arrives damaged, broken, or there is a demonstrable issue with the delivery or product quality, please contact us within 7 days of receipt with photographic evidence, and we will arrange a replacement or proportional credit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-[#2A1B0A] mb-6 border-b border-honey/20 pb-2">DATA PROTECTION</h2>
            <p className="mb-4 text-[#2A1B0A]/80">
              Your personal data is processed in accordance with our <Link to="/privacy" className="text-honey hover:underline">Privacy Policy</Link>, which complies with the General Data Protection Regulation (EU) 2016/679. By using our services, you acknowledge that you have read and understood our Privacy Policy.
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
