import { X, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-surface flex flex-col shadow-xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-secondary fill-secondary" />
              <h2 className="text-lg font-bold text-primary">Your Wishlist</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Heart className="w-16 h-16 text-outline-variant/50 mb-4 stroke-1" />
                <p className="text-on-surface-variant font-medium">Your wishlist is empty</p>
                <p className="text-xs text-on-surface-variant mt-1">Tap the heart on any product to save it here.</p>
                <button 
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-container transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div 
                    key={item.id}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-outline-variant/20 hover:border-outline-variant transition-colors"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-surface-container-low shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="text-sm font-bold text-primary truncate">
                            {item.name}
                          </h3>
                          <button 
                            onClick={() => onRemoveFromWishlist(item)}
                            className="text-secondary hover:text-primary transition-colors p-0.5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">
                          {item.description}
                        </p>
                        <span className="text-sm font-bold text-primary mt-1 block">
                          ₹{item.price}
                        </span>
                      </div>

                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => onMoveToCart(item)}
                          className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary-container transition-colors flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
