import { useState, FormEvent } from 'react';
import { Send, MessageSquare, ShieldCheck } from 'lucide-react';

export interface ContactFormProps {
  onSubmitContact: (details: {
    name: string;
    email: string;
    phone?: string;
    inquiryType?: string;
    message: string;
    subscribeNewsletter?: boolean;
  }) => Promise<void> | void;
}

export default function ContactForm({ onSubmitContact }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Retail Inquiry',
    message: '',
    subscribeNewsletter: true,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedInquiryType, setSubmittedInquiryType] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form validations
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg("Please enter your message.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save name and type for the success screen
      setSubmittedName(formData.name);
      setSubmittedInquiryType(formData.inquiryType);

      await onSubmitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        inquiryType: formData.inquiryType,
        message: formData.message.trim(),
        subscribeNewsletter: formData.subscribeNewsletter,
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Retail Inquiry',
        message: '',
        subscribeNewsletter: true,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMsg(err?.message || err?.details || String(err) || 'Failed to submit message to Supabase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-10 border border-outline-variant/30 shadow-sm relative overflow-hidden w-full h-full">
      {/* Abstract background shape */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-surface-container-low rounded-full -mr-10 -mt-10 opacity-50 pointer-events-none" />

      {isSubmitted ? (
        <div className="py-12 text-center space-y-6">
          <div className="w-16 h-16 bg-surface-container-high text-primary rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-primary">Message Dispatched!</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              Thank you for reaching out, <span className="font-semibold">{submittedName}</span>. Your inquiry regarding <span className="italic text-secondary">{submittedInquiryType}</span> has been securely logged with our Madhubani hub.
            </p>
          </div>
          <div className="pt-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setErrorMsg(null);
              }}
              className="px-6 py-2.5 border border-primary text-primary hover:bg-primary/5 text-xs font-semibold rounded-full transition-all active:scale-95"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/10 pb-3">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-lg font-bold text-on-surface-variant">Send a Direct Message</h2>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Full Name <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
                placeholder="e.g. Rohan Sharma"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Email Address <span className="text-secondary">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
                placeholder="e.g. rohan@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
                placeholder="e.g. +91 98765 XXXXX"
              />
            </div>

            {/* Inquiry Type */}
            <div className="space-y-1.5">
              <label htmlFor="inquiryType" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Nature of Inquiry
              </label>
              <select
                id="inquiryType"
                value={formData.inquiryType}
                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface cursor-pointer"
              >
                <option value="Retail Inquiry">Retail snacker question</option>
                <option value="Feedback">Product feedback / Flavors</option>
                <option value="Become a Distributor">Become a Distributor</option>
                <option value="Corporate Hampers">Corporate Gifting</option>
                <option value="Partnership">Boutique Partnership</option>
                <option value="Heritage Sourcing">Farmer Collective inquiry</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
              Your Message <span className="text-secondary">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface resize-none"
              placeholder="Tell us what's on your mind... we'd love to chat!"
            />
          </div>

          {/* Newsletter Subscription */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="subscribe"
              checked={formData.subscribeNewsletter}
              onChange={(e) => setFormData({ ...formData, subscribeNewsletter: e.target.checked })}
              className="w-4 h-4 rounded border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer"
            />
            <label htmlFor="subscribe" className="text-xs text-on-surface-variant select-none cursor-pointer">
              Subscribe to Bihar Bite's culinary stories, harvests and exclusive offers.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#7C8464] hover:bg-[#6A7155] text-white py-3.5 rounded-xl text-xs font-semibold tracking-widest uppercase shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Dispatch Correspondence
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
