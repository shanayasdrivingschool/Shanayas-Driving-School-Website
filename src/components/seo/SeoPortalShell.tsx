import type { ReactNode } from "react";
import { FilePenLine, LogOut, SearchCheck } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSeoAuth } from "@/components/seo/seoAuthContext";
import { signOutSeo } from "@/lib/seoApi";
import { cn } from "@/lib/utils";

const SeoPortalShell = ({ pageTitle, pageDescription, children }: { pageTitle: string; pageDescription: string; children: ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useSeoAuth();
  const handleSignOut = async () => {
    await signOutSeo();
    navigate("/seo/login", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-[#f6f8fb] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[96rem] items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/seo/blogs" className="flex items-center gap-2 font-black"><span className="rounded-lg bg-[#1d52a1] p-2 text-white"><SearchCheck className="h-4 w-4" /></span>SEO Studio</Link>
          <nav className="ml-4 hidden sm:block"><NavLink to="/seo/blogs" className={({ isActive }) => cn("inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold", isActive ? "bg-blue-50 text-[#1d52a1]" : "text-slate-500 hover:bg-slate-50")}><FilePenLine className="h-4 w-4" /> Blog manager</NavLink></nav>
          <div className="ml-auto flex items-center gap-2"><span className="hidden text-xs text-slate-500 md:block">{user?.email ?? "Preview user"}</span><Link to="/" className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100">Website</Link><button type="button" onClick={() => void handleSignOut()} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><LogOut className="h-3.5 w-3.5" /> Sign out</button></div>
        </div>
      </header>
      <main className="mx-auto max-w-[96rem] px-4 py-6 sm:px-6">
        <div className="mb-5"><h1 className="text-2xl font-black tracking-tight sm:text-3xl">{pageTitle}</h1><p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">{pageDescription}</p></div>
        {children}
      </main>
    </div>
  );
};

export default SeoPortalShell;
