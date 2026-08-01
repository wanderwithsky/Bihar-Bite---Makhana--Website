import { RefreshCw, ArrowLeft, Mail, AlertTriangle, HelpCircle } from 'lucide-react';
import { ScreenType } from '../types';

interface LegalPageProps {
  setScreen: (screen: ScreenType) => void;
}

export default function ReturnRefundScreen({ setScreen }: LegalPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-24 font-sans">
      
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
          <RefreshCw className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 leading-tight font-light mb-3">
          Returns & <span className="italic font-normal text-[#7C8464]">Refunds</span>
        </h1>
        <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">
          Effective Date: July 17, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm md:text-base leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">1. Premium Quality Promise</h2>
          <p>
            Because makhana is an organic, consumable agricultural food product, our health, safety, and hygiene standards are extremely stringent. Once food items leave our direct warehousing facility, we are unable to accept physical returns under ordinary circumstances.
          </p>
          <p>
            However, we stand behind the outstanding purity of our Mithila harvest 100%. If you are dissatisfied with your order due to package damage or quality defects, we are committed to making it right immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">2. Damaged Product Replacement Policy</h2>
          <p>
            If your premium makhana box arrives damaged, torn, or crushed in transit, you are fully covered under our <strong>Damaged Product Replacement Guarantee</strong>.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-4 my-6 text-xs md:text-sm text-stone-700 space-y-2">
            <span className="font-semibold text-stone-900 flex items-center gap-1.5 font-serif text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              How to Claim Free Replacement:
            </span>
            <p>
              Please notify us within <strong>48 hours</strong> of package delivery by emailing <strong className="text-stone-900">care@biharbite.com</strong>. Include your Order ID and 2-3 clear photographs/videos of the damaged outer shipping box or inner product bag.
            </p>
            <p>
              Once validated by our dispatch audit team, we will ship a fresh, brand-new replacement parcel to you completely free of charge. No physical return of the damaged product is necessary.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">3. Return Eligibility Exceptions</h2>
          <p>
            A replacement or refund may be granted in the following scenarios:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Wrong Item Shipped:</strong> You received a flavor, weight, or packet variant that differs from your paid order checkout.</li>
            <li><strong>Incomplete Order:</strong> An item was missing from your multi-item parcel (we will immediately dispatch the remaining items or refund that specific component's value).</li>
            <li><strong>Quality Concerns:</strong> Any batch-related issues that do not meet our premium, moisture-free crispness promise.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">4. Refund Process & Timelines</h2>
          <p>
            In instances where a refund is approved instead of a replacement:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Our finance team will initiate the refund back to your original payment method (Credit/Debit Card, UPI, Netbanking) within <strong>2 business days</strong>.</li>
            <li>The credited amount typically reflects in your bank statement within <strong>5 to 7 business days</strong>, depending on your banking institution's processing cycles.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">5. Cancellation Policy</h2>
          <p>
            You may cancel your order at no extra charge before it is packed and dispatched from our warehouse (usually within 3 hours of placing the order). Once an order is dispatched and a tracking ID/AWB is generated, we are unable to support cancellations or address changes in transit.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-stone-200">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">6. Contact Refund Assistance</h2>
          <p>
            Need help with a missing box, refund update, or package replacement? Reach out to our dedicated resolution desk:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <Mail className="w-5 h-5 text-[#7C8464]" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-bold">Email Help Desk</span>
                <span className="text-xs text-stone-800 font-semibold">care@biharbite.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <HelpCircle className="w-5 h-5 text-[#7C8464]" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-bold">Instant Helpline</span>
                <span className="text-xs text-stone-800 font-semibold">+91 91234 56789</span>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
