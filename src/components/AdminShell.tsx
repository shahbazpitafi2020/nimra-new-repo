import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

const adminNav = [
  { label: "Dashboard", to: "/admin/" },
  { label: "Blog Management", to: "/admin/blogs" },
  { label: "Add Blog", to: "/admin/add-blog" },
  { label: "Services", to: "/admin/services" },
  { label: "Doctor Profile", to: "/admin/profile" },
];

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { session, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/admin-login" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <p className="text-lg font-semibold text-teal">Checking admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white px-6 py-6 lg:w-80 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin Panel</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Clinic CMS</h2>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
            <p className="font-semibold text-slate-900">Signed in as</p>
            <p className="mt-2 truncate text-sm text-slate-600">{session?.user?.email || "Admin"}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {adminNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-teal/10 hover:text-teal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white px-6 py-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-teal">{title}</p>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
              ) : null}
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
