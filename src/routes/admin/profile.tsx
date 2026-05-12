import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "@/components/AdminShell";
import { requireAuth } from "@/lib/auth";
const PROFILE_ID = "df20282a-f6f4-40af-bf38-fbc10d6ba1e4";

export const Route = createFileRoute("/admin/profile")({
  beforeLoad: requireAuth,
  component: ProfilePage,
});

type ProfileData = {
  id: number;
  doctor_name: string;
  qualification: string;
  bio: string;
  image_url?: string;
};

function ProfilePage() {
  const [doctorName, setDoctorName] = useState("");
  const [qualification, setQualification] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const imageLabel = useMemo(() => (imageFile ? imageFile.name : "Upload profile image"), [imageFile]);

  async function fetchProfile() {
    setLoading(true);
    setError(null);

const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", "df20282a-f6f4-40af-bf38-fbc10d6ba1e4")
  .maybeSingle();

    if (error) {
      setError(error.message);
    } else if (data) {
      setDoctorName(data.doctor_name || "");
      setQualification(data.qualification || "");
      setBio(data.bio || "");
      setProfileImageUrl(data.image_url || null);
    }

    setLoading(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      let image_url = profileImageUrl;

      if (imageFile) {
        const fileName = Date.now() + imageFile.name;
        const { error: uploadError } = await supabase.storage
          .from("website-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicData } = supabase.storage.from("website-images").getPublicUrl(fileName);
        image_url = publicData.publicUrl || null;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: "df20282a-f6f4-40af-bf38-fbc10d6ba1e4",
        doctor_name: doctorName,
        qualification,
        bio,
        image_url,
      });

      if (error) {
        throw error;
      }

      setSuccess("Doctor profile saved successfully.");
    } catch (submitError: any) {
      setError(submitError?.message || "Unable to save profile.");
    }

    setSaving(false);
  }

  return (
    <AdminShell title="Doctor Profile" description="Update the doctor profile displayed on the public website.">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
        {error ? (
          <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-600 shadow-sm">Loading profile details...</div>
        ) : (
          <>
            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Doctor Name</span>
              <input
                value={doctorName}
                onChange={(event) => setDoctorName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Qualification</span>
              <input
                value={qualification}
                onChange={(event) => setQualification(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Bio</span>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-slate-700">Profile Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-600"
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mt-3 h-44 w-full rounded-3xl object-cover shadow-sm" />
              ) : profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="mt-3 h-44 w-full rounded-3xl object-cover shadow-sm" />
              ) : null}
              <div className="text-sm text-slate-500">{imageLabel}</div>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-teal px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving profile..." : "Save Profile"}
            </button>
          </>
        )}
      </form>
    </AdminShell>
  );
}
