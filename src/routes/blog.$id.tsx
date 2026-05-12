import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/blog/$id")({
  component: BlogDetailsPage,
});

type BlogType = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  featured_image: string;
};

function BlogDetailsPage() {
  const { id } = Route.useParams();

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  async function fetchBlog() {
    setLoading(true);
    setErrorMessage(null);

    console.log("BlogDetailsPage fetchBlog", { id });

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    console.log("BlogDetailsPage result", { data, error });

    if (error) {
      console.log("Blog fetch error:", error);
      setErrorMessage(error.message);
      setBlog(null);
    } else {
      setBlog(data);
    }

    setLoading(false);
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-teal">
          Loading blog...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-bold text-red-500">
          Error loading blog
        </h2>

        <p className="mt-3 text-muted-foreground">{errorMessage}</p>

        <Link
          to="/blog"
          className="mt-6 rounded-xl bg-teal px-6 py-3 font-semibold text-white"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  // Blog Not Found
  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl font-bold text-red-500">
          Blog not found
        </h2>

        <p className="mt-3 text-muted-foreground">
          The blog you are looking for does not exist.
        </p>

        <Link
          to="/blog"
          className="mt-6 rounded-xl bg-teal px-6 py-3 font-semibold text-white"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto max-w-4xl px-6">

        {/* Featured Image */}
        <img
          src={blog.featured_image || "/placeholder.png"}
          alt={blog.title}
          className="h-[420px] w-full rounded-3xl object-cover shadow-lg"
        />

        {/* Content */}
        <div className="mt-8">

          {/* Category */}
          <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="mt-4 text-lg italic text-gray-500">
              {blog.excerpt}
            </p>
          )}

          {/* Main Content */}
          <div className="mt-8 space-y-6 text-lg leading-9 text-gray-700">
            <p>{blog.content}</p>
          </div>

          {/* Back Button */}
          <Link
            to="/blog"
            className="mt-10 inline-block rounded-xl bg-teal px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
