import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, MessageCircle, MapPin, Phone, Clock, Mail } from "lucide-react";
import logo from "@/assets/bmi-logo-removebg-preview.png";

export function Footer() {
  return (
    <footer className="bg-charcoal text-background/85 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="inline-block rounded-2xl bg-background/95 p-4">
            <img
              src={logo}
              alt="Build My Interior"
              className="h-20 w-auto object-contain"
              width={240}
              height={240}
            />
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-background/70">
            Varanasi's trusted luxury interior design studio. From modular kitchens to
            turnkey homes, hotels and offices — we craft spaces that feel like home.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[
              { Icon: Instagram, href: "#" },
              { Icon: Facebook, href: "#" },
              { Icon: Youtube, href: "#" },
              { Icon: MessageCircle, href: "https://wa.me/917309754967" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                aria-label="social"
                className="grid h-10 w-10 place-items-center rounded-full border border-background/15 hover:border-gold hover:text-gold transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-background">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/portfolio", label: "Portfolio" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-background/70 hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold text-background">Visit Studio</h4>
          <ul className="mt-4 space-y-3 text-sm text-background/70">
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" /> 4th Floor, Nate Patel Nagar, Nadesar, Varanasi, Uttar Pradesh</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" /> <a href="tel:+917309754967">+91 73097 54967</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" /> hello@buildmyinterior.in</li>
            <li className="flex gap-2"><Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" /> Open daily 10 AM – 7 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/50">
          <p>© {new Date().getFullYear()} Build My Interior. All rights reserved.</p>
          <p>Crafted with care in Varanasi.</p>
        </div>
      </div>
    </footer>
  );
}