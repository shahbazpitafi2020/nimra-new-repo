import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Dr. Nimra Rehman" },
      { name: "description", content: "Get in touch with Dr. Nimra Rehman MBBS, RMP for appointments, consultations and queries." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-center font-display text-4xl font-bold uppercase tracking-wide text-teal lg:text-5xl">Contact Us</h1>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-3xl bg-teal/80 p-8 shadow-lg lg:p-10">
            {submitted ? (
              <div className="rounded-xl bg-white p-8 text-center">
                <h2 className="font-display text-2xl font-bold text-teal">Thank you!</h2>
                <p className="mt-2 text-sm text-muted-foreground">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-5"
              >
                {[
                  { label: "Your name", type: "text", name: "name" },
                  { label: "Your email", type: "email", name: "email" },
                  { label: "Subject", type: "text", name: "subject" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-medium text-white">{f.label}</label>
                    <input required type={f.type} name={f.name} className="mt-1 w-full rounded-md bg-white px-4 py-3 outline-none ring-teal focus:ring-2" />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-white">Your message (optional)</label>
                  <textarea rows={5} className="mt-1 w-full rounded-md bg-white px-4 py-3 outline-none ring-teal focus:ring-2" />
                </div>
                <button type="submit" className="rounded-full bg-white px-10 py-3 font-semibold uppercase tracking-wide text-teal shadow hover:bg-secondary">
                  Submit
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="rounded-3xl border border-border bg-white p-8 shadow-sm lg:p-10">
            <h2 className="font-display text-2xl font-bold uppercase text-teal">Compassionate Care You Can Trust</h2>
            <p className="mt-4 text-muted-foreground">
              Dr. Nimra Rehman, MBBS, RMP — providing personalized medical care with empathy and clinical excellence.
            </p>
            <p className="mt-3 text-muted-foreground">
              From general consultations to chronic disease management, we're committed to supporting your long-term health journey.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-teal" /> +92 329 3579993</div>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-teal" /> contact@drnimra-rehman.com</div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-teal" /> Clinic location available on appointment</div>
            </div>

            <div className="mt-8 flex gap-3">
              {[Facebook, Instagram, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="grid h-11 w-11 place-items-center rounded-md bg-teal text-white transition hover:bg-teal-dark">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <a href="/book" className="mt-8 inline-block rounded-lg border-2 border-teal bg-teal/5 px-6 py-2.5 text-sm font-semibold text-teal hover:bg-teal hover:text-white">
              Get a Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
