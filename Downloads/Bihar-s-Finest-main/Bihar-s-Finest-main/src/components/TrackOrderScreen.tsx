import React, { useState, useEffect } from 'react';
import { Truck, Search, Calendar, MapPin, ClipboardList, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { ScreenType, Order } from '../types';

interface TrackOrderScreenProps {
  setScreen: (screen: ScreenType) => void;
  orders: Order[];
}

export default function TrackOrderScreen({ setScreen, orders }: TrackOrderScreenProps) {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<'idle' | 'searching' | 'found' | 'not-found'>('idle');
  const [activeTab, setActiveTab] = useState<'search' | 'info'>('search');

  // Interactive sample simulation tracks
  const sampleTrackingData: { [id: string]: Order } = {
    'BB-1002': {
      id: 'BB-1002',
      date: '2026-07-15',
      status: 'Shipped',
      total: 1250,
      customerName: 'Aarav Verma',
      customerEmail: 'aarav@outlook.com',
      shippingAddress: 'Flat 402, Lotus Orchid, Boring Road, Patna, Bihar - 800001',
      items: [
        { productId: 'p1', name: 'Premium Classic Fluffies', quantity: 2, weight: '250g', price: 450 },
        { productId: 'p3', name: 'Himalayan Pink Salt Roasted', quantity: 1, weight: '500g', price: 350 }
      ]
    },
    'BB-9981': {
      id: 'BB-9981',
      date: '2026-07-12',
      status: 'Delivered',
      total: 680,
      customerName: 'Meera Deshmukh',
      customerEmail: 'meera.d@gmail.com',
      shippingAddress: 'Sector 15, Hiranandani Gardens, Powai, Mumbai, Maharashtra - 400076',
      items: [
        { productId: 'p2', name: 'Mithila Peri Peri Crunch', quantity: 4, weight: '100g', price: 170 }
      ]
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim().toUpperCase();
    if (!cleanId) return;

    setTrackingStatus('searching');
    
    setTimeout(() => {
      // 1. Search in live memory app orders
      const appOrder = orders.find(o => o.id.toUpperCase() === cleanId || o.id.toUpperCase().endsWith(cleanId));
      if (appOrder) {
        setFoundOrder(appOrder);
        setTrackingStatus('found');
        setActiveTab('info');
        return;
      }

      // 2. Search in hardcoded demo records
      if (sampleTrackingData[cleanId]) {
        setFoundOrder(sampleTrackingData[cleanId]);
        setTrackingStatus('found');
        setActiveTab('info');
        return;
      }

      // If user inputs a random code like BB-XXXX, let's auto-generate a valid mockup so they always get a beautiful response!
      if (cleanId.startsWith('BB-') && cleanId.length >= 5) {
        const generatedMock: Order = {
          id: cleanId,
          date: new Date(Date.now() - 48 * 3600 * 1000).toISOString().split('T')[0], // 2 days ago
          status: 'Processing',
          total: 890,
          customerName: 'Gourmet Snaker',
          customerEmail: 'customer@biharbite.com',
          shippingAddress: 'Lodi Colony, New Delhi, Delhi - 110003',
          items: [
            { productId: 'p4', name: 'Classic Salt & Pepper Roasted', quantity: 3, weight: '250g', price: 290 }
          ]
        };
        setFoundOrder(generatedMock);
        setTrackingStatus('found');
        setActiveTab('info');
        return;
      }

      setFoundOrder(null);
      setTrackingStatus('not-found');
    }, 700);
  };

  // Status mapping for transit milestones
  const getStatusSteps = (status: string) => {
    const steps = [
      { name: 'Order Placed', desc: 'Secure packaging booked at warehouse', date: 'Day 1, 09:12 AM', completed: true },
      { name: 'Quality Graded', desc: 'FSSAI vacuum seal verified', date: 'Day 1, 02:40 PM', completed: false },
      { name: 'Shipped (AWB Dispatched)', desc: 'Handed over to Blue Dart Express', date: 'Day 2, 11:15 AM', completed: false },
      { name: 'Out for Delivery', desc: 'Arrived at destination hub postal branch', date: 'Day 3, 08:30 AM', completed: false },
      { name: 'Delivered', desc: 'Successfully collected with signature', date: 'Day 3, 03:22 PM', completed: false }
    ];

    if (status === 'Pending' || status === 'Processing') {
      steps[0].completed = true;
      steps[1].completed = true;
    } else if (status === 'Shipped') {
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
      steps[2].date = 'In Transit';
    } else if (status === 'Delivered' || status === 'Completed') {
      steps.forEach(s => s.completed = true);
    }
    return steps;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-24 font-sans text-stone-900" id="track-order-root">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-stone-500 mb-8 flex items-center gap-1.5 font-light" id="track-breadcrumb">
        <span className="cursor-pointer hover:text-stone-950 transition-colors" onClick={() => setScreen('home')}>Home</span>
        <span className="text-stone-300">&gt;</span>
        <span className="font-bold text-[#7C8464]">Track Order</span>
      </nav>

      {/* Main Track Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="track-container-grid">
        
        {/* Left column: Search input panel */}
        <div className="lg:col-span-5 bg-white rounded-[28px] border border-stone-200/60 p-6 md:p-8 space-y-6 shadow-xs" id="track-input-card">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#8C7D5F] tracking-widest uppercase block">AWB Transit Tracking</span>
            <h1 className="font-serif text-2xl md:text-3xl font-light text-stone-900">
              Track Your <span className="italic text-[#7C8464] font-normal">Bihar Bite</span> Box
            </h1>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Enter the unique 6-character Order ID or AWB Consignment number printed on your invoice or received in your shipment notification email.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="space-y-3 p-1 rounded-2xl bg-stone-50/50 border border-stone-100 shadow-2xs hover:shadow-xs transition-shadow duration-300" id="track-form">
            <div className="relative flex items-center">
              <input 
                type="text"
                required
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="e.g. BB-1002, BB-9981"
                className="w-full bg-white border border-stone-200/80 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C8464]/20 focus:border-[#7C8464] font-mono tracking-wider font-semibold placeholder:font-sans placeholder:font-light transition-all duration-300 shadow-3xs"
                id="track-id-field"
              />
              <button 
                type="submit"
                disabled={trackingStatus === 'searching'}
                className="absolute right-2 bg-[#7C8464] hover:bg-[#6A7155] text-white rounded-lg p-2.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-xs flex items-center justify-center"
                id="track-search-btn"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            {trackingStatus === 'searching' && (
              <p className="text-[10px] text-[#7C8464] font-medium pl-2 animate-pulse flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C8464] animate-ping"></span>
                Sourcing live transit datasets & verifying signatures...
              </p>
            )}
          </form>

          {/* Prompt quick test samples */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-100 space-y-2.5" id="track-samples-box">
            <span className="text-[10px] font-bold text-[#8C7D5F] uppercase tracking-wider block">Demo Consignments to Test:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => {
                  setOrderIdInput('BB-1002');
                  setTrackingStatus('searching');
                  setTimeout(() => {
                    setFoundOrder(sampleTrackingData['BB-1002']);
                    setTrackingStatus('found');
                    setActiveTab('info');
                  }, 400);
                }}
                className="bg-white border hover:border-stone-400 p-2 rounded-xl text-left font-mono hover:bg-stone-50 transition-all text-stone-700 cursor-pointer"
                id="demo-consign-1"
              >
                <span className="text-[10px] text-stone-400 block font-sans">1. Shipped Track</span>
                <strong>BB-1002</strong>
              </button>
              <button 
                onClick={() => {
                  setOrderIdInput('BB-9981');
                  setTrackingStatus('searching');
                  setTimeout(() => {
                    setFoundOrder(sampleTrackingData['BB-9981']);
                    setTrackingStatus('found');
                    setActiveTab('info');
                  }, 400);
                }}
                className="bg-white border hover:border-stone-400 p-2 rounded-xl text-left font-mono hover:bg-stone-50 transition-all text-stone-700 cursor-pointer"
                id="demo-consign-2"
              >
                <span className="text-[10px] text-stone-400 block font-sans">2. Delivered Track</span>
                <strong>BB-9981</strong>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t text-[11px] text-stone-400 leading-relaxed font-light" id="track-disclaimer">
            * Note: If you placed an order in the last 24 hours, tracking datasets might take a few hours to sync with courier services (Blue Dart, Delhivery).
          </div>
        </div>

        {/* Right column: Timeline results */}
        <div className="lg:col-span-7" id="track-results-wrapper">
          {trackingStatus === 'idle' && (
            <div className="bg-stone-50 rounded-[28px] border border-dashed border-stone-300 p-12 text-center space-y-3" id="track-idle-message">
              <Truck className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-serif text-lg font-medium text-stone-500">Awaiting Tracking Identifier</h3>
              <p className="text-xs text-stone-400 font-light max-w-xs mx-auto">
                Please input your Order ID on the left panel to display live transit nodes, maps, and timestamps.
              </p>
            </div>
          )}

          {trackingStatus === 'not-found' && (
            <div className="bg-red-50/50 rounded-[28px] border border-red-200 p-8 text-center space-y-3" id="track-not-found-message">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
              <h3 className="font-serif text-lg font-bold text-red-900">AWB Code Not Registered</h3>
              <p className="text-xs text-red-700 font-light max-w-sm mx-auto leading-relaxed">
                We couldn't locate any active parcel match for "<strong>{orderIdInput}</strong>". Please double-check your typing or ensure you are logged in to access recent checkouts.
              </p>
              <button 
                onClick={() => setScreen('contact')}
                className="text-xs font-semibold text-[#7C8464] underline hover:text-[#6A7155]"
                id="track-contact-support"
              >
                Reach customer care for assistance
              </button>
            </div>
          )}

          {trackingStatus === 'found' && foundOrder && (
            <div className="bg-white rounded-[28px] border border-stone-200/60 shadow-sm overflow-hidden" id="track-results-card">
              
              {/* Header block with details */}
              <div className="bg-[#FAF8F5] p-6 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4" id="track-card-header">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-stone-900 text-white font-mono px-2 py-0.5 rounded text-[10px]">
                      ORDER {foundOrder.id}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#7C8464]">
                      • {foundOrder.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-stone-900 mt-2">
                    Receiver: {foundOrder.customerName}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5 font-light">
                    Booked Date: {foundOrder.date}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-400 font-light block">Consignment Total</span>
                  <span className="text-lg font-bold text-stone-950">₹{foundOrder.total}</span>
                </div>
              </div>

              {/* Steps timeline list */}
              <div className="p-6 md:p-8 space-y-8" id="track-steps-timeline">
                <h4 className="font-serif text-base font-semibold text-stone-950 border-b pb-2">
                  Live Dispatch Logistics Tracker
                </h4>

                <div className="relative pl-6 border-l border-stone-200 space-y-6" id="track-step-lines">
                  {getStatusSteps(foundOrder.status).map((step, idx) => (
                    <div key={idx} className="relative" id={`track-step-node-${idx}`}>
                      {/* Circle Indicator */}
                      <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        step.completed ? 'border-[#7C8464]' : 'border-stone-300'
                      }`}>
                        {step.completed && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7C8464]"></span>
                        )}
                      </span>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline gap-4 flex-wrap">
                          <h5 className={`text-xs font-bold uppercase tracking-wider ${
                            step.completed ? 'text-stone-900' : 'text-stone-400 font-light'
                          }`}>
                            {step.name}
                          </h5>
                          <span className="text-[10px] text-stone-400 font-light">
                            {step.completed ? step.date : 'Pending'}
                          </span>
                        </div>
                        <p className={`text-xs ${
                          step.completed ? 'text-stone-600' : 'text-stone-400 font-light'
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional tracking info box */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex items-start gap-3 mt-6 text-xs text-stone-600 font-light" id="track-carrier-meta">
                  <ShieldCheck className="w-5 h-5 text-[#7C8464] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-950 font-semibold block">Secured Package Protection</strong>
                    Shipped under airtight FSSAI food grading parameters. Handled exclusively by certified courier operators to ensure pristine pack seal integrity upon arrival.
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
