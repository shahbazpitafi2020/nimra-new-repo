import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/AdminShell";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/blogs")({
  beforeLoad: requireAuth,
  component: BlogManagementPage,
});

type BlogItem = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  featured_image?: string;
  created_at?: string;
};

function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, category, excerpt, featured_image, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setBlogs([]);
    } else {
      setBlogs(data || []);
    }

    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this blog post permanently?")) {
      return;
    }

    setDeleting(id);
    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      setBlogs((current) => current.filter((blog) => blog.id !== id));
    }

    setDeleting(null);
  }

  return (
    <AdminShell title="Blog Management" description="Create, edit, and remove blog posts for the website.">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Published blog posts</h3>
            <p className="mt-2 text-sm text-slate-600">Manage article content and featured images.</p>
          </div>
          <Link
            to="/admin/add-blog"
            className="inline-flex items-center justify-center rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Add New Blog
          </Link>
        </div>

        {error ? (
          <div className="rounded-3xl bg-red-50 p-5 text-sm text-red-700 shadow-sm">{error}</div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-600 shadow-sm">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-600 shadow-sm">No blog posts found yet.</div>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{blog.category}</p>
                    <h4 className="text-xl font-semibold text-slate-900">{blog.title}</h4>
                    <p className="max-w-2xl text-sm text-slate-600">{blog.excerpt}</p>
                    {blog.created_at ? (
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/admin/edit-blog/$id"
                      params={{ id: blog.id }}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-teal hover:text-teal"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      disabled={deleting === blog.id}
                      className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleting === blog.id ? "Deleting..." : "Delete"}
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
