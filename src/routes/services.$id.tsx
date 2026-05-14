import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/services/$id")({
  component: ServiceDetailsPage,
});

type ServiceType = {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  icon?: string;
};

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

function ServiceDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  async function fetchService() {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setErrorMessage(error.message);
      setService(null);
    } else {
      setService(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-teal">Loading service...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-bold text-red-500">Error loading service</h2>
        <p className="mt-3 text-muted-foreground">{errorMessage}</p>
        <Link
          to="/services"
          className="mt-6 rounded-xl bg-teal px-6 py-3 font-semibold text-white"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-bold text-red-500">Service not found</h2>
        <p className="mt-3 text-muted-foreground">
          The service you are looking for does not exist.
        </p>
        <Link
          to="/services"
          className="mt-6 rounded-xl bg-teal px-6 py-3 font-semibold text-white"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  // Get the appropriate icon for this service
  const getServiceIcon = () => {
    if (service.icon) {
      const iconIndex = parseInt(service.icon) || 0;
      return icons[iconIndex % icons.length];
    }
    return Stethoscope; // Default icon
  };

  const IconComponent = getServiceIcon();

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto max-w-4xl px-6">

        {/* Service Image */}
        {service.image_url && (
          <img
            src={service.image_url}
            alt={service.title}
            className="h-[420px] w-full rounded-3xl object-cover shadow-lg"
          />
        )}

        {/* Service Icon (if no image) */}
        {!service.image_url && (
          <div className="flex h-[420px] w-full items-center justify-center rounded-3xl bg-teal/10 shadow-lg">
            <IconComponent className="h-32 w-32 text-teal" />
          </div>
        )}

        {/* Content */}
        <div className="mt-8">

          {/* Service Icon Badge */}
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-teal/10 p-4">
              <IconComponent className="h-12 w-12 text-teal" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mt-5 text-center text-4xl font-bold leading-tight text-gray-900">
            {service.title}
          </h1>

          {/* Description */}
          <div className="mt-8 space-y-6 text-lg leading-9 text-gray-700">
            <p className="text-center text-xl">{service.description}</p>
          </div>

          {/* Service Features */}
          <div className="mt-12 rounded-2xl bg-green-cta/10 p-8 text-center">
            <h3 className="text-xl font-bold text-teal">Service Includes</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-2xl">📹</div>
                <div className="mt-2 font-semibold">Video Consultation</div>
                <div className="text-sm text-muted-foreground">Available online</div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-2xl">🏥</div>
                <div className="mt-2 font-semibold">In-Clinic Visit</div>
                <div className="text-sm text-muted-foreground">Personal consultation</div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900">Ready to Book?</h3>
            <p className="mt-2 text-muted-foreground">
              Schedule your appointment with Dr. Nimra Rehman
            </p>

            <button
              onClick={() => navigate({ to: "/contact" })}
              className="mt-6 rounded-xl bg-orange px-8 py-4 text-lg font-semibold text-white transition hover:opacity-90"
            >
              📅 Book Appointment Now
            </button>
          </div>

          {/* Back Button */}
          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-block rounded-xl bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              ← Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}