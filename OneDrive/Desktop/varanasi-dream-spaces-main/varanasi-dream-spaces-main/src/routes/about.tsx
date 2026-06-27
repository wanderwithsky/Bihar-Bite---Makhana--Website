import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Heart, Eye, Users, Star, Building2 } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import villaImg from "@/assets/portfolio-villa.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Build My Interior, Varanasi" },
      { name: "description", content: "Meet Build My Interior — Varanasi's luxury interior design studio. Learn our story, mission, vision and the team behind the work." },
      { property: "og:title", content: "About Build My Interior" },
      { property: "og:description", content: "Varanasi's trusted luxury interior design studio." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About the studio"
        title="Crafting Homes With Heart, in Varanasi"
        subtitle="Build My Interior is a luxury interior design studio rooted in Varanasi — bringing modern architecture, warm materials and crafted detail to every space we touch."
      />

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 grid gap-12 lg:grid-cols-2 items-center">
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            src={villaImg}
            alt="Studio project"
            loading="lazy"
            className="rounded-3xl object-cover w-full h-[480px] shadow-luxe"
          />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Our Story</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold">A practice built on craft</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Founded in Varanasi by a small team of designers and craftspeople, Build My Interior was created to bring metro-level interior design to one of India's most historic cities — without losing the warmth and personal touch our clients value.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From compact apartments to expansive villas, hotels and offices, every project we deliver is led by a senior designer and executed by our in-house team — so design intent, quality and timelines stay protected end-to-end.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 bg-cream">
        <div className="mx-auto max-w-6xl px-6 grid gap-8 md:grid-cols-2">
          {[
            { Icon: Heart, title: "Our Mission", text: "To craft beautiful, livable interiors that reflect the people who use them — combining honest pricing, premium materials and on-time delivery." },
            { Icon: Eye, title: "Our Vision", text: "To become Varanasi's most loved design studio — known for luxury, integrity, and homes that feel like home." },
          ].map((c) => (
            <div key={c.title} className="rounded-3xl bg-card p-10 border border-border hover-lift">
              <c.Icon className="h-8 w-8 text-gold" />
              <h3 className="mt-5 font-display text-2xl font-semibold">{c.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Founder's Note</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold">"Good design is the kindest gift you can give a home."</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            We believe a well-designed home does more than look beautiful — it shapes the everyday life of the family inside it. At Build My Interior, every drawing, every material, every site visit is in service of that belief.
          </p>
          <p className="mt-6 font-display text-lg">— Founder, Build My Interior</p>
        </div>
      </section>

      {/* Team / Achievements */}
      <section className="py-20 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Recognition</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold">Achievements & Team</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Star, k: "5.0", v: "Google Rating" },
              { Icon: Award, k: "31+", v: "Completed Projects" },
              { Icon: Users, k: "12+", v: "In-house Specialists" },
              { Icon: Building2, k: "100+", v: "Design Concepts" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl bg-card p-8 text-center border border-border">
                <s.Icon className="h-7 w-7 text-gold mx-auto" />
                <div className="mt-4 font-display text-4xl font-semibold">{s.k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link to="/contact" className="inline-flex rounded-full bg-charcoal text-background px-7 py-3.5 font-medium hover:bg-gold hover:text-charcoal transition">
              Work With Us
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}