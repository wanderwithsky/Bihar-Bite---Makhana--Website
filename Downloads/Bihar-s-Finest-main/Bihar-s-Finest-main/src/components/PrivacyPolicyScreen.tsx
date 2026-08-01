import { Shield, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { ScreenType } from '../types';

interface LegalPageProps {
  setScreen: (screen: ScreenType) => void;
}

export default function PrivacyPolicyScreen({ setScreen }: LegalPageProps) {
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
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 leading-tight font-light mb-3">
          Privacy <span className="italic font-normal text-[#7C8464]">Policy</span>
        </h1>
        <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">
          Last Updated: July 17, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm md:text-base leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">1. Introduction</h2>
          <p>
            Welcome to Bihar Bite ("we," "our," "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy governs the collection, use, and safeguarding of information that you provide when visiting our website or ordering our premium organic makhana products.
          </p>
          <p>
            By accessing or using our services, you consent to the practices described in this policy. If you do not agree with any terms in this policy, please discontinue use of our website immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">2. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on our website, express an interest in obtaining information about us or our products, participate in activities, or place an order.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Details:</strong> Full Name, Email Address, Contact Number (Mobile), Shipping and Billing Addresses.</li>
            <li><strong>Payment Information:</strong> Financial details processed securely via certified payment gateways (e.g., UPI, Netbanking, Cards) to complete transactions.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage patterns collected via essential cookies to improve website performance.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">3. How We Use Your Information</h2>
          <p>
            We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Processing, managing, and delivering your orders.</li>
            <li>Sending order confirmations, tracking details, and transactional updates.</li>
            <li>Providing responsive customer support for inquiries or replacements.</li>
            <li>Sharing promotional materials, newsletters, and curated health benefits updates (only if you have opted in, with easy unsubscribe options).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">4. Security of Your Information</h2>
          <p>
            We implement appropriate technical and organizational security measures, including SSL encryption, secure tokens, and trusted cloud databases (such as Supabase/Firebase) to protect your personal data from unauthorized access, disclosure, alteration, or destruction. However, please note that no electronic transmission over the internet can be guaranteed 100% secure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">5. Sharing of Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We share data only with trusted service partners essential for executing our services:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Logistics Partners:</strong> High-quality couriers (e.g., Delhivery, Blue Dart) to safely dispatch and track shipments.</li>
            <li><strong>Payment Gateways:</strong> Safe, authenticated payment aggregators processing end-to-end checkout.</li>
            <li><strong>Legal Requirements:</strong> When required by regulatory or governmental bodies under applicable laws in India.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">6. Your Rights</h2>
          <p>
            Under Indian digital privacy standards, you have the right to access, correct, update, or request the deletion of your personal information collected by us. If you wish to make any changes or request account deletion, please contact us at the details listed below.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-stone-200">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">7. Contact Our Privacy Officer</h2>
          <p>
            If you have any questions, comments, or concerns about this policy, please reach out directly to our support team:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <Mail className="w-5 h-5 text-[#7C8464]" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-bold">Email</span>
                <span className="text-xs text-stone-800 font-semibold">care@biharbite.com</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <Phone className="w-5 h-5 text-[#7C8464]" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-bold">Phone</span>
                <span className="text-xs text-stone-800 font-semibold">+91 91234 56789</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <MapPin className="w-5 h-5 text-[#7C8464]" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-bold">Office</span>
                <span className="text-xs text-stone-800 font-semibold">Darbhanga, Mithila, Bihar</span>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
