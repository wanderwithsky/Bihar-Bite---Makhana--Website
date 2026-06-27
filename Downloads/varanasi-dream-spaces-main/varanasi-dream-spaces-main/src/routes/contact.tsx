import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, MessageCircle, CheckCircle2 } from "lucide-react";
import { SiteLayout, PageHeader } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Build My Interior — Interior Designer in Varanasi" },
      { name: "description", content: "Book a free consultation with Varanasi's trusted interior design studio. Call +91 73097 54967, WhatsApp or visit our Nadesar studio." },
      { property: "og:title", content: "Contact Build My Interior" },
      { property: "og:description", content: "Book a free interior design consultation in Varanasi." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      property_type: String(fd.get("property") || "") || null,
      location: String(fd.get("location") || "").trim() || null,
      budget: String(fd.get("budget") || "") || null,
      requirements: String(fd.get("requirements") || "").trim() || null,
    };

    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert(payload);

    setSubmitting(false);

    if (insertError) {
      setError("Something went wrong. Please call or WhatsApp us directly.");
      return;
    }

    setSent(true);

    // Forward the enquiry to the studio WhatsApp
    const msg =
      `*New Enquiry — Build My Interior*%0A` +
      `*Name:* ${encodeURIComponent(payload.name)}%0A` +
      `*Phone:* ${encodeURIComponent(payload.phone)}%0A` +
      `*Email:* ${encodeURIComponent(payload.email)}%0A` +
      (payload.property_type ? `*Property:* ${encodeURIComponent(payload.property_type)}%0A` : "") +
      (payload.location ? `*Location:* ${encodeURIComponent(payload.location)}%0A` : "") +
      (payload.budget ? `*Budget:* ${encodeURIComponent(payload.budget)}%0A` : "") +
      (payload.requirements ? `%0A${encodeURIComponent(payload.requirements)}` : "");
    window.open(`https://wa.me/917309754967?text=${msg}`, "_blank", "noopener");
  };

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Let's talk"
        title="Tell Us About Your Space"
        subtitle="Share a few details and our design team will get back within 24 hours to schedule your free consultation."
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 grid gap-10 lg:grid-cols-5">
          {/* form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 rounded-3xl bg-card border border-border p-8 md:p-10 shadow-luxe"
          >
            <h2 className="font-display text-2xl font-semibold">Book Free Consultation</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" name="name" />
              <Field label="Phone" name="phone" type="tel" />
              <Field label="Email" name="email" type="email" />
              <Select label="Property Type" name="property" options={["Apartment", "Independent Home", "Villa", "Office", "Hotel / Restaurant", "Other"]} />
              <Field label="Location" name="location" />
              <Select label="Budget" name="budget" options={["Under ₹3L", "₹3L – ₹8L", "₹8L – ₹20L", "₹20L – ₹50L", "₹50L+"]} />
            </div>
            <div className="mt-5">
              <label className="text-sm font-medium">Requirements</label>
              <textarea name="requirements" rows={4} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold transition" placeholder="Tell us about your project, rooms, timelines..." />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-7 w-full rounded-full bg-gradient-gold text-charcoal py-3.5 font-medium hover-lift disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Enquiry"}
            </button>
            {sent && (
              <p className="mt-4 inline-flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-gold" />
                Thanks! Your enquiry was saved and forwarded to our WhatsApp. We'll respond within 24 hours.
              </p>
            )}
            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}
          </motion.form>

          {/* info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { Icon: MapPin, title: "Visit Studio", lines: ["4th Floor, Nate Patel Nagar,", "Nadesar, Varanasi,", "Uttar Pradesh"] },
              { Icon: Phone, title: "Call Us", lines: ["+91 73097 54967"], href: "tel:+917309754967" },
              { Icon: MessageCircle, title: "WhatsApp", lines: ["Chat with our designer"], href: "https://wa.me/917309754967" },
              { Icon: Mail, title: "Email", lines: ["hello@buildmyinterior.in"], href: "mailto:hello@buildmyinterior.in" },
              { Icon: Clock, title: "Hours", lines: ["Open daily · 10 AM – 7 PM"] },
            ].map((c) => (
              <a key={c.title} href={c.href ?? undefined} className="block rounded-2xl bg-card border border-border p-6 hover:border-gold transition">
                <div className="flex gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold text-charcoal shrink-0">
                    <c.Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{c.title}</p>
                    {c.lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-3xl border border-border shadow-luxe">
            <iframe
              title="Build My Interior — Studio location"
              src="https://www.google.com/maps?q=Nadesar,Varanasi,Uttar+Pradesh&output=embed"
              loading="lazy"
              className="w-full h-[420px] border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input name={name} type={type} required className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold transition" />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select name={name} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold transition">
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}