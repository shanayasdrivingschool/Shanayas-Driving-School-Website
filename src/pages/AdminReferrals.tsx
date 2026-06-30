import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Plus, ShieldAlert, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AffiliateMetricCard from "@/components/affiliate/AffiliateMetricCard";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminPortalShell from "@/components/admin/AdminPortalShell";
import AdminRecordDialog, { type AdminRecordDialogField } from "@/components/admin/AdminRecordDialog";
import { affiliateSurfaceClassName } from "@/components/affiliate/styles";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type AdminFormValues, normalizeRequiredString, toDateTimeInputValue, toIsoDateTimeValue } from "@/lib/adminCrud";
import { deleteAdminReferral, saveAdminReferral } from "@/lib/adminCrudApi";
import { getAdminAffiliates, getAdminReferrals } from "@/lib/affiliateApi";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, matchesSearch, paginateItems } from "@/lib/adminPanel";
import { downloadCsv } from "@/lib/exportCsv";

type ReferralEditorState = {
  id?: string;
  values: AdminFormValues;
};

const emptyReferralValues = (): AdminFormValues => ({
  affiliateRecordId: "",
  referralCode: "",
  landingPath: "/",
  ipAddress: "",
  userAgent: "",
  fingerprintHash: "",
  isSuspicious: false,
  suspicionReason: "",
  createdAt: "",
});

const AdminReferrals = () => {
  const queryClient = useQueryClient();
  const referralsQuery = useQuery({
    queryKey: ["admin-referrals"],
    queryFn: getAdminReferrals,
  });
  const affiliatesQuery = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: getAdminAffiliates,
  });
  const [search, setSearch] = useState("");
  const [suspicionFilter, setSuspicionFilter] = useState<"all" | "flagged" | "clean">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<ReferralEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const affiliateOptions = (affiliatesQuery.data?.affiliates ?? []).map((affiliate) => ({
    value: affiliate.id,
    label: `${affiliate.name} (${affiliate.affiliateId})`,
  }));

  const fields: AdminRecordDialogField[] = [
    {
      key: "affiliateRecordId",
      label: "Affiliate",
      type: "select",
      options: affiliateOptions,
      description: "Linked affiliate for this referral click.",
    },
    { key: "referralCode", label: "Referral code", type: "text", placeholder: "AFF1023" },
    { key: "landingPath", label: "Landing path", type: "text", placeholder: "/packages" },
    { key: "ipAddress", label: "IP address", type: "text", placeholder: "203.0.113.10" },
    { key: "fingerprintHash", label: "Fingerprint hash", type: "text", placeholder: "visitor fingerprint" },
    { key: "createdAt", label: "Created at", type: "datetime-local" },
    { key: "userAgent", label: "User agent", type: "textarea", fullWidth: true, rows: 4 },
    { key: "isSuspicious", label: "Suspicious click", type: "switch", description: "Flag this click as suspicious." },
    { key: "suspicionReason", label: "Suspicion reason", type: "text", placeholder: "rate_limit_exceeded", fullWidth: true },
  ];

  const filteredReferrals = useMemo(() => {
    const referrals = referralsQuery.data?.referrals ?? [];

    return referrals.filter((referral) => {
      if (suspicionFilter === "flagged" && !referral.isSuspicious) return false;
      if (suspicionFilter === "clean" && referral.isSuspicious) return false;
      if (!matchesSearch(search, [referral.affiliateId, referral.affiliateName, referral.landingPath, referral.ipAddress, referral.suspicionReason])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(referral.createdAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [dateFrom, dateTo, referralsQuery.data?.referrals, search, suspicionFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredReferrals, page, ADMIN_ROWS_PER_PAGE),
    [filteredReferrals, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => {
    setEditorState({ values: emptyReferralValues() });
  };

  const openEdit = (referral: NonNullable<typeof referralsQuery.data>["referrals"][number]) => {
    setEditorState({
      id: referral.id,
      values: {
        affiliateRecordId: referral.affiliateRecordId ?? "",
        referralCode: referral.referralCode ?? "",
        landingPath: referral.landingPath,
        ipAddress: referral.ipAddress ?? "",
        userAgent: referral.userAgent ?? "",
        fingerprintHash: referral.fingerprintHash ?? "",
        isSuspicious: referral.isSuspicious,
        suspicionReason: referral.suspicionReason ?? "",
        createdAt: toDateTimeInputValue(referral.createdAt),
      },
    });
  };

  const handleSave = async () => {
    if (!editorState) return;
    setIsSaving(true);
    try {
      await saveAdminReferral({
        id: editorState.id,
        affiliateRecordId: normalizeRequiredString(String(editorState.values.affiliateRecordId ?? ""), "Affiliate"),
        referralCode: normalizeRequiredString(String(editorState.values.referralCode ?? ""), "Referral code"),
        landingPath: normalizeRequiredString(String(editorState.values.landingPath ?? ""), "Landing path"),
        ipAddress: String(editorState.values.ipAddress ?? ""),
        userAgent: String(editorState.values.userAgent ?? ""),
        fingerprintHash: String(editorState.values.fingerprintHash ?? ""),
        isSuspicious: Boolean(editorState.values.isSuspicious),
        suspicionReason: String(editorState.values.suspicionReason ?? ""),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
      });
      toast.success(editorState.id ? "Referral updated." : "Referral created.");
      setEditorState(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-referrals"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save referral.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAdminReferral(deleteTarget.id);
      toast.success("Referral deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-referrals"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete referral.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Referral Intelligence"
      title={
        <>
          Inspect referral <span className="text-[#F5B13A]">click history</span>
        </>
      }
      description="Review raw attribution traffic, isolate suspicious click bursts, and inspect IP and fingerprint patterns from the existing affiliate click table."
      pageTitle="Referrals"
      pageDescription="This view replaces the lightweight referral log with searchable, paginated click monitoring while keeping the same visual language as the rest of the site."
    >
      {referralsQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading referral clicks...</div>
      ) : referralsQuery.isError || !referralsQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {referralsQuery.error instanceof Error ? referralsQuery.error.message : "Unable to load referral clicks."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            <AffiliateMetricCard label="Total clicks" value={referralsQuery.data.totalClicks.toString()} />
            <AffiliateMetricCard label="Suspicious clicks" value={referralsQuery.data.suspiciousCount.toString()} icon={<ShieldAlert className="h-5 w-5" />} />
            <AffiliateMetricCard label="Healthy traffic" value={`${Math.max(referralsQuery.data.totalClicks - referralsQuery.data.suspiciousCount, 0)}`} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:flex-1">
                <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search affiliate, IP, landing path..." className="h-12 rounded-xl border-slate-200" />
                <Select value={suspicionFilter} onValueChange={(value: "all" | "flagged" | "clean") => { setSuspicionFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Suspicion filter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All clicks</SelectItem>
                    <SelectItem value="flagged">Flagged only</SelectItem>
                    <SelectItem value="clean">Clean only</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} className="h-12 rounded-xl border-slate-200" />
                <Input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} className="h-12 rounded-xl border-slate-200" />
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                >
                  <Plus className="h-4 w-4" />
                  Add referral
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      "affiliate-referrals.csv",
                      filteredReferrals.map((referral) => ({
                        affiliate_id: referral.affiliateId,
                        affiliate_name: referral.affiliateName,
                        referral_code: referral.referralCode,
                        landing_path: referral.landingPath,
                        ip_address: referral.ipAddress,
                        fingerprint_hash: referral.fingerprintHash,
                        suspicious: referral.isSuspicious,
                        suspicion_reason: referral.suspicionReason,
                        created_at: referral.createdAt,
                      })),
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Landing path</TableHead>
                    <TableHead>IP address</TableHead>
                    <TableHead>Suspicion</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{referral.affiliateName}</p>
                          <p className="text-xs text-slate-500">{referral.affiliateId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{referral.landingPath}</TableCell>
                      <TableCell>{referral.ipAddress ?? "Unknown"}</TableCell>
                      <TableCell>
                        {referral.isSuspicious ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6242A]/10 px-3 py-1 text-xs font-bold text-[#B91C1C]">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            {referral.suspicionReason ?? "Flagged"}
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#1d52a1]/10 px-3 py-1 text-xs font-bold text-[#1d52a1]">Clean</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(referral.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(referral)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <SquarePen className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: referral.id, label: referral.referralCode ?? referral.id })}
                            className="inline-flex items-center gap-1 rounded-full bg-[#E6242A] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#C41E23]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
              <p>Showing {paginated.items.length} of {filteredReferrals.length} filtered referral clicks.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit referral" : "Add referral"}
            description="Create, inspect, or modify affiliate referral click records inside the admin panel."
            fields={fields}
            values={editorState?.values ?? emptyReferralValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.id ? "Save changes" : "Create referral"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete referral"
            description={`Delete ${deleteTarget?.label ?? "this referral"} from the admin panel. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminReferrals;
