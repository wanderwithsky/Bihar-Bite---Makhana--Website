import { MessageCircle, Phone } from "lucide-react";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href="https://wa.me/917309754967"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp chat"
        className="grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.72_0.17_145)] text-white shadow-luxe hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href="tel:+917309754967"
        aria-label="Call now"
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-gold text-charcoal shadow-luxe hover:scale-110 transition-transform"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}