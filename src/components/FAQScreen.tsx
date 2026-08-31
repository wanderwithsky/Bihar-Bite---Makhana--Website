import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, Phone, Mail } from 'lucide-react';
import { ScreenType } from '../types';

interface FAQScreenProps {
  setScreen: (screen: ScreenType) => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default function FAQScreen({ setScreen }: FAQScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>('q-1');

  const faqCategories: FAQCategory[] = [
    {
      title: 'Products & Quality',
      items: [
        {
          id: 'q-1',
          question: 'Are your makhanas organic and chemical-free?',
          answer: 'Yes, 100%! All our phool makhanas are organically grown in traditional lotus ponds in the Mithila region of Bihar. They are harvested manually by local experts, slow-roasted, and processed without any artificial chemicals, additives, or synthetic preservatives.'
        },
        {
          id: 'q-2',
          question: 'What are the health benefits of eating Makhana?',
          answer: 'Makhana (fox nuts) is an ancient ayurvedic superfood. It has a low glycemic index (safe for diabetes), is rich in vital antioxidants (like Kaempferol), is naturally gluten-free, and contains balanced plant proteins, magnesium, and potassium that support heart health and weight management.'
        },
        {
          id: 'q-3',
          question: 'How long do Bihar Bite products remain fresh?',
          answer: 'Our vacuum-sealed packs retain absolute crispness for up to 12 months from the packaging date. Once opened, we highly recommend storing them in our moisture-lock zipper packet or transferring them to an airtight dry container to prevent absorption of atmospheric moisture.'
        },
        {
          id: 'q-4',
          question: 'What does "Soot size" mean in makhana grading?',
          answer: '"Soot" is the traditional grading unit for waterlily seeds based on diameter. Grades range from 5 Soot to 9 Soot. Bihar Bite uses premium hand-grading to select only the largest, thickest seeds (typically 7+ to 9 Soot) for our premium and flavoured packs, ensuring an airy, robust crunch.'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      items: [
        {
          id: 'q-5',
          question: 'Do you ship makhana across India?',
          answer: 'Yes, we provide secure standard shipping across more than 26,000 active PIN codes in India. We partner with elite national couriers like Delhivery, Blue Dart, DTDC, and Xpressbees for guaranteed secure deliveries.'
        },
        {
          id: 'q-6',
          question: 'What are the shipping charges and timelines?',
          answer: 'Standard shipping is completely FREE for all cart values above ₹999. For orders below ₹999, we apply a flat, standard transit fee of ₹60. Dispatch occurs within 24 business hours of order placement. Standard delivery takes 1-3 days within Bihar and 3-5 business days across other parts of India.'
        },
        {
          id: 'q-7',
          question: 'How can I track my shipped parcel?',
          answer: 'Once your gourmet pack is picked up by our shipping partners, a live trackable AWB number is immediately sent to your registered email and mobile number. You can also track it directly on our interactive "Track Order" portal on this website!'
        }
      ]
    },
    {
      title: 'Orders & Payments',
      items: [
        {
          id: 'q-8',
          question: 'What payment methods do you accept?',
          answer: 'We support 100% secure, encrypted digital payment options including UPI transactions (GooglePay, PhonePe, Paytm, BHIM), all major Credit/Debit cards (Visa, Mastercard, RuPay), and secure NetBanking checkouts. Cash on Delivery (COD) is also fully supported at no extra charge.'
        },
        {
          id: 'q-9',
          question: 'What is your refund or replacement policy?',
          answer: 'Due to strict hygiene regulations for consumable food items, our products are non-returnable. However, we offer an absolute 100% damage guarantee: if your parcel is crushed or torn during transit, simply email us or WhatsApp a photo within 48 hours, and we will dispatch a free replacement box immediately.'
        }
      ]
    },
    {
      title: 'Bulk & Wholesale',
      items: [
        {
          id: 'q-10',
          question: 'Do you support wholesale supply, white-labeling, or exports?',
          answer: 'Yes, we are a certified bulk supplier and global exporter. We provide customized bulk bags, private white-labeling for health brands, and extensive corporate gifting solutions. Please navigate to our Bulk Orders section or contact our direct trade desk at Info@biharbite.com.'
        }
      ]
    }
  ];

  // Filtering FAQs based on search input
  const filteredCategories = faqCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-24 font-sans text-stone-900" id="hero">
      
      {/* Breadcrumb & Navigation */}
      <nav className="text-xs text-stone-500 mb-8 flex items-center gap-1.5 font-light" id="faq-breadcrumb">
        <span className="cursor-pointer hover:text-stone-950 transition-colors" onClick={() => setScreen('home')}>Home</span>
        <span className="text-stone-300">&gt;</span>
        <span className="font-bold text-[#7C8464]">Frequently Asked Questions</span>
      </nav>

      {/* Header and Search */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4" id="faq-header-container">
        <span className="text-xs font-semibold text-[#8C7D5F] tracking-widest uppercase block">Support & Help Desk</span>
        <h1 className="font-serif text-3xl md:text-5xl font-light text-stone-900 leading-tight">
          How can we help you <span className="italic font-normal text-[#7C8464]">today?</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-600 font-light max-w-lg mx-auto leading-relaxed">
          Find instantaneous answers about our organic wetland harvesting practices, pan-India courier shipments, order tracking, and refund guarantees.
        </p>

        {/* Dynamic Interactive Search Bar */}
        <div className="relative max-w-md mx-auto pt-4" id="faq-search-wrapper">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. organic, shipping, returns...)"
            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-2xl pl-12 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C8464] focus:border-[#7C8464] font-light shadow-xs"
            id="faq-search-input"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-4.5 top-[27px]" />
        </div>
      </div>

      {/* FAQs Main Accordion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20" id="faq-content-grid">
        
        {/* Left Side: Support cards */}
        <div className="lg:col-span-4 space-y-6" id="faq-side-cards">
          <div className="bg-[#FAF8F5] p-6 rounded-[28px] border border-stone-200/60 space-y-4 shadow-xs" id="faq-contact-card">
            <HelpCircle className="w-8 h-8 text-[#7C8464]" />
            <h3 className="font-serif text-lg font-semibold text-stone-900">Still have questions?</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              If your inquiry isn't cataloged here, please reach out to our active helpdesk directly. Our Mithila support executives are available from 9 AM to 7 PM IST.
            </p>
            <div className="space-y-3.5 pt-2 text-xs text-stone-700">
              <a href="https://wa.me/917985347849?text=Hi+Bihar+Bite%21+I%27d+like+to+know+more+about+your+Makhana+products." target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 hover:text-[#7C8464] transition-colors font-medium">
                <span className="w-8 h-8 rounded-xl bg-white border border-stone-200/50 flex items-center justify-center text-[#7C8464]"><MessageSquare className="w-4 h-4" /></span>
                WhatsApp: +91 79853 47849
              </a>
              <a href="mailto:Info@biharbite.com" className="flex items-center gap-3.5 hover:text-[#7C8464] transition-colors font-medium">
                <span className="w-8 h-8 rounded-xl bg-white border border-stone-200/50 flex items-center justify-center text-[#7C8464]"><Mail className="w-4 h-4" /></span>
                Info@biharbite.com
              </a>
              <a href="tel:+919336311140" className="flex items-center gap-3.5 hover:text-[#7C8464] transition-colors font-medium">
                <span className="w-8 h-8 rounded-xl bg-white border border-stone-200/50 flex items-center justify-center text-[#7C8464]"><Phone className="w-4 h-4" /></span>
                Phone: +91 93363 11140
              </a>
            </div>
          </div>

          <div className="bg-[#7C8464] text-white p-6 rounded-[28px] space-y-3 shadow-md" id="faq-b2b-card">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E5D7B3]">B2B & Trade Desk</span>
            <h4 className="font-serif text-base font-semibold">Wholesale Inquiries?</h4>
            <p className="text-xs text-white/80 font-light leading-relaxed">
              We process container-load freight quotes and sample box dispatches for international clients weekly.
            </p>
            <button 
              onClick={() => setScreen('bulk')}
              className="bg-white text-[#7C8464] hover:bg-[#FAF8F5] transition-colors text-xs font-semibold px-4 py-2.5 rounded-xl block w-full text-center shadow-xs cursor-pointer mt-2"
              id="faq-bulk-btn"
            >
              Request Bulk Sample
            </button>
          </div>
        </div>

        {/* Right Side: Accordion Lists */}
        <div className="lg:col-span-8 space-y-10" id="faq-accordions-container">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/50" id="faq-no-results">
              <p className="text-sm text-stone-500 font-light">No matching questions found for "{searchQuery}".</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#7C8464] font-semibold underline mt-2 hover:text-[#6A7155]"
                id="faq-clear-search-btn"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredCategories.map((category, idx) => (
              <div key={idx} className="space-y-4" id={`faq-cat-group-${idx}`}>
                <h2 className="font-serif text-lg font-semibold text-stone-900 border-b border-stone-100 pb-2 pl-1">
                  {category.title}
                </h2>
                
                <div className="space-y-3" id={`faq-cat-items-${idx}`}>
                  {category.items.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                      <div 
                        key={item.id}
                        className={`bg-white rounded-2xl border transition-all duration-300 ${
                          isOpen ? 'border-stone-900 shadow-xs' : 'border-stone-200/70 hover:border-stone-400'
                        }`}
                        id={`faq-item-card-${item.id}`}
                      >
                        <button
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                          className="w-full px-5 py-4 flex justify-between items-center text-left"
                          id={`faq-item-trigger-${item.id}`}
                        >
                          <span className="font-serif text-sm font-semibold text-stone-900 pr-4">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#7C8464] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-stone-600 leading-relaxed font-light border-t border-stone-50" id={`faq-item-content-${item.id}`}>
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
