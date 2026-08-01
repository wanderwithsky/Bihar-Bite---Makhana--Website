import { useState, KeyboardEvent, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Heart, ShoppingBag, X, UserCircle, ShieldAlert, Phone, Mail, MapPin, Menu, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

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
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        setHasScrolled(true);
        setIsExpanded(false);
        setIsSearchActive(false);
      } else {
        setHasScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (screen: ScreenType) => {
    setSelectedProduct(null);
    setScreen(screen);
    setIsExpanded(false);
  };

  const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
      setIsExpanded(false);
      setIsSearchActive(false);
    }
  };

  const navLinks = [
    { label: 'HOME', screen: 'home' },
    { label: 'PRODUCTS', screen: 'shop' },
    { label: 'ABOUT', screen: 'about' },
    { label: 'BLOG', screen: 'blog' },
    { label: 'BULK & EXPORT', screen: 'bulk' },
    { label: 'CONTACT', screen: 'contact' },
  ];

  return (
    <>
      {/* Top Customer Review Ticker */}
      <AnimatePresence>
        {!hasScrolled && topReviews.length > 0 && (
          <motion.div 
            initial={{ y: -42, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -42, opacity: 0 }}
            className="fixed top-0 w-full z-40 bg-[#55613A] h-[42px] flex items-center justify-center overflow-hidden"
          >
            <AnimatePresence>
              {topReviews[activeReviewIndex % topReviews.length] && (
                <motion.div
                  key={activeReviewIndex}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -40, opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute w-full px-4 flex items-center justify-center gap-1.5 md:gap-2 text-[#F8F5EE] font-sans font-medium text-[12px] md:text-[14px]"
                >
                  <div className="flex gap-[2px] shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 fill-[#D4A24A] text-[#D4A24A]" />
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

      {/* Floating Navigation */}
      <div className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ease-in-out ${hasScrolled ? 'top-6' : 'top-16 md:top-14'}`}>
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
                onClick={() => setIsExpanded(true)}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-[#5A6342] text-white shadow-lg cursor-pointer border-[0.5px] border-white/30 backdrop-blur-md"
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
                  className="p-2 bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 rounded-full transition-colors order-first"
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
                      onClick={() => handleNavClick(link.screen as ScreenType)}
                      className={`text-[10px] tracking-[0.2em] font-bold uppercase transition-colors ${
                        currentScreen === link.screen ? 'text-[#7C8464]' : 'text-stone-500 hover:text-stone-900'
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
                      className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={() => { setIsWishlistOpen(true); setIsExpanded(false); }}
                    className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-colors relative"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-[#7C8464] text-[#7C8464]' : ''}`} />
                    {wishlist.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-[#7C8464] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
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

                  {/* Account */}
                  {currentAdmin ? (
                    <button
                      onClick={() => handleNavClick('admin-dashboard')}
                      className="w-10 h-10 flex items-center justify-center text-[#7C8464] hover:bg-[#7C8464]/10 rounded-full transition-colors"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  ) : currentUser ? (
                    <button
                      onClick={() => { onOpenAuthModal(); setIsExpanded(false); }}
                      className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 rounded-full transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#7C8464] text-white flex items-center justify-center text-xs font-serif italic font-bold">
                        {currentUser.fullName.charAt(0)}
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => { onOpenAuthModal(); setIsExpanded(false); }}
                      className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                    </button>
                  )}
                  
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
                        onClick={() => handleNavClick(link.screen as ScreenType)}
                        className={`text-[9px] tracking-[0.15em] font-bold uppercase transition-colors px-2 py-1 ${
                          currentScreen === link.screen ? 'text-[#7C8464] bg-stone-100 rounded' : 'text-stone-500'
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
      </div>
    </>
  );
}