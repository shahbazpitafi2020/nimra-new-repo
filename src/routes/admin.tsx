import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: requireAuth,
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminShell title="Admin Panel" description="Manage your clinic's content and settings">
      <Outlet />
    </AdminShell>
  );
}
