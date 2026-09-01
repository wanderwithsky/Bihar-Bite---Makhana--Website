import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, Heart, ArrowLeft, Plus, Minus, ShoppingBag, ShieldCheck, 
  Truck, Leaf, CheckCircle2, MessageSquare, Flame, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ScreenType } from '../types';
import ProductInfoSections from './ProductInfoSections';

interface DetailsScreenProps {
  setScreen: (screen: ScreenType) => void;
  product: Product;
  setSelectedProduct: (product: Product | null) => void;
  products: Product[];
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number) => void;
  setNotification?: (notif: { message: string, type: 'success' | 'error' }) => void;
  onBuyNowAuthFlow?: (product: Product, selectedWeight: string, quantity: number) => void;
  currentUser?: any;
  setIsCartOpen?: (open: boolean) => void;
}

export default function DetailsScreen({
  setScreen,
  product: oldProductProp,
  setSelectedProduct,
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  setNotification,
  onBuyNowAuthFlow,
  currentUser,
  setIsCartOpen
}: DetailsScreenProps) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find product by slug from URL
  const product = products.find(p => p.slug === slug || (p as any).id === slug);


  
  // Gallery images from the new products.ts format
  const baseGalleryImages = product ? [
    ...((product as any).video ? [(product as any).video] : []),
    ...((product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : ['/images/hero/03.png']))
  ] : ['/images/hero/03.png'];

  const NUTRITION_IMAGE = '/images/nutrition-info.png';
  const PRODUCT_INFO_IMAGE = '/images/product-info.png';
  
  let galleryImages = [...baseGalleryImages];
  if (!galleryImages.includes(NUTRITION_IMAGE)) galleryImages.push(NUTRITION_IMAGE);
  if (!galleryImages.includes(PRODUCT_INFO_IMAGE)) galleryImages.push(PRODUCT_INFO_IMAGE);

  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedWeight, setSelectedWeight] = useState<string>(product?.weight || '100g');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(galleryImages[0]);
      setActiveImageIndex(0);
      setSelectedWeight((product as any).weights?.[0] || product.weight || '100g');
      setQuantity(1);
    }
  }, [product]);

  // Use local product structure
  const activePrice = (product as any)?.weightPrices?.[selectedWeight] || product?.price || 0;
  const originalPrice = Math.round(activePrice * 1.15); // Adjust based on dynamic price
  const discountPercent = Math.round(((originalPrice - activePrice) / originalPrice) * 100);
  const isSaved = wishlist.some((item) => item.id === (product as any)?.slug || item.id === (product as any)?.id);

  // Recommendations: 4 items excluding current
  const relatedProducts = products.filter((p) => ((p as any).slug || p.id) !== ((product as any)?.slug || product?.id)).slice(0, 4);
  // Ensure we always have 4 if possible
  if (relatedProducts.length < 4 && products.length >= 4) {
    const additional = products.filter(p => !relatedProducts.includes(p) && ((p as any).slug || p.id) !== ((product as any)?.slug || product?.id));
    relatedProducts.push(...additional.slice(0, 4 - relatedProducts.length));
  }

  const highlights = [
    { icon: <Flame className="w-4 h-4" />, text: "High Protein" },
    { icon: <Leaf className="w-4 h-4" />, text: "Gluten Free" },
    { icon: <ShieldCheck className="w-4 h-4" />, text: "No Preservatives" },
    { icon: <Star className="w-4 h-4" />, text: "Export Quality" },
  ];

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const text = encodeURIComponent(`Hi Bihar Bite! I'd like to order ${quantity}x ${product.name} (${selectedWeight}).`);
    window.open(`https://wa.me/917985347849?text=${text}`, '_blank');
  };

  const increaseQuantity = () => setQuantity(q => Math.min(99, q + 1));
  const decreaseQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (!product) return;
    onAddToCart(product, selectedWeight, quantity);
    // Notification is handled globally in App.tsx by handleAddToCart
  };

  const handleBuyNow = (e?: React.MouseEvent) => {
    if (!product) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (onBuyNowAuthFlow) {
      onBuyNowAuthFlow(product, selectedWeight, quantity);
    } else {
      onAddToCart(product, selectedWeight, quantity);
      if (setIsCartOpen) {
        setIsCartOpen(true);
      }
    }
  };

  const handleAmazonClick = () => {
    const url = (product as any)?.amazonUrl;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleThumbnailClick = (img: string, idx: number) => {
    setActiveImage(img);
    setActiveImageIndex(idx);
  };

  const openLightbox = () => {
    setLightboxIndex(activeImageIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const lightboxNext = (e: React.MouseEvent) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % galleryImages.length); };
  const lightboxPrev = (e: React.MouseEvent) => { e.stopPropagation(); setLightboxIndex(i => (i === 0 ? galleryImages.length - 1 : i - 1)); };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    if (isLightboxOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isLightboxOpen]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#FDFDF9]">
        <div className="w-24 h-24 mb-6 opacity-50">
          <img src="/images/hero/03.png" alt="Makhana" className="w-full h-full object-contain filter grayscale" />
        </div>
        <h2 className="font-serif text-4xl text-[#143A2A] mb-4">Product Not Found</h2>
        <p className="text-stone-500 mb-8 max-w-md text-center">We couldn't find the product you're looking for. It may have been removed or the link is incorrect.</p>
        <Link 
          to="/shop" 
          className="bg-[#143A2A] text-[#FAF8F4] px-8 py-3 rounded-full font-sans font-bold uppercase tracking-widest text-[13px] hover:bg-[#0E281C] transition-all duration-300 shadow-md"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/shop');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="font-sans bg-[#FAF8F4] min-h-screen pt-[120px] pb-24"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* ─── SHOWCASE & INFO LAYOUT ─── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT: Premium Showcase (55%) */}
          <div className="w-full lg:w-[55%] flex flex-col md:flex-row-reverse gap-4 md:gap-6 lg:h-[700px]">
            
            {/* Main Image */}
            <div 
              className="relative w-full h-[400px] md:h-full bg-[#F5F5F0] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden group flex-grow cursor-pointer"
              onClick={openLightbox}
            >
              <img src="/images/hero/03.png" aria-hidden="true" className="absolute top-8 right-8 w-20 opacity-30 group-hover:opacity-60 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 blur-[1px] pointer-events-none z-10" />
              {product.isBestseller && (
                <div className="absolute top-4 left-4 z-10 bg-[#C28E63] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Star className="w-3 h-3 fill-white" />
                  Best Seller
                </div>
              )}
              <AnimatePresence mode="wait">
                {activeImage?.endsWith('.mp4') || activeImage?.endsWith('.webm') || activeImage?.endsWith('.mov') ? (
                  <motion.video
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={activeImage}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={activeImage}
                    alt={activeImage === '/images/nutrition-info.png' ? "Nutritional Information for Bihar Bite Makhana" : activeImage === '/images/product-info.png' ? "Ingredients, Storage, Shelf Life and Allergen Information for Bihar Bite Makhana" : product.name}
                    className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${activeImage === '/images/nutrition-info.png' || activeImage === '/images/product-info.png' ? 'object-contain p-4' : 'object-cover'}`}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Vertical Thumbnails */}
            <div className="flex md:flex-col gap-4 w-full md:w-[120px] overflow-x-auto md:overflow-visible shrink-0 pb-4 md:pb-0 custom-scrollbar">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(img, idx)}
                  className={`relative shrink-0 w-[100px] h-[100px] md:w-full md:h-[130px] rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${
                    activeImage === img 
                      ? 'ring-2 ring-green-600 ring-offset-2' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {img?.endsWith('.mp4') || img?.endsWith('.webm') || img?.endsWith('.mov') ? (
                    <video src={img} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img 
                      src={img} 
                      className={`w-full h-full ${img === '/images/nutrition-info.png' || img === '/images/product-info.png' ? 'object-contain p-1' : 'object-cover'}`} 
                      alt={img === '/images/nutrition-info.png' ? "Nutritional Information for Bihar Bite Makhana" : img === '/images/product-info.png' ? "Ingredients, Storage, Shelf Life and Allergen Information for Bihar Bite Makhana" : `Thumbnail ${idx + 1}`} 
                    />
                  )}
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT: Product Information (45%) */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center">
            
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#143A2A] leading-tight">
                {product.name}
              </h1>
              <button 
                onClick={() => onToggleWishlist(product)}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 hover:bg-[#FAF8F4] transition-colors"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#C28E63] text-[#C28E63]' : 'text-stone-400'}`} />
              </button>
            </div>

            <p className="text-stone-600 text-[15px] leading-relaxed mb-6">
              {product.description || ''} Sourced directly from the rich wetlands of Mithila, roasted to perfection for an ultimate crunch.
            </p>

            {/* Price block */}
            <div className="flex items-end gap-3 mb-1">
              <span className="text-3xl font-bold text-[#143A2A]">
                {(product as any).priceDisplay ? (product as any).priceDisplay.replace(/\d+/, (match: string) => String(Number(match) * quantity)) : `₹${activePrice * quantity}`}
              </span>
              <span className="text-lg text-stone-400 line-through mb-1">₹{originalPrice * quantity}</span>
              {discountPercent > 0 ? (
                <span className="bg-[#C28E63]/10 text-[#C28E63] font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-[#C28E63]/20">
                  {discountPercent}% OFF
                </span>
              ) : null}
            </div>
            
            <p className="text-[13px] text-stone-500 mb-6">
              Inclusive of all taxes and transportation
            </p>

            {(product as any).taxLabel && (
              <div className="mb-6">
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                  {(product as any).taxLabel}
                </span>
              </div>
            )}

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#143A2A]/80">
                  <div className="w-8 h-8 rounded-full bg-[#143A2A]/5 flex items-center justify-center shrink-0">
                    {highlight.icon}
                  </div>
                  <span className="text-xs font-semibold tracking-wide uppercase">{highlight.text}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-stone-200 mb-8" />

            {/* Selection Options */}
            <div className="flex flex-col sm:flex-row gap-6 mb-10">
              
              {/* Weight / Pack Size */}
              <div className="flex-1">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-3">Pack Size</span>
                <div className="flex flex-wrap gap-2">
                  {((product as any).weights || [product.weight || '100g']).map((wt: string) => (
                    <button
                      key={wt}
                      onClick={() => setSelectedWeight(wt)}
                      className={`px-6 py-2.5 rounded-full border text-sm font-bold shadow-sm transition-all ${
                        selectedWeight === wt
                          ? 'border-[#143A2A] bg-[#143A2A] text-white'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {wt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-3">Quantity</span>
                <div className="flex items-center bg-white border border-stone-200 rounded-full h-[42px] px-2 w-[120px]">
                  <button onClick={decreaseQuantity} className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors text-stone-500">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium text-stone-800">{quantity}</span>
                  <button onClick={increaseQuantity} className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors text-stone-500">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-[#143A2A] border border-[#143A2A]/20 py-4 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button 
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#143A2A] text-white py-4 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#143A2A]/20 transition-all duration-300 active:scale-95"
                >
                  Buy Now
                </button>
              </div>
              <button 
                onClick={handleAmazonClick}
                disabled={!(product as any).amazonUrl}
                className={`w-full py-4 rounded-full font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                  (product as any).amazonUrl
                    ? 'bg-[#FF9900]/10 text-[#CC7A00] border border-[#FF9900]/20 hover:-translate-y-1 hover:bg-[#FF9900]/20 active:scale-95'
                    : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {(product as any).amazonUrl ? 'Buy on Amazon' : 'Amazon listing coming soon'}
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl p-5 border border-stone-100 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <Truck className="w-5 h-5 text-[#C28E63]" />
                <span><strong className="text-stone-900">Free Shipping</strong> on orders over ₹999</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <CheckCircle2 className="w-5 h-5 text-[#C28E63]" />
                <span>Estimated delivery in <strong>3-5 business days</strong></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <ShieldCheck className="w-5 h-5 text-[#C28E63]" />
                <span>Packaged securely in premium vacuum-sealed bags</span>
              </div>
            </div>

          </div>

        </div>

        {/* ─── DETAILED PRODUCT INFORMATION ─── */}
        <ProductInfoSections product={product} />

        {/* ─── YOU MAY ALSO LIKE ─── */}
        <div className="mt-32">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <span className="text-xs font-semibold text-[#8C7D5F] tracking-[0.2em] uppercase block mb-4">
              Explore More
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-[#143A2A] font-bold">
              You May Also Like
            </h2>
            <div className="w-[60px] h-[2px] bg-[#C28E63] mt-8 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {relatedProducts.map((p, idx) => {
              const pImage = (p as any).images?.[0] || p.image || '/images/01.png';
              const pWeight = (p as any).weight || p.weights?.[0] || '100g';
              const pPrice = p.price;
              
              return (
                <motion.div 
                  key={(p as any).slug || p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  onClick={() => {
                    navigate(`/product/${(p as any).slug || p.id}`);
                    window.scrollTo(0, 0); // Always scroll to top
                  }}
                  className="group relative bg-white rounded-[24px] p-3 lg:p-4 cursor-pointer transition-all duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:-rotate-[5deg] hover:-translate-y-[10px] hover:scale-[1.03] hover:shadow-[0_24px_50px_rgba(20,58,42,0.08)] border border-stone-100 flex flex-col h-full"
                >
                  <div className="aspect-[4/5] bg-[#F5F5F0] rounded-[16px] lg:rounded-[20px] overflow-hidden mb-4 relative flex-shrink-0">
                    <img 
                      src={pImage} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col flex-grow text-center">
                    <h3 className="font-serif font-bold text-[#143A2A] text-sm lg:text-base leading-snug mb-1 line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="text-stone-500 text-[10px] lg:text-xs mb-3 font-semibold uppercase tracking-wider">{pWeight}</div>
                    
                    <div className="mt-auto flex flex-col items-center gap-3">
                      <div className="font-sans font-bold text-[#143A2A] text-sm lg:text-base">₹{pPrice}</div>
                      <button className="w-full py-2.5 rounded-full border border-[#143A2A] text-[#143A2A] font-bold text-xs uppercase tracking-wider group-hover:bg-[#143A2A] group-hover:text-white transition-colors duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── LIGHTBOX MODAL ─── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <button 
              onClick={lightboxPrev}
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button 
              onClick={lightboxNext}
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            >
              <img 
                src={galleryImages[lightboxIndex]} 
                alt="Product View" 
                className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
