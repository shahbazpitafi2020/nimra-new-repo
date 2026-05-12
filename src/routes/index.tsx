import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ChevronLeft, 
  ChevronRight, 
  Stethoscope, 
  HeartPulse, 
  Activity, 
  Pill, 
  Syringe, 
  Microscope, 
  Star 
} from "lucide-react";
import heroImg from "@/assets/hero-doctor.jpg";

// --- TypeScript Interfaces ---
interface Profile {
  id: string;
  doctor_name: string;
  qualification: string;
  bio: string;
  image_url: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Nimra Rehman MBBS, RMP — Trusted General Physician" },
      { name: "description", content: "Compassionate general medicine, consultations and patient-first care from Dr. Nimra Rehman, MBBS, RMP." },
    ],
  }),
  component: HomePage,
});

// Helper to map Lucide icons based on service title
const getServiceIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("consultation")) return Stethoscope;
  if (t.includes("heart") || t.includes("preventive")) return HeartPulse;
  if (t.includes("chronic") || t.includes("disease")) return Activity;
  if (t.includes("pill") || t.includes("prescription")) return Pill;
  if (t.includes("vaccination") || t.includes("syringe")) return Syringe;
  if (t.includes("lab") || t.includes("microscope")) return Microscope;
  return Stethoscope; // Default
};

function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [dbBlogs, setDbBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Profile
      const { data: p } = await supabase.from("profiles").select("*").single();
      if (p) setProfile(p);

      // 2. Fetch Services
      const { data: s } = await supabase.from("services").select("*").order("created_at", { ascending: true });
      if (s) setDbServices(s);

      // 3. Fetch Blogs (Latest 2)
      const { data: b } = await supabase.from("blogs").select("*").order("created_at", { ascending: false }).limit(2);
      if (b) setDbBlogs(b);
    };
    fetchData();
  }, []);

  // Static Fallbacks (Explicitly Typed to prevent 'id' errors)
  const fallbackServices: Service[] = [
    { id: "1", title: "General Consultation", description: "Comprehensive evaluation and personalized treatment plans.", image_url: "" },
    { id: "2", title: "Preventive Care", description: "Routine check-ups, screenings and lifestyle guidance.", image_url: "" },
    { id: "3", title: "Chronic Disease Management", description: "Long-term care for diabetes, hypertension and more.", image_url: "" },
  ];

  const fallbackBlogs: Blog[] = [
    { id: "b1", tag: "General Medicine", title: "Understanding Hypertension", desc: "Learn how lifestyle changes can dramatically lower your blood pressure naturally." } as any,
    { id: "b2", tag: "Wellness", title: "Daily Habits for Better Health", desc: "Small, sustainable habits that compound into long-term wellness benefits." } as any,
  ];

  const servicesToDisplay = dbServices.length > 0 ? dbServices : fallbackServices;
  const blogsToDisplay = dbBlogs.length > 0 ? dbBlogs : fallbackBlogs;

  return (
    <div>
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[640px] w-full overflow-hidden">
          <img 
            src={profile?.image_url || heroImg} 
            alt={profile?.doctor_name || "Dr. Nimra Rehman"} 
            className="h-full w-full object-cover" 
            width={1600} height={1024} fetchPriority="high" decoding="async" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6">
          <div className="absolute left-6 top-1/2 max-w-md -translate-y-1/2 rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur lg:left-16 lg:p-10">
            <h1 className="font-display text-4xl font-bold leading-tight text-teal lg:text-5xl">
              {profile?.doctor_name || "Dr. Nimra Rehman"}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {profile?.qualification || "MBBS, RMP — Consultant Physician"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Specialties: General Medicine, Preventive Care, Chronic Disease Management
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/book" className="rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white shadow hover:bg-teal-dark">
                Book Appointment
              </Link>
              <Link to="/services" className="rounded-full border-2 border-teal px-6 py-3 text-sm font-semibold text-teal hover:bg-teal hover:text-white">
                Our Services
              </Link>
            </div>
          </div>

          <button className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow lg:left-6">
            <ChevronLeft className="h-5 w-5 text-teal" />
          </button>
          <button className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow lg:right-6">
            <ChevronRight className="h-5 w-5 text-teal" />
          </button>
        </div>
      </section>

      {/* DOCTOR CIRCLE */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto h-44 w-44 overflow-hidden rounded-full border-8 border-white shadow-xl ring-4 ring-teal/30">
            <img src={profile?.image_url || heroImg} alt={profile?.doctor_name || "Dr. Nimra Rehman"} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
          <h2 className="mt-8 font-display text-3xl font-bold text-foreground lg:text-4xl">
            Compassionate Care, Trusted Expertise
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {profile?.bio || "With years of clinical experience across leading Pakistani hospitals, Dr. Nimra Rehman combines evidence-based medicine with a patient-first approach to deliver exceptional care."}
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "08+", label: "Years Experience" },
              { num: "4", label: "Major Hospitals" },
              { num: "5K+", label: "Patients Treated" },
              { num: "24/7", label: "Care Support" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="font-display text-4xl font-bold text-teal">{s.num}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-teal">Experience</span>
            <h2 className="mt-4 font-display text-3xl font-bold lg:text-4xl">Professional Experience</h2>
            <p className="mt-3 text-muted-foreground">A career devoted to learning, healing and serving patients.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            {[
              "Former House Surgeon & Physician — PMH Hospital Islamabad",
              "Former House Surgeon & Physician — Nishtar Hospital Multan",
              "Former House Surgeon & Physician — Sheikh Zayed Hospital Rahim Yar Khan",
              "Former House Surgeon & Physician — THQ Hospital Khanpur",
            ].map((e) => (
              <div key={e} className="flex gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <p className="text-sm leading-relaxed">{e}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-teal lg:text-4xl">Our Medical Services</h2>
            <p className="mt-3 text-muted-foreground">Providing world-class care for your health and well-being</p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl bg-green-cta py-5 text-center text-lg font-semibold text-white shadow-md">
            💬 Visit Our Clinic
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl bg-teal py-5 text-center text-white shadow-md">
            <div className="text-lg font-semibold">📅 Book Appointment Now</div>
            <div className="text-sm opacity-90">Online Consultations Available</div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesToDisplay.map((s) => {
              const Icon = getServiceIcon(s.title);
              return (
                <div key={s.id} className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal/10 text-teal">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description || (s as any).desc}</p>
                  <div className="mt-4 rounded-lg bg-teal/10 py-2 text-xs font-semibold text-teal">📹 Video Consultation Available</div>
                  <Link to="/book" className="mt-3 block rounded-lg bg-orange py-2.5 text-sm font-semibold text-white hover:opacity-90">
                    📅 Book Appointment
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <span className="rounded-full bg-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-teal">From the blog</span>
            <h2 className="mt-4 font-display text-3xl font-bold lg:text-4xl">Explore Our Latest Posts</h2>
            <p className="mt-3 text-muted-foreground">Insights on health, wellness, treatments and more.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {blogsToDisplay.map((p) => (
              <article key={p.id} className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md">
                <span className="rounded-full bg-green-cta/15 px-3 py-1 text-xs font-semibold text-green-cta">
                  {p.category || (p as any).tag}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold group-hover:text-teal">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt || (p as any).desc}</p>
                <Link to="/blog" className="mt-4 inline-block text-sm font-semibold text-teal">Read more →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-center font-display text-3xl font-bold lg:text-4xl">What Our Patients Say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { name: "Ayesha K.", text: "Dr. Nimra is incredibly attentive and caring. She took the time to explain everything in detail." },
              { name: "Hamza R.", text: "Excellent diagnosis and treatment. Felt heard and properly cared for from the first visit." },
              { name: "Sana M.", text: "Highly professional and compassionate. I trust her completely with my family's health." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex gap-1 text-orange">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-orange" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                <p className="mt-4 text-sm font-semibold">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}