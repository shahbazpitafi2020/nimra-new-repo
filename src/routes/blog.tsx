import {
  createFileRoute,
  Link,
  Outlet,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Health Blog — Dr. Nimra Rehman" },
      {
        name: "description",
        content:
          "Articles and insights on health, wellness and preventive care.",
      },
    ],
  }),

  component: BlogPage,
});

type BlogType = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  featured_image: string;
};

function BlogPage() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Blog fetch error:", error);
    } else {
      setBlogs(data || []);
    }

    setLoading(false);
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-teal">
          Loading blogs...
        </p>
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <div className="bg-secondary/30 py-16">
        <div className="container mx-auto px-6">

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-teal lg:text-5xl">
              Health & Wellness Blog
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Trusted medical insights and wellness guidance.
            </p>
          </div>

          {/* Empty State */}
          {blogs.length === 0 && (
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold text-gray-700">
                No blogs found
              </h2>

              <p className="mt-3 text-muted-foreground">
                Blogs will appear here after publishing.
              </p>
            </div>
          )}

          {/* Blog Grid */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to="/blog/$id"
                params={{ id: String(blog.id) }}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal/30 to-teal/60">

                  <img
                    src={blog.featured_image || "/placeholder.png"}
                    alt={blog.title}
                    className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105"
                  />

                  {/* Category */}
                  <span className="absolute right-4 top-4 rounded-full bg-green-cta px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                    {blog.category}
                  </span>
                </div>

                {/* Content */}
                <div className="relative px-6 pb-6">

                  {/* Small Circle Image */}
                  <div className="absolute -top-8 left-6 h-16 w-16 overflow-hidden rounded-full border-4 border-white shadow">

                    <img
                      src={blog.featured_image || "/placeholder.png"}
                      alt={blog.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="pt-12">

                    {/* Title */}
                    <h2 className="font-display text-xl font-bold transition group-hover:text-teal">
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mt-2 text-sm text-muted-foreground">
                      {blog.excerpt}
                    </p>

                    <div className="mt-4 inline-block text-sm font-semibold text-teal transition group-hover:underline">
                      READ MORE →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}