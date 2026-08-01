import { useState, useEffect } from 'react';
import { Star, Heart, SlidersHorizontal, Search, ShoppingBag, Grid, ArrowUpDown } from 'lucide-react';
import { Product, ScreenType } from '../types';

interface ShopScreenProps {
  setScreen: (screen: ScreenType) => void;
  selectedCategory: Product['category'] | 'All';
  setSelectedCategory: (category: Product['category'] | 'All') => void;
  setSelectedProduct: (product: Product | null) => void;
  products: Product[];
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedWeight: string) => void;
  searchQuery: string;
}

export default function ShopScreen({
  setScreen,
  selectedCategory,
  setSelectedCategory,
  setSelectedProduct,
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  searchQuery,
}: ShopScreenProps) {
  // Local state for sidebar filters
  const [localCategory, setLocalCategory] = useState<Product['category'] | 'All'>(selectedCategory);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedPackSizes, setSelectedPackSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [cardSelectedWeights, setCardSelectedWeights] = useState<{ [productId: string]: string }>({});

  // Sync category state from header nav clicks
  useEffect(() => {
    setLocalCategory(selectedCategory);
  }, [selectedCategory]);

  // Set default weight selection for each product
  useEffect(() => {
    const defaults: { [productId: string]: string } = {};
    products.forEach((p) => {
      defaults[p.id] = p.weights[0];
    });
    setCardSelectedWeights(defaults);
  }, [products]);

  // Handle weight change for a product card
  const handleWeightChange = (productId: string, weight: string) => {
    setCardSelectedWeights((prev) => ({
      ...prev,
      [productId]: weight,
    }));
  };

  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]
    );
  };

  const handlePackSizeToggle = (size: string) => {
    setSelectedPackSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setLocalCategory('All');
    setSelectedCategory('All');
    setSelectedFlavors([]);
    setSelectedPackSizes([]);
    setMaxPrice(1000);
  };

  // Filtering & Sorting Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category filter
    if (localCategory !== 'All' && product.category !== localCategory) {
      return false;
    }

    // 2. Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.flavors.some((f) => f.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // 3. Flavors filter
    if (selectedFlavors.length > 0) {
      const hasSelectedFlavor = product.flavors.some((f) => selectedFlavors.includes(f));
      if (!hasSelectedFlavor) return false;
    }

    // 4. Pack sizes filter
    if (selectedPackSizes.length > 0) {
      const hasSelectedSize = product.weights.some((w) => selectedPackSizes.includes(w));
      if (!hasSelectedSize) return false;
    }

    // 5. Price filter
    const activeWeight = cardSelectedWeights[product.id] || product.weights[0];
    const activePrice = product.weightPrices[activeWeight] || product.price;
    if (activePrice > maxPrice) {
      return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aWeight = cardSelectedWeights[a.id] || a.weights[0];
    const bWeight = cardSelectedWeights[b.id] || b.weights[0];
    const aPrice = a.weightPrices[aWeight] || a.price;
    const bPrice = b.weightPrices[bWeight] || b.price;

    if (sortBy === 'price-low') return aPrice - bPrice;
    if (sortBy === 'price-high') return bPrice - aPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0; // Default Featured
  });

  const availableFlavors = Array.from(
    new Set(products.flatMap((p) => p.flavors))
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      
      {/* Mobile Filters Header */}
      <div className="col-span-12 lg:hidden flex justify-between items-center bg-white p-4 rounded-xl border border-outline-variant/30">
        <button 
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters {selectedFlavors.length + selectedPackSizes.length > 0 && `(${selectedFlavors.length + selectedPackSizes.length})`}</span>
        </button>
        
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-transparent text-primary outline-none"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Sidebar Filters (Desktop + Mobile overlay) */}
      <div className={`col-span-12 lg:col-span-3 space-y-6 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
            <h3 className="font-serif font-bold text-lg text-primary">Filters</h3>
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-secondary hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Collections</h4>
            <div className="flex flex-col gap-1">
              {['All', 'Plain', 'Roasted', 'Flavoured', 'Premium', 'Gift Packs'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setLocalCategory(cat as any);
                    setSelectedCategory(cat as any);
                  }}
                  className={`text-left text-sm py-1.5 px-3 rounded-lg transition-all ${
                    localCategory === cat 
                      ? 'bg-primary text-white font-semibold' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Profile */}
          {availableFlavors.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-outline-variant/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Flavor Profile</h4>
              <div className="flex flex-wrap gap-1.5">
                {availableFlavors.map((flavor) => {
                  const isSelected = selectedFlavors.includes(flavor);
                  return (
                    <button
                      key={flavor}
                      onClick={() => handleFlavorToggle(flavor)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary text-white font-semibold' 
                          : 'border-outline-variant/50 text-on-surface-variant hover:border-primary'
                      }`}
                    >
                      {flavor}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pack Size */}
          <div className="space-y-2 pt-4 border-t border-outline-variant/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Pack Sizes</h4>
            <div className="grid grid-cols-2 gap-2">
              {['100g', '250g', '500g', '1kg'].map((size) => {
                const isSelected = selectedPackSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handlePackSizeToggle(size)}
                    className={`text-xs px-2 py-1.5 rounded-lg border transition-all ${
                      isSelected 
                        ? 'border-secondary bg-secondary/5 text-secondary font-bold' 
                        : 'border-outline-variant/50 text-on-surface-variant hover:border-secondary'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-4 border-t border-outline-variant/10">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <span>Max Price</span>
              <span className="text-primary font-mono font-bold">₹{maxPrice}</span>
            </div>
            <input 
              type="range"
              min={100}
              max={1000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
            />
          </div>

        </div>
      </div>

      {/* Product Catalog Column */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        
        {/* Top bar controls */}
        <div className="hidden lg:flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-outline-variant/20 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Grid className="w-4 h-4" />
            <span>Showing <strong className="text-primary">{sortedProducts.length}</strong> luxurious flavors</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-on-surface-variant">Sort By</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="font-semibold text-primary outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-outline-variant/20">
            <Search className="w-12 h-12 text-outline-variant/50 mx-auto mb-4 stroke-1" />
            <h4 className="text-lg font-bold text-primary">No Makhana found</h4>
            <p className="text-sm text-on-surface-variant mt-1">Try resetting the filters or modifying your query.</p>
            <button 
              onClick={handleResetFilters}
              className="mt-4 px-6 py-2 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary-container transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedProducts.map((product) => {
              const activeWeight = cardSelectedWeights[product.id] || product.weights[0];
              const activePrice = product.weightPrices[activeWeight] || product.price;
              const isSaved = wishlist.some((item) => item.id === product.id);

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col justify-between overflow-hidden group/card relative hover:border-secondary transition-all duration-300 h-full"
                >
                  {/* Image, Badges & Wishlist Trigger */}
                  <div className="aspect-square bg-surface-container-low overflow-hidden relative cursor-pointer">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      onClick={() => {
                        setSelectedProduct(product);
                        setScreen('details');
                      }}
                      className="w-full h-full object-cover group-hover/card:scale-102 transition-transform duration-500" 
                    />
                    
                    {/* Bestseller or New tags */}
                    {product.isBestseller && (
                      <span className="absolute top-3 left-3 bg-primary text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                        Bestseller
                      </span>
                    )}
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-secondary text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                        New
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-outline-variant/20 hover:bg-white text-secondary hover:text-primary transition-all active:scale-95"
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-secondary' : ''}`} />
                    </button>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                          {product.category}
                        </span>
                        <div className="flex items-center text-secondary-container">
                          <Star className="w-3 h-3 fill-secondary-container" />
                          <span className="text-xs font-bold text-primary ml-1">{product.rating}</span>
                        </div>
                      </div>

                      <h3 
                        onClick={() => {
                          setSelectedProduct(product);
                          setScreen('details');
                        }}
                        className="font-serif font-bold text-primary text-base hover:text-secondary cursor-pointer transition-colors leading-tight mb-1"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Card Weight Selector */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {product.weights.map((wt) => {
                          const isSel = wt === activeWeight;
                          return (
                            <button
                              key={wt}
                              onClick={() => handleWeightChange(product.id, wt)}
                              className={`text-[10px] px-2 py-1 rounded transition-all ${
                                isSel 
                                  ? 'bg-primary text-white font-bold' 
                                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                              }`}
                            >
                              {wt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cart Add Button */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/10">
                      <div>
                        <span className="text-xs text-on-surface-variant block leading-none">Price</span>
                        <span className="text-sm font-bold text-primary">₹{activePrice}</span>
                      </div>
                      <button
                        onClick={() => onAddToCart(product, activeWeight)}
                        className="bg-secondary text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-secondary/90 transition-colors flex items-center gap-1 active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
