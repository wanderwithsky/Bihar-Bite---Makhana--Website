import { useState, FormEvent } from 'react';
import { Mail, Phone, Globe, ShieldCheck, Award, MessageSquare, Send } from 'lucide-react';
import { countries } from '../data';
import WholesaleEnquiryPopup from './WholesaleEnquiryPopup';

interface BulkScreenProps {
  onSubmitInquiry: (details: {
    name: string;
    email: string;
    phone: string;
    company: string;
    country: string;
    type: string;
    quantity: string;
    message: string;
  }) => Promise<void> | void;
}

export default function BulkScreen({ onSubmitInquiry }: BulkScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: 'India',
    type: 'wholesaler',
    quantity: '1000',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        country: formData.country,
        type: formData.type,
        quantity: formData.quantity,
        message: formData.message,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        country: 'India',
        type: 'wholesaler',
        quantity: '1000',
        message: '',
      });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || String(err) || 'Failed to submit B2B wholesale inquiry.');
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppChat = () => {
    const text = encodeURIComponent("Hello Bihar Bite! We are interested in bulk importing premium graded Makhana. Please share catalogs and details.");
    window.open(`https://wa.me/917985347849?text=${text}`, '_blank');
  };

  return (
    <div id="hero" className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-20 font-sans">
      <WholesaleEnquiryPopup />
      
      {/* Page Header */}
      <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary block">
          Global B2B Wholesale & Exports
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary leading-tight">
          Bulk & Wholesale Makhana from Bihar
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
          Bihar Bite supports wholesale and bulk Makhana requirements across India. We deliver premium quality directly to your business.
        </p>
      </div>

      {/* Permanent Wholesale Benefits */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "Multiple grades",
            "Bulk quantities",
            "Retail & wholesale supply",
            "Custom packing",
            "Pan-India dispatch",
            "Business enquiries"
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white border border-outline-variant/30 rounded-xl p-4 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-on-surface">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Left Value Props column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl text-primary border-b pb-3">Why Bihar Bite B2B?</h3>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-primary">Uncompromising Premium Grading</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Every batch is handpicked, sorted, and meticulously graded (Soot-size 5 to Soot-size 9) to ensure only robust, premium seeds are packed.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-primary">Certified Food Safety Process</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Our facilities are fully certified. We guarantee 100% moisture control, hygienic packaging, and premium microbiological safety.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-primary">Custom Global Logistics</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Supporting multiple freight options (FOB, CIF, Air freight) with customized white-labeling, bulk packaging bags, or custom brand boxes.
                </p>
              </div>
            </div>
          </div>

          {/* Quick contact / Chat */}
          <div className="bg-primary text-white rounded-2xl p-6 border border-primary-container space-y-4">
            <h3 className="font-serif font-bold text-lg text-secondary-container">Have Urgent Inquiries?</h3>
            <p className="text-xs leading-relaxed text-white/80">
              Speak directly with our global trade manager. Available 24/7 for urgent quotes, shipping timelines, or sample box distributions.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button 
                onClick={handleWhatsAppChat}
                className="bg-secondary text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-secondary/90 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Direct Trade
              </button>
              <a 
                href="mailto:Info@biharbite.com"
                className="bg-primary-container text-white border border-white/20 font-semibold text-xs px-5 py-2.5 rounded-full hover:bg-white/10 transition-all flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                Email Bulk Trade
              </a>
            </div>
          </div>
        </div>

        {/* Right Inquiry Form Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-outline-variant/20 shadow-sm">
          <h3 className="font-serif font-bold text-xl text-primary mb-1">Send B2B Bulk Inquiry</h3>
          <p className="text-xs text-on-surface-variant mb-6">Complete this secure form to request product pricing catalogs and sample kits.</p>

          {submitSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-primary font-serif">Inquiry Lodged Safely!</h4>
              <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Thank you. Your wholesale inquiry has been safely dispatched to our global sales directors. We will contact you back via email with customized quotation PDFs within 12 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-medium leading-relaxed">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Your Full Name <span className="text-secondary">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Company / Organization <span className="text-secondary">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Pure Foods Ltd"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Email Address <span className="text-secondary">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 XXXXX"
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Country of Delivery</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface cursor-pointer"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Business Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface cursor-pointer"
                  >
                    <option value="wholesaler">Wholesale Importer</option>
                    <option value="retailer">Supermarket Chain</option>
                    <option value="brand">Private Label brand</option>
                    <option value="catering">Hotel/Catering business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Target Volume (kg)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Describe Custom Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your requirements (e.g., custom grades, specific flavors, bulk bags or private labeling, shipping terms CIF...)"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-sans text-on-surface"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-white font-bold py-3.5 rounded-xl hover:bg-secondary/95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    GET WHOLESALE QUOTE
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
