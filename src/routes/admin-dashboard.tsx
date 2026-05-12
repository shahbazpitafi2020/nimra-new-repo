import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/AdminShell";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin-dashboard")({
  beforeLoad: requireAuth,
  component: AdminDashboardPage,
});

type DashboardStats = {
  blogCount: number;
  serviceCount: number;
  profileSet: boolean;
};

function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    blogCount: 0,
    serviceCount: 0,
    profileSet: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    setLoading(true);
    setError(null);

    try {
      const [{ data: blogs }, { data: services }, { data: profile }] = await Promise.all([
        supabase.from("blogs").select("id"),
        supabase.from("services").select("id"),
        supabase.from("profiles").select("id"),
      ]);

      setStats({
        blogCount: blogs?.length ?? 0,
        serviceCount: services?.length ?? 0,
        profileSet: (profile?.length ?? 0) > 0,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load admin dashboard stats.");
    }

    setLoading(false);
  }

  return (
    <AdminShell
      title="Admin Dashboard"
      description="Manage website content, view quick counts, and access blog, services, and profile tools."
    >
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Published Blogs</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.blogCount}</p>
            <p className="mt-2 text-sm text-slate-600">Total blog articles available on the site.</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Services</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.serviceCount}</p>
            <p className="mt-2 text-sm text-slate-600">Entries available in the services section.</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Doctor Profile</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">
              {stats.profileSet ? "Configured" : "Not set"}
            </p>
            <p className="mt-2 text-sm text-slate-600">Manage the doctor bio and public profile details.</p>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl bg-red-50 p-5 text-sm text-red-700 shadow-sm">{error}</div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-center text-slate-600 shadow-sm">
            Loading admin dashboard...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <Link
              to="/admin/blogs"
              className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-semibold text-teal">Blog Management</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">Edit, create, and delete blog posts.</p>
            </Link>

            <Link
              to="/admin/services"
              className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-semibold text-teal">Services</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">Update clinical services and descriptions.</p>
            </Link>

            <Link
              to="/admin/profile"
              className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-semibold text-teal">Doctor Profile</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">Maintain doctor biography and contact details.</p>
            </Link>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
