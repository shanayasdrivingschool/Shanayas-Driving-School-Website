import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type PortalLink = {
  label: string;
  to: string;
};

type AffiliatePortalNavProps = {
  links: PortalLink[];
};

const AffiliatePortalNav = ({ links }: AffiliatePortalNavProps) => (
  <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-colors",
              isActive ? "bg-[#1d52a1] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  </div>
);

export default AffiliatePortalNav;
