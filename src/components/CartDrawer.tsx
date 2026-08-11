import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = totalAmount >= freeShippingThreshold;
  const progressPercent = Math.min((totalAmount / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[8px]"
            onClick={onClose}
          />

          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-y-0 right-0 max-w-full flex"
          >
            <div className="w-[85vw] max-w-[360px] md:w-screen md:max-w-md bg-white md:bg-surface h-[100vh] flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.15)] md:shadow-xl rounded-l-[18px] md:rounded-none overflow-hidden">
              {/* Header */}
              <div className="px-5 md:px-6 py-4 md:py-5 border-b border-stone-100 md:border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="text-[16px] md:text-lg font-bold text-primary flex items-center gap-2">
                    Shopping Bag
                    {totalItems > 0 && (
                      <span className="bg-[#D4A24A] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                        {totalItems}
                      </span>
                    )}
                  </h2>
                </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

              <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="w-16 h-16 text-outline-variant/50 mb-4 stroke-1" />
                    <p className="text-stone-500 font-medium text-sm md:text-base">Your cart is empty</p>
                    <button 
                      onClick={onClose}
                      className="mt-6 px-8 py-3.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-container transition-colors shadow-md"
                    >
                      Continue Shopping
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

                <div className="space-y-4 md:space-y-3">
                  {cart.map((item, index) => (
                    <div key={`${item.product.id}-${item.selectedWeight}-${index}`}>
                      <div className="flex gap-4 p-3 md:bg-white md:rounded-xl md:border md:border-outline-variant/20 hover:border-outline-variant transition-colors">
                        {(item.product as any).video ? (
                          <video 
                            src={(item.product as any).video} 
                            className="w-[72px] h-[72px] md:w-20 md:h-20 object-cover rounded-lg bg-stone-50 shrink-0 border border-stone-100"
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img 
                            src={(item.product as any).image || (item.product as any).images?.[0] || '/images/04.png'} 
                            alt={item.product.name}
                            className="w-[72px] h-[72px] md:w-20 md:h-20 object-cover rounded-lg bg-stone-50 shrink-0 border border-stone-100"
                          />
                        )}
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
                            <div className="flex items-center border border-stone-200 rounded md:bg-surface h-8">
                              <button 
                                onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-stone-50 active:scale-95 transition-all text-stone-500"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-[13px] font-bold text-primary">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                                className="w-8 h-full flex items-center justify-center hover:bg-stone-50 active:scale-95 transition-all text-stone-500"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <span className="text-[15px] font-bold text-primary">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Mobile Divider */}
                      <div className="h-px bg-stone-100 w-full mt-4 md:hidden last:hidden" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

              {/* Footer Billing & Checkout */}
              {cart.length > 0 && (
                <div className="border-t border-stone-100 md:border-outline-variant/30 px-5 md:px-6 py-5 bg-white space-y-4">
                  <div className="space-y-1.5 text-sm md:text-[13px]">
                    <div className="flex justify-between text-stone-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-primary">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Shipping</span>
                      <span>{isFreeShipping ? 'FREE' : '₹49'}</span>
                    </div>
                    <div className="h-px bg-stone-100 my-3 md:my-2" />
                    <div className="flex justify-between text-[16px] md:text-base font-bold text-primary">
                      <span>Total</span>
                      <span>₹{totalAmount + (isFreeShipping ? 0 : 49)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={onCheckout}
                      className="w-full bg-[#183D2F] text-white font-bold text-[15px] py-4 rounded-xl hover:bg-[#143A2A] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      Checkout
                    </button>
                    <button 
                      onClick={onClose}
                      className="w-full text-stone-500 font-semibold text-[14px] py-3 active:scale-[0.98] transition-transform md:hidden"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
