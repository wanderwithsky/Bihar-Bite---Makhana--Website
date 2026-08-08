import { FileText, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { ScreenType } from '../types';

interface LegalPageProps {
  setScreen: (screen: ScreenType) => void;
}

export default function TermsConditionsScreen({ setScreen }: LegalPageProps) {
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
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl text-stone-900 leading-tight font-light mb-3">
          Terms & <span className="italic font-normal text-[#7C8464]">Conditions</span>
        </h1>
        <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold">
          Effective Date: July 17, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-stone max-w-none space-y-8 text-stone-700 text-sm md:text-base leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">1. Acceptance of Terms</h2>
          <p>
            By accessing or purchasing from the Bihar Bite website, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations in India. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">2. Use License & Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to brand names, logos, text, high-resolution product imagery, blog narratives, packaging designs, and interactive applets, is the exclusive property of Bihar Bite.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You may view, download, or bookmark website information solely for personal, non-commercial purposes.</li>
            <li>You are strictly prohibited from modifying, copying, or republishing the materials for public or commercial display without explicit written consent.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">3. Product Details & Pricing</h2>
          <p>
            We strive to display our premium organic makhana products, descriptions, weights, and price variants as accurately as possible. However:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We reserve the right to revise product specifications, weight variants, and pricing structures without prior notice.</li>
            <li>We cannot guarantee that your monitor or phone screen's display of any product color or texture will be completely accurate to the physical item.</li>
            <li>All prices are displayed in Indian Rupees (INR) and are inclusive of applicable GST unless specified otherwise.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">4. User Accounts & Security</h2>
          <p>
            To place orders, track shipments, or access administrative portals, you may create an authenticated account. You are solely responsible for maintaining the confidentiality of your credentials and restrict access to your device. Bihar Bite reserves the right to suspend or terminate accounts, remove catalog entries, or cancel orders at our discretion.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">5. Limitations of Liability</h2>
          <p>
            In no event shall Bihar Bite or its suppliers be liable for any damages (including, without limitation, damages for loss of data, profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">6. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India, and any legal disputes or claims arising out of or in connection with them shall be subject to the exclusive jurisdiction of the competent courts of Bihar, India.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-stone-200">
          <h2 className="font-serif text-xl md:text-2xl text-stone-950 font-normal">7. Contact Information</h2>
          <p>
            For clarification on our terms or policies, please reach out to our legal compliance team:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <Mail className="w-5 h-5 text-[#7C8464]" />
              <div>
                <span className="text-[10px] uppercase text-stone-400 block font-bold">Email</span>
                <span className="text-xs text-stone-800 font-semibold">legal@biharbite.com</span>
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
