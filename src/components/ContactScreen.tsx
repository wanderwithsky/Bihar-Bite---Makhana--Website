import { Mail, Phone, MapPin, Clock, Sparkles } from 'lucide-react';
import ContactForm from './ContactForm';
import FAQSection from './FAQSection';

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
  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5 text-secondary" />,
      title: 'Email Correspondence',
      value: 'Info@biharbite.com',
      description: 'Our team responds within 12-24 hours.',
      actionText: 'Write to us',
      link: 'mailto:Info@biharbite.com',
    },
    {
      icon: <Phone className="w-5 h-5 text-secondary" />,
      title: 'Direct Telephony',
      value: '+91 78804 54502',
      description: 'Mon-Sat from 9:00 AM to 6:00 PM IST.',
      actionText: 'Call now',
      link: 'tel:+919336311140',
    },
    {
      icon: <MapPin className="w-5 h-5 text-secondary" />,
      title: 'Our Heritage Hub',
      value: 'Darbhanga, Bihar',
      description: 'Village- Sripur, Bahadurpur Post Malhipatti - 846002',
      actionText: 'View on map',
      link: 'https://www.google.com/maps/search/?api=1&query=Our+Heritage+Hub,+Village-+Sripur,+Bahadurpur+Post+Malhipatti,+Darbhanga,+Bihar+846002,+India',
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


  return (
    <div id="hero" className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-20 font-sans">
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
        <div className="lg:col-span-7">
          <ContactForm onSubmitContact={onSubmitContact} />
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

      {/* Google Maps Location Section */}
      <div className="mt-20 border-t border-outline-variant/30 pt-16">
        <div className="text-center mb-12">
          <span className="text-secondary font-serif italic text-lg block">Our Heritage Hub</span>
          <h2 className="font-serif text-3xl md:text-4xl text-primary mt-2">Visit Our Heritage Hub</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-[#FDFBF7] rounded-[32px] p-8 md:p-10 border border-outline-variant/30 shadow-sm max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center shadow-sm">
              <MapPin className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-on-surface-variant mb-3">Location</h3>
              <p className="text-sm md:text-base text-on-surface-variant/80 leading-relaxed max-w-sm">
                Village- Sripur, Bahadurpur Post Malhipatti,<br/>
                District Darbhanga, Bihar - 846002,<br/>
                India
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Our+Heritage+Hub,+Village-+Sripur,+Bahadurpur+Post+Malhipatti,+Darbhanga,+Bihar+846002,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#7C8464] hover:bg-[#6A7155] text-white px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:shadow-lg active:scale-95"
              >
                Get Directions →
              </a>
            </div>
          </div>
          <div className="w-full h-[300px] md:h-[400px] lg:h-[450px] rounded-[24px] overflow-hidden border border-outline-variant/20 shadow-sm relative bg-surface-container-low">
            <iframe
              title="Google Maps Location"
              src="https://maps.google.com/maps?q=Village-+Sripur,+Bahadurpur+Post+Malhipatti,+District+Darbhanga,+Bihar+-+846002&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>


      {/* FAQ SECTION */}
      <FAQSection />
    </div>
  );
}
