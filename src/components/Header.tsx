import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Phone, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <>
      {/* Top bar */}
      <div className="bg-teal text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-2.5 text-sm">
          <a href="tel:+923015827958" className="flex items-center gap-2 font-medium">
            <Phone className="h-4 w-4" /> +92 3015827958
          </a>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="WhatsApp"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-4 z-40 mx-4 mt-4 rounded-2xl border border-border bg-white/95 shadow-sm backdrop-blur lg:mx-8">
        <div className="flex items-center justify-between px-6 py-4">
          <Link
  to="/"
  className="flex flex-col leading-tight transition hover:opacity-90"
>
  <span className="font-display text-4xl font-bold text-slate-900">
    Dr. <span className="text-teal-600">Nimra Rehman</span>
  </span>

  <span className="text-m uppercase tracking-[0.6em] text-slate-400">
    Consultant Physician
  </span>
</Link>

          <nav className="hidden items-center gap-10 lg:flex">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-base font-medium text-foreground transition-colors hover:text-teal"
                activeProps={{ className: "text-orange" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/book"
              className="rounded-full border-2 border-teal px-5 py-2.5 text-center text-sm font-semibold leading-tight text-teal transition hover:bg-teal hover:text-white"
            >
              Book An<br />Appointment
            </Link>
            <a
              href="#"
              className="rounded-full border-2 border-teal px-5 py-3.5 text-sm font-semibold text-teal transition hover:bg-teal hover:text-white"
            >
              Visit Our Clinic
            </a>
          </div>

          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border px-6 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-medium">
                  {n.label}
                </Link>
              ))}
              <Link to="/book" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-teal px-4 py-2 text-center text-white">
                Book An Appointment
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
