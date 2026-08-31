import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, CreditCard, ShieldCheck, MapPin, 
  ShoppingCart, ChevronRight, Check, ArrowLeft, ArrowRight, Download
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product, User, Address, ScreenType, CartItem, Order } from '../types';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface CheckoutScreenProps {
  buyNowItem: { product: Product, selectedWeight: string, quantity: number, price: number } | null;
  cart?: CartItem[];
  onOrderSuccess: (details: {
    name: string;
    email: string;
    phone: string;
    address: string;
    saveAddress?: boolean;
    paymentMethod?: 'cod' | 'online';
  }) => Promise<Order | void>;
  currentUser: User | null;
  setScreen?: (screen: ScreenType) => void;
  onPaymentVerified?: (order: Order) => void;
  onClose: () => void;
}

export default function CheckoutScreen({
  buyNowItem,
  cart,
  onOrderSuccess,
  currentUser,
  setScreen,
  onPaymentVerified,
  onClose
}: CheckoutScreenProps) {
  // Script loader utility
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const navigate = useNavigate();
  const isOrderPlaced = React.useRef(false);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Redirect if no item and not success (and not currently placing an order)
  useEffect(() => {
    if (!buyNowItem && (!cart || cart.length === 0) && !isSuccess && !isOrderPlaced.current) {
      navigate('/shop');
    }
  }, [buyNowItem, cart, isSuccess, navigate]);

  // Prefill from currentUser
  const defaultAddress = currentUser?.savedAddresses?.find(a => a.isDefault) || currentUser?.savedAddresses?.[0];

  const [formData, setFormData] = useState({
    name: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.mobile || '',
    house: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    saveAddress: false,
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>(
    currentUser?.savedAddresses?.length ? (defaultAddress?.id || currentUser.savedAddresses[0].id) : 'new'
  );
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  if (!buyNowItem && (!cart || cart.length === 0) && !isSuccess && !isOrderPlaced.current) {
    return null; // Will redirect via useEffect
  }

  const checkoutItems = buyNowItem 
    ? [{ product: buyNowItem.product, selectedWeight: buyNowItem.selectedWeight, quantity: buyNowItem.quantity, price: buyNowItem.price }]
    : (cart || []);

  const subtotal = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'online') {
      setIsSubmitting(true);
      try {
        // Prepare address
        let finalAddress = '';
        if (selectedAddressId === 'new' || !currentUser?.savedAddresses?.length) {
          finalAddress = `${formData.house}, ${formData.street}${formData.landmark ? `, Near ${formData.landmark}` : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
        } else {
          const addr = currentUser.savedAddresses.find(a => a.id === selectedAddressId);
          if (addr) {
            finalAddress = `${addr.streetAddress}${addr.apartment ? `, ${addr.apartment}` : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
            formData.phone = addr.mobile || formData.phone;
            formData.name = addr.fullName || formData.name;
          }
        }

        // 1. Create a Pending Order in Supabase
        isOrderPlaced.current = true;
        const pendingOrder = await onOrderSuccess({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: finalAddress,
          saveAddress: formData.saveAddress && selectedAddressId === 'new',
          paymentMethod: 'online',
          isInitiation: true
        });

        if (!pendingOrder) {
          alert('Failed to initiate order. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // 2. Load Razorpay script
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          setIsSubmitting(false);
          return;
        }

        // 3. Create Order Backend
        const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        console.log('[RAZORPAY] checkout total (rupees):', total);
        console.log('[RAZORPAY] amount sent to backend (app_order_id):', (pendingOrder as Order).id);
        console.log('[RAZORPAY] create-order request started');
        const orderResponse = await fetch(`${baseUrl}/api/payment/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            app_order_id: (pendingOrder as Order).id,
            amount: total, // Frontend explicitly sends rupees
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone
          })
        });

        console.log('[RAZORPAY] response status:', orderResponse.status);
        
        const orderDataText = await orderResponse.text();
        console.log('[RAZORPAY] response body:', orderDataText);
        
        let orderData;
        try {
          orderData = JSON.parse(orderDataText);
        } catch(e) {
          alert(`Server returned non-JSON response. Status: ${orderResponse.status}`);
          setIsSubmitting(false);
          return;
        }

        if (!orderData.success) {
          alert('Unable to start online payment. Please try again.');
          setIsSubmitting(false);
          return;
        }

        // 3. Initialize Razorpay Modal
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Frontend key
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Bihar Bite',
          description: 'Premium Makhana Purchase',
          order_id: orderData.order_id,
          handler: async function (response: any) {
            try {
              // 4. Verify Payment Backend
              const verifyResponse = await fetch(`${baseUrl}/api/payment/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  app_order_id: (pendingOrder as Order).id
                })
              });
              
              const verifyData = await verifyResponse.json();

              if (verifyData.success) {
                // Payment success, order already in DB, just trigger verification callback
                if (onPaymentVerified) {
                  onPaymentVerified(pendingOrder as Order);
                }
                setConfirmedOrder(pendingOrder as Order);
                setIsSuccess(true);
              } else {
                alert('Payment verification failed.');
              }
            } catch (err) {
              console.error(err);
              alert('Payment verification failed.');
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
            color: '#143A2A'
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
            }
          }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
          alert(`Payment failed: ${response.error.description}`);
          setIsSubmitting(false);
        });
        paymentObject.open();

      } catch (err) {
        console.error(err);
        alert('Failed to initiate online payment.');
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      let finalAddress = '';
      if (selectedAddressId === 'new' || !currentUser?.savedAddresses?.length) {
        finalAddress = `${formData.house}, ${formData.street}${formData.landmark ? `, Near ${formData.landmark}` : ''}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      } else {
        const addr = currentUser.savedAddresses.find(a => a.id === selectedAddressId);
        if (addr) {
          finalAddress = `${addr.streetAddress}${addr.apartment ? `, ${addr.apartment}` : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
          formData.phone = addr.mobile || formData.phone;
          formData.name = addr.fullName || formData.name;
        }
      }

      isOrderPlaced.current = true;
      const order = await onOrderSuccess({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: finalAddress,
        saveAddress: formData.saveAddress && selectedAddressId === 'new',
        paymentMethod
      });
      if (order) setConfirmedOrder(order as Order);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
      if (!isSuccess) {
        // If it failed, reset the ref so redirect can happen if cart is empty
        isOrderPlaced.current = false;
      }
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    
    // Format Date Helper
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    };

    return (
      <div className="min-h-screen bg-[#FAF8F4] pt-[120px] pb-24 flex items-center justify-center font-sans px-4">
        <div className="bg-white max-w-2xl w-full rounded-[32px] p-8 md:p-12 shadow-sm border border-stone-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-[#143A2A] mb-4">Order Confirmed!</h1>
          
          {confirmedOrder ? (
            <>
              <p className="text-stone-600 mb-6 max-w-md leading-relaxed">
                Thank you for your order. We have received your request and are preparing it for dispatch.
              </p>
              
              <div className="w-full bg-[#FAF8F4] rounded-2xl p-6 text-left border border-stone-200 mb-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Order ID</span>
                  <span className="font-bold text-[#143A2A]">#{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Order Date & Time</span>
                  <span className="font-bold text-[#143A2A]">{formatDate(confirmedOrder.date)}, {confirmedOrder.time}</span>
                </div>
                
                <div className="h-px bg-stone-200 w-full my-4" />
                
                {confirmedOrder.deliveryStartDate && confirmedOrder.deliveryEndDate && (
                  <div className="flex justify-between items-center bg-[#C28E63]/10 p-4 rounded-xl mb-4">
                    <span className="text-sm font-bold text-[#C28E63] uppercase tracking-wider">Estimated Delivery</span>
                    <span className="font-bold text-[#143A2A]">
                      {formatDate(confirmedOrder.deliveryStartDate)} – {formatDate(confirmedOrder.deliveryEndDate)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Payment Method</span>
                  <span className="font-bold text-[#143A2A]">{confirmedOrder.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
                </div>
                <div className="h-px bg-stone-200 w-full my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Grand Total</span>
                  <span className="text-xl font-bold text-[#C28E63]">₹{confirmedOrder.total}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button 
                  onClick={() => generateInvoicePDF(confirmedOrder)}
                  className="flex-1 md:flex-none px-8 py-4 bg-white border-2 border-[#143A2A] text-[#143A2A] rounded-full font-bold uppercase tracking-wider text-xs hover:bg-stone-50 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Invoice
                </button>
                <Link 
                  to="/shop" 
                  className="flex-1 md:flex-none px-8 py-4 bg-[#143A2A] text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#0E281C] transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-stone-600 mb-8 max-w-md leading-relaxed">
                Thank you for your order. We have received your request and are preparing it for dispatch. 
                You will receive updates via email shortly.
              </p>
              
              <div className="w-full bg-[#FAF8F4] rounded-2xl p-6 text-left border border-stone-200 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Payment Method</span>
                  <span className="font-bold text-[#143A2A]">{paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</span>
                </div>
                <div className="h-px bg-stone-200 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">Amount to Pay</span>
                  <span className="text-xl font-bold text-[#C28E63]">₹{total}</span>
                </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <Link 
                  to="/shop" 
                  className="flex-1 md:flex-none px-8 py-4 bg-[#143A2A] text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#0E281C] transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] pt-[100px] pb-24 font-sans selection:bg-[#C28E63]/20 selection:text-[#143A2A]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        
        {/* Header & Back Button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product
          </button>
        </div>
        
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#143A2A] mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 custom-scrollbar">
          {[
            { step: 1, label: 'Order Summary', icon: <ShoppingCart className="w-4 h-4" /> },
            { step: 2, label: 'Delivery Details', icon: <MapPin className="w-4 h-4" /> },
            { step: 3, label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
          ].map((s, idx, arr) => (
            <React.Fragment key={s.step}>
              <div 
                className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-full border transition-all ${
                  currentStep === s.step 
                    ? 'border-[#143A2A] bg-[#143A2A] text-white' 
                    : currentStep > s.step
                    ? 'border-[#C28E63] text-[#C28E63] bg-[#C28E63]/5'
                    : 'border-stone-200 text-stone-400 bg-white'
                }`}
              >
                {currentStep > s.step ? <Check className="w-4 h-4" /> : s.icon}
                <span className="font-bold text-xs uppercase tracking-wider">{s.label}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className={`w-8 md:w-16 h-px shrink-0 ${currentStep > s.step ? 'bg-[#C28E63]' : 'bg-stone-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Layout: Left Content, Right Summary */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left Column - Forms */}
          <div className="w-full lg:w-[60%] shrink-0">
            
            {/* STEP 1: CART SUMMARY */}
            {currentStep === 1 && checkoutItems.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-stone-100"
              >
                <h2 className="text-xl font-serif font-bold text-[#143A2A] mb-6">Review Items</h2>
                <div className="space-y-4 mb-8">
                  {checkoutItems.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center p-4 border border-stone-100 rounded-2xl bg-[#FAF8F4]/50">
                      <div className="flex-1">
                        <h3 className="font-serif font-bold text-lg text-[#143A2A] mb-1">{item.product.name}</h3>
                        <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
                          Weight: {item.selectedWeight}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-stone-600">Qty: {item.quantity}</span>
                          <span className="font-bold text-[#143A2A] text-lg">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleNextStep}
                  className="w-full py-4 bg-[#143A2A] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0E281C] transition-all"
                >
                  Continue to Delivery <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: ADDRESS */}
            {currentStep === 2 && (
              <motion.form 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                onSubmit={handleNextStep}
                className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-stone-100"
              >
                <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
                  <h2 className="text-xl font-serif font-bold text-[#143A2A]">Contact Details</h2>
                  {!currentUser && (
                    <span className="text-xs text-stone-500">
                      Guest Checkout. <button type="button" onClick={() => setScreen?.('auth')} className="text-[#C28E63] font-bold underline">Login</button> for faster checkout.
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Full Name *</label>
                    <input 
                      type="text" required
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Mobile Number *</label>
                    <input 
                      type="tel" required
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Email Address *</label>
                    <input 
                      type="email" required
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <h2 className="text-xl font-serif font-bold text-[#143A2A] mb-6 border-b border-stone-100 pb-4">Delivery Address</h2>
                
                {currentUser && currentUser.savedAddresses && currentUser.savedAddresses.length > 0 && (
                  <div className="mb-6 space-y-3">
                    {currentUser.savedAddresses.map(addr => (
                      <label 
                        key={addr.id} 
                        className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id 
                            ? 'border-[#143A2A] bg-[#143A2A]/5' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="addressSelection" 
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-sm mb-1">{addr.fullName} <span className="font-normal text-stone-500">- {addr.mobile}</span></p>
                          <p className="text-stone-600 text-sm">{addr.streetAddress}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                          <p className="text-stone-600 text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                        </div>
                      </label>
                    ))}
                    
                    <label 
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAddressId === 'new' 
                          ? 'border-[#143A2A] bg-[#143A2A]/5' 
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="addressSelection" 
                        value="new"
                        checked={selectedAddressId === 'new'}
                        onChange={() => setSelectedAddressId('new')}
                      />
                      <span className="font-bold text-stone-900 text-sm">+ Add New Address</span>
                    </label>
                  </div>
                )}

                {(selectedAddressId === 'new' || !currentUser?.savedAddresses?.length) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">House / Flat / Building *</label>
                      <input 
                        type="text" required={selectedAddressId === 'new'}
                        value={formData.house} onChange={e => setFormData({...formData, house: e.target.value})}
                        className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Street / Area *</label>
                      <input 
                        type="text" required={selectedAddressId === 'new'}
                        value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})}
                        className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Landmark (Optional)</label>
                      <input 
                        type="text"
                        value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})}
                        className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">City *</label>
                      <input 
                        type="text" required={selectedAddressId === 'new'}
                        value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">State *</label>
                      <input 
                        type="text" required={selectedAddressId === 'new'}
                        value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
                        className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">PIN Code *</label>
                      <input 
                        type="text" required={selectedAddressId === 'new'} maxLength={6}
                        value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                        className="w-full bg-[#FAF8F4] border-none rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#143A2A]/20 outline-none text-stone-900 font-medium"
                      />
                    </div>
                    {currentUser && (
                      <div className="md:col-span-2 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.saveAddress}
                            onChange={e => setFormData({...formData, saveAddress: e.target.checked})}
                            className="w-4 h-4 text-[#143A2A] rounded focus:ring-[#143A2A]"
                          />
                          <span className="text-sm text-stone-600">Save this address to My Account</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button" onClick={handlePrevStep}
                    className="px-6 py-4 bg-stone-100 text-stone-600 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-[#143A2A] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0E281C] transition-all"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <motion.form 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePlaceOrder}
                className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-stone-100"
              >
                <h2 className="text-xl font-serif font-bold text-[#143A2A] mb-8 border-b border-stone-100 pb-4">Select Payment Method</h2>
                
                <div className="space-y-4 mb-8">
                  
                  {/* COD */}
                  <label 
                    className={`flex items-start gap-4 p-6 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod' 
                        ? 'border-[#143A2A] bg-[#143A2A]/5' 
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input 
                      type="radio" name="paymentMethod" value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1"
                    />
                    <div>
                      <h3 className="font-bold text-stone-900 mb-1">Cash on Delivery</h3>
                      <p className="text-sm text-stone-500">Pay with cash when your order arrives.</p>
                    </div>
                  </label>

                  {/* ONLINE */}
                  <label 
                    className={`flex items-start gap-4 p-6 rounded-2xl border transition-all ${
                      paymentMethod === 'online' 
                        ? 'border-[#143A2A] bg-[#143A2A]/5' 
                        : 'border-stone-200'
                    }`}
                  >
                    <input 
                      type="radio" name="paymentMethod" value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mt-1"
                    />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-stone-900 mb-1">Online Payment</h3>
                        <p className="text-sm text-stone-500">Pay securely online with Cards/UPI.</p>
                      </div>
                    </div>
                  </label>

                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400 mb-8 justify-center bg-stone-50 p-4 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  100% Safe & Secure Checkout process
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button" onClick={handlePrevStep}
                    className="px-6 py-4 bg-stone-100 text-stone-600 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-stone-200 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-[#143A2A] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0E281C] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order Now'}
                  </button>
                </div>
              </motion.form>
            )}

          </div>

          {/* Right Column - Order Summary Widget */}
          <div className="w-full lg:w-[40%] sticky top-32">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100">
              <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-stone-100">
                <div className="flex justify-between text-stone-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600 text-sm">
                  <span>Delivery Fee</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-stone-900'}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-stone-900">Grand Total</span>
                <span className="text-2xl font-serif font-bold text-[#C28E63]">₹{total}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
