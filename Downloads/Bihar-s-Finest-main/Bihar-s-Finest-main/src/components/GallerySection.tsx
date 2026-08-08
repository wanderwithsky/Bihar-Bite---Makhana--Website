import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const availableImages = [
  "/gallery/WhatsApp Image 2026-08-01 at 2.51.08 PM.jpeg",
  "/gallery/WhatsApp Image 2026-08-01 at 2.51.09 PM.jpeg",
  "/gallery/WhatsApp Image 2026-08-01 at 2.51.10 PM.jpeg",
  "/gallery/WhatsApp Image 2026-08-01 at 2.52.12 PM.jpeg",
  "/gallery/WhatsApp Image 2026-08-01 at 2.58.43 PM.jpeg",
  "/gallery/WhatsApp Image 2026-08-01 at 2.58.47 PM.jpeg",
  "/gallery/WhatsApp Image 2026-08-01 at 2.58.49 PM.jpeg"
];

const titles = [
  { title: "Harvest Morning", sub: "Mithila Wetlands" },
  { title: "Freshly Roasted", sub: "Traditional Process" },
  { title: "Hand Sorted", sub: "Generations of Care" },
  { title: "Premium Selection", sub: "Export Quality" },
  { title: "Organic Farming", sub: "Bihar's Pride" },
  { title: "Perfect Crunch", sub: "Slow Roasted" },
  { title: "Golden Hour", sub: "Lotus Ponds" },
  { title: "Village Life", sub: "Community Heritage" },
  { title: "Nature's Bounty", sub: "Raw & Pure" },
  { title: "Healthy Snacking", sub: "Everyday Nutrition" },
];

const aspectRatios = [
  'aspect-[1/1]', 'aspect-[4/5]', 'aspect-[3/4]', 
  'aspect-[16/9]', 'aspect-[9/16]', 'aspect-[5/4]', 
  'aspect-[21/9]'
];

const galleryItems = availableImages.map((src, i) => {
  return {
    id: i,
    src,
    title: titles[i % titles.length].title,
    sub: titles[i % titles.length].sub,
    // Add some pseudo-randomness to aspect ratios based on index
    aspectClass: aspectRatios[(i * 3 + 7) % aspectRatios.length],
  };
});

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev! + 1) % galleryItems.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev! - 1 + galleryItems.length) % galleryItems.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <section id="gallery" className="relative w-full py-24 bg-transparent overflow-hidden border-t border-[#EBE6DA]">
      {/* ─── AMBIENT SECTION DECOR: SOFT SPOTLIGHTS ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[800px] h-[800px] bg-[radial-gradient(circle,_#FDEBCC_0%,_transparent_60%)] blur-[100px] opacity-[0.15]" />
        <div className="absolute bottom-[20%] right-[20%] w-[1000px] h-[1000px] bg-[radial-gradient(circle,_#E2C8BA_0%,_transparent_60%)] blur-[120px] opacity-[0.1]" />
      </div>
      
      <div className="relative z-10 w-full">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center mb-16 px-6"
        >
          <span className="text-[10px] font-bold text-[#8C7D5F] tracking-[0.25em] uppercase block mb-4">
            OUR GALLERY
          </span>
          <h2 className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-4xl md:text-5xl lg:text-[56px] tracking-tight">
            <span className="font-serif text-[#143A2A] font-bold">Moments from the World of</span>
            <span className="font-serif italic text-[#C28E63]" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}>Makhana</span>
          </h2>
          <div className="w-[80px] h-[2px] bg-[#143A2A] mt-8 rounded-full mb-6" />
          <p className="font-sans text-[#4A4A3A] max-w-2xl mx-auto text-[15px] md:text-[17px] leading-relaxed">
            Every harvest has a story. Every frame reflects the purity, craftsmanship, and heritage of Bihar.
          </p>
        </motion.div>

        {/* Pinterest-style Masonry Gallery */}
        <div className="w-[90%] max-w-[1800px] mx-auto columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
          {galleryItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ 
                duration: 0.6, 
                delay: (index % 5) * 0.1, // staggered reveal
                ease: "easeOut" 
              }}
              onClick={() => setLightboxIndex(index)}
              className="relative break-inside-avoid overflow-hidden rounded-[20px] group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-[#EBE6DA]"
            >
              <div className={`${item.aspectClass} relative w-full`}>
                <img 
                  src={item.src} 
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05] group-hover:brightness-110"
                />
                
                {/* Soft Glass Overlay from Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 md:p-6">
                   <h4 className="text-white font-serif text-[18px] md:text-[20px] leading-snug transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     {item.title}
                   </h4>
                   <span className="text-[#D8C29A] font-sans font-medium text-[11px] uppercase tracking-widest mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                     {item.sub}
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-12"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Bar Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
              <div className="text-white/60 font-mono text-sm tracking-[0.2em] pointer-events-auto select-none">
                 {String(lightboxIndex + 1).padStart(2, '0')} / {galleryItems.length}
              </div>
              <button 
                className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors border border-white/10 pointer-events-auto"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Arrows */}
            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors border border-white/5 z-20"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev! - 1 + galleryItems.length) % galleryItems.length);
              }}
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            
            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors border border-white/5 z-20"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev! + 1) % galleryItems.length);
              }}
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Main Image Container */}
            <motion.div 
              key={lightboxIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={galleryItems[lightboxIndex].src} 
                alt={galleryItems[lightboxIndex].title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-6 text-center">
                 <h3 className="text-white font-serif text-[24px] tracking-wide">
                   {galleryItems[lightboxIndex].title}
                 </h3>
                 <span className="text-[#D8C29A] font-sans text-[12px] uppercase tracking-widest mt-2 block">
                   {galleryItems[lightboxIndex].sub}
                 </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
