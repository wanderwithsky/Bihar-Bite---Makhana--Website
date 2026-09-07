import { ArrowRight, Star, Award, ShieldCheck, Truck, RotateCcw, CheckSquare, HeartHandshake, Leaf, Globe, CheckCircle2, ChevronRight, MapPin, ShoppingBag , Package, FileText, Flower2, X } from 'lucide-react';
import ContactForm from './ContactForm';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Product, ScreenType } from '../types';
import ProcessJourney from './ProcessJourney';
import GallerySection from './GallerySection';
import GlobalBackground from './GlobalBackground';
import B2BSection from './B2BSection';
import FAQSection from './FAQSection';

interface HomeScreenProps {
  setScreen: (screen: ScreenType) => void;
  setSelectedCategory: (category: Product['category'] | 'All') => void;
  setSelectedProduct: (product: Product | null) => void;
  products: Product[];
  isProductsLoading?: boolean;
  productsError?: string | null;
  onSubmitContact: (details: {
    name: string;
    phone_whatsapp: string;
    business_name?: string;
    city?: string;
    requirement?: string;
    quantity?: string;
    message: string;
  }) => Promise<void> | void;
  onAddToCart?: (product: Product, selectedWeight: string, quantity?: number) => void;
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
  onSubmitContact,
  onAddToCart
}: HomeScreenProps) {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [activeReel, setActiveReel] = useState<{video: string} | null>(null);
  const [isRawMakhanaModalOpen, setIsRawMakhanaModalOpen] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isFlavoursExpanded, setIsFlavoursExpanded] = useState(false);
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
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#C28E63] origin-left z-[9999]"
        style={{ scaleX: scrollYProgress }}
      />
      <GlobalBackground />
      
            {/* ─── HERO SECTION ─── */}
      <div id="hero" className="w-full relative overflow-hidden bg-[#F8F4EC] md:bg-[linear-gradient(to_right,#F8F4EC_0%,#F8F4EC_35%,#F3E9D9_45%,#EBDBC2_60%,#DDC4A2_100%)]">
        <section className="relative w-full min-h-[100svh] md:min-h-screen flex flex-col md:flex-row items-stretch pt-[60px] md:pt-0">
          
          {/* Mobile Background Image (Top Half on Mobile) */}
          <div className="w-full h-[45vh] md:hidden relative bg-[#E8E2D9]">
            <img 
              src="/images/hero/hero-composition.png" 
              alt="Bihar Bite Premium Makhana Presentation" 
              className="absolute inset-0 w-full h-full object-cover object-right" 
              style={{
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)',
                maskImage: 'linear-gradient(to top, transparent 0%, black 20%)'
              }}
            />
            {/* Soft gradient fading into content on mobile */}
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#F8F4EC] to-transparent pointer-events-none"></div>
          </div>

          {/* Left Content Container */}
          <div className="w-full md:w-[50%] lg:w-[50%] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-10 md:py-[10vh] relative z-10 bg-[#F8F4EC] md:bg-transparent">
            
            {/* Main Headline */}
            <div className="mb-6 md:mb-8 max-w-[600px]">
              {/* Brand Lockup */}
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/hero/logo.png" alt="Bihar Bite Logo" className="w-8 h-8 object-contain" />
                <span className="font-serif text-[#143A2A] text-[20px] md:text-[24px] leading-none tracking-wide font-medium mt-1">
                  Bihar <span className="italic">Bite</span>
                </span>
              </div>
              
              <h1 className="font-serif font-bold text-[#143A2A] text-[36px] sm:text-[40px] md:text-[46px] lg:text-[52px] leading-[1.15] tracking-tight mb-4">
                Premium Makhana,<br/>
                <span className="italic text-[#C28E63]">Direct from Bihar,</span><br/>
                Supplied Across India
              </h1>
              <p className="font-sans text-[#8A6A3E] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
                WHOLESALE • BULK SUPPLY • PRIVATE LABEL
              </p>
              <p className="font-sans text-[#4A4A3A] text-[15px] md:text-[16px] leading-relaxed font-medium max-w-[500px]">
                Graded Makhana from the wetlands of Bihar, supplied across India with consistent premium quality.
              </p>
            </div>

            {/* Badges/Features (Clean Inline List) */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mb-8 max-w-[600px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#E8F3EE] rounded-full flex items-center justify-center text-[#1A4533]">
                  <Leaf size={16} strokeWidth={2} />
                </div>
                <span className="font-sans font-bold text-[11px] text-[#143A2A] uppercase tracking-wide">Direct from Farms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#E8F3EE] rounded-full flex items-center justify-center text-[#1A4533]">
                  <Award size={16} strokeWidth={2} />
                </div>
                <span className="font-sans font-bold text-[11px] text-[#143A2A] uppercase tracking-wide">Premium Quality</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-[500px] w-full">
              <button 
                onClick={() => setScreen('bulk')} 
                className="flex-1 bg-[#1A4533] text-white py-3.5 px-4 rounded-xl hover:bg-[#143A2A] hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <Package size={16} strokeWidth={2} className="text-white/80 group-hover:text-white transition-colors" />
                <span className="font-sans font-bold text-[13px] tracking-wide text-white">GET B2B QUOTE</span>
              </button>
              
              <button 
                onClick={() => window.open('https://wa.me/917985347849?text=Hello%20Bihar%20Bite,%20I%20would%20like%20to%20request%20a%20sample%20of%20Makhana.', '_blank')} 
                className="flex-1 bg-white text-[#143A2A] border border-[#143A2A]/15 py-3.5 px-4 rounded-xl hover:border-[#143A2A]/30 hover:bg-[#FAF8F4] hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 fill-[#1A4533]" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                <span className="font-sans font-bold text-[13px] tracking-wide text-[#143A2A]">REQUEST SAMPLE</span>
              </button>
            </div>

            {/* Trust Signals (Subtle Text below buttons) */}
            <div className="mt-6 pt-5 border-t border-[#143A2A]/5 flex items-center gap-6 max-w-[500px]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={14} className="text-[#8A6A3E]" />
                <span className="font-sans text-[10px] font-bold text-[#4A4A3A] tracking-wider uppercase">50 KG+ MOQ</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[#8A6A3E]" />
                <span className="font-sans text-[10px] font-bold text-[#4A4A3A] tracking-wider uppercase">GST Billing</span>
              </div>
            </div>

          </div>

          {/* Right Desktop Image Showcase */}
          <div className="hidden md:block w-[50%] lg:w-[50%] relative h-screen">
            <img 
              src="/images/hero/hero-composition.png" 
              alt="Bihar Bite Premium Makhana Presentation" 
              className="absolute inset-0 w-full h-full object-cover object-[85%_center]" 
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%)'
              }}
            />
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
                  "Direct Bihar Sourcing",
                  "Multiple Grades",
                  "Consistent Quality",
                  "Bulk Supply",
                  "FSSAI Approved",
                  "Ancient Superfood",
                  "100% Natural",
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
              { num: "500+", label: "Farmers Connected" },
              { num: "3+", label: "Countries Served" },
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

      {/* ─── OUR MAKHANA RANGE (B2B CATALOGUE) ─── */}
      <section className="relative w-full pt-[100px] md:pt-[120px] pb-[80px] bg-[#FDFBF7] overflow-hidden">
        <div className="relative z-10 w-[92%] md:w-[85%] lg:w-[80%] max-w-[1700px] mx-auto">
          
          {/* Section Title */}
          <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24">
            <span className="text-xs font-semibold text-[#8A6A3E] tracking-[0.2em] uppercase block mb-4">
              B2B CATALOGUE
            </span>
            <h2 className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-4xl md:text-5xl lg:text-[56px] tracking-tight">
              <span className="font-sans font-extrabold text-[#143A2A]">OUR MAKHANA</span>
              <span className="italic text-[#C28E63]" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}>RANGE</span>
            </h2>
            <div className="w-[80px] h-[2px] bg-[#143A2A] mt-8 rounded-full" />
          </div>

          {/* Raw Makhana Subsection */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-10 border-b border-[#EBE6DA] pb-4">
              <h3 className="font-serif text-[32px] md:text-[36px] text-[#143A2A] font-bold">Raw Makhana</h3>
              <button 
                onClick={() => setIsRawMakhanaModalOpen(true)}
                className="font-sans font-bold text-[13px] text-[#143A2A] uppercase tracking-widest hover:text-[#C28E63] transition-colors flex items-center gap-1.5"
              >
                View All <ArrowRight size={16}/>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'raw-1', name: '4 Suta', price: '₹500/kg', img: '/images/01.png' },
                { id: 'raw-2', name: '4+ Suta', price: '₹800/kg', img: '/images/02.png' },
                { id: 'raw-3', name: '5 Suta', price: '₹850/kg', img: '/images/03.png' },
                { id: 'raw-4', name: '5+ Suta', price: '₹940/kg', img: '/images/04.png' },
                { id: 'raw-5', name: '6 Suta', price: '₹1,100/kg', img: '/images/makhana-05.jpeg' },
                { id: 'raw-6', name: '6+ Handpick', price: '₹1,220/kg', img: '/images/01.png' },
              ].slice(0, 3).map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group bg-white rounded-[24px] border border-[#EBE6DA] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                  onClick={() => {
                    setSelectedProduct({ id: prod.id, name: `${prod.name} Raw Makhana`, price: 0, priceDisplay: prod.price, image: prod.img, images: [prod.img], category: 'Raw', description: 'Premium B2B Raw Makhana. Minimum order 50 KG.', weight: '50kg MOQ' } as any);
                    setScreen('product');
                    window.scrollTo(0,0);
                  }}
                >
                  <div className="w-full h-[300px] p-8 flex items-center justify-center bg-[#FDFBF7]">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-sm mix-blend-multiply" />
                  </div>
                  <div className="p-8 border-t border-[#EBE6DA]/50 flex flex-col grow justify-between bg-white relative z-10">
                    <div>
                      <h4 className="font-sans font-bold text-[22px] text-[#143A2A] mb-2">{prod.name}</h4>
                      <p className="font-sans font-bold text-[#8A6A3E] text-[20px] mb-6">{prod.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-dashed border-[#EBE6DA]">
                      <span className="font-sans font-bold text-[11px] text-[#4A4A3A] uppercase tracking-widest bg-[#F5F2EA] px-3 py-1.5 rounded-md">MOQ 50 KG</span>
                      <span className="font-sans font-bold text-[12px] text-[#143A2A] uppercase tracking-widest group-hover:text-[#C28E63] transition-colors flex items-center gap-1.5">
                        VIEW DETAILS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Roasted & Flavoured Subsection */}
          <div>
            <h3 className="font-serif text-[32px] md:text-[36px] text-[#143A2A] mb-10 border-b border-[#EBE6DA] pb-4 font-bold">Roasted & Flavoured</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'roast-1', name: 'Roasted Makhana', price: '₹1,250/kg', img: '/images/04.png' },
                { id: 'roast-2', name: 'Peri Peri Makhana', price: 'Bulk Pricing', img: '/images/02.png' },
              ].map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group bg-white rounded-[24px] border border-[#EBE6DA] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                  onClick={() => {
                    setSelectedProduct({ id: prod.id, name: prod.name, price: 0, priceDisplay: prod.price, image: prod.img, images: [prod.img], category: 'Roasted', description: 'Premium B2B Roasted & Flavoured Makhana. Minimum order 50 KG.', weight: '50kg MOQ' } as any);
                    setScreen('product');
                    window.scrollTo(0,0);
                  }}
                >
                  <div className="w-full h-[300px] p-8 flex items-center justify-center bg-[#FDFBF7]">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-sm mix-blend-multiply" />
                  </div>
                  <div className="p-8 border-t border-[#EBE6DA]/50 flex flex-col grow justify-between bg-white relative z-10">
                    <div>
                      <h4 className="font-sans font-bold text-[22px] text-[#143A2A] mb-2">{prod.name}</h4>
                      <p className="font-sans font-bold text-[#8A6A3E] text-[20px] mb-6">{prod.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-dashed border-[#EBE6DA]">
                      <span className="font-sans font-bold text-[11px] text-[#4A4A3A] uppercase tracking-widest bg-[#F5F2EA] px-3 py-1.5 rounded-md">MOQ 50 KG</span>
                      <span className="font-sans font-bold text-[12px] text-[#143A2A] uppercase tracking-widest group-hover:text-[#C28E63] transition-colors flex items-center gap-1.5">
                        VIEW DETAILS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Custom Explore More Flavours Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group bg-[#FDFBF7] rounded-[24px] border border-[#EBE6DA] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col relative h-full min-h-[450px]"
                onClick={() => setIsFlavoursExpanded(!isFlavoursExpanded)}
              >
                {/* Subtle hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EA] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8 grow">
                  {!isFlavoursExpanded ? (
                    <div className="flex flex-col items-center justify-center w-full grow">
                      <div className="w-8 h-[1px] bg-[#C28E63]/50 group-hover:bg-[#C28E63] group-hover:w-16 transition-all duration-700 ease-out mb-6" />
                      <h4 className="font-serif italic text-[32px] md:text-[38px] text-[#143A2A] leading-[1.1] mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                        Explore More<br/>Flavours
                      </h4>
                      
                      {/* Animated reveal on hover */}
                      <div className="h-6 overflow-hidden flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        <span className="font-sans font-bold text-[12px] text-[#C28E63] uppercase tracking-widest flex items-center gap-2">
                          Discover more flavour options <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300"/>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center w-full h-full"
                    >
                      <h4 className="font-serif italic text-[28px] text-[#143A2A] mb-8">Custom Flavours</h4>
                      <div className="flex flex-col gap-4 w-full max-w-[250px]">
                        {['Tangy Tomato', 'Mint & Lime', 'Cheese & Herbs', 'Indian Masala'].map((flavour, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="font-sans text-[15px] text-[#4A4A3A] font-medium border-b border-[#EBE6DA] pb-3 flex justify-between items-center"
                          >
                            <span>{flavour}</span>
                            <span className="text-[10px] text-[#8A6A3E] uppercase tracking-widest font-bold">MOQ 50 KG</span>
                          </motion.div>
                        ))}
                      </div>
                      <span className="mt-8 font-sans font-bold text-[11px] text-[#143A2A] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
                        Click to close
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── PRIVATE LABEL CTA SECTION ─── */}
      <section className="relative w-full mt-[50px] py-16 md:py-24 bg-[#FAF8F4] overflow-hidden border-t border-[#EBE6DA]">
        <div className="relative z-10 w-[92%] md:w-[85%] lg:w-[80%] max-w-[1700px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left: Heading & Intro */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="w-full lg:w-[45%]"
            >
              <div className="w-12 h-[2px] bg-[#C28E63] mb-8" />
              <h2 className="font-serif text-[36px] md:text-[44px] lg:text-[52px] text-[#143A2A] leading-[1.1] mb-6">
                Launch Your <br/>
                <span className="italic text-[#C28E63]">Own Makhana Brand</span>
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-[#4A4A3A] mb-10 max-w-[480px] leading-relaxed">
                From sourcing to packing, we help businesses build and scale their own premium makhana brand.
              </p>
              
              <button 
                onClick={() => {
                  navigate('/private-label');
                  window.scrollTo(0,0);
                }}
                className="group flex items-center gap-3 bg-[#143A2A] text-white px-8 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-[12px] transition-all duration-300 hover:bg-[#1A4533] hover:shadow-lg hover:-translate-y-0.5"
              >
                START YOUR PRIVATE LABEL <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Right: Services Grid */}
            <div className="w-full lg:w-[55%]">
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                {[
                  "Makhana sourcing",
                  "Grading",
                  "Roasting",
                  "Flavouring",
                  "Custom packaging",
                  "Nitrogen flushing",
                  "Batch printing",
                  "Bulk dispatch"
                ].map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.05 + 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#143A2A]/5 flex items-center justify-center shrink-0 group-hover:bg-[#C28E63]/10 transition-colors">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C28E63" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="font-sans text-[15px] md:text-[16px] text-[#143A2A] font-medium tracking-wide">
                      {service}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS (PREMIUM SELECTION) ─── */}
      <section className="relative w-full py-[100px] md:py-[140px] bg-[#143A2A] overflow-hidden">
        {/* Ambient Decor */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,_#1A4533_0%,_transparent_70%)] blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle,_#0E281C_0%,_transparent_70%)] blur-[100px]" />
        </div>

        <div className="relative z-10 w-[92%] md:w-[85%] lg:w-[80%] max-w-[1700px] mx-auto">
          
          {/* Section Title */}
          <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-20">
            <span className="text-xs font-semibold text-[#8A6A3E] tracking-[0.2em] uppercase block mb-4">
              CURATED SELECTION
            </span>
            <h2 className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-4xl md:text-5xl lg:text-[56px] tracking-tight">
              <span className="font-sans font-extrabold text-[#FAF8F4]">FEATURED</span>
              <span className="italic text-[#C28E63]" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}>PRODUCTS</span>
            </h2>
            <div className="w-[80px] h-[2px] bg-[#C28E63] mt-8 rounded-full" />
          </div>

          {/* Premium Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Main Feature - Spans 8 columns on Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-8 group relative bg-[#0E281C]/50 rounded-[32px] overflow-hidden cursor-pointer min-h-[450px] md:min-h-[550px] flex items-center shadow-2xl border border-white/10 backdrop-blur-sm"
              onClick={() => {
                setSelectedProduct({ id: 'feat-1', name: 'Premium Roasted Makhana', price: 0, priceDisplay: '₹1,250/kg', image: '/images/04.png', images: ['/images/04.png'], category: 'Roasted', description: 'Curated premium roasted makhana for bulk buyers.', weight: '50kg MOQ' } as any);
                setScreen('product');
                window.scrollTo(0,0);
              }}
            >
              <div className="absolute inset-0 w-full h-full p-8 md:p-12 lg:p-20 flex justify-end items-center opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                <img src="/images/04.png" alt="Roasted Makhana" className="h-full w-auto object-contain object-right group-hover:scale-110 group-hover:-rotate-2 transition-all duration-700 ease-out mix-blend-screen" />
              </div>
              <div className="relative z-10 p-8 md:p-12 w-full md:w-2/3 h-full flex flex-col justify-center bg-gradient-to-r from-[#143A2A] via-[#143A2A]/90 to-transparent">
                <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-[#C28E63] uppercase mb-4">Export Grade</span>
                <h3 className="font-serif text-[40px] md:text-[56px] text-[#FAF8F4] leading-[1.05] mb-6 font-bold">Premium Roasted<br/><span className="italic font-light">Makhana</span></h3>
                <p className="font-sans text-[#FAF8F4]/80 text-[16px] md:text-[18px] mb-10 max-w-[340px] leading-relaxed">Perfectly roasted premium lotus seeds, ready for private label packaging or direct distribution.</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <span className="font-sans font-bold text-[12px] text-[#FAF8F4] uppercase tracking-widest bg-white/10 px-5 py-2.5 rounded-full border border-white/10 w-fit">MOQ 50 KG</span>
                  <span className="font-sans font-bold text-[13px] text-[#C28E63] uppercase tracking-widest flex items-center gap-2 group-hover:text-white transition-colors w-fit">
                    VIEW DETAILS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Secondary Feature - Spans 4 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-4 group relative bg-[#0E281C]/50 rounded-[32px] overflow-hidden cursor-pointer min-h-[450px] flex flex-col justify-end shadow-2xl border border-white/10 backdrop-blur-sm"
              onClick={() => {
                setSelectedProduct({ id: 'feat-2', name: 'Retail Packaged Makhana', price: 0, priceDisplay: 'Bulk Supply', image: '/images/02.png', images: ['/images/02.png'], category: 'Packaged', description: 'Consumer-ready retail packages available in bulk.', weight: '50kg MOQ' } as any);
                setScreen('product');
                window.scrollTo(0,0);
              }}
            >
              <div className="absolute inset-0 w-full h-[65%] p-10 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                <img src="/images/02.png" alt="Packaged Makhana" className="w-full h-full object-contain group-hover:scale-110 transition-all duration-700 ease-out mix-blend-screen" />
              </div>
              <div className="relative z-10 p-8 md:p-10 bg-gradient-to-t from-[#143A2A] via-[#143A2A]/95 to-transparent pt-32">
                <h3 className="font-serif font-bold text-[32px] text-[#FAF8F4] leading-[1.1] mb-6">Retail<br/><span className="italic font-light">Packaged</span></h3>
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-[10px] text-[#FAF8F4] uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-md border border-white/10">MOQ 50 KG</span>
                  <span className="font-sans font-bold text-[12px] text-[#C28E63] uppercase tracking-widest group-hover:text-white transition-colors flex items-center gap-1.5">
                    DETAILS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Third Feature - Spans 6 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-6 group relative bg-[#0E281C]/50 rounded-[32px] overflow-hidden cursor-pointer min-h-[380px] flex items-center shadow-2xl border border-white/10 backdrop-blur-sm"
              onClick={() => {
                setSelectedProduct({ id: 'feat-3', name: 'Makhana Papad', price: 0, priceDisplay: 'Bulk Supply', image: '/images/makhana-05.jpeg', images: ['/images/makhana-05.jpeg'], category: 'Papad', description: 'Traditional healthy Makhana Papad in bulk.', weight: '50kg MOQ' } as any);
                setScreen('product');
                window.scrollTo(0,0);
              }}
            >
              <div className="w-1/2 h-full p-8 md:p-12 flex flex-col justify-center bg-gradient-to-r from-[#143A2A] via-[#143A2A]/90 to-transparent relative z-10">
                <h3 className="font-serif font-bold text-[32px] md:text-[40px] text-[#FAF8F4] leading-[1.1] mb-8">Makhana<br/><span className="italic font-light text-[#C28E63]">Papad</span></h3>
                <div className="flex flex-col items-start gap-5">
                  <span className="font-sans font-bold text-[11px] text-[#FAF8F4] uppercase tracking-wider bg-white/10 px-4 py-2 rounded-md border border-white/10">MOQ 50 KG</span>
                  <span className="font-sans font-bold text-[13px] text-[#C28E63] uppercase tracking-widest group-hover:text-white transition-colors flex items-center gap-1.5">
                    VIEW DETAILS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                  </span>
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-2/3 p-0 flex items-center justify-end">
                <img src="/images/makhana-05.jpeg" alt="Makhana Papad" className="h-[120%] w-auto object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#143A2A]/40 mix-blend-multiply pointer-events-none"></div>
              </div>
            </motion.div>

            {/* Fourth Feature - Spans 6 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-6 group relative bg-[#0E281C]/50 rounded-[32px] overflow-hidden cursor-pointer min-h-[380px] flex items-center shadow-2xl border border-white/10 backdrop-blur-sm"
              onClick={() => {
                setSelectedProduct({ id: 'feat-4', name: 'Makhana Cookies', price: 0, priceDisplay: 'Bulk Supply', image: '/images/03.png', images: ['/images/03.png'], category: 'Cookies', description: 'Healthy Makhana Cookies for B2B supply.', weight: '50kg MOQ' } as any);
                setScreen('product');
                window.scrollTo(0,0);
              }}
            >
              <div className="w-1/2 h-full p-8 md:p-12 flex flex-col justify-center bg-gradient-to-r from-[#143A2A] via-[#143A2A]/90 to-transparent relative z-10">
                <h3 className="font-serif font-bold text-[32px] md:text-[40px] text-[#FAF8F4] leading-[1.1] mb-8">Makhana<br/><span className="italic font-light text-[#C28E63]">Cookies</span></h3>
                <div className="flex flex-col items-start gap-5">
                  <span className="font-sans font-bold text-[11px] text-[#FAF8F4] uppercase tracking-wider bg-white/10 px-4 py-2 rounded-md border border-white/10">MOQ 50 KG</span>
                  <span className="font-sans font-bold text-[13px] text-[#C28E63] uppercase tracking-widest group-hover:text-white transition-colors flex items-center gap-1.5">
                    VIEW DETAILS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                  </span>
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-2/3 p-8 flex items-center justify-end opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                <img src="/images/03.png" alt="Makhana Cookies" className="w-full h-full object-contain group-hover:scale-110 group-hover:translate-x-2 transition-all duration-700 ease-out mix-blend-screen" />
              </div>
            </motion.div>

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

      {/* ─── B2B / WHOLESALE SECTION ─── */}
      <B2BSection onNavigateBulk={() => setScreen('bulk')} />

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
      
      {/* ─── FAQ SECTION ─── */}
      <FAQSection />
      
      {/* ─── RAW MAKHANA MODAL ─── */}
      <AnimatePresence>
        {isRawMakhanaModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setIsRawMakhanaModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[1200px] max-h-[90vh] bg-[#F5F2EA] rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-[#EBE6DA]">
                <div>
                  <h3 className="font-serif text-[28px] md:text-[36px] text-[#143A2A] leading-none">All Raw Makhana</h3>
                  <p className="font-sans text-[#8A6A3E] mt-2 text-[14px] uppercase tracking-widest font-semibold">Premium B2B Catalogue</p>
                </div>
                <button 
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[#F5F2EA] transition-colors border border-[#EBE6DA] text-[#143A2A]"
                  onClick={() => setIsRawMakhanaModalOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: 'raw-1', name: '4 Suta', price: '₹500/kg', img: '/images/01.png' },
                    { id: 'raw-2', name: '4+ Suta', price: '₹800/kg', img: '/images/02.png' },
                    { id: 'raw-3', name: '5 Suta', price: '₹850/kg', img: '/images/03.png' },
                    { id: 'raw-4', name: '5+ Suta', price: '₹940/kg', img: '/images/04.png' },
                    { id: 'raw-5', name: '6 Suta', price: '₹1,100/kg', img: '/images/makhana-05.jpeg' },
                    { id: 'raw-6', name: '6+ Handpick', price: '₹1,220/kg', img: '/images/01.png' },
                  ].map((prod, idx) => (
                    <motion.div
                      key={prod.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="group bg-white rounded-[24px] border border-[#EBE6DA] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
                    >
                      <div className="relative w-full h-[250px] p-6 flex items-center justify-center bg-[#FDFBF7]">
                        <img src={prod.img} alt={prod.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-sm mix-blend-multiply" />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            className="bg-[#C28E63] hover:bg-[#a67751] text-white font-sans font-bold text-[12px] uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (onAddToCart) onAddToCart({ id: prod.id, name: `${prod.name} Raw Makhana`, price: parseInt(prod.price.replace(/[^\d]/g, '')), image: prod.img } as any, '50kg MOQ', 1);
                            }}
                          >
                            <ShoppingBag size={16} /> Add to Cart
                          </button>
                          <button 
                            className="bg-white hover:bg-gray-100 text-[#143A2A] font-sans font-bold text-[12px] uppercase tracking-widest px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsRawMakhanaModalOpen(false);
                              setSelectedProduct({ id: prod.id, name: `${prod.name} Raw Makhana`, price: 0, priceDisplay: prod.price, image: prod.img, images: [prod.img], category: 'Raw', description: 'Premium B2B Raw Makhana. Minimum order 50 KG.', weight: '50kg MOQ' } as any);
                              setScreen('product');
                              window.scrollTo(0,0);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                      <div className="p-6 border-t border-[#EBE6DA]/50 flex flex-col grow justify-between bg-white">
                        <div>
                          <h4 className="font-sans font-bold text-[20px] text-[#143A2A] mb-1">{prod.name}</h4>
                          <p className="font-sans font-bold text-[#8A6A3E] text-[18px]">{prod.price}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-dashed border-[#EBE6DA]">
                          <span className="font-sans font-bold text-[10px] text-[#4A4A3A] uppercase tracking-widest bg-[#F5F2EA] px-3 py-1.5 rounded-md">MOQ 50 KG</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
