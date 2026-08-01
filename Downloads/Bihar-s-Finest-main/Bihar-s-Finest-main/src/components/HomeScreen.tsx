import { ArrowRight, Star, Award, ShieldCheck, Truck, RotateCcw, CheckSquare, HeartHandshake, Leaf, Globe, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Product, ScreenType } from '../types';
import ProcessJourney from './ProcessJourney';
import GallerySection from './GallerySection';

interface HomeScreenProps {
  setScreen: (screen: ScreenType) => void;
  setSelectedCategory: (category: Product['category'] | 'All') => void;
  setSelectedProduct: (product: Product | null) => void;
  products: Product[];
}

export default function HomeScreen({
  setScreen,
  setSelectedCategory,
  setSelectedProduct,
  products,
}: HomeScreenProps) {
  const [activeReel, setActiveReel] = useState<{title: string, image: string} | null>(null);

  const handleCollectionClick = (category: Product['category']) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setScreen('shop');
  };

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 3);

  return (
    <div className="font-sans bg-[#FAF8F4] overflow-hidden">
      
      {/* ─── HERO SECTION ─── */}
      <section
        id="hero"
        className="relative w-full min-h-screen overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 60% 30%, #FFF8EC 0%, #F8F3EA 50%, #EDE4D6 100%)',
        }}
      >
        {/* Fullscreen Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 z-0 w-full h-full object-cover"
        >
          <source src="/flow.mp4" type="video/mp4" />
        </video>

        {/* Subtle Text Readability Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(248,243,234,0.15) 0%, rgba(248,243,234,0.35) 100%)',
          }}
        />

        {/* Two-column layout — Left 45% / Right 55% */}
        <div className="relative z-10 flex h-screen min-h-[700px] w-full max-w-[1600px] mx-auto px-8 md:px-14 lg:px-24 flex-col md:flex-row items-center">

          {/* ── LEFT 45% ── */}
          <div className="flex w-full flex-col items-start justify-center md:w-[45%]">

            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-[40px]"
            >
              <Leaf size={56} className="text-[#143A2A]" strokeWidth={1.2} />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[48px] sm:text-[64px] md:text-[78px] lg:text-[92px] font-semibold text-[#143A2A] whitespace-nowrap mb-[28px]"
              style={{
                fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
                letterSpacing: '-1.5px',
                lineHeight: 0.95,
                textShadow: '0 2px 12px rgba(255,255,255,0.12)'
              }}
            >
              Bihar Bite
            </motion.h1>

            {/* Luxury divider — animates from center */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center w-[220px] h-[1.5px] bg-[rgba(184,151,86,0.7)] mb-[24px]"
            >
              {/* Small luxury diamond ornament in the center */}
              <div className="absolute w-[6px] h-[6px] rotate-45 bg-[rgba(184,151,86,1)] outline outline-[1px] outline-offset-[2px] outline-[rgba(184,151,86,0.6)]" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif italic text-[18px] sm:text-[22px] md:text-[24px] lg:text-[28px] text-[#8A6A3E]"
              style={{
                fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
                letterSpacing: '0.4px',
                textShadow: '0 2px 12px rgba(255,255,255,0.12)'
              }}
            >
              Sustainably Harvested &nbsp;•&nbsp; Artfully Sourced
            </motion.p>
          </div>



        </div>
      </section>

      {/* ─── TRUST & BRAND HIGHLIGHTS MARQUEE ─── */}
      <section className="w-full h-[60px] bg-[#F8F5EE] border-y border-[#D8C29A] flex items-center relative z-20">
        <div 
          className="w-full h-full overflow-hidden flex items-center"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'
          }}
        >
          <div className="flex w-fit animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center shrink-0">
                {[
                  "FSSAI Approved",
                  "Ancient Superfood",
                  "100% Natural",
                  "Rich in Protein",
                  "Handpicked Quality",
                  "Gluten Free",
                  "Make in India",
                  "No Preservatives",
                  "Farm Fresh",
                  "Raw & Natural",
                  "Premium Bihar Makhana",
                  "Sustainably Sourced",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center shrink-0">
                    <span 
                      className="italic font-medium text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] text-[#415235] tracking-[0.01em] leading-none"
                      style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", "Libre Baskerville", serif' }}
                    >
                      {text}
                    </span>
                    <div className="w-[5px] h-[5px] rounded-full bg-[#C9A76A] mx-[28px]" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="py-12 md:py-20 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { num: "10,000+", label: "Farmers Connected" },
              { num: "25+", label: "Countries Served" },
              { num: "100%", label: "Natural & Organic" },
              { num: "Premium", label: "Export Grade" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white rounded-3xl p-6 md:p-8 text-center shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-stone-100"
              >
                <h3 className="font-serif text-3xl md:text-4xl text-[#7C8464] mb-2">{stat.num}</h3>
                <p className="text-xs uppercase tracking-widest font-bold text-stone-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS SECTION ─── */}
      <section className="relative w-full py-[120px] bg-[#FAF7F2] overflow-hidden">
        {/* Subtle Pattern Background */}
        <div 
          className="absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'url("/images/04.png")', backgroundSize: '250px', backgroundRepeat: 'repeat', backgroundPosition: 'center' }}
        />
        
        <div className="relative z-10 w-[92%] md:w-[85%] lg:w-[80%] max-w-[1700px] mx-auto">
          
          {/* Section Title */}
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <h2 className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-4xl md:text-5xl lg:text-[56px] tracking-tight">
              <span className="font-sans font-extrabold text-[#143A2A]">FEATURED</span>
              <span className="italic text-[#C28E63]" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}>PRODUCTS</span>
            </h2>
            <div className="w-[80px] h-[2px] bg-[#143A2A] mt-8 rounded-full" />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[32px]">
            {[
              { name: "Premium Plain Makhana", price: 399, weight: "250 G", image: "/images/04.png" },
              { name: "Roasted Makhana", price: 229, weight: "100 G", image: "/images/02.png" },
              { name: "Makhana Papad", price: 199, weight: "200 G", image: "/images/01.png" },
              { name: "Makhana Cookies", price: 249, weight: "150 G", image: "/images/03.png" }
            ].map((prod, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (idx + 1) * 0.1 }}
                className="group relative bg-[#FDFDF9] rounded-[36px] border border-[#EBE6DA] shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-[10px] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full"
                onClick={() => setScreen('shop')}
              >
                {/* Image Area */}
                <div className="relative w-full h-[400px] lg:h-[500px] p-[20px] flex items-center justify-center bg-transparent overflow-hidden">
                  
                  {/* Floating Decoration */}
                  <img src="/images/hero/03.png" aria-hidden="true" className="absolute top-6 right-6 w-16 opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:rotate-12 blur-[1px] pointer-events-none" />

                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    className="w-full h-full object-contain object-center group-hover:scale-[1.04] transition-transform duration-300 ease-out drop-shadow-sm"
                  />
                </div>
                
                {/* Content Area */}
                <div className="flex flex-col grow justify-end bg-white/60">
                  <div className="px-8 pt-4 pb-6">
                    <h3 className="font-sans font-semibold text-[#143A2A] text-[18px] text-center leading-tight">
                      {prod.name}
                    </h3>
                  </div>
                  {/* Bottom Information Bar */}
                  <div className="px-8 py-5 flex justify-between items-center border-t border-[#EBE6DA]/80">
                    
                    <div className="relative h-[36px] flex items-center w-full">
                      {/* Price (default state) */}
                      <div className="absolute left-0 flex items-center transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-y-2">
                        <span className="font-sans font-bold text-[#143A2A] text-[22px]">₹{prod.price}</span>
                      </div>
                      
                      {/* Add to Cart Button (hover state) */}
                      <div className="absolute left-0 flex items-center opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                        <button 
                          className="bg-[#143A2A] text-[#FDFCF8] text-[11px] font-bold tracking-[0.15em] px-5 py-2.5 rounded-full uppercase shadow-md hover:bg-[#0E281C] transition-colors"
                          onClick={(e) => { e.stopPropagation(); setScreen('shop'); }}
                        >
                          ADD TO CART
                        </button>
                      </div>
                      
                      {/* Weight (always visible on right) */}
                      <div className="absolute right-0 flex items-center h-full">
                        <span className="font-sans font-bold text-[#8C7D5F] text-[12px] uppercase tracking-[0.1em]">{prod.weight}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-16">
            <button 
              onClick={() => setScreen('shop')} 
              className="bg-[#143A2A] hover:bg-[#0E281C] text-[#FAF8F4] px-10 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-[13px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
            >
              View All Products
            </button>
          </div>
          
        </div>
      </section>

      {/* ─── SCROLL THE SOCIALS SECTION ─── */}
      <section className="relative w-full py-[120px] bg-[#FAF8F4] overflow-hidden border-t border-[#EBE6DA]">
        
        {/* Premium Luxury Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#FAF8F4] to-[#F5F2E9]">
          {/* Radial light behind heading */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFFFFF] via-[#FAF8F4]/50 to-transparent opacity-80 blur-3xl" />
          
          {/* Subtle Abstract Blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#E8E2D2] blur-[120px] opacity-40 mix-blend-multiply" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full bg-[#E5DFCD] blur-[150px] opacity-40 mix-blend-multiply" />
          
          {/* Noise/Grain Texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          {/* Faint Social Icons in Corners */}
          <motion.div initial={{ y: 0 }} whileInView={{ y: -30 }} transition={{ duration: 3, ease: "easeOut" }} className="absolute inset-0">
            {/* Instagram */}
            <svg className="absolute top-20 left-10 md:left-20 w-24 h-24 md:w-32 md:h-32 text-[#143A2A] opacity-[0.02] -rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            {/* Heart */}
            <svg className="absolute bottom-32 right-10 md:right-20 w-32 h-32 md:w-48 md:h-48 text-[#143A2A] opacity-[0.02] rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {/* Comment */}
            <svg className="absolute top-1/2 left-5 md:left-16 w-20 h-20 md:w-28 md:h-28 text-[#C28E63] opacity-[0.03] -rotate-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            {/* Play Button */}
            <svg className="absolute bottom-20 left-1/4 w-24 h-24 md:w-36 md:h-36 text-[#143A2A] opacity-[0.02] rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            {/* Share / Camera */}
            <svg className="absolute top-32 right-20 md:right-32 w-24 h-24 md:w-28 md:h-28 text-[#C28E63] opacity-[0.02] rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </motion.div>
        </div>
        
        <div className="relative z-10 w-[95%] md:w-[90%] lg:w-[85%] max-w-[1600px] mx-auto">
          
          {/* Section Title */}
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <span className="text-xs font-semibold text-[#8C7D5F] tracking-[0.2em] uppercase block mb-4">
              OUR SOCIALS
            </span>
            <h2 className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-4xl md:text-5xl lg:text-[56px] tracking-tight">
              <span className="font-serif text-[#143A2A]">Scroll The</span>
              <span className="font-serif italic text-[#C28E63]" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}>Socials</span>
            </h2>
            <div className="w-[80px] h-[2px] bg-[#143A2A] mt-8 rounded-full" />
          </div>

          {/* Reels Row */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 custom-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:snap-none md:gap-[32px] md:pb-0 px-4 md:px-0">
            {[
              { title: "Harvesting Fresh Makhana", image: "/images/reels/harvesting.png" },
              { title: "Inside Bihar Bite Factory", image: "/images/reels/factory.png" },
              { title: "Healthy Evening Snack", image: "/images/reels/snack.png" },
              { title: "From Pond to Premium", image: "/images/reels/flatlay.png" }
            ].map((reel, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative bg-[#143A2A] rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden cursor-pointer flex-shrink-0 snap-center w-[280px] md:w-auto aspect-[9/16] md:aspect-auto md:h-[480px] lg:h-[560px]"
                onClick={() => setActiveReel(reel)}
              >
                {/* Background Image */}
                <img 
                  src={reel.image} 
                  alt={reel.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                />
                
                {/* Bottom Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05110C]/90 via-[#05110C]/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />
                
                {/* Instagram Reels Badge */}
                <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span className="text-white text-[9px] font-bold tracking-wider leading-none pt-[1px]">REELS</span>
                </div>

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-[70px] h-[70px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transition-all duration-300 group-hover:scale-[1.12] group-hover:bg-[#143A2A] group-hover:border-[#143A2A]">
                    <svg className="w-8 h-8 ml-1 text-white transition-colors duration-300 fill-white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Bottom Title */}
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h3 className="text-white font-sans font-medium text-lg leading-snug drop-shadow-md">
                    {reel.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-16">
            <button 
              className="group flex items-center gap-3 bg-[#143A2A] text-[#FAF8F4] px-10 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-[12px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
            >
              View Instagram <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
        </div>
      </section>

      {/* Reels Modal Overlay */}
      <AnimatePresence>
        {activeReel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
            onClick={() => setActiveReel(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] md:max-w-[440px] aspect-[9/16] bg-[#0A1A12] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Background Image */}
              <img src={activeReel.image} className="absolute inset-0 w-full h-full object-cover opacity-60" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                <div className="w-[80px] h-[80px] rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  <svg className="w-10 h-10 ml-1 text-white fill-white opacity-90" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <h3 className="font-sans font-semibold text-2xl text-white mb-6 drop-shadow-lg leading-snug">{activeReel.title}</h3>
                <p className="font-sans text-[#D8C29A] uppercase tracking-[0.2em] text-[11px] font-bold bg-black/40 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10">
                  Video coming soon
                </p>
              </div>

              {/* Close Button */}
              <button 
                className="absolute top-5 right-5 w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors border border-white/10 z-20"
                onClick={() => setActiveReel(null)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CUSTOMER TESTIMONIALS ─── */}
      <section className="relative w-full py-[120px] bg-[#FAF8F4] overflow-hidden border-t border-[#EBE6DA]">
        {/* Subtle Background Art */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'url("/images/hero/02.png")', backgroundSize: '400px', backgroundRepeat: 'repeat', backgroundPosition: 'center' }}
        />

        <div className="relative z-10 w-full">
          {/* Section Title */}
          <div className="flex flex-col items-center justify-center text-center mb-20 px-6">
            <span className="text-xs font-semibold text-[#8C7D5F] tracking-[0.2em] uppercase block mb-4">
              CUSTOMER LOVE
            </span>
            <h2 className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-4xl md:text-5xl lg:text-[56px] tracking-tight">
              <span className="font-serif text-[#143A2A] font-bold">The Happy</span>
              <span className="font-serif italic text-[#C28E63]" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}>Shoutouts</span>
            </h2>
            <div className="w-[80px] h-[2px] bg-[#143A2A] mt-8 rounded-full" />
          </div>

          {/* Marquee Wrapper */}
          <div className="w-full flex items-center overflow-hidden relative">
            <div className="flex w-fit animate-[marquee_40s_linear_infinite]">
              {/* Duplicate array twice for seamless loop */}
              {[...Array(2)].map((_, trackIdx) => (
                <div key={trackIdx} className="flex gap-6 pr-6 w-max">
                  {[
                    { name: "Rakesh Sharma", role: "Business Owner", text: "Bihar Bite has completely changed the way I snack. The makhana tastes incredibly fresh and the quality is consistent in every pack." },
                    { name: "Neha Gupta", role: "Nutrition Coach", text: "I've tried many brands, but Bihar Bite stands out for its premium quality and authentic taste. Highly recommended." },
                    { name: "Aman Verma", role: "Software Engineer", text: "The packaging feels premium and the makhana is perfectly roasted. Definitely ordering again from Bihar Bite." },
                    { name: "Priya Singh", role: "Fitness Enthusiast", text: "Bihar Bite delivers exactly what it promises. Crunchy, clean and genuinely premium makhana." },
                    { name: "Vivek Jain", role: "Entrepreneur", text: "The freshness and taste are unmatched. Bihar Bite has become our family's favorite healthy snack." },
                    { name: "Meenal Kapoor", role: "Doctor", text: "Excellent quality and beautiful packaging. Bihar Bite feels like an international premium brand." }
                  ].map((rev, i) => (
                    <div 
                      key={i} 
                      className="group bg-[#FDFCF8] rounded-[28px] p-[36px] w-[85vw] md:w-[45vw] lg:w-[31vw] xl:w-[420px] flex-shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#EBE6DA] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:scale-[1.02] relative cursor-pointer"
                    >
                      {/* Quote Icon */}
                      <div className="absolute top-8 right-8 text-[#EBE6DA]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-4 h-4 fill-[#C28E63] text-[#C28E63]" />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="font-serif text-[#3A3832] text-[19px] leading-[1.6] mb-8 italic">
                        "{rev.text}"
                      </p>

                      <div className="w-12 h-[1px] bg-[#EBE6DA] mb-6" />

                      {/* Customer Info */}
                      <div>
                        <h4 className="font-sans font-bold text-[#143A2A] text-[17px]">{rev.name}</h4>
                        <p className="font-sans text-[#8C7D5F] text-[13px] tracking-wide mt-1 uppercase">{rev.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HERITAGE SECTION ─── */}
      <section className="relative w-full py-24 bg-[#FAF8F4] overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold text-[#8C7D5F] tracking-[0.2em] uppercase block mb-4">
              WHY BIHAR BITE?
            </span>
            <h2 className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-3xl md:text-5xl lg:text-[48px] tracking-tight text-[#143A2A] font-serif">
              From <span className="font-serif italic text-[#C28E63]" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}>Bihar's Wetlands</span> to Your Home
            </h2>
            <div className="w-[80px] h-[2px] bg-[#143A2A] mt-8 mb-6 mx-auto rounded-full" />
            <p className="font-sans text-[#4A4A3A] max-w-3xl mx-auto text-[15px] md:text-[17px] leading-relaxed">
              Every Makhana begins its journey in the pristine wetlands of Mithila. We work directly with local farming communities to bring naturally grown, carefully harvested, premium-quality Makhana from Bihar to homes across India.
            </p>
          </motion.div>
        </div>

        {/* Full Width Image Container */}
        <div className="relative w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] rounded-[28px] md:rounded-[32px] overflow-hidden shadow-2xl group"
          >
            {/* Background Image with Zoom Animation */}
            <motion.div 
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img 
                src="/images/wetlands_heritage.png" 
                alt="Bihar Wetlands Makhana Harvesting"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gradient Overlay for Card Readability */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#05110C]/90 via-[#05110C]/40 md:via-[#05110C]/20 to-transparent pointer-events-none" />

            {/* Floating Glassmorphism Card */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-6 left-6 right-6 md:left-auto md:right-12 md:top-1/2 md:-translate-y-1/2 md:w-[440px] bg-[#FDFDF9]/85 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/50"
            >
              <span className="text-[10px] font-bold text-[#8C7D5F] tracking-[0.2em] uppercase block mb-4">
                OUR HERITAGE
              </span>
              <h3 className="font-serif text-[24px] md:text-[28px] text-[#143A2A] font-bold leading-tight mb-4">
                From the wetlands of Bihar to healthy kitchens across the world.
              </h3>
              <p className="font-sans text-[#4A4A3A] text-[14px] md:text-[15px] leading-relaxed mb-8">
                Our makhana is harvested using generations-old techniques, naturally sun-dried, carefully selected and packed with care so every bite carries the authentic taste of Bihar.
              </p>
              
              <button className="group flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[#143A2A] hover:text-[#C28E63] transition-colors">
                Explore Our Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* ─── MAKHANA PROCESS SECTION ─── */}
      <ProcessJourney />

      {/* ─── OUR GALLERY SECTION ─── */}
      <GallerySection />

      {/* Elegant CTA */}
      <section className="py-32 bg-[#FAF8F4] relative">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="bg-white rounded-[40px] p-12 md:p-20 shadow-xl border border-stone-100"
            >
               <h2 className="font-serif text-4xl md:text-5xl text-[#3A3832] font-light mb-6">
                 Experience the <span className="italic text-[#7C8464]">Finest</span>
               </h2>
               <p className="text-stone-500 font-light mb-10 max-w-lg mx-auto">
                 Join thousands of healthy snackers and culinary experts worldwide who trust Bihar Bite for their premium Makhana needs.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setSelectedCategory('All');
                      setScreen('shop');
                    }}
                    className="bg-[#3A3832] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#1A1A1A] transition-colors"
                  >
                    Shop Retail
                  </button>
                  <button 
                    onClick={() => setScreen('bulk')}
                    className="bg-[#7C8464] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#6A7155] transition-colors"
                  >
                    Inquire for Bulk Export
                  </button>
               </div>
            </motion.div>
         </div>
      </section>
      
    </div>
  );
}
