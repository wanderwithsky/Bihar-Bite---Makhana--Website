import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface ContactScreenProps {
  onSubmitContact: (details: {
    name: string;
    email: string;
    phone?: string;
    inquiryType?: string;
    message: string;
    subscribeNewsletter?: boolean;
  }) => Promise<void> | void;
}

export default function ContactScreen({ onSubmitContact }: ContactScreenProps) {
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

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5 text-secondary" />,
      title: 'Email Correspondence',
      value: 'hello@biharbite.com',
      description: 'Our team responds within 12-24 hours.',
      actionText: 'Write to us',
      link: 'mailto:hello@biharbite.com',
    },
    {
      icon: <Phone className="w-5 h-5 text-secondary" />,
      title: 'Direct Telephony',
      value: '+91 98765 43210',
      description: 'Mon-Sat from 9:00 AM to 6:00 PM IST.',
      actionText: 'Call now',
      link: 'tel:+919876543210',
    },
    {
      icon: <MapPin className="w-5 h-5 text-secondary" />,
      title: 'Our Heritage Hub',
      value: 'Mithila Region, Bihar',
      description: 'Darjeeling-Narkatiaganj Highway, Madhubani - 847211',
      actionText: 'View on map',
      link: '#',
    },
    {
      icon: <Clock className="w-5 h-5 text-secondary" />,
      title: 'Operating Hours',
      value: '09:00 - 18:00 (IST)',
      description: 'Sunday is reserved for crop hydration and rest.',
      actionText: 'Our schedule',
      link: '#',
    },
  ];

  const faqs = [
    {
      question: 'Where is Bihar Bite Makhana sourced from?',
      answer: 'Our water lily seeds are harvested sustainably from the authentic wetland biomes of Mithila, Bihar, by heritage farm collectives using traditional methodologies passed down over generations.',
    },
    {
      question: 'Are there artificial preservatives or flavorings added?',
      answer: 'Never. Bihar Bite prides itself on absolute purity. We use slow-roasted techniques with pure cow ghee or cold-pressed olive oils, finished with authentic spices and natural seasonings.',
    },
    {
      question: 'Do you offer custom gifting packs or bulk exports?',
      answer: 'Yes! We supply boutique retail, luxury wedding hampers, corporate gifting, and international bulk exports. Use our Inquire Bulk screen or drop a custom note here.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-20 font-sans">
      {/* Decorative Top Accent */}
      <div className="w-16 h-[2px] bg-secondary mx-auto mb-6" />

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-secondary font-serif italic text-lg md:text-xl block">
          Get in Touch
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-on-surface-variant leading-tight">
          Let's Build a <span className="italic font-normal text-primary">Flavorful Connection</span>
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant/80 max-w-xl mx-auto leading-relaxed">
          Whether you have a product question, feedback on our roasted selections, or wish to partner with Bihar Bite's heritage collective, we are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form Section */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-10 border border-outline-variant/30 shadow-sm relative overflow-hidden">
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

        {/* Contact Details & Sourcing Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {contactMethods.map((method, index) => (
              <a
                href={method.link}
                key={index}
                className="bg-[#FDFBF7] rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex items-start gap-4 hover:border-secondary hover:bg-white transition-all group cursor-pointer"
              >
                <div className="p-3 bg-surface rounded-xl border border-outline-variant/20 group-hover:scale-105 transition-transform">
                  {method.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-on-surface-variant/80">
                    {method.title}
                  </h3>
                  <p className="font-serif text-base text-primary font-medium">
                    {method.value}
                  </p>
                  <p className="text-[11px] text-on-surface-variant/70 leading-normal">
                    {method.description}
                  </p>
                  {method.link !== '#' && (
                    <span className="inline-flex items-center text-[10px] font-semibold text-secondary hover:underline pt-1">
                      {method.actionText} →
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>

          {/* Short Sourcing Promise banner */}
          <div className="bg-[#7C8464] text-white rounded-[24px] p-6 shadow-sm space-y-3 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <Sparkles className="w-32 h-32" />
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-white/70 block">
              Bihar Bite Promise
            </span>
            <h3 className="font-serif text-lg italic leading-tight">
              Rooted in Mithila heritage, served fresh to snacker palates globally.
            </h3>
            <p className="text-xs text-white/85 leading-relaxed">
              We coordinate with 120+ micro-farmer families directly to ensure ethical pricing, maximum nutritional preservation, and high quality raw crops.
            </p>
          </div>
        </div>
      </div>

      {/* Mini FAQ Section */}
      <div className="mt-20 border-t border-outline-variant/30 pt-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <HelpCircle className="w-6 h-6 text-secondary mx-auto" />
            <h2 className="font-serif text-2xl text-primary">Frequently Asked Queries</h2>
            <p className="text-xs text-on-surface-variant/80">Quick clarifications before dispatching messages</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#F1EDE4]/50 rounded-2xl p-6 border border-outline-variant/10 space-y-2">
                <h4 className="font-serif text-base font-bold text-on-surface-variant">{faq.question}</h4>
                <p className="text-xs md:text-sm text-on-surface-variant/85 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
