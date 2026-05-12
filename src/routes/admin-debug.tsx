import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin-debug")({
  component: AdminDebugPage,
});

function AdminDebugPage() {
  const [testEmail, setTestEmail] = useState("admin@example.com");
  const [testPassword, setTestPassword] = useState("TestPassword123!");
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setDebugLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    addLog("✅ Debug page loaded - Supabase client initialized");
    addLog("📝 Use this page to diagnose authentication issues");
    addLog("");
    addLog("🔍 Common issues:");
    addLog("  • User doesn't exist in Supabase Auth");
    addLog("  • Password doesn't match");
    addLog("  • Email not verified (if required)");
    addLog("  • User blocked/disabled");
  }, []);

  async function testConnection() {
    try {
      addLog("\n🧪 Testing Supabase connection...");

      // Try to get auth status
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        addLog(`❌ Error getting session: ${error.message}`);
      } else {
        addLog(`✅ Session check successful`);
        addLog(`📊 Current session: ${data?.session ? "Active" : "None"}`);
      }

      // Try a dummy login to see the exact error
      addLog("\n🔐 Testing auth with provided credentials...");
      addLog(`   Email: ${testEmail}`);
      addLog(`   Password: ${testPassword.substring(0, 3)}${"*".repeat(testPassword.length - 3)}`);
      
      const loginResult = await supabase.auth.signInWithPassword({
        email: testEmail.trim(),
        password: testPassword,
      });

      if (loginResult.error) {
        addLog(`❌ Login error: ${loginResult.error.message}`);
        addLog(`   Status: ${(loginResult.error as any).status || "Unknown"}`);
        addLog(`   Code: ${(loginResult.error as any).code || "Unknown"}`);
        
        if ((loginResult.error as any).status === 400) {
          addLog(`\n⚠️  Status 400 means: User not found OR incorrect password`);
          addLog(`    This is intentional - Supabase doesn't reveal which one for security`);
          addLog(`\n✅ Solution: Create a test user in your Supabase project:`);
          addLog(`   1. Go to: https://app.supabase.com`);
          addLog(`   2. Select your project`);
          addLog(`   3. Go to: Authentication > Users`);
          addLog(`   4. Click "+ Create User"`);
          addLog(`   5. Enter email: ${testEmail}`);
          addLog(`   6. Enter password: ${testPassword}`);
          addLog(`   7. Click "Create User"`);
        }
      } else if (loginResult.data?.session) {
        addLog(`✅ Login successful!`);
        addLog(`   User: ${loginResult.data.user?.email}`);
      } else {
        addLog(`⚠️  Unexpected: login succeeded but no session`);
      }
    } catch (err: any) {
      addLog(`💥 Unexpected error: ${err.message}`);
    }
  }

  async function listAllUsers() {
    try {
      addLog("\n📋 Attempting to list all auth users...");
      addLog("⚠️  Note: Client-side auth can't list users (security restriction)");
      addLog("    Check your Supabase dashboard instead:");
      addLog("    https://app.supabase.com > Authentication > Users");
      
      // Try to get current user info
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        addLog(`\n❌ Not authenticated yet`);
      } else {
        addLog(`\n✅ Current user: ${data.user?.email}`);
      }
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
    }
  }

  function showConfig() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    addLog("\n⚙️  Configuration Check:");
    addLog(`VITE_SUPABASE_URL: ${url ? "✅ Set (" + url + ")" : "❌ Missing"}`);
    addLog(`VITE_SUPABASE_ANON_KEY: ${key ? "✅ Set (length: " + key.length + ")" : "❌ Missing"}`);
    
    if (!url || !key) {
      addLog("\n❌ Critical: Missing environment variables!");
      addLog("   Add to .env file:");
      addLog("   VITE_SUPABASE_URL=your_project_url");
      addLog("   VITE_SUPABASE_ANON_KEY=your_anon_key");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">🔧 Admin Login Debugger</h1>
        <p className="mb-6 text-slate-600">Test Supabase authentication and diagnose login issues</p>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Test Credentials</h2>
          <p className="mb-4 text-sm text-slate-600">
            Use real credentials from your Supabase project. If you don't have a test user, create one in your Supabase dashboard.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={showConfig}
            className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Show Config
          </button>
          <button
            onClick={testConnection}
            className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
          >
            Test Login
          </button>
          <button
            onClick={listAllUsers}
            className="rounded bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Auth Status
          </button>
        </div>

        <div className="rounded-lg bg-slate-900 p-6 text-white shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Debug Log</h2>
          <div className="max-h-96 space-y-1 overflow-y-auto font-mono text-sm">
            {debugLog.length === 0 ? (
              <div className="text-slate-500">Click a button above to start debugging...</div>
            ) : (
              debugLog.map((log, i) => (
                <div key={i} className="break-words text-slate-200">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4 rounded-lg bg-blue-50 p-6 text-sm text-blue-800 shadow-md">
          <div>
            <h3 className="mb-2 font-semibold">📖 How to Fix Login Issues</h3>
            <ol className="list-inside list-decimal space-y-2">
              <li>
                <strong>Check your Supabase project URL:</strong> Make sure VITE_SUPABASE_URL matches your project (click "Show Config" above)
              </li>
              <li>
                <strong>Create a test user:</strong>
                <ul className="ml-4 list-inside list-disc">
                  <li>Go to <code className="bg-blue-100 px-2 py-1">https://app.supabase.com</code></li>
                  <li>Select your project</li>
                  <li>Navigate to <strong>Authentication → Users</strong></li>
                  <li>Click <strong>"+ Create User"</strong></li>
                  <li>Enter email and password (8+ characters recommended)</li>
                  <li>Make sure <strong>Email confirmed</strong> is toggled ON</li>
                  <li>Click <strong>"Create user"</strong></li>
                </ul>
              </li>
              <li>
                <strong>Test the login:</strong> Use the credentials above to test. Status 400 with "invalid_credentials" means the user doesn't exist.
              </li>
              <li>
                <strong>Try the actual login:</strong> Go to <code className="bg-blue-100 px-2 py-1">/admin-login</code> and login with your test user
              </li>
            </ol>
          </div>

          <div className="mt-4 border-t border-blue-200 pt-4">
            <h4 className="mb-2 font-semibold">🔍 Error Code Reference</h4>
            <ul className="space-y-1">
              <li><code className="bg-blue-100 px-2 py-1">400 invalid_credentials</code> → User not found or wrong password</li>
              <li><code className="bg-blue-100 px-2 py-1">422 email_not_confirmed</code> → User exists but email not verified</li>
              <li><code className="bg-blue-100 px-2 py-1">400 user_banned</code> → User account is disabled</li>
              <li><code className="bg-blue-100 px-2 py-1">401 unauthorized</code> → Auth token invalid/expired</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
