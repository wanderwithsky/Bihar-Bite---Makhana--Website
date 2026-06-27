import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import kitchenImg from "@/assets/portfolio-kitchen.jpg";
import bedroomImg from "@/assets/portfolio-bedroom.jpg";
import hotelImg from "@/assets/portfolio-hotel.jpg";
import officeImg from "@/assets/portfolio-office.jpg";
import wardrobeImg from "@/assets/portfolio-wardrobe.jpg";
import restaurantImg from "@/assets/portfolio-restaurant.jpg";
import villaImg from "@/assets/portfolio-villa.jpg";
import ceilingImg from "@/assets/portfolio-ceiling.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Interior Design Projects in Varanasi | Build My Interior" },
      { name: "description", content: "Browse our portfolio of luxury home, kitchen, hotel, office and commercial interior projects delivered across Varanasi." },
      { property: "og:title", content: "Interior Design Portfolio — Build My Interior" },
      { property: "og:description", content: "A curated portfolio of luxury interior projects." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

const projects = [
  { src: kitchenImg, cat: "Kitchen", title: "Walnut & Brass Kitchen", area: "180 sqft", budget: "₹4.2L", timeline: "30 days", materials: "BWP ply, PU shutters, Quartz" },
  { src: villaImg, cat: "Living", title: "Riverside Villa", area: "1,400 sqft", budget: "₹38L", timeline: "90 days", materials: "Italian marble, walnut veneer" },
  { src: bedroomImg, cat: "Bedroom", title: "Cream Master Suite", area: "260 sqft", budget: "₹6.5L", timeline: "35 days", materials: "Acrylic shutters, fabric panels" },
  { src: hotelImg, cat: "Hotel", title: "Heritage Hotel Lobby", area: "900 sqft", budget: "₹28L", timeline: "75 days", materials: "Marble, brass, crystal" },
  { src: officeImg, cat: "Office", title: "Warm Wood Office", area: "1,100 sqft", budget: "₹19L", timeline: "55 days", materials: "Veneer, glass, vinyl" },
  { src: wardrobeImg, cat: "Bedroom", title: "Walk-in Wardrobe", area: "120 sqft", budget: "₹3.4L", timeline: "25 days", materials: "Laminate, brass, mirror" },
  { src: restaurantImg, cat: "Commercial", title: "Fine-Dining Bistro", area: "1,600 sqft", budget: "₹42L", timeline: "85 days", materials: "Wood, leather, brass" },
  { src: ceilingImg, cat: "Living", title: "Coffered Dining", area: "240 sqft", budget: "₹5.8L", timeline: "30 days", materials: "Gypsum, cove LED" },
];

const filters = ["All", "Kitchen", "Bedroom", "Living", "Office", "Commercial", "Hotel"];

function PortfolioPage() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<typeof projects[number] | null>(null);
  const list = projects.filter(p => active === "All" || p.cat === active);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Selected Work"
        title="Our Portfolio"
        subtitle="A curated selection of recent residential and commercial interior projects delivered across Varanasi."
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  active === f
                    ? "bg-charcoal text-background border-charcoal"
                    : "bg-transparent text-foreground border-border hover:border-gold hover:text-gold"
                }`}
              >{f}</button>
            ))}
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <motion.button
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                onClick={() => setSelected(p)}
                className="group text-left rounded-3xl overflow-hidden bg-card border border-border hover-lift"
              >
                <div className="relative h-72 overflow-hidden">
                  <img src={p.src} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <p className="text-[11px] uppercase tracking-widest text-gold">{p.cat}</p>
                  <h3 className="mt-1 font-display text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.area} · {p.budget} · {p.timeline}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[60] bg-charcoal/85 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-background rounded-3xl max-w-4xl w-full overflow-hidden shadow-luxe grid md:grid-cols-2" onClick={e => e.stopPropagation()}>
            <img src={selected.src} alt={selected.title} className="w-full h-72 md:h-full object-cover" />
            <div className="p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">{selected.cat}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{selected.title}</h3>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Area</dt><dd className="font-medium">{selected.area}</dd></div>
                <div><dt className="text-muted-foreground">Budget</dt><dd className="font-medium">{selected.budget}</dd></div>
                <div><dt className="text-muted-foreground">Timeline</dt><dd className="font-medium">{selected.timeline}</dd></div>
                <div><dt className="text-muted-foreground">Materials</dt><dd className="font-medium">{selected.materials}</dd></div>
              </dl>
              <button onClick={() => setSelected(null)} className="mt-8 w-full rounded-full bg-charcoal text-background py-3 font-medium hover:bg-gold hover:text-charcoal transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}