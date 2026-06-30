import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useAdminSession } from "@/hooks/useAdminSession";

const AdminRouteGuard = () => {
  const location = useLocation();
  const { loading, user } = useAdminAuth();
  const adminSession = useAdminSession();

  if (loading || (user && adminSession.isLoading)) {
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

  if (adminSession.data?.isAdmin !== true) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname, denied: true }} />;
  }

  return <Outlet />;
};

export default AdminRouteGuard;
