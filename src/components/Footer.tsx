import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 bg-[#1f2937] text-white">
      <div className="container mx-auto px-6 py-14 text-center">
        <Link to="/" className="inline-block font-display text-5xl font-bold tracking-tight">
          NR<span className="text-teal">.</span>
        </Link>
        <p className="mt-4 text-sm text-gray-300">
          Dr. Nimra Rehman MBBS, RMP — Compassionate General Medicine & Patient Care
        </p>
        <div className="mt-5 flex justify-center gap-3">
          {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
            <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-gray-600 transition hover:bg-teal">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <div className="mt-5 flex justify-center gap-3 text-xs">
          {["Stripe", "PayPal", "VISA"].map((p) => (
            <span key={p} className="rounded bg-gray-500 px-4 py-1.5 font-bold text-white">{p}</span>
          ))}
        </div>
      </div>
      <div className="bg-teal">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-6 py-5 text-sm text-white md:flex-row md:gap-10">
          <Link to="/book">Book an Appointment</Link>
          <span className="hidden md:inline opacity-50">|</span>
          <Link to="/">Home</Link>
          <span className="hidden md:inline opacity-50">|</span>
          <Link to="/services">Services</Link>
          <span className="hidden md:inline opacity-50">|</span>
          <Link to="/blog">Blog</Link>
          <span className="hidden md:inline opacity-50">|</span>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="border-t border-white/20 py-3 text-center text-xs text-white/90">
          © 2026 Dr. Nimra Rehman. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
