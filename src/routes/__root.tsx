import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  Link,
} from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-teal px-6 py-2 text-white">Go Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-full bg-teal px-6 py-2 text-white">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dr. Nimra Rehman MBBS, RMP — General Physician" },
      { name: "description", content: "Dr. Nimra Rehman MBBS, RMP — Compassionate medical care, consultations and patient care from an experienced physician." },
      { property: "og:title", content: "Dr. Nimra Rehman MBBS, RMP — General Physician" },
      { name: "twitter:title", content: "Dr. Nimra Rehman MBBS, RMP — General Physician" },
      { property: "og:description", content: "Dr. Nimra Rehman MBBS, RMP — Compassionate medical care, consultations and patient care from an experienced physician." },
      { name: "twitter:description", content: "Dr. Nimra Rehman MBBS, RMP — Compassionate medical care, consultations and patient care from an experienced physician." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/651ff2a8-1e9c-4395-a538-78baf5e42839" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/651ff2a8-1e9c-4395-a538-78baf5e42839" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1"><Outlet /></main>
          <Footer />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
