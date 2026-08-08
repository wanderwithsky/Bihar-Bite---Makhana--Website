import { useState, FormEvent, useEffect } from 'react';
import { X, CheckCircle2, CreditCard, ShieldCheck, MapPin, AlertCircle, Calendar, RefreshCw } from 'lucide-react';
import { CartItem, ScreenType } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderSuccess: (details: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => void;
  setScreen?: (screen: ScreenType) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onOrderSuccess,
  setScreen,
}: CheckoutModalProps) {
  const [navbarHeight, setNavbarHeight] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // Reset agreement check when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsAgreed(false);
      
      // Calculate navbar height automatically
      const updateNavbarHeight = () => {
        let height = 0;
        
        // Find the sticky header elements
        const desktopHeader = document.querySelector('header.fixed');
        const mobileHeader = document.querySelector('div.fixed.z-50.w-full');
        
        if (desktopHeader && window.getComputedStyle(desktopHeader).display !== 'none') {
          height = desktopHeader.getBoundingClientRect().height;
        } else if (mobileHeader && window.getComputedStyle(mobileHeader).display !== 'none') {
          height = mobileHeader.getBoundingClientRect().height;
        }
        
        // Also check if review ticker is visible and might push things down (if applicable)
        const reviewTicker = document.querySelector('div.fixed.top-0.z-40');
        let tickerHeight = 0;
        if (reviewTicker && window.getComputedStyle(reviewTicker).display !== 'none') {
           tickerHeight = reviewTicker.getBoundingClientRect().height;
        }
        
        // Some headers might start below the review ticker, so we take the max or sum depending on layout,
        // but typically the highest bottom coordinate of fixed elements at the top is the safe area.
        const safeAreaTop = Math.max(height, tickerHeight, window.innerWidth >= 768 ? 72 : 64);
        
        setNavbarHeight(safeAreaTop);
      };

      updateNavbarHeight();
      window.addEventListener('resize', updateNavbarHeight);
      
      return () => {
        window.removeEventListener('resize', updateNavbarHeight);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 60; // Standard flat ₹60 shipping to match DetailsScreen
  const total = subtotal + shipping;

  // Dynamic delivery date calculation (3 to 5 business days from today)
  const today = new Date();
  const estStart = new Date();
  estStart.setDate(today.getDate() + 3);
  const estEnd = new Date();
  estEnd.setDate(today.getDate() + 5);

  const formatDateStr = (date: Date) => {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const estDeliveryStr = `${formatDateStr(estStart)} - ${formatDateStr(estEnd)}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAgreed) {
      alert('You must agree to the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }
    
    if (formData.paymentMethod === 'cod') {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // Step 1: Create Order
      const orderRes = await fetch(`${apiUrl}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total * 100, // paise
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone
        })
      });
      
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Step 2: Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bihar Bite",
        description: "Premium Makhana Checkout",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Step 3: Verify Signature
            const verifyRes = await fetch(`${apiUrl}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setIsSuccess(true);
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verify error:', err);
            alert('Error verifying payment.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#143A2A"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert('Payment failed: ' + response.error.description);
        setIsSubmitting(false);
      });
      rzp.open();

    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Error initializing payment. ' + error.message);
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onOrderSuccess({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city} - ${formData.pincode}`
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[101] flex flex-col items-center p-4 overflow-y-auto custom-scrollbar font-sans"
      style={{ 
        paddingTop: `calc(${navbarHeight}px + 32px)`,
        paddingBottom: '32px'
      }}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isSuccess ? undefined : onClose}
      />

      <div className="relative bg-surface w-full max-w-2xl rounded-[28px] shadow-2xl overflow-hidden z-10 border border-outline-variant/30 flex flex-col shrink-0 my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-white">
          <h2 className="font-serif text-xl font-bold text-primary">
            {isSuccess ? '🎉 Order Confirmed!' : '🔒 Secure Checkout Gateway'}
          </h2>
          {!isSuccess && (
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isSuccess ? (
            <div className="text-center py-8 px-4 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                Order Placed Successfully!
              </h3>
              <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed font-light">
                Thank you for choosing <strong>Bihar Bite</strong>. Your premium gourmet makhana box has been reserved and is currently being packed with utmost cleanliness and care.
              </p>

              {/* Order summary display */}
              <div className="bg-white rounded-2xl p-5 border border-outline-variant/20 text-left max-w-md w-full mb-8 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-[#7C8464] uppercase tracking-wider">
                    Shipment Target Address:
                  </p>
                  <p className="text-sm font-semibold text-stone-900 mt-1">{formData.name}</p>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed font-light">
                    {formData.address}, {formData.city} - {formData.pincode}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5 font-mono">
                    Phone: {formData.phone}
                  </p>
                </div>
                <div className="h-px bg-stone-100" />
                <div className="flex justify-between items-center text-xs text-stone-600">
                  <span>Method of Payment:</span>
                  <span className="font-semibold text-stone-900 uppercase">
                    {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-stone-600">
                  <span>Shipping Delivery:</span>
                  <span className="font-semibold text-green-600 uppercase">
                    {shipping === 0 ? 'FREE' : '₹60'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-stone-600">
                  <span>Estimated Delivery Range:</span>
                  <span className="font-semibold text-stone-950 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    {estDeliveryStr}
                  </span>
                </div>
                <div className="h-px bg-stone-100" />
                <div className="flex justify-between items-center text-sm font-bold text-stone-900">
                  <span>Paid Grand Total:</span>
                  <span className="text-base text-[#7C8464]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-stone-900/10 cursor-pointer"
              >
                Continue Exploring Foods
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Shipping Form */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#7C8464] uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
                  <MapPin className="w-4 h-4" />
                  1. Shipping & Logistics
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8464] focus:border-[#7C8464] font-sans text-stone-900 font-light"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8464] focus:border-[#7C8464] font-sans text-stone-900 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile No</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit mobile"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8464] focus:border-[#7C8464] font-sans text-stone-900 font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Street Address</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Apartment/Flat No, Building, Area landmark"
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8464] focus:border-[#7C8464] font-sans text-stone-900 font-light"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Patna"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8464] focus:border-[#7C8464] font-sans text-stone-900 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Postal PIN Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="6-digit code"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8464] focus:border-[#7C8464] font-sans text-stone-900 font-light"
                    />
                  </div>
                </div>

                {/* Delivery Time and Return Summary */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/50 space-y-3 mt-4 text-[11px] text-stone-600 font-light">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-[#7C8464] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-950 font-semibold block">Pan-India Dispatch Timeline</strong>
                      Orders processed in 24 hours. Estimated arrival: <span className="text-stone-900 font-semibold">{estDeliveryStr}</span>.
                    </div>
                  </div>
                  <div className="flex items-start gap-2 border-t pt-2 border-stone-200/50">
                    <RefreshCw className="w-4 h-4 text-[#7C8464] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-950 font-semibold block">Return Policy Summary</strong>
                      Makhana is consumable and non-returnable. We provide 100% free replacements for any transit package damage instantly.
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Summary & Payment */}
              <div className="space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#7C8464] uppercase tracking-widest mb-4 flex items-center gap-1.5 border-b pb-2">
                    <CreditCard className="w-4 h-4" />
                    2. Payment Details
                  </h3>

                  {/* Payment selection */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <label className={`border rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 transition-all text-center ${
                      formData.paymentMethod === 'cod' ? 'border-stone-950 bg-stone-50 text-stone-950 font-semibold' : 'border-stone-200 text-stone-500'
                    }`}>
                    <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="sr-only" 
                      />
                      <span className="text-xs">Cash on Delivery</span>
                      <span className="text-[9px] text-stone-400 mt-0.5">Pay at your doorstep</span>
                    </label>

                    <label className={`border rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 transition-all text-center ${
                      formData.paymentMethod === 'upi' ? 'border-stone-950 bg-stone-50 text-stone-950 font-semibold' : 'border-stone-200 text-stone-500'
                    }`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="upi" 
                        checked={formData.paymentMethod === 'upi'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                        className="sr-only" 
                      />
                      <span className="text-xs">UPI Digital Payment</span>
                      <span className="text-[9px] text-stone-400 mt-0.5">GooglePay, PhonePe, Paytm</span>
                    </label>
                  </div>

                  {/* Order summary table */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-stone-200/50 space-y-3">
                    <span className="text-[10px] font-bold text-[#7C8464] uppercase tracking-widest block">Basket Summary</span>
                    <div className="max-h-24 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-stone-700 truncate max-w-[150px] font-light">
                            {item.product.name} ({item.selectedWeight}) <strong className="text-stone-900 font-semibold">x{item.quantity}</strong>
                          </span>
                          <span className="font-semibold text-stone-950">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-stone-200/60 my-2" />
                    <div className="flex justify-between text-xs text-stone-500 font-light">
                      <span>Subtotal basket value</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-500 font-light">
                      <span>Transit Shipping & Delivery</span>
                      <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                        {shipping === 0 ? 'FREE Delivery' : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-500 font-light">
                      <span>Delivery Date Estimate</span>
                      <span className="text-stone-800 font-medium">{estDeliveryStr}</span>
                    </div>
                    <div className="h-px bg-stone-200/60 my-1" />
                    <div className="flex justify-between text-sm font-bold text-stone-950 pt-1">
                      <span>Grand Total</span>
                      <span className="text-base text-[#7C8464]">₹{total}</span>
                    </div>
                  </div>
                </div>

                {/* Agreement checkbox and Place Order */}
                <div className="space-y-3">
                  
                  {/* T&C checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="w-4 h-4 mt-0.5 text-stone-900 border-stone-300 rounded focus:ring-stone-500 cursor-pointer"
                      />
                      <span className="text-[11px] text-stone-600 leading-snug font-light">
                        I agree to the{' '}
                        <button 
                          type="button"
                          onClick={() => {
                            if (setScreen) {
                              setScreen('terms-conditions');
                              onClose();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              alert("Opening Terms & Conditions");
                            }
                          }}
                          className="text-[#7C8464] font-medium hover:underline bg-transparent border-none p-0 inline align-baseline"
                        >
                          Terms & Conditions
                        </button>{' '}
                        and{' '}
                        <button 
                          type="button"
                          onClick={() => {
                            if (setScreen) {
                              setScreen('privacy-policy');
                              onClose();
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                              alert("Opening Privacy Policy");
                            }
                          }}
                          className="text-[#7C8464] font-medium hover:underline bg-transparent border-none p-0 inline align-baseline"
                        >
                          Privacy Policy
                        </button>.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isAgreed}
                    className="w-full bg-stone-900 text-white font-semibold py-3.5 rounded-xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-950/10 disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-widest mt-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      'Place Secure Order'
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 text-center font-light">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    <span>256-Bit SSL Secured Checkout Gateway • Encrypted & Safe</span>
                  </div>
                </div>

              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
