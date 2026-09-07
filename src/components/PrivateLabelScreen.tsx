import { ArrowRight, Box, Package, Factory, Droplets, PenTool, Truck, Sparkles, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect } from 'react';

// Services data with icons
const services = [
  { name: "Makhana sourcing", icon: Droplets, desc: "Premium pond-to-pack sourcing" },
  { name: "Grading", icon: Scale, desc: "Precision multi-level sorting" },
  { name: "Roasting", icon: Sparkles, desc: "Perfect crunch development" },
  { name: "Flavouring", icon: Factory, desc: "Custom seasoning profiles" },
  { name: "Custom packaging", icon: Package, desc: "Bespoke brand containers" },
  { name: "Nitrogen flushing", icon: Box, desc: "Extended shelf-life sealing" },
  { name: "Batch printing", icon: PenTool, desc: "Dynamic label & date coding" },
  { name: "Bulk dispatch", icon: Truck, desc: "Pan-India safe transit" }
];

export default function PrivateLabelScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF8F4] min-h-screen font-sans selection:bg-[#143A2A]/20 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90svh] lg:min-h-[90vh] flex items-center justify-center pt-[100px] md:pt-[120px] pb-16 md:pb-24 overflow-hidden">
        {/* Controlled maximum width centered container */}
        <div className="w-full max-w-[1250px] mx-auto px-6 lg:px-12">
          {/* Two column composition: 55% Left / 45% Right on large screens */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Left Content (55%) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-[55%] space-y-8 flex flex-col justify-center"
            >
              <div className="flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[#C28E63]"></span>
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#C28E63]">
                  PRIVATE LABEL
                </span>
              </div>
              
              <h1 className="font-serif text-[56px] sm:text-[72px] lg:text-[84px] font-bold text-[#143A2A] leading-[1.05] tracking-tight">
                Launch Your <br />
                <span className="italic font-normal">Own Makhana</span> <br />
                Brand
              </h1>
              
              <p className="text-lg md:text-[19px] text-[#5A6348] leading-[1.6] max-w-[420px] font-light">
                From sourcing to packing, we help businesses build and scale their own makhana brand.
              </p>
              
              <div className="pt-2">
                <button 
                  onClick={() => navigate('/bulk')}
                  className="group relative inline-flex items-center justify-center gap-3 bg-[#143A2A] text-white font-bold text-[13px] tracking-widest uppercase px-8 py-[18px] rounded-full overflow-hidden transition-all hover:shadow-[0_8px_25px_rgba(20,58,42,0.25)] active:scale-95"
                >
                  <span className="relative z-10">START YOUR PRIVATE LABEL</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>

            {/* Right Visual Composition (45%) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="w-full lg:w-[45%] relative flex items-center justify-center mt-16 lg:mt-0"
            >
              <div className="relative w-full max-w-[500px] lg:max-w-none flex justify-center items-center">
                <img 
                  src="/images/hero/private-label-hero.png" 
                  alt="Premium Private Label Packaging" 
                  className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xl scale-110 sm:scale-125 lg:scale-[1.40] origin-center"
                />
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>
      
      {/* Services Grid Section */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-serif text-3xl md:text-[42px] font-bold text-[#143A2A]">
              Built Around Your Brand
            </h2>
            <p className="text-[#5A6348] text-lg font-light max-w-2xl mx-auto">
              End-to-end solutions tailored for your premium makhana business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group relative bg-[#F2EFE8] rounded-[24px] p-8 hover:bg-white hover:shadow-xl hover:shadow-[#143A2A]/5 transition-all duration-400 overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white text-[#143A2A] flex items-center justify-center mb-6 group-hover:bg-[#143A2A] group-hover:text-white transition-colors duration-400 shadow-sm">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-[22px] font-bold text-[#143A2A] mb-3">{service.name}</h3>
                  <p className="text-[15px] text-[#5A6348] leading-relaxed font-light">{service.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="bg-[#143A2A] rounded-[40px] py-20 px-8 relative overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#184532] via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-10">
              <h2 className="font-serif text-4xl md:text-[56px] font-bold text-[#FAF8F4] leading-[1.1]">
                Ready to build your <br className="hidden sm:block" />
                <span className="italic font-normal text-[#C28E63]">Makhana legacy?</span>
              </h2>
              
              <button 
                onClick={() => navigate('/bulk')}
                className="group inline-flex items-center justify-center gap-3 bg-[#C28E63] text-white font-bold text-[13px] tracking-widest uppercase px-10 py-[18px] rounded-full hover:bg-[#b07d53] transition-all hover:shadow-[0_8px_25px_rgba(194,142,99,0.3)] active:scale-95"
              >
                START YOUR PRIVATE LABEL
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
