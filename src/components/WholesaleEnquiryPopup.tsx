import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function WholesaleEnquiryPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const handleClose = () => {
    setIsExiting(true);
    setIsVisible(false);
  };

  useEffect(() => {
    // Trigger entrance slightly after mount
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // Trigger exit after ~2.8 seconds
    const exitTimer = setTimeout(() => {
      handleClose();
    }, 2850);

    // Remove from DOM completely after exit animation finishes
    const unmountTimer = setTimeout(() => {
      setIsRendered(false);
    }, 3300);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isRendered) return null;

  // Calculate the transform classes based on the current state to ensure upward movement on both entry and exit
  let transformClasses = 'translate-y-4 scale-[0.92]'; // Initial state (before entry)
  if (isVisible) {
    transformClasses = 'translate-y-0 scale-100'; // Visible state
  } else if (isExiting) {
    transformClasses = '-translate-y-2 scale-[0.96]'; // Exiting state
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-400 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-400"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div
        className={`relative w-full max-w-[90%] md:max-w-md bg-[#FAF8F4] border border-[#E5DFD1] shadow-2xl rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-400 ease-out transform ${transformClasses}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#7C8464] hover:text-[#143A2A] transition-colors p-1.5 rounded-full hover:bg-[#E5DFD1]/50"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-[#143A2A] font-bold text-lg md:text-xl tracking-wide mt-2 mb-3 leading-tight uppercase">
          📦 50 KG+ BULK ENQUIRIES WELCOME 🤝
        </h3>
        
        <p className="text-sm md:text-base text-on-surface-variant/80 font-medium">
          Wholesale, retail supply & bulk business enquiries.
        </p>
      </div>
    </div>
  );
}
