import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Briefcase,
  ShieldCheck,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { fetchEmployeeApplications, type EmployeeApplicationRecord } from "@/lib/leadService";

type StatusFilter = "All" | EmployeeApplicationRecord["status"];

const statusColors: Record<EmployeeApplicationRecord["status"], string> = {
  "Pending Review": "bg-amber-100 text-amber-800",
  Reviewed: "bg-blue-100 text-blue-800",
  Shortlisted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const statusIcons: Record<EmployeeApplicationRecord["status"], typeof CheckCircle2> = {
  "Pending Review": Clock,
  Reviewed: FileText,
  Shortlisted: CheckCircle2,
  Rejected: XCircle,
};

const demoApplications: EmployeeApplicationRecord[] = [
  {
    applicationID: "APP-20260304-A1B2C",
    positionApplied: "Driving Instructor",
    requiresLicenseFlag: true,
    applicantName: "James Wilson",
    applicantEmail: "james.w@email.com",
    applicantPhone: "250-555-1001",
    yearsOfExperience: "5",
    submissionTimestamp: "2026-03-01T10:30:00Z",
    status: "Pending Review",
  },
  {
    applicationID: "APP-20260304-D3E4F",
    positionApplied: "Driving Instructor",
    requiresLicenseFlag: true,
    applicantName: "Sarah Chen",
    applicantEmail: "sarah.c@email.com",
    applicantPhone: "250-555-1002",
    yearsOfExperience: "8",
    submissionTimestamp: "2026-03-02T14:15:00Z",
    status: "Shortlisted",
  },
  {
    applicationID: "APP-20260304-G5H6I",
    positionApplied: "Office Administrator",
    requiresLicenseFlag: false,
    applicantName: "Priya Patel",
    applicantEmail: "priya.p@email.com",
    applicantPhone: "250-555-1003",
    yearsOfExperience: "3",
    submissionTimestamp: "2026-03-03T09:00:00Z",
    status: "Reviewed",
  },
];

const HiringDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");
  const [licenseFilter, setLicenseFilter] = useState<"All" | "Yes" | "No">("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [experienceMin, setExperienceMin] = useState("");

  const [applications, setApplications] = useState<EmployeeApplicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showingDemoData, setShowingDemoData] = useState(false);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    setShowingDemoData(false);

    try {
      const data = await fetchEmployeeApplications();
      setApplications(data);
    } catch (error) {
      console.error("Hiring dashboard load failed:", error);
      setApplications(demoApplications);
      setShowingDemoData(true);
      setLoadError("Could not load live applications from Supabase. Showing demo records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const positionOptions = useMemo(() => {
    const set = new Set(applications.map((a) => a.positionApplied));
    return Array.from(set).sort();
  }, [applications]);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (positionFilter !== "All" && a.positionApplied !== positionFilter) return false;
      if (licenseFilter !== "All") {
        const wantsLicense = licenseFilter === "Yes";
        if (a.requiresLicenseFlag !== wantsLicense) return false;
      }
      if (statusFilter !== "All" && a.status !== statusFilter) return false;

      const minExp = Number(experienceMin);
      const appExp = Number(a.yearsOfExperience);
      if (experienceMin && Number.isFinite(minExp) && Number.isFinite(appExp) && appExp < minExp) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.applicantName.toLowerCase().includes(q) ||
          a.applicantEmail.toLowerCase().includes(q) ||
          a.applicationID.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [applications, positionFilter, licenseFilter, statusFilter, experienceMin, searchQuery]);

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "Pending Review").length;
    const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
    const positions = new Set(applications.map((a) => a.positionApplied)).size;
    return { total, pending, shortlisted, positions };
  }, [applications]);

  return (
    <main className="min-h-screen bg-[#F2F2F2] text-[#202121]">
      <PageNameSection
        eyebrow="Admin"
        title={<span className="text-[#F5C518]">Hiring Dashboard</span>}
        titleClassName="text-[#F5C518]"
        description="Review and manage employee applications."
        backgroundImage="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=2200&q=80"
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {loadError ? (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle size={16} />
            <span>{loadError}</span>
            <button
              type="button"
              onClick={() => void loadApplications()}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-amber-400 px-3 py-1 font-semibold transition-colors hover:bg-amber-100"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        ) : null}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Applications",
              value: stats.total,
              icon: FileText,
              color: "text-[#1d52a1]",
              bg: "bg-[#1d52a1]/10",
            },
            {
              label: "Pending Review",
              value: stats.pending,
              icon: Clock,
              color: "text-amber-600",
              bg: "bg-amber-100",
            },
            {
              label: "Shortlisted",
              value: stats.shortlisted,
              icon: CheckCircle2,
              color: "text-green-600",
              bg: "bg-green-100",
            },
            {
              label: "Open Positions",
              value: stats.positions,
              icon: Briefcase,
              color: "text-[#E6242A]",
              bg: "bg-red-100",
            },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                <s.icon size={22} />
              </span>
              <div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Filter size={16} className="text-[#1d52a1]" />
            <span className="text-sm font-black uppercase tracking-wide text-[#1d52a1]">Filters</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-[#1d52a1] focus:ring-2 focus:ring-[#1d52a1]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#1d52a1]"
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
            >
              <option value="All">All Positions</option>
              {positionOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#1d52a1]"
              value={licenseFilter}
              onChange={(e) => setLicenseFilter(e.target.value as "All" | "Yes" | "No")}
            >
              <option value="All">Licence: All</option>
              <option value="Yes">Licence Required</option>
              <option value="No">No Licence</option>
            </select>

            <select
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#1d52a1]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-600">Min Experience (years):</label>
            <input
              type="number"
              min="0"
              className="w-20 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#1d52a1]"
              value={experienceMin}
              onChange={(e) => setExperienceMin(e.target.value)}
              placeholder="0"
            />
            {(positionFilter !== "All" || licenseFilter !== "All" || statusFilter !== "All" || experienceMin || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setPositionFilter("All");
                  setLicenseFilter("All");
                  setStatusFilter("All");
                  setExperienceMin("");
                }}
                className="ml-auto text-xs font-semibold text-[#E6242A] hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            Showing <strong className="text-slate-700">{filtered.length}</strong> of{" "}
            <strong className="text-slate-700">{applications.length}</strong> applications
          </p>
          {showingDemoData ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Demo data</span> : null}
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-lg font-bold text-slate-500">Loading applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <AlertCircle size={40} className="mx-auto text-slate-300" />
            <p className="mt-4 text-lg font-bold text-slate-500">No applications match your filters</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => {
              const StatusIcon = statusIcons[app.status];
              return (
                <div
                  key={app.applicationID}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1d52a1]/10 text-lg font-bold text-[#1d52a1]">
                        {app.applicantName.charAt(0)}
                      </span>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{app.applicantName}</h3>
                        <p className="text-sm text-slate-500">{app.applicantEmail}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{app.applicantPhone}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusColors[app.status]}`}
                    >
                      <StatusIcon size={12} />
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Briefcase size={12} className="text-[#1d52a1]" />
                      {app.positionApplied}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <ShieldCheck
                        size={12}
                        className={app.requiresLicenseFlag ? "text-[#E6242A]" : "text-green-500"}
                      />
                      {app.requiresLicenseFlag ? "Licence Required" : "No Licence"}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Users size={12} className="text-[#1d52a1]" />
                      {app.yearsOfExperience} yrs experience
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock size={12} />
                      {new Date(app.submissionTimestamp).toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="ml-auto font-mono text-[11px] text-slate-400">{app.applicationID}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
};

export default HiringDashboard;
