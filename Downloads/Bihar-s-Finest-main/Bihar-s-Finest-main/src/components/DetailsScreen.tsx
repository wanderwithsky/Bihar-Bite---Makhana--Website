import React, { useState, useEffect } from 'react';
import { 
  Star, Heart, ArrowLeft, Plus, Minus, ShoppingBag, ShieldCheck, 
  Truck, RefreshCw, ChevronDown, ChevronUp, Award, Calendar, 
  MapPin, Clipboard, CheckCircle2, MessageSquare, AlertCircle, ShoppingCart
} from 'lucide-react';
import { Product, ScreenType, Review } from '../types';

interface DetailsScreenProps {
  setScreen: (screen: ScreenType) => void;
  product: Product;
  setSelectedProduct: (product: Product | null) => void;
  products: Product[];
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedWeight: string, quantity: number) => void;
}

export default function DetailsScreen({
  setScreen,
  product,
  setSelectedProduct,
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
}: DetailsScreenProps) {
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedWeight, setSelectedWeight] = useState<string>(product.weights[0]);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Accordion state
  const [openSection, setOpenSection] = useState<string | null>('description');

  // Customer reviews local state to support real-time user additions
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Delivery pin check simulation
  const [pinCode, setPinCode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'checking' | 'available' | 'error'>('idle');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  // Sync state if product changes
  useEffect(() => {
    setActiveImage(product.image);
    setSelectedWeight(product.weights[0]);
    setQuantity(1);
    setOpenSection('description');
    setReviewSubmitted(false);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setDeliveryStatus('idle');
    setPinCode('');
    setDeliveryMessage('');

    // Prepopulate high quality reviews if none exist
    const defaultReviews: Review[] = product.reviews && product.reviews.length > 0 
      ? product.reviews 
      : [
          {
            id: 'rev-1',
            userName: 'Vikram Singh',
            rating: 5,
            date: 'July 14, 2026',
            comment: 'Absolutely outstanding freshness. The crispiness is superior to any other makhana available in supermarket shelves. Tastes authentic and roasted just right.'
          },
          {
            id: 'rev-2',
            userName: 'Ananya Sharma',
            rating: 5,
            date: 'June 29, 2026',
            comment: 'We ordered the premium gift box and standard plain ones. Extremely satisfied with the hand-graded size. They are clean and huge seeds!'
          },
          {
            id: 'rev-3',
            userName: 'Ramesh Pathak',
            rating: 4,
            date: 'May 18, 2026',
            comment: 'Very good snack alternative. Himalayan Salt flavor has a perfect balance. Shipping was quick to Mumbai.'
          }
        ];
    setLocalReviews(defaultReviews);
  }, [product]);

  const activePrice = product.weightPrices[selectedWeight] || product.price;
  const isSaved = wishlist.some((item) => item.id === product.id);

  // Find a bundle companion (Frequently Bought Together)
  const bundleCompanion = products.find((p) => p.id !== product.id) || products[0];
  const companionWeight = bundleCompanion ? bundleCompanion.weights[0] : '100g';
  const companionPrice = bundleCompanion ? (bundleCompanion.weightPrices[companionWeight] || bundleCompanion.price) : 120;

  const totalBundleOriginal = activePrice + companionPrice;
  const totalBundleDiscounted = Math.round(totalBundleOriginal * 0.9); // 10% discount bundle

  // Filter related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const finalRelated = relatedProducts.length > 0 
    ? relatedProducts 
    : products.filter((p) => p.id !== product.id).slice(0, 3);

  // Toggle Accordion section
  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  // Simulated Pin code verification
  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim() || pinCode.length < 6) {
      setDeliveryStatus('error');
      setDeliveryMessage('Please enter a valid 6-digit Indian PIN Code.');
      return;
    }
    setDeliveryStatus('checking');
    setTimeout(() => {
      setDeliveryStatus('available');
      setDeliveryMessage('Standard Free Shipping eligibility active. Delivery estimated in 3 - 5 business days.');
    }, 800);
  };

  // Interactive Review submit handler
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      alert('Please fill out all fields before submitting your rating.');
      return;
    }
    const submittedReview: Review = {
      id: `user-rev-${Date.now()}`,
      userName: newReviewName,
      rating: newReviewRating,
      date: 'Today',
      comment: newReviewComment
    };
    setLocalReviews([submittedReview, ...localReviews]);
    setReviewSubmitted(true);
    setNewReviewName('');
    setNewReviewComment('');
  };

  // Add bundle to basket
  const handleAddBundleToCart = () => {
    // Add main product
    onAddToCart(product, selectedWeight, 1);
    // Add companion product
    if (bundleCompanion) {
      onAddToCart(bundleCompanion, companionWeight, 1);
    }
    alert(`Success! The "${product.name}" and "${bundleCompanion.name}" bundle has been added to your basket.`);
  };

  // Rating metrics calculations
  const totalReviewCount = localReviews.length;
  const averageRating = (localReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewCount).toFixed(1);

  // Star breakdown calculation
  const starCounts = [0, 0, 0, 0, 0];
  localReviews.forEach((r) => {
    const starIdx = Math.min(Math.max(Math.floor(r.rating) - 1, 0), 4);
    starCounts[starIdx]++;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-24 font-sans">
      
      {/* Back button & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button 
          onClick={() => {
            setSelectedProduct(null);
            setScreen('shop');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary group transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </button>
        
        <nav className="text-xs text-on-surface-variant flex items-center gap-1.5 font-light">
          <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setScreen('home')}>Home</span>
          <span className="text-stone-300">&gt;</span>
          <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => setScreen('shop')}>{product.category}</span>
          <span className="text-stone-300">&gt;</span>
          <span className="font-bold text-primary">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Layout Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
        
        {/* Left Side: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-stone-50 rounded-[32px] overflow-hidden border border-stone-200/60 relative group shadow-sm">
            <img 
              src={activeImage} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            {product.isBestseller && (
              <span className="absolute top-5 left-5 bg-[#7C8464] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-sm">
                Bestseller
              </span>
            )}
            
            {/* Wishlist toggle anchor */}
            <button
              onClick={() => onToggleWishlist(product)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center border border-stone-200 hover:bg-white text-secondary transition-all active:scale-95 shadow-md"
              title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 transition-all ${isSaved ? 'fill-secondary text-secondary' : 'text-stone-600 hover:text-secondary'}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar pt-1">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-stone-50 shrink-0 transition-all ${
                    activeImage === img ? 'border-[#7C8464] shadow-sm scale-98' : 'border-stone-200/40 opacity-85 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Primary Info & Ordering Panel */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="bg-[#7C8464]/10 text-[#7C8464] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#7C8464]/20">
                ⭐ Mithila Heritage Grade
              </span>
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-bold text-stone-900 ml-1">{averageRating}</span>
                <span className="text-xs text-stone-500 ml-1">({totalReviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-light text-stone-900 leading-tight">
              {product.name}
            </h1>
            
            {product.tagline && (
              <p className="font-serif italic text-[#7C8464] text-base font-light">
                "{product.tagline}"
              </p>
            )}

            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Dynamic pricing display */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-extralight text-stone-950">₹{activePrice}</span>
              {product.originalPrice && (
                <span className="text-base text-stone-400 line-through font-light">
                  ₹{Math.round(product.originalPrice * (activePrice / product.price))}
                </span>
              )}
              <span className="text-stone-400 text-xs">Inclusive of all local taxes & GST</span>
            </div>

            <div className="h-px bg-stone-200/70" />

            {/* Weight variant options */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold uppercase tracking-wider text-stone-700">Select Pack Size (Weight Variants)</span>
                <span className="text-[#7C8464] font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Freshly Packed batch
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.weights.map((wt, i) => {
                  const isSel = wt === selectedWeight;
                  return (
                    <button
                      key={wt}
                      onClick={() => setSelectedWeight(wt)}
                      className={`relative py-3 rounded-2xl border transition-all text-xs text-center flex flex-col justify-center items-center ${
                        isSel 
                          ? 'border-stone-900 bg-stone-50 text-stone-950 font-semibold shadow-sm' 
                          : 'border-stone-200 text-stone-600 hover:border-stone-400 font-light'
                      }`}
                    >
                      <span className="text-xs uppercase">{wt}</span>
                      <span className="text-[10px] text-stone-400 font-light mt-0.5">₹{product.weightPrices[wt] || activePrice}</span>
                      {i === 1 && (
                        <span className="absolute -top-1.5 bg-secondary text-white text-[7px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Best Value
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Qty selector */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">Quantity</span>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3.5 hover:bg-stone-50 text-stone-700 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3.5 hover:bg-stone-50 text-stone-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs text-stone-500">
                  Total item weight: <strong className="text-stone-800 font-bold">{(parseFloat(selectedWeight) * quantity) >= 1000 ? `${(parseFloat(selectedWeight) * quantity) / 1000}kg` : `${parseFloat(selectedWeight) * quantity}g`}</strong>
                  <br />
                  Total checkout price: <strong className="text-stone-950 text-sm font-semibold block">₹{activePrice * quantity}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Checkout triggers */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                onAddToCart(product, selectedWeight, quantity);
                alert(`Success! ${quantity} x ${product.name} (${selectedWeight}) has been added to your basket.`);
              }}
              className="flex-1 bg-stone-900 text-white font-semibold py-4 rounded-2xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-stone-900/10 active:scale-99 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Basket
            </button>
            <button
              onClick={() => {
                onAddToCart(product, selectedWeight, quantity);
                setScreen('shop');
              }}
              className="flex-1 bg-[#7C8464] text-white font-semibold py-4 rounded-2xl hover:bg-[#6A7155] transition-colors shadow-lg shadow-[#7C8464]/10 active:scale-99 cursor-pointer"
            >
              Express Checkout
            </button>
          </div>

          {/* Delivery Pin Eligibility Checker */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60 space-y-2">
            <label className="text-xs font-semibold text-stone-700 block">Check Pan-India Shipping Eligibility</label>
            <form onSubmit={handleCheckDelivery} className="flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code (e.g. 110001)"
                className="flex-grow bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-stone-500 font-light"
              />
              <button 
                type="submit"
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Check
              </button>
            </form>
            {deliveryStatus === 'checking' && (
              <p className="text-[10px] text-stone-500 animate-pulse">Checking postal databases...</p>
            )}
            {deliveryStatus === 'available' && (
              <p className="text-[11px] text-green-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                {deliveryMessage}
              </p>
            )}
            {deliveryStatus === 'error' && (
              <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                {deliveryMessage}
              </p>
            )}
          </div>

          {/* Glassmorphic value props */}
          <div className="grid grid-cols-3 gap-4 bg-stone-50/50 rounded-2xl p-4 border border-stone-200/50">
            <div className="text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#7C8464] mx-auto" />
              <h4 className="text-[10px] font-bold text-stone-950">100% Clean Sourced</h4>
              <p className="text-[8px] text-stone-500">Zero artificial preservatives</p>
            </div>
            <div className="text-center space-y-1 border-l border-r border-stone-200/50 px-2">
              <Truck className="w-5 h-5 text-[#7C8464] mx-auto" />
              <h4 className="text-[10px] font-bold text-stone-950">Fast Shipping</h4>
              <p className="text-[8px] text-stone-500">Shipped in 24 hours</p>
            </div>
            <div className="text-center space-y-1">
              <RefreshCw className="w-5 h-5 text-[#7C8464] mx-auto" />
              <h4 className="text-[10px] font-bold text-stone-950">Damage Protection</h4>
              <p className="text-[8px] text-stone-500">No-question free replacement</p>
            </div>
          </div>

        </div>
      </div>

      {/* Accordion List for Detailed Specs & Policies (Great for Mobile UX) */}
      <section className="mb-20 border border-stone-200 rounded-[28px] overflow-hidden bg-white shadow-sm divide-y divide-stone-100">
        
        {/* Accordion Item 1: Description & Specifications */}
        <div className="w-full">
          <button
            onClick={() => toggleSection('description')}
            className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-stone-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Clipboard className="w-5 h-5 text-stone-600" />
              <span className="font-serif text-base font-semibold text-stone-950">Product Description & Raw Ingredients</span>
            </div>
            {openSection === 'description' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>
          
          {openSection === 'description' && (
            <div className="px-6 pb-6 pt-2 text-stone-600 text-xs md:text-sm leading-relaxed space-y-4">
              <p>
                Our organic makhana (foxnuts) represents premium heritage farming. Sourced from waterlily ponds in the Mithila wetlands of Bihar, these seeds are slow-roasted using traditional clay ovens and hand-graded for maximum size and airy crunch.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                <div className="space-y-2">
                  <h5 className="font-bold text-stone-950 uppercase tracking-wider text-[11px]">Ingredient Formulation</h5>
                  <p className="font-light">
                    {product.category === 'Plain' 
                      ? '100% raw, unadulterated, hand-graded popped waterlily foxnut seeds.'
                      : product.category === 'Flavoured'
                      ? 'Popped waterlily seeds, cold-pressed olive oil, organic rock salt, hand-mixed dry spices (black pepper, cumin, dry mango powder, chili flakes).'
                      : 'Popped waterlily seeds roasted in certified organic edible vegetable oils.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-400 block font-light">Country of Origin</span>
                    <strong className="text-stone-800">India (Mithila, Bihar)</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-light">Shelf Life</span>
                    <strong className="text-stone-800">12 Months (from packaging)</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-light">SKU Identifier</span>
                    <strong className="text-stone-800">BB-MK-{product.id.slice(0, 5).toUpperCase()}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-light">FSSAI Registration No.</span>
                    <strong className="text-[#7C8464]">10425999000213 (Placeholder)</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-stone-400 italic">
                <strong>Manufacturer Details:</strong> Bihar Bite Agro Products Private Limited, Darbhanga Industrial Hub, Mithila Region, Bihar, India.
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item 2: Health Benefits */}
        <div className="w-full">
          <button
            onClick={() => toggleSection('benefits')}
            className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-stone-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-stone-600" />
              <span className="font-serif text-base font-semibold text-stone-950">Key Health Benefits of Makhana</span>
            </div>
            {openSection === 'benefits' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>
          
          {openSection === 'benefits' && (
            <div className="px-6 pb-6 pt-2 text-stone-600 text-xs md:text-sm leading-relaxed space-y-3">
              <p>Makhana is a recognized ancient ayurvedic superfood. It contains high nutritional densities making it an excellent alternative to fried potato chips or processed grain snacks:</p>
              <ul className="list-disc pl-5 space-y-2 text-stone-600 font-light">
                <li><strong className="text-stone-950 font-semibold">Low Glycemic Index (GI):</strong> Excellent for managing daily sugar levels and safe for diabetic snacks.</li>
                <li><strong className="text-stone-950 font-semibold">Antioxidant Rich:</strong> Sourced naturally with Kaempferol, helping reduce chronic inflammation and cellular aging.</li>
                <li><strong className="text-stone-950 font-semibold">Gluten-Free & Plant Protein:</strong> High digestibility, packed with plant-derived proteins ideal for health-conscious individuals.</li>
                <li><strong className="text-stone-950 font-semibold">Heart-Friendly Minerals:</strong> Abundant magnesium and potassium content supports cardiovascular circulation and regulates blood pressure safely.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Accordion Item 3: Nutrition Information */}
        <div className="w-full">
          <button
            onClick={() => toggleSection('nutrition')}
            className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-stone-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-stone-600" />
              <span className="font-serif text-base font-semibold text-stone-950">Nutritional Information Panel</span>
            </div>
            {openSection === 'nutrition' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>
          
          {openSection === 'nutrition' && product.nutritionalInfo && (
            <div className="px-6 pb-6 pt-2 text-stone-600 text-xs md:text-sm space-y-4">
              <div className="max-w-md border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-stone-50 font-semibold border-b border-stone-200 text-stone-900">
                    <tr>
                      <th className="p-3">Nutrients Measured</th>
                      <th className="p-3">Quantity (per 100g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-light text-stone-700">
                    <tr>
                      <td className="p-3">Energy / Calories</td>
                      <td className="p-3 font-semibold text-stone-950">{product.nutritionalInfo.calories}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Dietary Fiber</td>
                      <td className="p-3 font-semibold text-stone-950">{product.nutritionalInfo.fiber}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Plant Protein</td>
                      <td className="p-3 font-semibold text-stone-950">{product.nutritionalInfo.protein}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Fat & Cholesterol</td>
                      <td className="p-3 font-semibold text-stone-950">{product.nutritionalInfo.fat}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Magnesium</td>
                      <td className="p-3 font-semibold text-stone-950">210 mg</td>
                    </tr>
                    <tr>
                      <td className="p-3">Potassium</td>
                      <td className="p-3 font-semibold text-stone-950">350 mg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-stone-400 italic">
                * Percent daily reference intake values are calculated based on a 2,000 calorie diet plan. Your actual requirements may vary.
              </p>
            </div>
          )}
        </div>

        {/* Accordion Item 4: Storage & Handling */}
        <div className="w-full">
          <button
            onClick={() => toggleSection('storage')}
            className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-stone-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-stone-600" />
              <span className="font-serif text-base font-semibold text-stone-950">Storage Guidelines & Shelf Life</span>
            </div>
            {openSection === 'storage' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>
          
          {openSection === 'storage' && (
            <div className="px-6 pb-6 pt-2 text-stone-600 text-xs md:text-sm leading-relaxed space-y-3 font-light">
              <p>Makhana seeds readily absorb atmospheric moisture which results in a soft, non-crispy texture. To retain maximum gourmet quality:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Store inside the original Bihar Bite moisture-lock zipper packet, or transfer to an airtight dry container immediately after opening.</li>
                <li>Keep the container stored in a cool, dry pantry, away from direct thermal heat sources, stoves, or sunlight.</li>
                <li>Do not refrigerate the packets, as condensation will alter the structural crunch of the seeds.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Accordion Item 5: Shipping, Dispatch & Damaged Return policies */}
        <div className="w-full">
          <button
            onClick={() => toggleSection('shipping')}
            className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-stone-50/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-stone-600" />
              <span className="font-serif text-base font-semibold text-stone-950">Shipping charges, Return & Replacements</span>
            </div>
            {openSection === 'shipping' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>
          
          {openSection === 'shipping' && (
            <div className="px-6 pb-6 pt-2 text-stone-600 text-xs md:text-sm leading-relaxed space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <h5 className="font-bold text-stone-950 uppercase tracking-wider text-[11px]">Shipping Policies</h5>
                  <ul className="list-disc pl-4 space-y-1.5 font-light">
                    <li><strong>Dispatch Timeline:</strong> Processed and dispatched in 24 hours.</li>
                    <li><strong>Delivery Time:</strong> 1-3 business days within Bihar, 3-5 days across India.</li>
                    <li><strong>Shipping Charges:</strong> Free standard shipping for cart values above ₹999. Flat ₹60 applied under ₹999.</li>
                    <li><strong>Delivery Coverage:</strong> Senders covered in over 26,000 active PIN codes pan-India.</li>
                    <li><strong>Tracking:</strong> Active links sent on email/WhatsApp immediately after warehouse pickup.</li>
                  </ul>
                </div>
                
                <div className="space-y-2.5">
                  <h5 className="font-bold text-stone-950 uppercase tracking-wider text-[11px]">Returns & Damage Coverages</h5>
                  <ul className="list-disc pl-4 space-y-1.5 font-light">
                    <li><strong>Refund Eligibility:</strong> Non-returnable due to hygiene regulations.</li>
                    <li><strong>Damage Policy:</strong> If a package is crushed, torn, or damaged in transit, we provide a <strong>100% free replacement</strong>. No return required!</li>
                    <li><strong>Claims Window:</strong> Email care@biharbite.com with order details and photos within 48h of receiving.</li>
                    <li><strong>Refund Processing:</strong> Approvals completed within 48h. Bank credits take 5-7 business days.</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <strong>Customer Support Desk:</strong> Care email at <strong className="text-stone-800">care@biharbite.com</strong> or telephone support hotline <strong className="text-stone-800">+91 91234 56789</strong>.
              </div>
            </div>
          )}
        </div>

      </section>

      {/* Frequently Bought Together (Dynamic & Interactive Bundle) */}
      {bundleCompanion && (
        <section className="mb-20 bg-[#FBFBFA] border border-stone-200/80 rounded-[32px] p-6 md:p-10 shadow-sm">
          <span className="text-xs font-semibold text-[#8C7D5F] tracking-widest uppercase block mb-1">Gourmet Bundle Pairings</span>
          <h3 className="font-serif text-2xl text-stone-950 font-light mb-6">Frequently Bought Together</h3>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              {/* Primary Item */}
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-stone-100 shadow-xs w-full max-w-[280px]">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl border" />
                <div className="min-w-0">
                  <h4 className="font-serif font-semibold text-stone-900 text-sm truncate">{product.name}</h4>
                  <span className="text-xs text-[#7C8464] font-medium block">{selectedWeight}</span>
                  <span className="text-xs text-stone-400 font-light">₹{activePrice}</span>
                </div>
              </div>

              {/* Plus Sign */}
              <div className="text-stone-300 font-light text-2xl font-serif shrink-0">+</div>

              {/* Companion Item */}
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-stone-100 shadow-xs w-full max-w-[280px]">
                <img src={bundleCompanion.image} alt={bundleCompanion.name} className="w-16 h-16 object-cover rounded-xl border" />
                <div className="min-w-0">
                  <h4 className="font-serif font-semibold text-stone-900 text-sm truncate">{bundleCompanion.name}</h4>
                  <span className="text-xs text-[#7C8464] font-medium block">{companionWeight}</span>
                  <span className="text-xs text-stone-400 font-light">₹{companionPrice}</span>
                </div>
              </div>

            </div>

            {/* Price Box & Action Button */}
            <div className="w-full lg:w-auto shrink-0 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex flex-col sm:flex-row lg:flex-col justify-between items-center lg:items-end gap-6">
              <div className="text-center sm:text-left lg:text-right">
                <span className="text-xs text-stone-400 block font-light">Combined Bundle Price</span>
                <div className="flex items-baseline justify-center sm:justify-start lg:justify-end gap-2 mt-1">
                  <span className="text-2xl font-semibold text-stone-950">₹{totalBundleDiscounted}</span>
                  <span className="text-xs text-stone-400 line-through font-light">₹{totalBundleOriginal}</span>
                </div>
                <span className="bg-[#7C8464]/10 text-[#7C8464] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded mt-1.5 inline-block">
                  🎁 Bundle Discount (Save 10%)
                </span>
              </div>

              <button
                onClick={handleAddBundleToCart}
                className="w-full sm:w-auto bg-stone-950 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add Bundle to Basket
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews & Ratings Panel */}
      <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 border-t border-stone-200/60 pt-16">
        
        {/* Left: Scoreboard & Add review form */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-stone-950 font-light mb-4">Customer Sentiment</h3>
            <div className="flex items-center gap-4 bg-stone-50 p-6 rounded-3xl border border-stone-200/50 shadow-xs">
              <div className="text-center">
                <span className="text-4xl md:text-5xl font-extralight text-stone-950 block">{averageRating}</span>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Out of 5.0</span>
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.round(parseFloat(averageRating)) ? 'fill-amber-500 text-amber-500' : 'text-stone-200'}`} 
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-500 font-light">Based on verified purchaser transactions</p>
              </div>
            </div>
          </div>

          {/* Star progress bars */}
          <div className="space-y-2 text-xs">
            {Array.from({ length: 5 }).map((_, idx) => {
              const stars = 5 - idx;
              const count = starCounts[4 - idx];
              const percentage = totalReviewCount > 0 ? (count / totalReviewCount) * 100 : 0;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-10 text-stone-500 text-right">{stars} star</span>
                  <div className="flex-grow h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="w-6 text-stone-400 text-right">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Submit form */}
          <div className="bg-[#FAF8F5] p-6 rounded-[28px] border border-stone-200/60 space-y-4">
            <h4 className="font-serif text-lg font-semibold text-stone-950">Share Your Experience</h4>
            
            {reviewSubmitted ? (
              <div className="bg-green-50 border border-green-200/80 rounded-2xl p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                <h5 className="font-serif font-bold text-green-900 text-sm">Review Submitted Successfully!</h5>
                <p className="text-xs text-green-700 font-light">Thank you for rating Bihar Bite. Your honest feedback cultivates our heritage quality.</p>
                <button 
                  onClick={() => setReviewSubmitted(false)}
                  className="text-xs text-[#7C8464] font-semibold underline mt-2 hover:text-[#6A7155]"
                >
                  Write another review
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-700 font-medium block mb-1">Your Full Name</label>
                  <input 
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white border border-stone-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-500 font-light"
                  />
                </div>

                <div>
                  <label className="text-stone-700 font-medium block mb-1">Star Rating</label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const ratingVal = idx + 1;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewReviewRating(ratingVal)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${ratingVal <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-stone-700 font-medium block mb-1">Review Comments</label>
                  <textarea 
                    rows={3}
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="How was the freshness, crunchiness, and packaging?"
                    className="w-full bg-white border border-stone-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-500 font-light"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Review List */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-2xl text-stone-950 font-light mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-stone-600" />
            Verified Customer Reviews ({totalReviewCount})
          </h3>
          
          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-2 no-scrollbar">
            {localReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white p-5 rounded-2xl border border-stone-100 shadow-xs space-y-2 hover:border-stone-200 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm">{rev.userName}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Verified Purchase</span>
                      <span className="text-[10px] text-stone-400 font-light">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Recommended products */}
      <section className="border-t border-stone-200/60 pt-16">
        <h3 className="font-serif text-2xl text-stone-950 mb-8 font-light">You Might Also Like</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {finalRelated.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                setSelectedProduct(item);
                setActiveImage(item.image);
                setSelectedWeight(item.weights[0]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/60 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group h-full"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-stone-50">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-[#7C8464] uppercase tracking-wider">{item.category} Collection</span>
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-stone-900 ml-0.5">{item.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-serif font-bold text-stone-950 text-base group-hover:text-[#7C8464] transition-colors truncate mb-1">{item.name}</h4>
                  <p className="text-xs text-stone-500 font-light line-clamp-2">{item.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100">
                  <span className="text-sm font-semibold text-stone-950">₹{item.price}</span>
                  <span className="text-xs font-bold text-[#7C8464] group-hover:underline">View Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
