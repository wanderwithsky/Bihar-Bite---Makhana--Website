import { useState, FormEvent } from 'react';
import { ArrowRight, Share2, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScreenType } from '../types';

interface FooterProps {
  setScreen: (screen: ScreenType) => void;
  onSubscribe: (email: string) => void;
}

export default function Footer({ setScreen, onSubscribe }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#143A2A] via-[#0E281C] to-[#0A1A12] text-white pt-16 pb-8 border-t border-[#C28E63]/20 mt-auto font-sans overflow-hidden">
      
      {/* ─── AMBIENT FOOTER DECOR: BOTANICAL ILLUSTRATIONS ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        {/* Large Botanical Leaves Bottom Left */}
        <svg className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rotate-12" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10C149.706 10 190 50.2944 190 100C190 149.706 149.706 190 100 190C50.2944 190 10 149.706 10 100C10 50.2944 50.2944 10 100 10Z" fill="#FAF8F4"/>
          <path d="M100 10V100" stroke="#FAF8F4" strokeWidth="2" />
        </svg>
        {/* Large Botanical Leaves Bottom Right */}
        <svg className="absolute -bottom-10 -right-32 w-[600px] h-[600px] -rotate-12" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10C149.706 10 190 50.2944 190 100C190 149.706 149.706 190 100 190C50.2944 190 10 149.706 10 100C10 50.2944 50.2944 10 100 10Z" fill="#FAF8F4"/>
          <path d="M100 10V100" stroke="#FAF8F4" strokeWidth="2" />
        </svg>
      </div>

      {/* Brand & Newsletter Header Row */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
        <div className="lg:col-span-5 space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">
          <h2 className="font-serif text-3xl font-extralight text-secondary-container cursor-pointer tracking-tight hover:opacity-95">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Bihar <span className="italic font-normal">Bite</span>
            </Link>
          </h2>
          <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
            Cultivating Heritage, Delivering Purity. Sourcing premium, mineral-rich Euryale Ferox directly from the pristine waterlily wetlands of Mithila, Bihar. Freshly slow-roasted and graded to perfection.
          </p>
        </div>
        
        <div className="lg:col-span-7 flex flex-col justify-center space-y-3 text-center lg:text-left items-center lg:items-start mt-8 lg:mt-0">
          <span className="text-xs font-semibold text-secondary-container tracking-widest uppercase">Subscribe to our Journal</span>
          <p className="text-xs text-white/70 max-w-md font-light">
            Stay updated on harvest cycles, gourmet recipes, exclusive discounts, and health news.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-md w-full relative">
            <input 
              type="email"
              required
              placeholder={subscribed ? "Subscription active! Thank you" : "Enter your email address"}
              disabled={subscribed}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-primary-container border-none text-white text-xs rounded-xl sm:rounded-r-none sm:rounded-l-xl focus:ring-1 focus:ring-secondary-container px-4 py-3 placeholder-white/40 focus:outline-none font-light"
            />
            <button 
              type="submit"
              disabled={subscribed}
              className={`bg-secondary-container text-primary font-bold px-5 py-3 rounded-xl sm:rounded-l-none sm:rounded-r-xl transition-all text-xs uppercase tracking-widest min-h-[44px] ${
                subscribed ? 'bg-green-500 text-white' : 'hover:bg-[#E5D7B3] active:scale-95'
              }`}
            >
              Join
            </button>
          </form>
          <div className="flex gap-2 text-[10px] text-white/40 items-center">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure. Spam-free. Unsubscribe anytime.</span>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center sm:text-left">
        
        {/* Column 1: Company */}
        <div className="space-y-4">
          <h3 className="text-secondary-container font-semibold text-xs uppercase tracking-wider">
            Company
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-white/80 font-light">
            <li>
              <Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4">
                About Bihar Bite
              </Link>
            </li>
            <li>
              <Link to="/our-story" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4">
                Our Story & Heritage
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/blog" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4">
                Our Journal & Blog
              </Link>
            </li>
            <li>
              <Link to="/faqs" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Customer Support */}
        <div className="space-y-4">
          <h3 className="text-secondary-container font-semibold text-xs uppercase tracking-wider">
            Customer Support
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-white/80 font-light">
            <li>
              <Link to="/shipping-policy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/return-refund-policy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block">
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block text-left">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block text-left">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/track-order" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block text-left">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Business */}
        <div className="space-y-4">
          <h3 className="text-secondary-container font-semibold text-xs uppercase tracking-wider">
            Business
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-white/80 font-light">
            <li>
              <Link to="/bulk" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block text-left">
                Bulk Orders
              </Link>
            </li>
            <li>
              <Link to="/bulk" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block text-left">
                Wholesale & HoReCa
              </Link>
            </li>
            <li>
              <Link to="/bulk" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block text-left">
                Export Solutions
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors hover:underline underline-offset-4 block text-left">
                Become a Distributor
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Connect */}
        <div className="space-y-4">
          <h3 className="text-secondary-container font-semibold text-xs uppercase tracking-wider">
            Connect
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-white/80 font-light">
            <li>
              <a href="https://wa.me/917985347849?text=Hi+Bihar+Bite%21+I%27d+like+to+know+more+about+your+Makhana+products." target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:underline underline-offset-4 block">
                WhatsApp: +91 79853 47849
              </a>
            </li>
            <li>
              <a href="https://instagram.com/bihar_biteofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:underline underline-offset-4 block">
                Instagram: bihar_biteofficial
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/Biharbiteofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:underline underline-offset-4 block">
                Facebook: Biharbite Makhana
              </a>
            </li>
            <li>
              <a href="https://youtube.com/@biharbitemakhana?si=7na-GBWRa19EaZMA" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:underline underline-offset-4 block">
                YouTube: Biharbite Makhana
              </a>
            </li>
            <li>
              <a href="mailto:info@biharbite.com" className="hover:text-white transition-colors hover:underline underline-offset-4 block">
                Email: info@biharbite.com
              </a>
            </li>
            <li>
              <a href="tel:+919336311140" className="hover:text-white transition-colors hover:underline underline-offset-4 block">
                Phone: +91 93363 11140
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Trust Badges, Payment & Delivery Partner icons */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-b border-primary-container/20 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left text-xs text-white/70">
        
        {/* Secure Payments Badge & List */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-container block">Secure Payments</span>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/90 border border-primary-container font-semibold">Visa</span>
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/90 border border-primary-container font-semibold">Mastercard</span>
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/90 border border-primary-container font-semibold">UPI Auto</span>
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/90 border border-primary-container font-semibold">RuPay</span>
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/90 border border-primary-container font-semibold">NetBanking</span>
          </div>
        </div>

        {/* SSL Badge */}
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-green-950/40 text-green-400 border border-green-900/50 px-3 py-1.5 rounded-full text-[11px] font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            🔒 256-Bit SSL Secure Connection
          </div>
          <span className="text-[10px] text-white/40">Guaranteed safe and encrypted transactions</span>
        </div>

        {/* Delivery Partner Logos */}
        <div className="space-y-2 text-center md:text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-container block">Dispatch & Shipping Partners</span>
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/95 border border-primary-container font-medium">Delhivery</span>
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/95 border border-primary-container font-medium">Blue Dart</span>
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/95 border border-primary-container font-medium">DTDC</span>
            <span className="bg-primary-container px-2 py-1 rounded text-[10px] text-white/95 border border-primary-container font-medium">Xpressbees</span>
          </div>
        </div>

      </div>

      {/* Bottom Footer Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 text-xs text-white/60">
        <p>© 2026 Bihar Bite. Cultivating Heritage, Delivering Purity. Sourced in Bihar, enjoyed globally.</p>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3 h-3 text-[#E5D7B3] fill-[#E5D7B3]" /> from Mithila, India
          </span>
        </div>
      </div>
    </footer>
  );
}