import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OurStoryScreen() {
  return (
    <div className="w-full bg-[#FAF8F4] min-h-screen">
      <section id="hero" className="relative w-full pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#0A1A12] z-0" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          
          <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest font-bold mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#C28E63]">Our Story</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#C28E63] text-xs font-bold tracking-[0.2em] uppercase block mb-4">
              HERITAGE
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] text-white tracking-tight leading-tight max-w-4xl mx-auto">
              Our Journey from <span className="italic text-[#C28E63]">Bihar</span> to Global
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="font-serif text-[22px] md:text-[28px] text-[#143A2A] leading-relaxed italic text-center mb-16">
            "Makhana is more than a snack. It is the soul of Mithila, cultivated with patience and harvested with reverence."
          </p>

          <div className="space-y-12 text-[#4A4A3A] text-[16px] leading-relaxed font-sans">
            <div>
              <h2 className="font-sans font-bold text-[#143A2A] text-xl mb-4">The Ponds of Mithila</h2>
              <p>
                For centuries, the wetlands of North Bihar have been the sanctuary of Euryale Ferox—the prickly water lily that gifts us Makhana. It’s an aquatic crop that demands the purest water and the most skilled hands. Our journey begins here, where we partner directly with generational farmers who know the waters better than anyone.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-bold text-[#143A2A] text-xl mb-4">Traditional Harvesting</h2>
              <p>
                Harvesting Makhana is an art form. Farmers dive into the ponds, collecting the seeds by hand from the muddy beds. The seeds are then cleaned, naturally sun-dried, and roasted in earthen pots before being meticulously popped. This entirely manual process preserves the nutritional integrity of every single Fox Nut.
              </p>
            </div>

            <div>
              <h2 className="font-sans font-bold text-[#143A2A] text-xl mb-4">A Modern Revival</h2>
              <p>
                Bihar Bite was born from a desire to elevate this humble, local superfood into a global luxury snacking experience. By establishing fair-trade practices, we empower our local farming communities while delivering an unmatched standard of hygiene, flavor, and packaging. Every handful of Bihar Bite Makhana is a celebration of our heritage.
              </p>
            </div>
          </div>
          
          <div className="mt-20 flex justify-center">
            <Link 
              to="/shop"
              className="group flex items-center gap-3 bg-[#143A2A] text-[#FAF8F4] px-10 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-[13px] transition-all duration-300 hover:bg-[#0E281C] hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
            >
              Explore Our Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
