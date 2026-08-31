import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    question: "What is Bihar Makhana?",
    answer: "Bihar Makhana, also known as Fox Nuts or Gorgon Nuts, is the edible seed of the Euryale ferox plant. Bihar is one of India's major Makhana-growing regions, particularly known for its freshwater wetlands and traditional cultivation practices."
  },
  {
    question: "Where is Bihar Bite Makhana sourced from?",
    answer: (
      <>
        <p className="mb-2">Bihar Bite sources its Makhana from the wetlands and growing regions of Bihar, with the brand's heritage rooted in Mithila and Darbhanga, Bihar.</p>
        <p className="font-semibold text-stone-800">Our Heritage Hub:</p>
        <p>Village- Sripur, Bahadurpur Post Malhipatti,<br />
        District Darbhanga, Bihar - 846002, India.</p>
      </>
    )
  },
  {
    question: "Do you sell wholesale Makhana?",
    answer: (
      <>
        <p className="mb-2">Yes. Bihar Bite supplies Makhana for retail, wholesale, distribution, and bulk business requirements.</p>
        <p className="mb-2">Available offerings can include:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Multiple grades</li>
          <li>Bulk quantities</li>
          <li>Retail & wholesale supply</li>
          <li>Custom packing</li>
          <li>Pan-India dispatch</li>
          <li>Business enquiries</li>
        </ul>
        <p>For wholesale/business enquiries, please visit our <Link to="/bulk" className="text-[#143A2A] font-bold underline underline-offset-2">Wholesale page</Link> or contact us directly on WhatsApp:</p>
        <a href="https://wa.me/917880454502" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-bold text-[#25D366] hover:text-[#1DA851] transition-colors">
          WhatsApp: +91 78804 54502
        </a>
      </>
    )
  },
  {
    question: "What is Suta in Makhana?",
    answer: "\"Suta\" refers to the grading/classification used to indicate the size and quality grade of Makhana. Higher Suta grades generally refer to larger and premium-grade Makhana. The website currently offers grades including 4 Suta, 5 Suta, and 6 Suta."
  },
  {
    question: "What is the minimum wholesale order?",
    answer: (
      <>
        <p className="mb-4">For wholesale or bulk requirements, the minimum order quantity can depend on the product grade, packaging requirement, and business requirement. Customers should contact Bihar Bite directly for the applicable minimum quantity and quotation.</p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Link to="/bulk" className="inline-block bg-[#143A2A] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#1e523c] transition-colors">
            GET WHOLESALE QUOTE
          </Link>
          <span className="text-stone-400 hidden sm:inline">or</span>
          <a href="https://wa.me/917880454502" target="_blank" rel="noopener noreferrer" className="inline-block font-bold text-[#25D366] hover:text-[#1DA851] transition-colors">
            WhatsApp: +91 78804 54502
          </a>
        </div>
      </>
    )
  },
  {
    question: "Do you deliver across India?",
    answer: "Yes. Bihar Bite offers Pan-India dispatch and delivery. Applicable shipping charges, delivery timelines, or estimates may depend on the destination and order."
  },
  {
    question: "How should Makhana be stored?",
    answer: "Store in a cool, dry and hygienic place. Keep away from direct sunlight and moisture. After opening, keep the pack tightly sealed in an airtight container."
  }
];

export default function FAQSection({ embedded = false }: { embedded?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (embedded) {
    return (
      <div className="space-y-3 w-full">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-stone-900 shadow-sm' : 'border-stone-200/70 hover:border-stone-400'
              }`}
            >
              <button
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-5 md:px-6 py-4 md:py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="font-serif text-[17px] font-semibold text-stone-900 pr-4">
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#7C8464] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                )}
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 md:px-6 pb-5 text-stone-600 leading-relaxed font-light text-[15px] border-t border-stone-50 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="py-24 bg-[#FDFCF8] border-t border-stone-200/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-[#C28E63] tracking-[0.2em] uppercase mb-4 block">Frequently Asked Questions</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#143A2A] mb-6">Everything You Need to Know</h2>
          <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Answers to the most common questions about Bihar Bite Makhana, sourcing, grades, wholesale supply, delivery, and storage.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-[#143A2A]/30 shadow-md' : 'border-stone-200/70 hover:border-stone-300'
                }`}
              >
                <button
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#143A2A] focus-visible:ring-offset-2"
                >
                  <span className={`font-serif text-[17px] md:text-lg font-semibold pr-4 transition-colors ${isOpen ? 'text-[#143A2A]' : 'text-stone-800'}`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#C28E63] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                  )}
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-stone-600 leading-relaxed font-light text-[15px] border-t border-stone-50 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
