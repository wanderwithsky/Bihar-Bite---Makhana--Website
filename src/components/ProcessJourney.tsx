import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const processSteps = [
  { 
    title: "Harvesting from Bihar Wetlands", 
    step: "Step 1", 
    video: "/videos/01.mp4", 
    duration: "0:42", 
    desc: "Collected traditionally from lotus ponds by skilled farmers." 
  },
  { 
    title: "Cleaning & Processing", 
    step: "Step 2", 
    video: "/videos/cleaning-and-processing.mp4", 
    duration: "1:15", 
    desc: "Naturally cleaned and prepared using traditional methods." 
  },
  { 
    title: "Roasting & Popping", 
    step: "Step 3", 
    video: "/videos/03.mp4", 
    duration: "0:58", 
    desc: "Expertly roasted over fire for the perfect crunch." 
  },
  { 
    title: "Packaging & Delivery", 
    step: "Step 4", 
    video: "/videos/packing.mp4", 
    duration: "2:04", 
    desc: "Freshly packed and shipped while preserving quality."
  }
];

function ProcessCard({ step, i, onClick }: { step: any; i: number; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: i * 0.15 }}
      onClick={onClick}
      className="shrink-0 snap-center w-[85vw] md:w-auto group relative bg-[#0A1A12] rounded-[28px] overflow-hidden cursor-pointer aspect-[4/5] shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out hover:-translate-y-2"
    >
      <video 
        ref={videoRef}
        src={step.video} 
        autoPlay
        preload="metadata"
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] opacity-90 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A12]/95 via-[#0A1A12]/40 to-transparent transition-colors duration-500 group-hover:from-black group-hover:via-black/60 group-hover:to-black/30" />
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-[#143A2A] text-[10px] font-bold tracking-wider uppercase">Journey</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
          <span className="text-white text-[11px] font-mono font-medium">{step.duration}</span>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none transition-transform duration-500 group-hover:scale-110">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 group-hover:bg-[#C28E63]/90 group-hover:border-[#C28E63] transition-colors duration-500 shadow-lg">
          <Play className="w-6 h-6 ml-1 text-white fill-white transition-opacity duration-500 opacity-90 group-hover:opacity-100" />
        </div>
      </div>
      <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none transition-transform duration-500 group-hover:-translate-y-2">
        <span className="text-[#D8C29A] text-[11px] font-bold tracking-widest uppercase block mb-2">
          {step.step}
        </span>
        <h3 className="text-white font-serif text-[22px] font-semibold leading-snug drop-shadow-md mb-2">
          {step.title}
        </h3>
        <p className="text-white/80 font-sans text-[13px] leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-[100px] transition-all duration-500 overflow-hidden">
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProcessJourney() {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (activeVideoIndex !== null && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  }, [activeVideoIndex]);

  return (
    <section id="process" className="relative w-full py-24 bg-transparent overflow-hidden border-t border-[#EBE6DA]">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <motion.svg 
          initial={{ x: -100 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute top-1/4 left-0 w-[200%] h-[50%]"
          viewBox="0 0 1000 200" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100" stroke="#C28E63" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
          <path d="M0,120 C150,220 350,20 500,120 C650,220 850,20 1000,120" stroke="#143A2A" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
        </motion.svg>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center mb-16"
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
            Follow the complete journey of authentic Bihar Makhana, from the peaceful wetlands of Bihar to carefully packed products delivered to your doorstep.
          </p>
        </motion.div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible pb-8 md:pb-0 custom-scrollbar">
          {processSteps.map((step, i) => (
            <ProcessCard key={i} step={step} i={i} onClick={() => setActiveVideoIndex(i)} />
          ))}
        </div>

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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.82)] backdrop-blur-[8px] p-6 md:p-12"
            onClick={() => setActiveVideoIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-colors border border-white/10 z-20"
              onClick={() => setActiveVideoIndex(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-[95vw] md:w-[clamp(900px,72vw,1200px)] md:h-[clamp(520px,75vh,700px)] max-h-[90vh] bg-[#0A1A12] rounded-[24px] overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Video Area */}
              <div className="relative w-full aspect-[9/16] md:aspect-auto md:grow md:w-[68%] bg-black flex items-center justify-center overflow-hidden rounded-t-[24px] md:rounded-tr-none md:rounded-l-[24px]">
                 <video 
                   ref={videoRef}
                   src={processSteps[activeVideoIndex].video}
                   controls
                   playsInline
                   autoPlay
                   className="w-full h-full object-contain"
                 />
              </div>

              {/* Right Content Area */}
              <div className="w-full md:w-[32%] md:min-w-[320px] md:max-w-[380px] shrink-0 p-8 md:p-10 flex flex-col justify-center bg-[#143A2A] relative">
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
