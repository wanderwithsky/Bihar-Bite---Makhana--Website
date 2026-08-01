import { Sparkles, Heart, Users, Shield, Target, Trophy } from 'lucide-react';

export default function AboutScreen() {
  const coreValues = [
    {
      icon: <Users className="w-6 h-6 text-secondary" />,
      title: 'Farmer Welfare',
      description: 'We connect directly with over 120+ micro-farmer families in the Mithila region. By bypassing middlemen, we guarantee fair trade premium prices directly to the heritage cultivators.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-secondary" />,
      title: 'Uncompromised Purity',
      description: 'Our Makhanas are roasted in pure cow ghee or premium cold-pressed oils. Free from synthetic chemical preservatives, artificial colors, or monosodium glutamate.'
    },
    {
      icon: <Heart className="w-6 h-6 text-secondary" />,
      title: 'Nutritional Heritage',
      description: 'Bringing back ancient superfoods loaded with plant-based protein, dietary fiber, magnesium, and active potassium, specifically crafted for modern-day healthy snacking.'
    }
  ];

  const milestones = [
    {
      year: 'Heritage roots',
      title: 'Ancient Sourcing Sins',
      description: 'Water lily seed harvesting is a 2000-year-old art form native to Bihar’s unique wetland biomes. Each seed is hand-collected from muddy pond beds with incredible precision.'
    },
    {
      year: 'Modern Roasting',
      title: 'The Slow-Roast Method',
      description: 'Our proprietary multi-stage roasting system ensures each kernel pops into an evenly textured puff, retaining its vital mineral composition and fiber crispness.'
    },
    {
      year: 'Global Footprint',
      title: 'Ethical Global Exports',
      description: 'From regional Mithila ponds directly to gourmet snackers in metropolitan India, Singapore, Europe, and the Americas.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-[140px] sm:pt-[148px] md:pt-[152px] pb-20 font-sans">
      
      {/* Top Brand Divider Accent */}
      <div className="w-16 h-[2px] bg-secondary mx-auto mb-6" />

      {/* Main Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-secondary font-serif italic text-lg md:text-xl block">
          Our Culinary Odyssey
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-on-surface-variant leading-tight">
          Preserving the Soul of <span className="italic font-normal text-primary">Mithila Makhana</span>
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant/80 max-w-xl mx-auto leading-relaxed">
          At Bihar Bite, we are on a mission to elevate India's original superfood from traditional wetland ponds straight to global gourmet snack collections, while empowering local heritage farmers.
        </p>
      </div>

      {/* Narrative Section with Image/Graphic Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-serif text-2xl md:text-3.5xl font-light text-primary leading-tight">
            Hand-harvested, slow-popped, and cooked with authentic <span className="italic font-normal">hereditary recipes</span>.
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant/80 leading-relaxed">
            The pristine water lily (Euryale ferox) grows abundantly in the stagnant freshwater pools of North Bihar. Our farm collectives plunge into these calm waters at dawn, using traditional bamboo equipment to gather the precious black seeds.
          </p>
          <p className="text-xs md:text-sm text-on-surface-variant/80 leading-relaxed">
            Once harvested, these seeds undergo an intensive sun-drying, cleaning, and multi-stage firing process. Popped by hand at the precise hot temperature, only the highest grade kernels are chosen to be seasoned with pure spices and healthy oils.
          </p>
          <div className="border-l-4 border-secondary pl-5 italic text-[#4A4A3A] font-serif text-sm py-2">
            "Makhana is not merely a healthy snack; it is an economic lifeline for Bihar’s wet-land farmers and a 2000-year-old emblem of cultural heritage."
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-[32px] overflow-hidden shadow-lg border border-outline-variant/30 aspect-[4/3] bg-surface-container-low group">
            <img 
              src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=1000" 
              alt="Harvesting Makhana water lilies" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4A4A3A]/60 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/80">Sustenance of Wetlands</p>
                <h4 className="font-serif text-lg">Direct Sourcing from Pond to Pop</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Bento Grid */}
      <div className="bg-[#FAF8F4] rounded-[40px] p-8 md:p-14 border border-[#E5DFD1] mb-24">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-secondary font-serif italic text-sm md:text-base block">Our Foundations</span>
          <h3 className="font-serif text-2xl md:text-3.5xl text-primary font-light">What Defines Bihar Bite</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#F1EDE4] rounded-2xl flex items-center justify-center">
                {value.icon}
              </div>
              <h4 className="font-serif text-lg font-bold text-primary">{value.title}</h4>
              <p className="text-xs md:text-sm text-on-surface-variant/80 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Journey Process */}
      <div className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-secondary font-serif italic text-sm md:text-base block">Our Heritage Process</span>
          <h3 className="font-serif text-2xl md:text-3.5xl text-primary font-light">How it Reaches Your Plate</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line for timeline */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-outline-variant/30 -z-10" />

          {milestones.map((milestone, idx) => (
            <div key={idx} className="bg-[#F1EDE4]/40 hover:bg-[#F1EDE4]/70 transition-colors rounded-3xl p-6 md:p-8 border border-outline-variant/15 space-y-3 relative">
              <span className="inline-block bg-[#7C8464] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {milestone.year}
              </span>
              <h4 className="font-serif text-base font-bold text-[#4A4A3A]">
                {milestone.title}
              </h4>
              <p className="text-xs md:text-sm text-on-surface-variant/85 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call To Action Box */}
      <div className="mt-24 bg-[#7C8464] text-white rounded-[40px] p-8 md:p-16 text-center space-y-6 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-12">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="absolute left-0 bottom-0 opacity-10 -translate-x-12 translate-y-12">
          <Heart className="w-64 h-64" />
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white/70 block">Join Our Collective Savor</span>
          <h2 className="font-serif text-3xl md:text-5xl italic font-light leading-tight">
            Crispy, guilt-free snacking is just one box away.
          </h2>
          <p className="text-xs md:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
            Support the local farmers of North Bihar and shift to a healthier dietary lifestyle today. Browse our slow-roasted ghee selections or order a curated gift pack!
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a 
              href="#shop" 
              className="bg-white text-primary hover:bg-[#FDFBF7] px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                // We will trigger screen change via click handler on parent or global screen dispatcher.
                // Just using standard anchor for fallback.
                window.location.hash = 'shop';
              }}
            >
              Explore our Flavors
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
