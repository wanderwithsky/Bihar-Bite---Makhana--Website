import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Heart, ShoppingBag, X, UserCircle, ShieldAlert, Phone, Mail, MapPin, Menu, Star } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartItem, Product, ScreenType, User } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  selectedCategory: Product['category'] | 'All';
  setSelectedCategory: (category: Product['category'] | 'All') => void;
  setSelectedProduct: (product: Product | null) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  wishlist: Product[];
  setIsWishlistOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: () => void;
  currentUser: User | null;
  currentAdmin: { email: string; name: string } | null;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

export default function Header({
  currentScreen,
  setScreen,
  selectedCategory,
  setSelectedCategory,
  setSelectedProduct,
  cart,
  setIsCartOpen,
  wishlist,
  setIsWishlistOpen,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  currentUser,
  currentAdmin,
  onOpenAuthModal,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const { scrollY, scrollYProgress } = useScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Show top-bar transition
    if (current > 50 !== hasScrolled) {
      setHasScrolled(current > 50);
      if (current > 50) {
        setIsExpanded(false);
        setIsSearchActive(false);
      }
    }
    
    // Hide/show navbar on scroll direction
    if (current < 60) {
      if (!isNavVisible) setIsNavVisible(true);
    } else if (current > previous + 8 && current > 60) {
      // Scrolling down quickly -> hide
      if (isNavVisible) setIsNavVisible(false);
    } else if (current < previous - 8) {
      // Scrolling up quickly -> show
      if (!isNavVisible) setIsNavVisible(true);
    }
  });

  const topReviews = [
    { text: "The freshest makhana we've ever tasted. Bihar Bite has become our family's favourite healthy snack.", name: "Rakesh Sharma" },
    { text: "Premium packaging, amazing crunch and authentic taste. Bihar Bite truly stands out from every other brand.", name: "Neha Gupta" },
    { text: "I ordered once just to try it. Now Bihar Bite is part of my monthly grocery list.", name: "Aman Verma" },
    { text: "Excellent quality, fast delivery and perfectly roasted makhana. Highly recommended.", name: "Priya Singh" }
  ];

  useEffect(() => {
    if (!hasScrolled && topReviews.length > 0) {
      const interval = setInterval(() => {
        setActiveReviewIndex((prev) => (prev + 1) % topReviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [hasScrolled]);

  useEffect(() => {
    let observer: IntersectionObserver;
    let fallbackListener: () => void;

    const observeHero = () => {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        observer = new IntersectionObserver(
          ([entry]) => {
            setIsHeroVisible(entry.isIntersecting);
          },
          { rootMargin: '-10px 0px 0px 0px', threshold: 0 }
        );
        observer.observe(heroEl);
      } else {
        // Fallback: if no hero element, assume we're not in a hero after scrolling past 200px
        fallbackListener = () => {
          setIsHeroVisible(window.scrollY < 200);
        };
        fallbackListener();
        window.addEventListener('scroll', fallbackListener, { passive: true });
      }
    };

    const timer = setTimeout(observeHero, 100);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      if (fallbackListener) window.removeEventListener('scroll', fallbackListener);
    };
  }, [location.pathname]);

  // Removed manual scroll listener in favor of useMotionValueEvent

  const handleNavClick = (path: string) => {
    setSelectedProduct(null);
    navigate(path);
    setIsExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
      setIsExpanded(false);
      setIsSearchActive(false);
    }
  };

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'PRODUCTS', path: '/shop' },
    { label: 'ABOUT', path: '/about' },
    { label: 'BLOG', path: '/blog' },
    { label: 'BULK & EXPORT', path: '/bulk' },
    { label: 'CONTACT', path: '/contact' },
  ];

  const showHeroNav = location.pathname === '/' && isHeroVisible;

  return (
    <>
      {/* Top Customer Review Ticker */}
      <AnimatePresence>
        {!hasScrolled && topReviews.length > 0 && (
          <motion.div 
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            className="fixed top-0 w-full z-40 bg-[#55613A] h-[34px] md:h-[42px] flex items-center justify-center overflow-hidden"
          >
            <AnimatePresence>
              {topReviews[activeReviewIndex % topReviews.length] && (
                <motion.div
                  key={activeReviewIndex}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute w-full px-4 flex items-center justify-center gap-1.5 md:gap-2 text-white font-sans font-medium text-[12px]"
                >
                  <div className="flex gap-[2px] shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-[14px] h-[14px] fill-[#D4A24A] text-[#D4A24A]" />
                    ))}
                  </div>
                  <span className="truncate max-w-[50vw] sm:max-w-none tracking-wide">
                    "{topReviews[activeReviewIndex % topReviews.length].text}"
                  </span>
                  <span className="shrink-0 opacity-80 md:ml-1">— {topReviews[activeReviewIndex % topReviews.length].name}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Standard Sticky Horizontal Navbar (Appears outside Hero section) */}
      <AnimatePresence>
        {!showHeroNav && (
          <motion.header
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="hidden md:block fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-stone-200/50 shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
              {/* Logo */}
              <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-2">
                <span className="font-serif text-2xl font-light tracking-tight text-[#143A2A]">
                  Bihar <span className="italic">Bite</span>
                </span>
              </Link>
              
              {/* Center Links (Desktop) */}
              <nav className="hidden lg:flex items-center gap-8">
                {navLinks.map(link => {
                  let destPath = link.path;
                  // Handle sections that don't exist as dedicated pages yet, mapping them to home hashes
                  if (link.label === 'GALLERY') destPath = '/#gallery';
                  if (link.label === 'PROCESS') destPath = '/#process';
                  
                  return (
                    <Link
                      key={link.label}
                      to={destPath}
                      onClick={(e) => {
                        if (destPath.startsWith('/#')) {
                          e.preventDefault();
                          navigate('/');
                          setTimeout(() => {
                            const id = destPath.split('#')[1];
                            const el = document.getElementById(id);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        } else {
                          window.scrollTo(0,0);
                        }
                      }}
                      className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-colors ${
                        location.pathname === destPath ? 'text-[#7C8464]' : 'text-[#4A4A3A] hover:text-[#7C8464]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Right Icons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSearchActive(true)}
                  className="w-11 h-11 flex items-center justify-center text-[#4A4A3A] hover:text-[#7C8464] transition-colors rounded-full hover:bg-stone-100"
                >
                  <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
                <button 
                  onClick={() => setIsWishlistOpen(true)}
                  className="w-11 h-11 flex items-center justify-center text-[#4A4A3A] hover:text-[#7C8464] transition-colors rounded-full hover:bg-stone-100"
                >
                  <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
                <button 
                  onClick={() => {
                    if (currentUser) handleNavClick('/account');
                    else onOpenAuthModal();
                  }}
                  className="w-11 h-11 flex items-center justify-center text-[#4A4A3A] hover:text-[#7C8464] transition-colors rounded-full hover:bg-stone-100 hidden md:flex"
                >
                  <UserCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="w-11 h-11 flex items-center justify-center text-[#4A4A3A] hover:text-[#7C8464] transition-colors rounded-full hover:bg-stone-100 relative"
                >
                  <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#7C8464] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Search Dropdown for Standard Nav */}
            <AnimatePresence>
              {isSearchActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="absolute top-full left-0 right-0 bg-white border-b border-stone-200/50 shadow-lg overflow-hidden"
                >
                  <div className="max-w-3xl mx-auto px-6 py-6 flex items-center gap-4">
                    <Search className="w-5 h-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search for Makhana, flavours..."
                      className="flex-1 bg-transparent border-none outline-none text-stone-700 font-sans text-lg placeholder-stone-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyPress}
                      autoFocus
                    />
                    <button onClick={() => setIsSearchActive(false)}>
                      <X className="w-5 h-5 text-stone-400 hover:text-stone-700" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Horizontal Navbar */}
      <AnimatePresence>
        {(!showHeroNav || hasScrolled) && (
          <motion.header
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden fixed top-0 left-0 right-0 z-[1000] bg-[#FFFFFF] backdrop-blur-[10px] border-b border-[rgba(0,0,0,0.08)] shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
          >
            <div className="w-full h-[64px] px-4 flex items-center justify-between relative">
              {/* Left Hamburger */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-[44px] h-[44px] flex items-center justify-start text-[#143A2A]"
                aria-label="Open Navigation"
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>

              {/* Center Brand */}
              <Link to="/" onClick={() => window.scrollTo(0,0)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="font-serif text-2xl font-light tracking-tight text-[#143A2A]">
                  Bihar <span className="italic">Bite</span>
                </span>
              </Link>

              {/* Right Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="w-[44px] h-[44px] flex items-center justify-end text-[#4A4A3A]"
                aria-label="Open Cart"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#7C8464] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar (Only during Hero) */}
      <AnimatePresence>
        {!isNavVisible && showHeroNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 h-[3px] bg-[#C28E63] z-[60] origin-left"
            style={{ scaleX }}
          />
        )}
      </AnimatePresence>
      {/* Floating Cart (Only during Hero on Mobile) */}
      <AnimatePresence>
        {showHeroNav && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              y: isNavVisible ? 0 : -120, 
              opacity: isNavVisible ? 1 : 0, 
              scale: isNavVisible ? 1 : 0.9 
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
            className={`md:hidden fixed z-50 flex transition-all duration-[250ms] ease-in-out right-4 top-[48px] ${hasScrolled ? '-translate-y-4 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'}`}
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center bg-[#21492F] text-white shadow-lg cursor-pointer border-[0.5px] border-white/30 backdrop-blur-md relative"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-white" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4A24A] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Navigation (Only during Hero) */}
      <AnimatePresence>
        {showHeroNav && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              y: isNavVisible ? 0 : -120, 
              opacity: isNavVisible ? 1 : 0, 
              scale: isNavVisible ? 1 : 0.9 
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
            className={`fixed z-50 flex transition-all duration-[250ms] ease-in-out left-4 top-[48px] md:left-0 md:right-0 md:justify-center ${hasScrolled ? 'md:top-6 -translate-y-4 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto' : 'md:top-14 translate-y-0 opacity-100 pointer-events-auto'}`}
          >
            <motion.div
          layout
          data-expanded={isExpanded}
          className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-stone-200/60 shadow-xl overflow-hidden flex items-center justify-center relative"
          style={{
            borderRadius: isExpanded ? '32px' : '50px',
          }}
          initial={{ width: 56, height: 56 }}
          animate={{
            width: isExpanded ? 'auto' : 56,
            height: isExpanded ? 'auto' : 56,
            minHeight: isExpanded ? 56 : 56,
            padding: isExpanded ? '0.5rem 1.5rem' : '0',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.button
                key="closed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileMenuOpen(true);
                  } else {
                    setIsExpanded(true);
                  }
                }}
                className="w-[52px] h-[52px] md:w-14 md:h-14 rounded-full flex items-center justify-center bg-[#21492F] md:bg-[#5A6342] text-white shadow-lg cursor-pointer border-[0.5px] border-white/30 backdrop-blur-md"
                aria-label="Open Navigation"
              >
                <Menu className="w-5 h-5 text-white" strokeWidth={1.5} />
              </motion.button>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4 md:gap-8 flex-wrap justify-center py-2 px-2"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-11 h-11 flex items-center justify-center bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 rounded-full transition-colors order-first"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Nav Links */}
                <div className="hidden lg:flex items-center gap-6">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      onClick={() => handleNavClick(link.path)}
                      className={`text-[10px] tracking-[0.2em] font-bold uppercase transition-colors ${
                        location.pathname === link.path ? 'text-[#7C8464]' : 'text-[#4A4A3A] hover:text-[#7C8464]'
                      }`}
                    >
                      {link.label}
                    </motion.button>
                  ))}
                </div>

                {/* Actions (Search, Wishlist, Cart, Account) */}
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 md:gap-3"
                >
                  {/* Search */}
                  <div className="flex items-center">
                    <AnimatePresence>
                      {isSearchActive && (
                        <motion.input
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 140, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleSearchKeyPress}
                          className="bg-stone-100 border-none rounded-full py-1.5 pl-4 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8464] font-sans text-stone-800 mr-2"
                          autoFocus
                        />
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => isSearchActive ? onSearchSubmit() : setIsSearchActive(true)}
                      className="w-11 h-11 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={() => { setIsWishlistOpen(true); setIsExpanded(false); }}
                    className="w-11 h-11 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-colors relative"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-[#7C8464] text-[#7C8464]' : ''}`} />
                    {wishlist.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-[#7C8464] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  {/* Profile */}
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      if (currentUser) handleNavClick('/account');
                      else onOpenAuthModal();
                    }}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <UserCircle className="w-4 h-4" strokeWidth={1.5} />
                  </button>

                  {/* Cart */}
                  <button
                    onClick={() => { setIsCartOpen(true); setIsExpanded(false); }}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-colors relative"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {cartCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-[#7C8464] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Bulk Inquiry Button */}
                  <button
                    onClick={() => handleNavClick('bulk')}
                    className="hidden lg:inline-flex bg-[#7C8464] hover:bg-[#6A7155] text-white text-[9px] tracking-[0.2em] uppercase font-bold px-5 py-2.5 rounded-full transition-colors ml-2"
                  >
                    Inquire Bulk
                  </button>
                </motion.div>
                
                {/* Mobile Dropdown fallback for links */}
                <div className="w-full lg:hidden flex justify-center mt-2 border-t border-stone-200 pt-3">
                   <div className="flex flex-wrap justify-center gap-3">
                     {navLinks.map((link, i) => (
                      <motion.button
                        key={link.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                        onClick={() => handleNavClick(link.path)}
                        className={`text-[9px] tracking-[0.15em] font-bold uppercase transition-colors px-2 py-1 ${
                          location.pathname === link.path ? 'text-[#7C8464] bg-stone-100 rounded' : 'text-stone-500'
                        }`}
                      >
                        {link.label}
                      </motion.button>
                    ))}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Navigation Drawer (Left Side) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[9999] overflow-hidden font-sans md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/45 backdrop-blur-[8px]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-y-0 left-0 w-[85vw] max-w-[340px] h-[100vh] bg-[#FFFFFF] shadow-[0_0_40px_rgba(0,0,0,0.18)] rounded-r-[18px] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="px-6 py-6 flex flex-col border-b border-stone-100 relative">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full text-stone-400 hover:text-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <span className="font-serif text-2xl font-light tracking-tight text-[#143A2A]">
                  Bihar <span className="italic">Bite</span>
                </span>
                <span className="text-stone-400 text-xs mt-1 font-medium">
                  Premium Makhana from Bihar
                </span>
              </div>

              {/* Drawer Menu */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Products', path: '/shop' },
                  { label: 'About', path: '/about' },
                  { label: 'Blog', path: '/blog' },
                  { label: 'Bulk & Export', path: '/bulk' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'Wishlist', action: () => setIsWishlistOpen(true) },
                  { label: 'My Account', action: currentUser ? () => navigate('/account') : onOpenAuthModal },
                  { label: 'Orders', action: currentUser ? () => navigate('/account') : onOpenAuthModal },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (item.action) {
                        item.action();
                      } else if (item.path) {
                        navigate(item.path);
                      }
                    }}
                    className="w-full h-[56px] flex items-center px-4 rounded-xl text-[15px] font-bold text-stone-600 hover:bg-[#F8F5EE] hover:text-[#183D2F] transition-colors text-left"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-6 border-t border-stone-100 flex flex-col gap-4">
                <span className="text-[11px] font-bold tracking-[0.1em] text-stone-400 uppercase">Follow Us</span>
                <div className="flex gap-4 text-stone-500">
                  <a href="#" className="hover:text-[#183D2F] transition-colors font-medium text-[13px]">Instagram</a>
                  <a href="#" className="hover:text-[#183D2F] transition-colors font-medium text-[13px]">Facebook</a>
                  <a href="#" className="hover:text-[#183D2F] transition-colors font-medium text-[13px]">YouTube</a>
                  <a href="#" className="hover:text-[#183D2F] transition-colors font-medium text-[13px]">WhatsApp</a>
                </div>
                <div className="text-stone-400 text-[11px] mt-2">
                  © Bihar Bite
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </>
  );
}