import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface B2BSectionProps {
  onNavigateBulk: () => void;
}

export default function B2BSection({ onNavigateBulk }: B2BSectionProps) {
  const whatsappNumber = "917880454502";
  const whatsappMessage = encodeURIComponent("Hello Bihar Bite, I am interested in wholesale/bulk Makhana supply.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="relative w-full py-20 md:py-28 bg-[#FDFDF9] overflow-hidden border-t border-[#EBE6DA]">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT SIDE: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <span className="text-[11px] font-bold text-[#8C7D5F] tracking-[0.2em] uppercase mb-4 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C28E63]" />
              B2B • WHOLESALE • DISTRIBUTION
            </span>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[44px] text-[#143A2A] font-bold leading-[1.1] mb-6">
              Bulk & Wholesale Makhana from Bihar
            </h2>
            
            <p className="font-sans text-[#4A4A3A] text-[15px] md:text-[17px] leading-relaxed mb-8 max-w-lg">
              Partner with Bihar Bite for premium quality, sustainably harvested Makhana. Sourced directly from the pristine wetlands of Mithila to ensure unparalleled crunch, size, and purity for your business.
            </p>
            
            {/* Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10">
              {[
                "Multiple grades",
                "Bulk quantities",
                "Retail & wholesale supply",
                "Custom packing",
                "Pan-India dispatch",
                "Business enquiries"
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C28E63] shrink-0" />
                  <span className="font-sans text-[15px] text-[#2C3B2A] font-medium">{point}</span>
                </div>
              ))}
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={onNavigateBulk}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#143A2A] hover:bg-[#0E281C] text-[#FAF8F4] px-8 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-[13px] transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98]"
              >
                GET WHOLESALE QUOTE <ArrowRight className="w-4 h-4" />
              </button>
              
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-[13px] transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98]"
              >
                ORDER / ENQUIRE ON WHATSAPP
              </a>
            </div>
          </motion.div>
          
          {/* RIGHT SIDE: Image */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[32px] overflow-hidden shadow-2xl group"
          >
            <div className="absolute inset-0 bg-[#E8E2D9] pointer-events-none" />
            <img 
              src="/images/hero/hero-composition.png" 
              alt="Premium Bihar Makhana Wholesale"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle Gradient overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05110C]/40 to-transparent pointer-events-none" />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
