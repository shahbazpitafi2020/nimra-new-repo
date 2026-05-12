import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Stethoscope,
  HeartPulse,
  Activity,
  Pill,
  Syringe,
  Microscope,
  Baby,
  Brain,
  Apple,
  Shield,
  Users,
  ClipboardCheck,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Medical Services — Dr. Nimra Rehman" },
      {
        name: "description",
        content:
          "Comprehensive medical services from Dr. Nimra Rehman MBBS, RMP.",
      },
    ],
  }),
  component: ServicesPage,
});

const icons = [
  Stethoscope,
  HeartPulse,
  Activity,
  Pill,
  Syringe,
  Microscope,
  Baby,
  Brain,
  Apple,
  Shield,
  Users,
  ClipboardCheck,
];

function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setServices(data);
    }
  }

  return (
    <div>
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-display text-4xl font-bold text-teal lg:text-5xl">
            Our Medical Services
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Providing world-class care for your health and well-being.
          </p>
        </div>
      </section>

      <section className="container mx-auto -mt-2 px-6">
        <div className="space-y-4">
          <div className="rounded-2xl bg-green-cta py-6 text-center text-lg font-semibold text-white shadow-md">
            💬 Visit Our Clinic
          </div>

          <div className="rounded-2xl bg-teal py-6 text-center text-white shadow-md">
            <div className="text-lg font-semibold">
              📅 Book Appointment Now
            </div>

            <div className="text-sm opacity-90">
              Online Consultations Available
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {services.map((service, index) => {
              const Icon = icons[index % icons.length];

              return (
                <Link
                 key={service.id}
                 to="/services"
                  className="block rounded-2xl border border-border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal/10 text-teal">
                    <Icon className="h-8 w-8" />
                  </div>

                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="mb-4 h-48 w-full rounded-xl object-cover"
                    />
                  )}

                  <h3 className="mt-4 font-display text-lg font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-4 rounded-lg bg-teal/10 py-2 text-xs font-semibold text-teal">
                    📹 Video Consultation Available
                  </div>

                  <button
                    onClick={() => navigate({ to: "/contact" })}
                    className="mt-3 block w-full rounded-lg bg-orange py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    📅 Book Appointment
                  </button>
                </Link>
              );
            })}

          </div>
        </div>
      </section>
    </div>
  );
}