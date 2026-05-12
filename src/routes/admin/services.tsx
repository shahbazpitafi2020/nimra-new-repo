import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/AdminShell";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/services")({
  beforeLoad: requireAuth,
  component: ServicesManagementPage,
});

type ServiceItem = {
  id: string;
  title: string;
  description: string;
};

function ServicesManagementPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from("services").select("id, title, description").order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setServices([]);
    } else {
      setServices(data || []);
    }

    setLoading(false);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!title || !description) {
        throw new Error("Please provide title and description.");
      }

      if (editingId) {
        const { error } = await supabase.from("services").update({ title, description }).eq("id", editingId);
        if (error) throw error;
        setServices((current) =>
          current.map((service) =>
            service.id === editingId ? { ...service, title, description } : service
          )
        );
      } else {
        const { data, error } = await supabase.from("services").insert({ title, description }).select("id, title, description");
        if (error) throw error;
        setServices((current) => [...data, ...current]);
      }

      setTitle("");
      setDescription("");
      setEditingId(null);
    } catch (saveError: any) {
      setError(saveError?.message || "Unable to save service.");
    }

    setSaving(false);
  }

  async function handleEdit(service: ServiceItem) {
    setEditingId(service.id);
    setTitle(service.title);
    setDescription(service.description);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this service?")) {
      return;
    }

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }

    setServices((current) => current.filter((service) => service.id !== id));
  }

  return (
    <AdminShell
      title="Services Management"
      description="Create, update, and remove the services displayed on the public website."
    >
      <div className="space-y-6">
        {error ? (
          <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}

        <form onSubmit={handleSave} className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Service Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>
            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {editingId ? "Update Service" : "Create Service"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setDescription("");
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        {loading ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-600 shadow-sm">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-600 shadow-sm">No services found yet.</div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <div key={service.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(service)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-teal hover:text-teal"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
