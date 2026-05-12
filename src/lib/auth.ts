import { redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw redirect({
      to: "/admin-login",
    });
  }

  return { session };
}

export async function requireNoAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    throw redirect({
      to: "/admin-dashboard",
    });
  }

  return {};
}