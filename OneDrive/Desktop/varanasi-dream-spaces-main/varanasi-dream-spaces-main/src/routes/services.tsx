import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Home, Building2, ChefHat, Shirt, Layers, Sofa, KeyRound } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import kitchenImg from "@/assets/portfolio-kitchen.jpg";
import bedroomImg from "@/assets/portfolio-bedroom.jpg";
import wardrobeImg from "@/assets/portfolio-wardrobe.jpg";
import ceilingImg from "@/assets/portfolio-ceiling.jpg";
import officeImg from "@/assets/portfolio-office.jpg";
import villaImg from "@/assets/portfolio-villa.jpg";
import hotelImg from "@/assets/portfolio-hotel.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Interior Design Services in Varanasi | Build My Interior" },
      { name: "description", content: "Explore our interior design services — residential, commercial, modular kitchen, wardrobe, false ceiling, furniture, and turnkey solutions in Varanasi." },
      { property: "og:title", content: "Interior Design Services — Build My Interior" },
      { property: "og:description", content: "Residential, commercial, kitchen, wardrobe, ceiling and turnkey interior design." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const items = [
  { Icon: Home, title: "Residential Interior", img: villaImg, desc: "Full-home interior design — from layout planning to furniture, finishes and styling.", faqs: [
    { q: "How long does a full home interior take?", a: "Most full-home projects complete in 45–75 working days depending on scope." },
    { q: "Do you handle civil work?", a: "Yes — we manage civil, electrical, plumbing and finishing under one timeline." },
  ]},
  { Icon: Building2, title: "Commercial Interior", img: hotelImg, desc: "Hotels, restaurants, showrooms and retail interiors with a hospitality-first approach.", faqs: [
    { q: "Can you work after business hours?", a: "Absolutely — we plan execution around live operations for commercial spaces." },
  ]},
  { Icon: ChefHat, title: "Kitchen Design", img: kitchenImg, desc: "Modular kitchens with premium shutters, soft-close hardware and durable countertops.", faqs: [
    { q: "What materials do you use?", a: "BWP plywood carcass with acrylic, PU or laminate shutters and Hettich/Häfele hardware." },
    { q: "Do you offer EMI?", a: "Yes — easy 6/12-month EMI options are available." },
  ]},
  { Icon: Shirt, title: "Wardrobe Design", img: wardrobeImg, desc: "Sliding, openable and walk-in wardrobes engineered for the way you store.", faqs: [
    { q: "Sliding or openable — which is better?", a: "Sliding for narrow rooms, openable for maximum storage flexibility." },
  ]},
  { Icon: Layers, title: "False Ceiling", img: ceilingImg, desc: "Gypsum and POP ceilings with concealed cove lighting and architectural detailing.", faqs: [
    { q: "Do ceilings reduce room height much?", a: "Typically 4–6 inches; we design to keep the room feeling spacious." },
  ]},
  { Icon: Sofa, title: "Furniture Design", img: bedroomImg, desc: "Custom-built furniture made in our workshop — beds, sofas, dining and statement pieces.", faqs: [
    { q: "Can I match an existing piece?", a: "Yes — we can sample finishes and detail to match an existing palette." },
  ]},
  { Icon: KeyRound, title: "Turnkey Interior", img: officeImg, desc: "One studio handles design, materials, execution and styling — handover ready.", faqs: [
    { q: "What's included in turnkey?", a: "Design, civil, electrical, plumbing, furniture, finishes, décor and final styling." },
    { q: "How is pricing structured?", a: "A single transparent quotation with milestone-based payments." },
  ]},
];

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Services"
        title="Full-service Interior Design"
        subtitle="Whether you're refreshing a single room or building a brand new home, we have a service for it — all under one roof."
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-16">
          {items.map((s, i) => (
            <ServiceBlock key={s.title} {...s} flip={i % 2 === 1} />
          ))}
        </div>
      </section>
      <section className="py-20 bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Not sure which service you need?</h2>
          <p className="mt-4 text-muted-foreground">Book a free 20-minute consultation. We'll help you scope the right starting point.</p>
          <Link to="/contact" className="mt-8 inline-flex rounded-full bg-gradient-gold text-charcoal px-7 py-3.5 font-medium hover-lift">
            Book Free Consultation <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function ServiceBlock({ Icon, title, img, desc, faqs, flip }: { Icon: any; title: string; img: string; desc: string; faqs: { q: string; a: string }[]; flip: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className={`grid gap-10 lg:grid-cols-2 items-center ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <div className="relative rounded-3xl overflow-hidden shadow-luxe">
        <img src={img} alt={title} loading="lazy" className="w-full h-[420px] object-cover" />
      </div>
      <div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-gold text-charcoal">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="mt-5 font-display text-3xl md:text-4xl font-semibold">{title}</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>
        <div className="mt-6 divide-y divide-border border-y border-border">
          {faqs.map((f) => <Faq key={f.q} {...f} />)}
        </div>
      </div>
    </motion.article>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 py-4 text-left">
        <span className="font-medium text-foreground">{q}</span>
        <ChevronDown className={`h-5 w-5 text-gold shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground">{a}</p>}
    </div>
  );
}