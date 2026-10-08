import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSeoAuth } from "@/components/seo/seoAuthContext";
import { useSeoSession } from "@/hooks/useSeoSession";

const SeoRouteGuard = () => {
  const location = useLocation();
  const { loading, user } = useSeoAuth();
  const seoSession = useSeoSession();
  const resolved = seoSession.isSuccess || seoSession.isError;

  if (loading || (user && !resolved)) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50"><p className="font-bold text-slate-700">Checking SEO workspace access…</p></main>;
  }
  if (!user) return <Navigate to="/seo/login" replace state={{ from: location.pathname }} />;
  if (seoSession.data?.isSeoUser !== true) return <Navigate to="/seo/login" replace state={{ denied: true }} />;
  return <Outlet />;
};

export default SeoRouteGuard;
