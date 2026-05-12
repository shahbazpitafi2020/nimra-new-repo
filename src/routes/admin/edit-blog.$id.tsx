import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/AdminShell";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/edit-blog/$id")({
  beforeLoad: requireAuth,
  component: EditBlogPage,
});

function EditBlogPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid blog id.");
      setLoading(false);
      return;
    }

    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const imageLabel = useMemo(() => (imageFile ? imageFile.name : "Upload new featured image"), [imageFile]);

  async function fetchBlog() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from("blogs").select("*").eq("id", id).single();
    if (error) {
      setError(error.message);
    } else if (!data) {
      setError("Blog not found.");
    } else {
      setTitle(data.title || "");
      setCategory(data.category || "");
      setExcerpt(data.excerpt || "");
      setContent(data.content || "");
      setFeaturedImageUrl(data.featured_image || null);
    }

    setLoading(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let featured_image = featuredImageUrl;

      if (imageFile) {
        const fileName = Date.now() + imageFile.name;
        const { error: uploadError } = await supabase.storage
          .from("website-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicData } = supabase.storage.from("website-images").getPublicUrl(fileName);
        featured_image = publicData.publicUrl || null;
      }

      const { error } = await supabase.from("blogs").update({
        title,
        category,
        excerpt,
        content,
        featured_image,
      }).eq("id", id);

      if (error) {
        throw error;
      }

      navigate({ to: "/admin/blogs" });
    } catch (submitError: any) {
      setError(submitError?.message || "Unable to update the blog.");
    }

    setSaving(false);
  }

  return (
    <AdminShell title="Edit Blog" description="Update blog details and featured image.">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
        {error ? (
          <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-600 shadow-sm">Loading blog details...</div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-3">
                <span className="text-sm font-semibold text-slate-700">Title</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                  required
                />
              </label>

              <label className="space-y-3">
                <span className="text-sm font-semibold text-slate-700">Category</span>
                <input
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                  required
                />
              </label>
            </div>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Excerpt</span>
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Content</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={8}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Featured Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-600"
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mt-3 h-44 w-full rounded-3xl object-cover shadow-sm" />
              ) : featuredImageUrl ? (
                <img src={featuredImageUrl} alt="Featured" className="mt-3 h-44 w-full rounded-3xl object-cover shadow-sm" />
              ) : null}
              <div className="text-sm text-slate-500">{imageLabel}</div>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Updating blog..." : "Save Changes"}
              </button>
              <Link
                to="/admin/blogs"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Blog List
              </Link>
            </div>
          </>
        )}
      </form>
    </AdminShell>
  );
}
