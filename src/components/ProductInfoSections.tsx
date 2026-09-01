import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import FAQSection from './FAQSection';

interface ProductInfoSectionsProps {
  product: Product;
}

export default function ProductInfoSections({ product }: ProductInfoSectionsProps) {
  const [openId, setOpenId] = useState<string | null>('shipping');

  const sections = [
    {
      id: 'shipping',
      title: 'Shipping Information',
      content: (
        <div className="text-[14px] space-y-3">
          <p>We provide secure standard shipping across India.</p>
          <p><strong>Timeline:</strong> Dispatch occurs within 24 business hours of order placement. Standard delivery takes 1-3 days within Bihar and 3-5 business days across other parts of India.</p>
          <p><strong>Charges:</strong> Standard shipping is completely FREE for all cart values above ₹999. For orders below ₹999, we apply a flat transit fee of ₹60.</p>
        </div>
      )
    },
    {
      id: 'returns',
      title: 'Returns & Refund',
      content: <p className="text-[14px]">Due to strict hygiene regulations for consumable food items, our products are non-returnable. However, we offer an absolute 100% damage guarantee: if your parcel is crushed or torn during transit, simply email us or WhatsApp a photo within 48 hours, and we will dispatch a free replacement box immediately.</p>
    },
    {
      id: 'reviews',
      title: 'Reviews',
      content: (
        <div className="text-[14px] text-center py-8 border border-stone-100 rounded-xl bg-stone-50/50">
          <p className="text-stone-500 italic">No reviews yet.</p>
        </div>
      )
    }
  ];

  const whatsappMessage = encodeURIComponent(`Hello Bihar Bite, I am interested in ${product.name}. Please share more details.`);
  const whatsappUrl = `https://wa.me/917880454502?text=${whatsappMessage}`;

  return (
    <div className="mt-20 max-w-3xl mx-auto w-full">
      <h3 className="font-serif text-3xl font-bold text-[#143A2A] mb-8 text-center md:text-left">Product Information</h3>
      
      <div className="space-y-3">
        {sections.map((section) => {
          const isOpen = openId === section.id;
          return (
            <div 
              key={section.id} 
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                isOpen ? 'border-stone-900 shadow-sm' : 'border-stone-200/70 hover:border-stone-400'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : section.id)}
                className="w-full px-5 md:px-6 py-4 md:py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="font-serif text-[17px] font-semibold text-stone-900 pr-4">
                  {section.title}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#7C8464] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                )}
              </button>
              
              {isOpen && (
                <div className="px-5 md:px-6 pb-5 text-stone-600 leading-relaxed font-light border-t border-stone-50 pt-4">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Shared FAQ Section */}
        <FAQSection embedded />
      </div>

      {/* WhatsApp Enquiry Button */}
      <div className="mt-10 flex justify-center md:justify-start">
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white px-10 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-[13px] transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <MessageSquare className="w-5 h-5" />
          ENQUIRE ON WHATSAPP
        </a>
      </div>
    </div>
  );
}
