import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const processSteps = [
  { title: "Harvesting Fresh Makhana", step: "Step 1", image: "/images/reels/harvesting.png", duration: "0:42", desc: "Discover how our farmers carefully harvest Makhana directly from the lotus ponds using centuries-old techniques." },
  { title: "Collecting from Lotus Ponds", step: "Step 2", image: "/images/reels/factory.png", duration: "1:15", desc: "The delicate process of gathering premium seeds from the pristine, nutrient-rich wetlands." },
  { title: "Traditional Sun Drying", step: "Step 3", image: "/images/reels/snack.png", duration: "0:58", desc: "Seeds are naturally sun-dried over days to ensure the perfect core moisture levels are reached." },
  { title: "Village Processing", step: "Step 4", image: "/images/reels/flatlay.png", duration: "2:04", desc: "Local communities manually process the seeds, removing the dark outer shell with profound precision." },
  { title: "Roasting Process", step: "Step 5", image: "/images/reels/harvesting.png", duration: "1:30", desc: "Slow-roasted over earthen heat, a traditional method that unlocks that signature Bihar Bite crunch." },
  { title: "Sorting & Cleaning", step: "Step 6", image: "/images/reels/factory.png", duration: "0:45", desc: "Every single batch is meticulously hand-sorted and graded to retain only the absolute best seeds." },
  { title: "Premium Packaging", step: "Step 7", image: "/images/reels/snack.png", duration: "1:12", desc: "Sealed in premium airtight, luxury packaging to preserve long-lasting freshness and authentic taste." },
  { title: "Quality Inspection", step: "Step 8", image: "/images/reels/flatlay.png", duration: "0:50", desc: "Rigorous final quality checks are performed to ensure export-grade perfection in every pouch." },
  { title: "Ready for Delivery", step: "Step 9", image: "/images/reels/harvesting.png", duration: "0:35", desc: "Safely boxed and carefully dispatched for global delivery to our premium customers." },
  { title: "From Bihar to Your Home", step: "Step 10", image: "/images/reels/factory.png", duration: "1:20", desc: "The final step of the journey, arriving directly from our origins to your healthy snack bowl." },
];

export default function ProcessJourney() {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeVideoIndex !== null) {
      setActiveVideoIndex((activeVideoIndex + 1) % processSteps.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeVideoIndex !== null) {
      setActiveVideoIndex((activeVideoIndex - 1 + processSteps.length) % processSteps.length);
    }
  };

  return (
    <section className="relative w-full py-24 bg-[#FAF8F4] overflow-hidden border-t border-[#EBE6DA]">
      {/* Subtle Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'url("/images/hero/02.png")', backgroundSize: '300px', backgroundRepeat: 'repeat', backgroundPosition: 'center' }}
      />
      
      <div className="relative z-10 w-full">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center mb-16 px-6"
        >
          <span className="text-xs font-semibold text-[#8C7D5F] tracking-[0.2em] uppercase block mb-4">
            MAKHANA PROCESS
          </span>
          <h2 className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-4xl md:text-5xl lg:text-[56px] tracking-tight">
            <span className="font-serif text-[#143A2A] font-bold">How</span>
            <span className="font-serif italic text-[#C28E63]" style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", serif' }}>Makhana</span>
            <span className="font-serif text-[#143A2A] font-bold">is Made?</span>
          </h2>
          <div className="w-[80px] h-[2px] bg-[#143A2A] mt-8 rounded-full mb-6" />
          <p className="font-sans text-[#4A4A3A] max-w-2xl mx-auto text-[15px] md:text-[17px] leading-relaxed">
            From the peaceful wetlands of Bihar to your healthy snack bowl, discover every step of the traditional Makhana journey.
          </p>
        </motion.div>

        {/* Marquee Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex items-center overflow-hidden relative"
        >
          <div className="flex w-fit animate-marquee marquee-track" style={{ animationDuration: '65s' }}>
            {[...Array(2)].map((_, trackIdx) => (
              <div key={trackIdx} className="flex gap-4 md:gap-6 pr-4 md:pr-6 w-max">
                {processSteps.map((step, i) => (
                  <div 
                    key={i}
                    onClick={() => setActiveVideoIndex(i)}
                    className="group relative bg-[#0A1A12] rounded-[28px] overflow-hidden cursor-pointer flex-shrink-0 w-[80vw] sm:w-[45vw] md:w-[30vw] xl:w-[280px] aspect-[9/16] shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out hover:-translate-y-2"
                  >
                    {/* Background Image */}
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Darker Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-colors duration-500 group-hover:from-black/95 group-hover:via-black/60 group-hover:to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10 pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                        <span className="text-[#143A2A] text-[10px] font-bold tracking-wider uppercase">Journey</span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                        <span className="text-white text-[11px] font-mono font-medium">{step.duration}</span>
                      </div>
                    </div>

                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none transition-transform duration-500 group-hover:scale-110">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 group-hover:bg-[#C28E63]/90 group-hover:border-[#C28E63] transition-colors duration-500 shadow-lg">
                        <Play className="w-6 h-6 ml-1 text-white fill-white transition-opacity duration-500 opacity-90 group-hover:opacity-100" />
                      </div>
                      
                      {/* Click to Play text */}
                      <span className="text-white text-[11px] font-bold tracking-widest uppercase mt-4 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        Click to Play
                      </span>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none transition-transform duration-500 group-hover:-translate-y-2">
                      <span className="text-[#D8C29A] text-[11px] font-bold tracking-widest uppercase block mb-1">
                        {step.step}
                      </span>
                      <h3 className="text-white font-sans font-medium text-[16px] leading-snug drop-shadow-md">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Story Line */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex flex-col items-center justify-center text-center px-6"
        >
          <div className="w-[120px] h-[1px] bg-[#C28E63]/30 mb-8" />
          <p className="font-serif italic text-[#3A3832] text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
            "Every handful of Bihar Bite Makhana carries the dedication of farmers, generations of tradition, and the purity of Bihar's wetlands."
          </p>
          <div className="w-[120px] h-[1px] bg-[#C28E63]/30 mb-10" />
          
          <button className="group flex items-center gap-3 bg-[#7C8464] text-[#FAF8F4] px-8 py-3.5 rounded-full font-sans font-bold uppercase tracking-widest text-[11px] transition-all duration-300 hover:bg-[#55613A] hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
            Explore Our Process <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {activeVideoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setActiveVideoIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors border border-white/10 z-20"
              onClick={() => setActiveVideoIndex(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] md:max-w-[1000px] bg-[#0A1A12] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Video Area */}
              <div className="relative w-full aspect-[9/16] md:aspect-auto md:w-[50%] lg:w-[60%] bg-black flex items-center justify-center">
                 <img src={processSteps[activeVideoIndex].image} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                    <div className="w-[80px] h-[80px] rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-6 shadow-xl">
                      <Play className="w-10 h-10 ml-1 text-white fill-white opacity-90" />
                    </div>
                    <p className="font-sans text-[#D8C29A] uppercase tracking-[0.2em] text-[10px] font-bold bg-black/40 px-4 py-2 rounded-full border border-white/10">
                      Dummy Video Playing
                    </p>
                 </div>
              </div>

              {/* Right Content Area */}
              <div className="w-full md:w-[50%] lg:w-[40%] p-8 md:p-12 flex flex-col justify-center bg-[#143A2A] relative">
                 <span className="text-[#D8C29A] text-[12px] font-bold tracking-[0.2em] uppercase block mb-3">
                   {processSteps[activeVideoIndex].step}
                 </span>
                 <h3 className="font-serif text-[28px] md:text-[36px] text-white font-bold leading-tight mb-6">
                   {processSteps[activeVideoIndex].title}
                 </h3>
                 <p className="font-sans text-white/70 text-[15px] leading-relaxed mb-12">
                   {processSteps[activeVideoIndex].desc}
                 </p>

                 {/* Prev/Next Controls */}
                 <div className="flex gap-4 mt-auto">
                    <button 
                      onClick={handlePrev}
                      className="w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#143A2A] transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#143A2A] transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
