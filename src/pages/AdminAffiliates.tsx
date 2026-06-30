import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Plus, ShieldCheck, SquarePen, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";
import AffiliateMetricCard from "@/components/affiliate/AffiliateMetricCard";
import AffiliateStatusBadge from "@/components/affiliate/AffiliateStatusBadge";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminPortalShell from "@/components/admin/AdminPortalShell";
import AdminRecordDialog, { type AdminRecordDialogField } from "@/components/admin/AdminRecordDialog";
import { affiliateSurfaceClassName } from "@/components/affiliate/styles";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  type AdminFormValues,
  normalizeNumber,
  normalizeRequiredString,
  toDateTimeInputValue,
  toIsoDateTimeValue,
} from "@/lib/adminCrud";
import { deleteAdminAffiliate, saveAdminAffiliate } from "@/lib/adminCrudApi";
import { getAdminAffiliates, updateAffiliateStatus } from "@/lib/affiliateApi";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, matchesSearch, paginateItems } from "@/lib/adminPanel";
import { downloadCsv } from "@/lib/exportCsv";
import { formatAffiliateCurrency, payoutMethodLabels } from "@/lib/affiliateProgram";
import type { AffiliateStatus, PreferredPayoutMethod } from "@/lib/affiliateTypes";

const createEmptyAffiliateValues = (): AdminFormValues => ({
  authUserId: "",
  affiliateCode: "",
  name: "",
  email: "",
  phone: "",
  age: "",
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  guardianConsent: false,
  socialMediaLink: "",
  preferredPayoutMethod: "bank_transfer",
  status: "pending",
  commissionRate: "0.05",
  cookieDurationDays: "30",
  notes: "",
  createdAt: "",
  approvedAt: "",
  blockedAt: "",
});

type AffiliateEditorState = {
  id?: string;
  values: AdminFormValues;
};

const AdminAffiliates = () => {
  const queryClient = useQueryClient();
  const affiliatesQuery = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: getAdminAffiliates,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AffiliateStatus>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<AffiliateEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fields: AdminRecordDialogField[] = [
    { key: "authUserId", label: "Auth user ID", type: "text", placeholder: "Existing Supabase Auth UUID" },
    { key: "affiliateCode", label: "Affiliate code", type: "text", placeholder: "Leave blank to auto-generate" },
    { key: "name", label: "Full name", type: "text", placeholder: "Affiliate name" },
    { key: "email", label: "Email", type: "email", placeholder: "affiliate@example.com" },
    { key: "phone", label: "Phone", type: "text", placeholder: "+1 555 123 4567" },
    { key: "age", label: "Age", type: "number", min: 13, max: 100, step: "1", description: "Required for new affiliate records." },
    { key: "guardianName", label: "Guardian name", type: "text", placeholder: "Required if affiliate is under 18" },
    { key: "guardianEmail", label: "Guardian email", type: "email", placeholder: "guardian@example.com" },
    { key: "guardianPhone", label: "Guardian phone", type: "text", placeholder: "+1 555 123 4567" },
    { key: "guardianConsent", label: "Guardian consent confirmed", type: "switch", description: "Required when age is under 18." },
    { key: "socialMediaLink", label: "Social media link", type: "text", placeholder: "https://instagram.com/..." },
    {
      key: "preferredPayoutMethod",
      label: "Payout method",
      type: "select",
      options: [
        { label: "Bank transfer", value: "bank_transfer" },
        { label: "PayPal", value: "paypal" },
        { label: "Interac e-Transfer", value: "interac" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Blocked", value: "blocked" },
      ],
    },
    { key: "commissionRate", label: "Commission rate", type: "number", min: 0, max: 1, step: "0.01" },
    { key: "cookieDurationDays", label: "Cookie duration days", type: "number", min: 1, max: 365 },
    { key: "createdAt", label: "Created at", type: "datetime-local" },
    { key: "approvedAt", label: "Approved at", type: "datetime-local" },
    { key: "blockedAt", label: "Blocked at", type: "datetime-local" },
    { key: "notes", label: "Internal notes", type: "textarea", fullWidth: true, rows: 4 },
  ];

  const filteredAffiliates = useMemo(() => {
    const affiliates = affiliatesQuery.data?.affiliates ?? [];

    return affiliates.filter((affiliate) => {
      if (statusFilter !== "all" && affiliate.status !== statusFilter) return false;
      if (!matchesSearch(search, [affiliate.affiliateId, affiliate.name, affiliate.email, affiliate.phone])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(affiliate.createdAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [affiliatesQuery.data?.affiliates, dateFrom, dateTo, search, statusFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredAffiliates, page, ADMIN_ROWS_PER_PAGE),
    [filteredAffiliates, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => setEditorState({ values: createEmptyAffiliateValues() });

  const openEdit = (affiliate: NonNullable<typeof affiliatesQuery.data>["affiliates"][number]) => {
    setEditorState({
      id: affiliate.id,
      values: {
        authUserId: affiliate.authUserId ?? "",
        affiliateCode: affiliate.affiliateId,
        name: affiliate.name,
        email: affiliate.email,
        phone: affiliate.phone ?? "",
        age: affiliate.age?.toString() ?? "",
        guardianName: affiliate.guardianName ?? "",
        guardianEmail: affiliate.guardianEmail ?? "",
        guardianPhone: affiliate.guardianPhone ?? "",
        guardianConsent: affiliate.guardianConsent,
        socialMediaLink: affiliate.socialMediaLink ?? "",
        preferredPayoutMethod: affiliate.preferredPayoutMethod,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate.toString(),
        cookieDurationDays: affiliate.cookieDurationDays.toString(),
        notes: affiliate.notes ?? "",
        createdAt: toDateTimeInputValue(affiliate.createdAt),
        approvedAt: toDateTimeInputValue(affiliate.approvedAt),
        blockedAt: toDateTimeInputValue(affiliate.blockedAt),
      },
    });
  };

  const handleStatusUpdate = async (affiliateId: string, status: "approved" | "blocked") => {
    try {
      await updateAffiliateStatus({ affiliateId, status });
      toast.success(`Affiliate ${status}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update affiliate.");
    }
  };

  const handleSave = async () => {
    if (!editorState) return;
    setIsSaving(true);
    try {
      await saveAdminAffiliate({
        id: editorState.id,
        authUserId: String(editorState.values.authUserId ?? ""),
        affiliateCode: String(editorState.values.affiliateCode ?? ""),
        name: normalizeRequiredString(String(editorState.values.name ?? ""), "Name"),
        email: normalizeRequiredString(String(editorState.values.email ?? ""), "Email"),
        phone: String(editorState.values.phone ?? ""),
        age: String(editorState.values.age ?? "").trim().length > 0
          ? normalizeNumber(String(editorState.values.age ?? ""), "Age")
          : null,
        guardianName: String(editorState.values.guardianName ?? ""),
        guardianEmail: String(editorState.values.guardianEmail ?? ""),
        guardianPhone: String(editorState.values.guardianPhone ?? ""),
        guardianConsent: Boolean(editorState.values.guardianConsent),
        socialMediaLink: String(editorState.values.socialMediaLink ?? ""),
        preferredPayoutMethod: editorState.values.preferredPayoutMethod as PreferredPayoutMethod,
        status: editorState.values.status as AffiliateStatus,
        commissionRate: normalizeNumber(String(editorState.values.commissionRate ?? "0.05"), "Commission rate"),
        cookieDurationDays: normalizeNumber(String(editorState.values.cookieDurationDays ?? "30"), "Cookie duration days"),
        notes: String(editorState.values.notes ?? ""),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
        approvedAt: toIsoDateTimeValue(String(editorState.values.approvedAt ?? "")),
        blockedAt: toIsoDateTimeValue(String(editorState.values.blockedAt ?? "")),
      });
      toast.success(editorState.id ? "Affiliate updated." : "Affiliate created.");
      setEditorState(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save affiliate changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAdminAffiliate(deleteTarget.id);
      toast.success("Affiliate deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-affiliates"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-referrals"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete affiliate.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Affiliate Management"
      title={
        <>
          Manage every <span className="text-[#F5B13A]">affiliate account</span>
        </>
      }
      description="Approve new partners, block risky accounts, adjust payout settings, and edit profile details while keeping Auth and affiliate records in sync."
      pageTitle="Affiliates"
      pageDescription="This page extends the existing affiliate admin flow with full search, filtering, pagination, and profile editing against the persisted affiliates table."
    >
      {affiliatesQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading admin affiliates...</div>
      ) : affiliatesQuery.isError || !affiliatesQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {affiliatesQuery.error instanceof Error ? affiliatesQuery.error.message : "Unable to load affiliate records."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AffiliateMetricCard label="Total affiliates" value={affiliatesQuery.data.totals.totalAffiliates.toString()} />
            <AffiliateMetricCard label="Approved" value={affiliatesQuery.data.totals.approvedAffiliates.toString()} />
            <AffiliateMetricCard label="Pending" value={affiliatesQuery.data.totals.pendingAffiliates.toString()} />
            <AffiliateMetricCard label="Blocked" value={affiliatesQuery.data.totals.blockedAffiliates.toString()} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:flex-1">
                <Input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Search affiliate, email, code..."
                  className="h-12 rounded-xl border-slate-200"
                />
                <Select value={statusFilter} onValueChange={(value: "all" | AffiliateStatus) => { setStatusFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
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
                  Add affiliate
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      "affiliate-roster.csv",
                      filteredAffiliates.map((affiliate) => ({
                        affiliate_id: affiliate.affiliateId,
                        name: affiliate.name,
                        email: affiliate.email,
                        status: affiliate.status,
                        total_clicks: affiliate.totalClicks,
                        total_purchases: affiliate.totalPurchases,
                        total_revenue: affiliate.totalRevenue,
                        total_commission: affiliate.totalCommission,
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
                    <TableHead>Status</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Payout due</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{affiliate.name}</p>
                          <p className="text-xs text-slate-500">{affiliate.affiliateId} · {affiliate.email}</p>
                          <p className="text-xs text-slate-500">{payoutMethodLabels[affiliate.preferredPayoutMethod]}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AffiliateStatusBadge type="affiliate" value={affiliate.status} />
                      </TableCell>
                      <TableCell>{affiliate.totalClicks}</TableCell>
                      <TableCell>{formatAffiliateCurrency(affiliate.totalRevenue)}</TableCell>
                      <TableCell>{formatAffiliateCurrency(affiliate.totalCommission)}</TableCell>
                      <TableCell>{formatAffiliateCurrency(affiliate.pendingPayout)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(affiliate)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <SquarePen className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleStatusUpdate(affiliate.id, "approved")}
                            className="inline-flex items-center gap-1 rounded-full bg-[#1d52a1] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#17488d]"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleStatusUpdate(affiliate.id, "blocked")}
                            className="inline-flex items-center gap-1 rounded-full bg-[#E6242A] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#C41E23]"
                          >
                            <UserX className="h-3.5 w-3.5" />
                            Block
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: affiliate.id, label: affiliate.name })}
                            className="inline-flex items-center gap-1 rounded-full border border-[#E6242A] px-3 py-2 text-xs font-bold text-[#E6242A] transition-colors hover:bg-[#E6242A] hover:text-white"
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
              <p>Showing {paginated.items.length} of {filteredAffiliates.length} filtered affiliates.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit affiliate" : "Add affiliate"}
            description="Create a manual affiliate record or update the current affiliate profile directly from the admin panel."
            fields={fields}
            values={editorState?.values ?? createEmptyAffiliateValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.id ? "Save changes" : "Create affiliate"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete affiliate"
            description={`Delete ${deleteTarget?.label ?? "this affiliate"} from the admin panel. Related referral, commission, and payout records may cascade.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminAffiliates;
