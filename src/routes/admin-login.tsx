import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { requireNoAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin-login")({
  beforeLoad: requireNoAuth,
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      console.warn("⚠️ Email field is empty");
      setErrorMsg("Please enter your email address");
      return;
    }

    if (!password) {
      console.warn("⚠️ Password field is empty");
      setErrorMsg("Please enter your password");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    console.log("🔐 Login attempt:", { email: email.trim(), passwordLength: password.length });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log("🔐 Auth response:", {
        success: !error,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        error: error ? { message: error.message, status: (error as any).status } : null,
      });

      if (error) {
        console.error("❌ Auth error details:", {
          message: error.message,
          status: (error as any).status,
          code: (error as any).code,
        });

        // Map common Supabase errors to user-friendly messages
        if (error.message.includes("Invalid login credentials")) {
          setErrorMsg("Invalid email or password. Please check and try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setErrorMsg("Please confirm your email address before logging in.");
        } else if (error.message.includes("User not found")) {
          setErrorMsg("No account found with this email address.");
        } else {
          setErrorMsg(`Login failed: ${error.message}`);
        }

        setLoading(false);
        return;
      }

      if (!data?.session) {
        console.warn("⚠️ Auth succeeded but no session created");
        setErrorMsg("Login succeeded but session was not created. Please try again.");
        setLoading(false);
        return;
      }

      console.log("✅ Login successful! Session created for user:", data.user?.email);
      console.log("🔄 Redirecting to dashboard...");

      setLoading(false);
      navigate({ to: "/admin-dashboard" });
    } catch (unexpectedError) {
      console.error("❌ Unexpected error during login:", unexpectedError);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-6">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >

        <h1 className="text-center font-display text-3xl font-bold text-teal">
          Admin Login
        </h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to manage website content
        </p>

        {errorMsg && (
          <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <div className="mt-6">
          <label className="text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-teal"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-teal"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-teal py-3 font-semibold text-white hover:opacity-90"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}