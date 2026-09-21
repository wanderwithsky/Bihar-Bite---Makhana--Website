import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const curatedImages = [
  {
    src: "/gallery/WhatsApp Image 2026-08-01 at 2.51.08 PM.jpeg",
    title: "Harvest Morning", sub: "Bihar Origin",
    gridClass: "col-span-1 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2"
  },
  {
    src: "/gallery/WhatsApp Image 2026-08-01 at 2.51.10 PM.jpeg",
    title: "Hand Sorted", sub: "Raw & Pure",
    gridClass: "col-span-1 row-span-1 md:col-span-1 md:row-span-1"
  },
  {
    src: "/gallery/WhatsApp Image 2026-08-01 at 2.51.09 PM.jpeg",
    title: "Freshly Roasted", sub: "Traditional Process",
    gridClass: "col-span-1 row-span-1 md:col-span-1 md:row-span-2"
  },
  {
    src: "https://res.cloudinary.com/twhpmnfb/image/upload/v1789978288/roasted-makhana-1250.jpg",
    title: "Golden Roasted", sub: "Perfect Crunch",
    gridClass: "col-span-1 row-span-1 md:col-span-1 md:row-span-1"
  },
  {
    src: "https://res.cloudinary.com/twhpmnfb/image/upload/v1789986255/8e196dfc-903e-4401-b797-f9db83607020.jpg",
    title: "Spicy & Savory", sub: "Flavoured Makhana",
    gridClass: "col-span-1 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2"
  },
  {
    src: "https://res.cloudinary.com/twhpmnfb/image/upload/v1789986272/b68211f8-7286-4a33-8415-444a0c104d50.jpg",
    title: "Village Roasting", sub: "Community Heritage",
    gridClass: "col-span-1 row-span-1 md:col-span-1 md:row-span-1"
  },
  {
    src: "https://res.cloudinary.com/twhpmnfb/image/upload/v1789986249/d08e4f36-856d-4ea2-9b27-bc148e280bf4.jpg",
    title: "Warehouse Inventory", sub: "Export Quality",
    gridClass: "col-span-1 row-span-1 md:col-span-1 md:row-span-1"
  },
  {
    src: "https://res.cloudinary.com/twhpmnfb/image/upload/v1789986263/88572929-afd2-4ed6-8a68-7de19e8ff469.jpg",
    title: "Decoding Grades", Nature: "Quality Metrics",
    gridClass: "col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
  },
  {
    src: "/gallery/WhatsApp Image 2026-08-01 at 2.52.12 PM.jpeg",
    title: "Premium Packaging", sub: "Bihar's Pride",
    gridClass: "col-span-1 row-span-1 md:row-span-2"
  },
  {
    src: "https://res.cloudinary.com/twhpmnfb/image/upload/v1789978290/5.jpg",
    title: "Retail Pouch", sub: "Everyday Nutrition",
    gridClass: "col-span-1 row-span-1 md:row-span-2"
  },
  {
    src: "/gallery/WhatsApp Image 2026-08-01 at 2.58.49 PM.jpeg",
    title: "Makhana Cookies", sub: "Healthy Snacking",
    gridClass: "col-span-1 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2"
  }
];

const galleryItems = curatedImages.map((img, i) => ({
  id: i,
  src: img.src,
  title: img.title,
  sub: img.sub,
  gridClass: img.gridClass
}));

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

        {/* Editorial Masonry Gallery */}
        <div className="w-[95%] max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[250px] lg:auto-rows-[300px] grid-flow-dense px-4">
          {galleryItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ 
                duration: 0.8, 
                delay: (index % 4) * 0.15,
                ease: [0.23, 1, 0.32, 1] 
              }}
              onClick={() => setLightboxIndex(index)}
              className={`relative overflow-hidden rounded-[24px] group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-[#EBE6DA] ${item.gridClass}`}
            >
              <div className="relative w-full h-full">
                <img 
                  src={item.src} 
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                
                {/* Soft Glass Overlay from Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                   <h4 className="text-white font-serif text-[20px] md:text-[24px] leading-snug transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     {item.title}
                   </h4>
                   <span className="text-[#D8C29A] font-sans font-medium text-[11px] md:text-[12px] uppercase tracking-widest mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
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
