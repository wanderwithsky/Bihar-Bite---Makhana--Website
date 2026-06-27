import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight, Phone, MessageCircle, Star, CheckCircle2,
  Sofa, Building2, ChefHat, Shirt, Layers, BedDouble, Hotel, Briefcase, Home, KeyRound,
  Award, Box, PenTool, Wallet, Gem, Clock, UserCheck, LifeBuoy, ChevronLeft, ChevronRight,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroImg from "@/assets/hero-living.jpg";
import kitchenImg from "@/assets/portfolio-kitchen.jpg";
import bedroomImg from "@/assets/portfolio-bedroom.jpg";
import hotelImg from "@/assets/portfolio-hotel.jpg";
import officeImg from "@/assets/portfolio-office.jpg";
import wardrobeImg from "@/assets/portfolio-wardrobe.jpg";
import restaurantImg from "@/assets/portfolio-restaurant.jpg";
import villaImg from "@/assets/portfolio-villa.jpg";
import ceilingImg from "@/assets/portfolio-ceiling.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Best Interior Designer in Varanasi | Build My Interior" },
      {
        name: "description",
        content:
          "Looking for the best interior designer in Varanasi? Build My Interior specializes in modular kitchens, luxury home interiors, commercial interiors, wardrobe design, and turnkey interior solutions.",
      },
      { property: "og:title", content: "Best Interior Designer in Varanasi | Build My Interior" },
      { property: "og:description", content: "Luxury home, kitchen, hotel and office interiors in Varanasi." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const },
};

const services = [
  { Icon: Home, title: "Residential Interior", desc: "End-to-end home interiors crafted around how you live." },
  { Icon: Building2, title: "Commercial Interior", desc: "Workplaces and retail spaces that elevate your brand." },
  { Icon: ChefHat, title: "Luxury Modular Kitchen", desc: "German-engineered kitchens with premium finishes." },
  { Icon: Shirt, title: "Wardrobe Design", desc: "Bespoke wardrobes tailored to your space and style." },
  { Icon: Layers, title: "False Ceiling", desc: "Architectural ceilings with ambient cove lighting." },
  { Icon: Sofa, title: "Living Room Design", desc: "Statement living areas designed to host and unwind." },
  { Icon: BedDouble, title: "Bedroom Design", desc: "Restful retreats blending warmth and refinement." },
  { Icon: Hotel, title: "Hotel Interior", desc: "Hospitality interiors that guests remember." },
  { Icon: Briefcase, title: "Office Interior", desc: "Productive, design-led workspaces for modern teams." },
  { Icon: KeyRound, title: "Turnkey Interior Solution", desc: "One studio, one timeline, one beautiful handover." },
];

const reasons = [
  { Icon: Award, title: "Experienced Designers" },
  { Icon: Box, title: "3D Visualization" },
  { Icon: PenTool, title: "Customized Design" },
  { Icon: Wallet, title: "Transparent Pricing" },
  { Icon: Gem, title: "Premium Materials" },
  { Icon: Clock, title: "On-Time Delivery" },
  { Icon: UserCheck, title: "Dedicated Project Manager" },
  { Icon: LifeBuoy, title: "After-Sales Support" },
];

const portfolio = [
  { src: kitchenImg, cat: "Kitchen", title: "Walnut & Brass Kitchen" },
  { src: villaImg, cat: "Luxury Villa", title: "Riverside Villa" },
  { src: bedroomImg, cat: "Bedroom", title: "Cream Master Suite" },
  { src: hotelImg, cat: "Hotel", title: "Heritage Hotel Lobby" },
  { src: officeImg, cat: "Office", title: "Warm Wood Office" },
  { src: wardrobeImg, cat: "Bedroom", title: "Walk-in Wardrobe" },
  { src: restaurantImg, cat: "Restaurant", title: "Fine-Dining Bistro" },
  { src: ceilingImg, cat: "Living Room", title: "Coffered Dining" },
];

const categories = ["All", "Living Room", "Bedroom", "Kitchen", "Hotel", "Office", "Restaurant", "Luxury Villa"];

const process = [
  { n: "01", title: "Book Consultation", desc: "Share your space, style and budget with our designer." },
  { n: "02", title: "Site Visit", desc: "On-site survey and detailed measurements." },
  { n: "03", title: "3D Design", desc: "Photorealistic 3D walkthrough of your home." },
  { n: "04", title: "Material Selection", desc: "Curate finishes from our premium material library." },
  { n: "05", title: "Execution", desc: "Skilled in-house craftsmen, monitored daily." },
  { n: "06", title: "Final Handover", desc: "Styled, cleaned and ready to move in." },
];

const reviews = [
  { name: "Anjali Verma", role: "Homeowner, Cantt", text: "Build My Interior transformed my home into a stylish and comfortable space. Every detail was thoughtful." },
  { name: "Rohit Singh", role: "Hotelier", text: "The hotel interior project was beautifully executed. Our guests have noticed the upgrade." },
  { name: "Priya Mishra", role: "Apartment Owner", text: "The team delivered on time and exceeded expectations. The modular kitchen is a dream." },
  { name: "Aditya Sharma", role: "Office Owner", text: "Professional, transparent, and brilliant with materials. Our workspace finally feels premium." },
];

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <Services />
      <WhyChoose />
      <Portfolio />
      <Process />
      <Reviews />
      <Stats />
      <CTASection />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative -mt-20 min-h-[100svh] flex items-end overflow-hidden">
      <img
        src={heroImg}
        alt="Luxury living room interior by Build My Interior"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover hero-image"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/90" />

      <div className="relative mx-auto max-w-7xl w-full px-6 pb-20 md:pb-28 pt-32 text-white">
        <motion.p
          {...fadeUp}
          className="text-xs uppercase tracking-[0.4em] text-gold-soft font-medium"
        >
          Luxury Interior Studio · Varanasi
        </motion.p>
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-4 max-w-4xl font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05]"
        >
          Designing Beautiful Spaces<br />
          <span className="italic text-gold-soft">That Feel Like Home</span>
        </motion.h1>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base md:text-lg text-white/85"
        >
          Transform your home with Varanasi's trusted interior designers. From modular
          kitchens to complete home interiors, we create spaces you'll love.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold text-charcoal px-7 py-3.5 font-medium shadow-luxe hover-lift"
          >
            Book Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 font-medium text-white backdrop-blur-md hover:bg-white/10 transition"
          >
            View Portfolio
          </Link>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl"
        >
          {[
            { k: "31+", v: "Happy Clients" },
            { k: "5.0★", v: "Google Rating" },
            { k: "100%", v: "Client Satisfaction" },
            { k: "On-Time", v: "Delivery" },
          ].map((s) => (
            <div key={s.v} className="glass-card-dark rounded-2xl px-5 py-4 text-white">
              <div className="font-display text-2xl md:text-3xl text-gold-soft">{s.k}</div>
              <div className="text-xs md:text-sm text-white/80">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold text-foreground">{title}</h2>
      {desc && <p className="mt-4 text-muted-foreground text-base md:text-lg">{desc}</p>}
      <div className="mt-6 mx-auto h-px w-16 bg-gold" />
    </motion.div>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="What we craft"
          title="Interior Services, Tailored to You"
          desc="From a single room refresh to a full turnkey home — every project is led by a senior designer and built by our in-house team."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group relative rounded-3xl bg-card p-8 border border-border hover-lift"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-gold text-charcoal">
                <s.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-gold transition"
              >
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Why Build My Interior"
          title="Designed Right. Delivered On Time."
          desc="A boutique design studio with the discipline of a large practice."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card rounded-2xl p-6 hover-lift"
            >
              <r.Icon className="h-7 w-7 text-gold" />
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                {r.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Backed by a senior designer and accountable timelines.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const items = portfolio.filter((p) => active === "All" || p.cat === active);

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Selected Work"
          title="A Portfolio of Beautiful Spaces"
          desc="Browse a curated selection of recent residential and commercial interiors."
        />
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                active === c
                  ? "bg-charcoal text-background border-charcoal"
                  : "bg-transparent text-foreground border-border hover:border-gold hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {items.map((p, i) => (
            <motion.button
              key={p.title}
              {...fadeUp}
              transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
              onClick={() => setLightbox(p.src)}
              className="mb-5 block w-full overflow-hidden rounded-2xl bg-card relative group break-inside-avoid"
            >
              <img
                src={p.src}
                alt={p.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5 text-left">
                <div>
                  <p className="text-xs text-gold-soft tracking-widest uppercase">{p.cat}</p>
                  <h3 className="font-display text-xl text-white">{p.title}</h3>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-luxe" />
        </div>
      )}
    </section>
  );
}

function Process() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Our Process"
          title="Six Steps to Your Dream Home"
        />
        <div className="relative mt-16">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
            {process.map((p, i) => (
              <motion.div
                key={p.n}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-card border border-gold/40 shadow-luxe">
                  <span className="font-display text-2xl text-gold">{p.n}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [i, setI] = useState(0);
  const prev = () => setI((v) => (v - 1 + reviews.length) % reviews.length);
  const next = () => setI((v) => (v + 1) % reviews.length);
  return (
    <section className="py-24 md:py-32 bg-charcoal text-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.78_0.13_80/0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Google Reviews</p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold">Loved by 31+ families</h2>
        <div className="mt-2 flex items-center justify-center gap-1 text-gold">
          {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}
        </div>

        <motion.blockquote
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 font-display text-2xl md:text-3xl italic leading-relaxed text-white/90"
        >
          "{reviews[i].text}"
        </motion.blockquote>
        <div className="mt-6">
          <p className="font-medium text-white">{reviews[i].name}</p>
          <p className="text-sm text-white/60">{reviews[i].role}</p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={prev} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:border-gold hover:text-gold transition">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1.5">
            {reviews.map((_, j) => (
              <button key={j} onClick={() => setI(j)} aria-label={`Review ${j + 1}`} className={`h-1.5 rounded-full transition-all ${j === i ? "w-8 bg-gold" : "w-2 bg-white/30"}`} />
            ))}
          </div>
          <button onClick={next} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:border-gold hover:text-gold transition">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { k: "31+", v: "Google Reviews" },
    { k: "5.0", v: "Google Rating" },
    { k: "100+", v: "Design Concepts" },
    { k: "100%", v: "Customer Satisfaction" },
  ];
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.v} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="text-center">
            <div className="font-display text-5xl md:text-6xl font-semibold text-gold">{s.k}</div>
            <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{s.v}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-secondary/60">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl bg-charcoal text-background p-10 md:p-16 text-center shadow-luxe">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Let's begin</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-semibold">
              Ready to Transform Your Space?
            </h2>
            <p className="mt-4 text-white/75 max-w-xl mx-auto">
              Book your free design consultation today. Our designer will visit your home, understand your needs, and craft a moodboard you'll love.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a href="tel:+917309754967" className="inline-flex items-center gap-2 rounded-full bg-gradient-gold text-charcoal px-7 py-3.5 font-medium hover-lift">
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a href="https://wa.me/917309754967" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-medium text-white hover:bg-white/10 transition">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-white/60">
              <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-gold" /> Free site visit</span>
              <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-gold" /> Transparent pricing</span>
              <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-gold" /> 100% custom design</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
