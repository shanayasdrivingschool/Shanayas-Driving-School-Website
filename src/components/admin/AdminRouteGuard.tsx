import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useAdminSession } from "@/hooks/useAdminSession";

const AdminRouteGuard = () => {
  const location = useLocation();
  const { loading, user } = useAdminAuth();
  const adminSession = useAdminSession();

  /* Only the session restore blocks, and that is a local read. */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Admin</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">Checking your access...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  /* The admin flag is still in flight. Render the route anyway so the page mounts and
     starts its own query now instead of waiting a full round trip for this guard to
     clear -- both resolve against the same cached lookup in adminAccess, so the page
     costs nothing extra. A non-admin sees only empty page chrome for that moment: every
     table is RLS-protected, so no record can load, and the redirect below fires as soon
     as the answer arrives. */
  const resolved = adminSession.isSuccess || adminSession.isError;

  if (resolved && adminSession.data?.isAdmin !== true) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname, denied: true }} />;
  }

  return <Outlet />;
};

export default AdminRouteGuard;
