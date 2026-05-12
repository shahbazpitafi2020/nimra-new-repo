import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/add-blog")({
  component: AddBlogPage,
});

function AddBlogPage() {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let imageUrl = "";

    if (image) {

      const fileName = Date.now() + image.name;

      const { error: uploadError } = await supabase.storage
        .from("website-images")
        .upload(fileName, image);

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("website-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          category,
          excerpt,
          content,
          featured_image: imageUrl,
        },
      ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Blog added successfully");

      setTitle("");
      setCategory("");
      setExcerpt("");
      setContent("");
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30 p-10">

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">

        <h1 className="text-3xl font-bold text-teal">
          Add New Blog
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            type="text"
            placeholder="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border p-3"
            required
          />

          <textarea
            placeholder="Short excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <textarea
            placeholder="Full blog content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-40 w-full rounded-xl border p-3"
          />

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }
            }}
          />

          <button
            type="submit"
            className="rounded-xl bg-teal px-6 py-3 font-semibold text-white"
          >
            Publish Blog
          </button>

        </form>
      </div>
    </div>
  );
}