import { useState, FormEvent } from 'react';
import { Send, MessageSquare, ShieldCheck } from 'lucide-react';

export interface ContactFormProps {
  onSubmitContact: (details: {
    name: string;
    phone_whatsapp: string;
    business_name?: string;
    city?: string;
    requirement?: string;
    quantity?: string;
    message: string;
  }) => Promise<void> | void;
}

export default function ContactForm({ onSubmitContact }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone_whatsapp: '',
    business_name: '',
    city: '',
    requirement: '',
    quantity: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');

  const validateForm = () => {
    setErrorMsg(null);
    if (!formData.name.trim()) {
      setErrorMsg("Please enter your name.");
      return false;
    }
    if (!formData.phone_whatsapp.trim()) {
      setErrorMsg("Please enter your Phone / WhatsApp number.");
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMsg("Please enter your message.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      setSubmittedName(formData.name);
      await onSubmitContact({
        name: formData.name.trim(),
        phone_whatsapp: formData.phone_whatsapp.trim(),
        business_name: formData.business_name.trim(),
        city: formData.city.trim(),
        requirement: formData.requirement.trim(),
        quantity: formData.quantity.trim(),
        message: formData.message.trim(),
      });

      setFormData({
        name: '',
        phone_whatsapp: '',
        business_name: '',
        city: '',
        requirement: '',
        quantity: '',
        message: '',
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMsg(err?.message || err?.details || String(err) || 'Failed to submit message to Supabase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    if (!validateForm()) return;
    
    const waText = `Hello Bihar Bite,

Name: ${formData.name.trim()}
Phone/WhatsApp: ${formData.phone_whatsapp.trim()}
Business Name: ${formData.business_name.trim()}
City: ${formData.city.trim()}
Requirement: ${formData.requirement.trim()}
Quantity: ${formData.quantity.trim()}
Message: ${formData.message.trim()}

I would like to enquire with Bihar Bite.`;

    const encodedText = encodeURIComponent(waText);
    window.open(`https://wa.me/917880454502?text=${encodedText}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-10 border border-outline-variant/30 shadow-sm relative overflow-hidden w-full h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-surface-container-low rounded-full -mr-10 -mt-10 opacity-50 pointer-events-none" />

      {isSubmitted ? (
        <div className="py-12 text-center space-y-6">
          <div className="w-16 h-16 bg-surface-container-high text-primary rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-primary">Message Dispatched!</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              Thank you for reaching out, <span className="font-semibold">{submittedName}</span>. Your inquiry has been securely logged with our team.
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
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Name <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone_whatsapp" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Phone / WhatsApp <span className="text-secondary">*</span>
              </label>
              <input
                type="tel"
                id="phone_whatsapp"
                required
                value={formData.phone_whatsapp}
                onChange={(e) => setFormData({ ...formData, phone_whatsapp: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="business_name" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Business Name
              </label>
              <input
                type="text"
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="city" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label htmlFor="requirement" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Requirement
              </label>
              <input
                type="text"
                id="requirement"
                value={formData.requirement}
                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="quantity" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant/70">
              Message <span className="text-secondary">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface resize-none"
            />
          </div>

          <div className="space-y-3 pt-2">
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
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl text-xs font-semibold tracking-widest uppercase shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Send Enquiry on WhatsApp
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
