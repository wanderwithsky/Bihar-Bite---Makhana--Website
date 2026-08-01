import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, weight: string, newQuantity: number) => void;
  onRemoveItem: (productId: string, weight: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = totalAmount >= freeShippingThreshold;
  const progressPercent = Math.min((totalAmount / freeShippingThreshold) * 100, 100);

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
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-primary">Your Cart</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-16 h-16 text-outline-variant/50 mb-4 stroke-1" />
                <p className="text-on-surface-variant font-medium">Your cart is empty</p>
                <button 
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-container transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Shipping goal meter */}
                <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
                  {isFreeShipping ? (
                    <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                      🎉 You’ve unlocked <strong>Free Standard Shipping</strong>!
                    </p>
                  ) : (
                    <p className="text-xs text-on-surface-variant mb-2">
                      Add <strong className="text-primary">₹{freeShippingThreshold - totalAmount}</strong> more for free standard delivery.
                    </p>
                  )}
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary-container transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div 
                      key={`${item.product.id}-${item.selectedWeight}-${index}`}
                      className="flex gap-4 p-3 bg-white rounded-xl border border-outline-variant/20 hover:border-outline-variant transition-colors"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg bg-surface-container-low shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h3 className="text-sm font-bold text-primary truncate">
                              {item.product.name}
                            </h3>
                            <button 
                              onClick={() => onRemoveItem(item.product.id, item.selectedWeight)}
                              className="text-on-surface-variant hover:text-red-500 transition-colors p-0.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="inline-block mt-0.5 bg-surface-container text-primary font-semibold text-[10px] px-2 py-0.5 rounded">
                            {item.selectedWeight}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-outline-variant/30 rounded bg-surface">
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                              className="px-2 py-1 hover:text-primary text-on-surface-variant transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-primary">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                              className="px-2 py-1 hover:text-primary text-on-surface-variant transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <span className="text-sm font-bold text-primary">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Billing & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-outline-variant/30 px-6 py-5 bg-white space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-semibold text-primary">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Estimated Shipping</span>
                  <span>{isFreeShipping ? 'FREE' : '₹49'}</span>
                </div>
                <div className="h-px bg-outline-variant/20 my-2" />
                <div className="flex justify-between text-base font-bold text-primary">
                  <span>Total</span>
                  <span>₹{totalAmount + (isFreeShipping ? 0 : 49)}</span>
                </div>
              </div>

              <button 
                onClick={onCheckout}
                className="w-full bg-secondary text-white font-semibold py-3.5 rounded-xl hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/10 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>
              <p className="text-[10px] text-center text-on-surface-variant">
                Standard delivery within 2-4 business days. Secure transaction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
