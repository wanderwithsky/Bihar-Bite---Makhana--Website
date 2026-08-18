import { ArrowRight, Star, Award, ShieldCheck, Truck, RotateCcw, CheckSquare, HeartHandshake, Leaf, Globe, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Product, ScreenType } from '../types';
import ProcessJourney from './ProcessJourney';
import GallerySection from './GallerySection';
import GlobalBackground from './GlobalBackground';

interface HomeScreenProps {
  setScreen: (screen: ScreenType) => void;
  setSelectedCategory: (category: Product['category'] | 'All') => void;
  setSelectedProduct: (product: Product | null) => void;
  products: Product[];
  isProductsLoading?: boolean;
  productsError?: string | null;
  onSubmitContact: (details: {
    name: string;
    email: string;
    phone?: string;
    inquiryType?: string;
    message: string;
    subscribeNewsletter?: boolean;
  }) => Promise<void> | void;
}

function SocialReelCard({ reel, idx, onClick }: { reel: any; idx: number; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!reel.video || !videoRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      });
    }, { threshold: 0.7 });
    
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [reel.video]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className="group relative bg-[#143A2A] rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 ease-out overflow-hidden cursor-pointer flex-shrink-0 snap-center w-[280px] md:w-auto aspect-[9/16] md:aspect-auto md:h-[480px] lg:h-[560px]"
      onClick={onClick}
    >
      {/* Background Media */}
      <video 
        ref={videoRef}
        src={reel.video}
        muted
        loop
        playsInline
        preload="none"
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


    </motion.div>
  );
}

function FeaturedProductVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src || !videoRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      });
    }, { threshold: 0.7 });
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      className="w-full h-full object-contain object-center group-hover:scale-[1.04] transition-transform duration-300 ease-out drop-shadow-sm"
    />
  );
}

export default function HomeScreen({ 
  setScreen, 
  setSelectedCategory, 
  setSelectedProduct, 
  products,
  isProductsLoading,
  productsError,
  onSubmitContact
}: HomeScreenProps) {
  const navigate = useNavigate();
  const [activeReel, setActiveReel] = useState<{video: string} | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Hero video autoplay prevented:', error);
          // Video will still be visible due to attributes, might just need interaction on some strict browsers
        });
      }
    }
  }, []);

  const handleCollectionClick = (category: Product['category']) => {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setScreen('shop');
  };

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 3);

  return (
    <div className="font-sans bg-[#FAF8F4] overflow-hidden relative">
      <GlobalBackground />
      
      {/* ─── HERO SECTION ─── */}
      <div id="hero" className="w-full">
        {/* ─── NEW MOBILE HERO (< 768px) ─── */}
        <section 
          className="md:hidden relative w-full min-h-[100svh] overflow-hidden"
          style={{
            backgroundImage: "url('/images/hero/mobile-hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Subtle gradient behind text only */}
          <div 
            className="absolute top-0 left-0 right-0 h-[50svh] z-0 pointer-events-none" 
            style={{ 
              background: 'linear-gradient(180deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,.08) 45%, transparent 100%)' 
            }} 
          />

          <div className="relative z-10 mx-auto flex flex-col items-center justify-start text-center pt-[20px]" style={{ width: 'min(90%, 420px)' }}>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <img src="/images/hero/logo.png" alt="Bihar Bite" style={{ width: 'clamp(90px, 26vw, 140px)', height: 'auto', objectFit: 'contain' }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-[18px] font-serif tracking-tight font-bold text-center"
              style={{ fontSize: 'clamp(2.4rem, 7vw, 3.3rem)', lineHeight: 0.95, maxWidth: '85vw', textShadow: '0 4px 18px rgba(0,0,0,.35)' }}
            >
              <span style={{ color: '#6B1232' }}>Premium</span><br />
              <span style={{ color: '#183D2F' }}>Makhana</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-[12px] font-serif italic text-center"
              style={{ color: '#D7A54B', fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', textShadow: '0 2px 10px rgba(0,0,0,.25)' }}
            >
              100% Natural
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="mt-[14px] font-sans text-white font-medium text-center"
              style={{ fontSize: 'clamp(0.95rem, 2.8vw, 1.15rem)', whiteSpace: 'nowrap', letterSpacing: '0.02em', textShadow: '0 2px 8px rgba(0,0,0,.25)' }}
            >
              Healthy &nbsp;•&nbsp; Crunchy &nbsp;•&nbsp; Farm Fresh
            </motion.p>

            <motion.button
              onClick={() => handleCollectionClick('All')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="mt-[18px] bg-white text-[#183D2F] rounded-[9999px] font-sans font-bold hover:bg-[#F8F5EE] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer flex items-center justify-center tracking-[0.05em]"
              style={{ width: 'clamp(180px, 58vw, 230px)', height: 'clamp(48px, 7vw, 56px)', fontSize: 'clamp(1rem, 3vw, 1.15rem)' }}
            >
              SHOP NOW
            </motion.button>
          </div>
        </section>

        {/* ─── DESKTOP HERO (>= 768px) ─── */}
        <section
          className="hidden md:block relative w-full min-h-screen overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 60% 30%, #FFF8EC 0%, #F8F3EA 50%, #EDE4D6 100%)',
          }}
        >
        {/* Loading Poster / Placeholder */}
        <div 
          className={`absolute inset-0 z-0 bg-[#E8E2D9] transition-opacity duration-[250ms] ease-in-out ${
            isVideoReady ? 'opacity-0' : 'opacity-100'
          }`} 
        />

        {/* Fullscreen Video Background */}
        <video
          key={isMobile ? 'mobile' : 'desktop'}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onCanPlay={() => setIsVideoReady(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-[250ms] ease-in-out ${
            isVideoReady && !videoError ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isMobile ? (
            <source src="/videos/hero-m.mp4" type="video/mp4" />
          ) : (
            <source src="/flow.mp4" type="video/mp4" />
          )}
        </video>
        
        {/* Fallback Image if video fails */}
        {videoError && (
          <img 
            src="/images/hero/hero-composition.png" 
            alt="Hero Background" 
            className="absolute inset-0 z-0 w-full h-full object-cover"
          />
        )}

        {/* Subtle Text Readability Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{
            background: isMobile 
              ? 'linear-gradient(90deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0) 100%)'
              : 'linear-gradient(to bottom, rgba(248,243,234,0.15) 0%, rgba(248,243,234,0.35) 100%)',
          }}
        />

        {/* Two-column layout — Left 45% / Right 55% */}
        <div className="relative z-10 flex min-h-[90vh] lg:h-screen lg:min-h-[700px] w-full max-w-[1600px] mx-auto px-6 md:px-14 lg:px-24 flex-col md:flex-row items-start md:items-center justify-start pt-[22vh] pb-[10vh] md:pt-0 md:pb-0">

          {/* ── LEFT 45% ── */}
          <div className="flex w-full max-w-[500px] md:max-w-none md:w-[45%] flex-col items-start justify-start mx-0 text-left">

            {/* Brand Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-[16px] md:mb-[40px]"
            >
              <Leaf size={isMobile ? 42 : 56} className="text-white/95 md:text-[#143A2A]" strokeWidth={1.2} style={{ filter: isMobile ? 'drop-shadow(0 2px 10px rgba(0,0,0,0.4))' : 'none' }} />
            </motion.div>

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif font-semibold whitespace-nowrap mb-[16px] md:mb-[28px] text-[clamp(36px,9vw,44px)] md:text-responsive-h1 text-[#FBF9F6] md:text-[#143A2A]"
              style={{
                fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
                letterSpacing: isMobile ? '-0.5px' : '-1.5px',
                lineHeight: 1.0,
                textShadow: isMobile ? '0 4px 20px rgba(0,0,0,0.5)' : '0 2px 12px rgba(255,255,255,0.12)'
              }}
            >
              Bihar Bite
            </motion.h1>

            {/* Luxury divider — animates from center */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center w-[120px] md:w-[220px] h-[1.5px] bg-[rgba(255,255,255,0.5)] md:bg-[rgba(184,151,86,0.7)] mb-[20px] md:mb-[24px]"
            >
              {/* Small luxury diamond ornament in the center */}
              <div className="absolute w-[6px] h-[6px] rotate-45 bg-white md:bg-[rgba(184,151,86,1)] outline outline-[1px] outline-offset-[2px] outline-[rgba(255,255,255,0.3)] md:outline-[rgba(184,151,86,0.6)]" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif italic text-[16px] sm:text-[18px] md:text-responsive-h3 text-[rgba(255,255,255,0.92)] md:text-[#8A6A3E] leading-[1.5] md:leading-normal text-left"
              style={{
                fontFamily: '"Cormorant Garamond", "Playfair Display", serif',
                letterSpacing: '0.4px',
                textShadow: isMobile ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 12px rgba(255,255,255,0.12)'
              }}
            >
              {isMobile ? (
                <>Sustainably Harvested<br/>Artfully Sourced</>
              ) : (
                <>Sustainably Harvested &nbsp;•&nbsp; Artfully Sourced</>
              )}
            </motion.p>
            
            {/* CTA Button */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                <button 
                  onClick={() => handleCollectionClick('All')}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full font-sans text-[11px] uppercase tracking-[0.15em] font-bold hover:bg-white hover:text-[#143A2A] transition-all shadow-lg active:scale-95"
                >
                  Explore Collection
                </button>
              </motion.div>
            )}
          </div>



        </div>
        </section>
      </div>

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
      <section className="relative w-full pt-[120px] pb-[40px] md:pb-[50px] bg-transparent overflow-hidden">
        
        {/* Ambient Section Decor: Lotus Leaf & Warm Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,_#FDFBF5_0%,_transparent_70%)] blur-[100px] opacity-70" />
          <motion.div 
            initial={{ x: -100, rotate: -15, opacity: 0 }}
            whileInView={{ x: -30, rotate: -5, opacity: 0.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[20%] -left-[10%] w-[500px] h-[500px]"
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 10C149.706 10 190 50.2944 190 100C190 149.706 149.706 190 100 190C50.2944 190 10 149.706 10 100C10 50.2944 50.2944 10 100 10Z" fill="#143A2A"/>
              <path d="M100 10V100" stroke="#143A2A" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

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
            {isProductsLoading ? (
              // Loading Skeletons
              [...Array(4)].map((_, i) => (
                <div key={i} className="group relative bg-[#FDFDF9] rounded-[36px] border border-[#EBE6DA] shadow-sm overflow-hidden flex flex-col h-full animate-pulse">
                  <div className="relative w-full h-[400px] lg:h-[500px] p-[20px] flex items-center justify-center bg-stone-100">
                    <div className="w-48 h-48 bg-stone-200 rounded-full"></div>
                  </div>
                  <div className="flex flex-col grow justify-end bg-white/60">
                    <div className="px-8 pt-4 pb-6">
                      <div className="h-6 bg-stone-200 rounded w-3/4 mx-auto mb-2"></div>
                    </div>
                    <div className="px-8 py-5 flex justify-between items-center border-t border-[#EBE6DA]/80">
                      <div className="h-6 bg-stone-200 rounded w-16"></div>
                      <div className="h-4 bg-stone-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : products.filter((p: any) => p.isBestseller || p.is_bestseller).length === 0 ? (
              // Empty State
              <div className="col-span-full text-center py-20 text-[#143A2A]">
                No featured products found.
              </div>
            ) : (
              products.filter((p: any) => p.isBestseller || p.is_bestseller).slice(0, 4).map((prod, idx) => {
                const coverImage = (prod as any).images?.[0] || prod.image || '/images/04.png';
              
              return (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (idx + 1) * 0.1 }}
                className="group relative bg-[#FDFDF9] rounded-[36px] border border-[#EBE6DA] shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-[10px] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full"
                onClick={() => navigate(`/product/${prod.id}`)}
              >
                {/* Image Area */}
                <div className="relative w-full h-[400px] lg:h-[500px] p-[20px] flex items-center justify-center bg-transparent overflow-hidden">
                  
                  {/* Floating Decoration */}
                  <img src="/images/hero/03.png" aria-hidden="true" className="absolute top-6 right-6 w-16 opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:rotate-12 blur-[1px] pointer-events-none" />

                  {prod.video ? (
                    <FeaturedProductVideo src={prod.video} />
                  ) : (
                    <img 
                      src={coverImage} 
                      alt={prod.name} 
                      className="w-full h-full object-contain object-center group-hover:scale-[1.04] transition-transform duration-300 ease-out drop-shadow-sm"
                    />
                  )}
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
                        <span className="font-sans font-bold text-[#143A2A] text-[22px]">{prod.priceDisplay || `₹${prod.price}`}</span>
                      </div>
                      
                      {/* Add to Cart Button (hover state) */}
                      <div className="absolute left-0 flex items-center opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                        <button 
                          className="bg-[#143A2A] text-[#FDFCF8] text-[11px] font-bold tracking-[0.15em] px-5 py-2.5 rounded-full uppercase shadow-md hover:bg-[#0E281C] transition-colors"
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${prod.id}`); }}
                        >
                          VIEW DETAILS
                        </button>
                      </div>
                      
                      {/* Weight (always visible on right) */}
                      <div className="absolute right-0 flex items-center h-full">
                        <span className="font-sans font-bold text-[#8C7D5F] text-[12px] uppercase tracking-[0.1em]">{prod.weight || '100g'}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
              );
            })
            )}
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
      <section className="relative w-full pt-[50px] md:pt-[60px] pb-[120px] bg-transparent overflow-hidden border-t border-[#EBE6DA]">
        
        {/* Ambient Section Decor: Instagram Story Abstract Blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} 
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_#E2C8BA_0%,_transparent_70%)] blur-[120px] opacity-20 mix-blend-multiply" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} 
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,_#DFD0B8_0%,_transparent_70%)] blur-[130px] opacity-20 mix-blend-multiply" 
          />
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
              { video: "/videos/social-04.mp4" },
              { video: "/videos/social-01.mp4" },
              { video: "/videos/social-02.mp4" },
              { video: "/videos/social-03.mp4" }
            ].map((reel, idx) => (
              <SocialReelCard key={idx} reel={reel} idx={idx} onClick={() => setActiveReel(reel as any)} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-16">
            <button 
              onClick={() => window.open('https://instagram.com/bihar_biteofficial', '_blank')}
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
              <video
                src={activeReel.video}
                autoPlay
                controls
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-contain"
              />

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
      <section className="relative w-full py-[120px] bg-transparent overflow-hidden border-t border-[#EBE6DA]">
        
        {/* Ambient Section Decor: Floating Quotation Marks */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: -50, opacity: 0.03 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute -top-10 left-[5%] text-[400px] font-serif text-[#143A2A] leading-none"
          >
            "
          </motion.div>
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: -20, opacity: 0.02 }}
            transition={{ duration: 4, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-10 right-[5%] text-[500px] font-serif text-[#143A2A] leading-none rotate-180"
          >
            "
          </motion.div>
        </div>

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
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        
        {/* Ambient Section Decor: Wetland Ripples and Lotus Leaves */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.04 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border-[1px] border-[#143A2A]"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1.1, opacity: 0.02 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] rounded-full border-[1px] border-[#143A2A]"
          />
          <motion.div 
            style={{ y: -50 }}
            className="absolute -bottom-32 -right-32 opacity-[0.05] animate-float-leaf"
          >
            <svg width="600" height="600" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="-rotate-12">
              <path d="M100 10C149.706 10 190 50.2944 190 100C190 149.706 149.706 190 100 190C50.2944 190 10 149.706 10 100C10 50.2944 50.2944 10 100 10Z" fill="#143A2A"/>
            </svg>
          </motion.div>
        </div>

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

      {/* ─── OUR HERITAGE HUB LOCATION SECTION ─── */}
      <section className="py-20 md:py-32 bg-transparent relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-secondary font-serif italic text-lg block">Our Heritage Hub</span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mt-2">Visit Our Heritage Hub</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-[#FDFBF7] rounded-[32px] p-8 md:p-10 border border-outline-variant/30 shadow-sm max-w-6xl mx-auto">
            <div className="h-full min-h-[450px]">
              <ContactForm onSubmitContact={onSubmitContact} />
            </div>
            <div className="w-full h-full min-h-[450px] rounded-[24px] overflow-hidden border border-outline-variant/20 shadow-sm relative bg-surface-container-low">
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
      </section>
      
    </div>
  );
}
