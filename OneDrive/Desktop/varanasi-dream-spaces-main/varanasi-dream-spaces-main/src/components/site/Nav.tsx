import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/bmi-logo-removebg-preview.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center shrink-0" aria-label="Build My Interior — Home">
          <img
            src={logo}
            alt="Build My Interior — Designing Spaces, Creating Experiences, Varanasi"
            className="h-12 sm:h-20 w-auto object-contain"
            width={200}
            height={200}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+917309754967"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-medium text-foreground hover:bg-gold/10 transition"
          >
            <Phone className="h-4 w-4 text-gold" /> 73097 54967
          </a>
          <Link
            to="/contact"
            className="rounded-full bg-charcoal text-background px-5 py-2.5 text-sm font-medium hover:bg-gold hover:text-charcoal transition-colors"
          >
            Free Consultation
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-md text-foreground"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium text-foreground/90 hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+917309754967"
              className="mt-2 rounded-full bg-charcoal text-background px-5 py-3 text-center text-sm font-medium"
            >
              Call 73097 54967
            </a>
          </div>
        </div>
      )}
    </header>
  );
}