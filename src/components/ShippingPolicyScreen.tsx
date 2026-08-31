import { Truck, ArrowLeft, Mail, Clock, HelpCircle } from 'lucide-react';
import { ScreenType } from '../types';

interface LegalPageProps {
  setScreen: (screen: ScreenType) => void;
}

export default function ShippingPolicyScreen({ setScreen }: LegalPageProps) {
  return (
    <div id="hero" className="max-w-4xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-24 font-sans">
      
      {/* Back button */}
      <button 
        onClick={() => setScreen('home')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#7C8464] transition-colors mb-8 uppercase tracking-widest cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Header */}
      <div className="border-b border-stone-200 pb-8 mb-10 text-center md:text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7C8464]/10 text-[#7C8464] mb-4">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 leading-tight font-light mb-3">
          Shipping <span className="italic font-normal text-[#7C8464]">Policy</span>
        </h1>
        <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">
          Effective Date: July 17, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm md:text-base leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">1. Processing & Dispatch Timeline</h2>
          <p>
            At Bihar Bite, we pride ourselves on delivering the freshest batch of hand-graded waterlily seeds (makhana). To ensure unmatched quality and crunchiness:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All orders are processed and dispatched within <strong>24 to 48 business hours</strong> of receipt (excluding Sundays and national holidays).</li>
            <li>Orders placed before 12:00 PM are generally handed over to our logistic partners on the same business day.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">2. Shipping Charges & Free Eligibility</h2>
          <p>
            We keep our shipping prices transparent and customer-friendly across India:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Orders above ₹999:</strong> Eligible for <strong>FREE standard delivery</strong> pan-India.</li>
            <li><strong>Orders below ₹999:</strong> A nominal flat shipping charge of <strong>₹60</strong> is applied at checkout to cover transit costs.</li>
            <li><strong>Express Dispatch Option:</strong> Available in select metropolitan cities for an additional charge of ₹120.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">3. Estimated Delivery Times</h2>
          <p>
            Once dispatched, standard delivery timelines vary depending on your delivery location:
          </p>
          <div className="overflow-x-auto my-4 border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-stone-50 font-semibold border-b border-stone-200 text-stone-900">
                <tr>
                  <th className="p-4">Region / Location</th>
                  <th className="p-4">Delivery Estimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="p-4 font-medium">Bihar & Neighboring States</td>
                  <td className="p-4">1 - 3 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Metros & Tier 1 Cities (Delhi, Mumbai, Bengaluru, etc.)</td>
                  <td className="p-4">3 - 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Tier 2 & Tier 3 Towns</td>
                  <td className="p-4">4 - 6 Business Days</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Northeast India & Remote Islands</td>
                  <td className="p-4">5 - 8 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">4. Reliable Delivery Partners</h2>
          <p>
            To maintain strict handling safety and on-time transit, we coordinate with India's leading logistics providers, including <strong>Delhivery, Blue Dart, DTDC, Xpressbees, and India Post</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">5. Tracking Your Shipment</h2>
          <p>
            Once your package is handed over to our courier partners, we will instantly send you an SMS, WhatsApp notification, and email containing your active tracking link and AWB number. You can use these links to monitor your box in real time or schedule alternative deliveries.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-stone-200">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">6. Delivery Assistance</h2>
          <p>
            If your package is delayed, shows "Delivered" but was not received, or if you face address corrections, contact our shipping desk immediately:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <Mail className="w-5 h-5 text-[#7C8464]" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-bold">Email Help Desk</span>
                <span className="text-xs text-stone-800 font-semibold">Info@biharbite.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <Clock className="w-5 h-5 text-[#7C8464]" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-bold">Support Hours</span>
                <span className="text-xs text-stone-800 font-semibold">Mon - Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
