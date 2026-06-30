import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Plus, SquarePen, Trash2, Wallet } from "lucide-react";
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
  formatJsonInput,
  type AdminFormValues,
  normalizeNumber,
  normalizeRequiredString,
  parseStringArrayJsonInput,
  toDateTimeInputValue,
  toIsoDateTimeValue,
} from "@/lib/adminCrud";
import { deleteAdminPayout, saveAdminPayout } from "@/lib/adminCrudApi";
import { getAdminAffiliates, getAdminPayouts, submitPayoutAction } from "@/lib/affiliateApi";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, matchesSearch, paginateItems } from "@/lib/adminPanel";
import { downloadCsv } from "@/lib/exportCsv";
import { formatAffiliateCurrency, payoutMethodLabels } from "@/lib/affiliateProgram";
import type { PayoutStatus, PreferredPayoutMethod } from "@/lib/affiliateTypes";

const payoutStatusOptions: Array<"all" | PayoutStatus> = ["all", "pending", "approved", "paid", "failed", "cancelled"];

type PayoutEditorState = {
  id?: string;
  values: AdminFormValues;
};

const createEmptyPayoutValues = (): AdminFormValues => ({
  affiliateRecordId: "",
  amount: "0",
  paymentMethod: "bank_transfer",
  paymentStatus: "pending",
  commissionIds: formatJsonInput([], "array"),
  notes: "",
  requestedAt: "",
  approvedAt: "",
  paidAt: "",
  createdAt: "",
});

const AdminPayouts = () => {
  const queryClient = useQueryClient();
  const payoutsQuery = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: getAdminPayouts,
  });
  const affiliatesQuery = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: getAdminAffiliates,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PayoutStatus>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<PayoutEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const affiliateOptions = (affiliatesQuery.data?.affiliates ?? []).map((affiliate) => ({
    value: affiliate.id,
    label: `${affiliate.name} (${affiliate.affiliateId})`,
  }));

  const fields: AdminRecordDialogField[] = [
    { key: "affiliateRecordId", label: "Affiliate", type: "select", options: affiliateOptions },
    { key: "amount", label: "Amount", type: "number", min: 0, step: "0.01" },
    {
      key: "paymentMethod",
      label: "Payment method",
      type: "select",
      options: [
        { label: "Bank transfer", value: "bank_transfer" },
        { label: "PayPal", value: "paypal" },
        { label: "Interac e-Transfer", value: "interac" },
      ],
    },
    {
      key: "paymentStatus",
      label: "Payment status",
      type: "select",
      options: payoutStatusOptions
        .filter((entry): entry is PayoutStatus => entry !== "all")
        .map((entry) => ({ label: entry, value: entry })),
    },
    { key: "requestedAt", label: "Requested at", type: "datetime-local" },
    { key: "approvedAt", label: "Approved at", type: "datetime-local" },
    { key: "paidAt", label: "Paid at", type: "datetime-local" },
    { key: "createdAt", label: "Created at", type: "datetime-local" },
    { key: "commissionIds", label: "Commission IDs JSON", type: "json", fullWidth: true },
    { key: "notes", label: "Internal notes", type: "textarea", fullWidth: true, rows: 4 },
  ];

  const filteredPayouts = useMemo(() => {
    const payouts = payoutsQuery.data?.payouts ?? [];

    return payouts.filter((payout) => {
      if (statusFilter !== "all" && payout.paymentStatus !== statusFilter) return false;
      if (!matchesSearch(search, [payout.affiliateId, payout.affiliateName, payout.notes])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(payout.requestedAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [dateFrom, dateTo, payoutsQuery.data?.payouts, search, statusFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredPayouts, page, ADMIN_ROWS_PER_PAGE),
    [filteredPayouts, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => setEditorState({ values: createEmptyPayoutValues() });

  const openEdit = (payout: NonNullable<typeof payoutsQuery.data>["payouts"][number]) => {
    setEditorState({
      id: payout.id,
      values: {
        affiliateRecordId: payout.affiliateRecordId,
        amount: payout.amount.toString(),
        paymentMethod: payout.paymentMethod,
        paymentStatus: payout.paymentStatus,
        commissionIds: formatJsonInput(payout.commissionIds, "array"),
        notes: payout.notes ?? "",
        requestedAt: toDateTimeInputValue(payout.requestedAt),
        approvedAt: toDateTimeInputValue(payout.approvedAt),
        paidAt: toDateTimeInputValue(payout.paidAt),
        createdAt: toDateTimeInputValue(payout.createdAt),
      },
    });
  };

  const runPayoutAction = async (
    input: { action: "create"; affiliateId: string } | { action: "approve" | "paid" | "cancel"; payoutId: string },
  ) => {
    try {
      await submitPayoutAction(input);
      toast.success("Payout updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update payout.");
    }
  };

  const handleSave = async () => {
    if (!editorState) return;

    setIsSaving(true);
    try {
      await saveAdminPayout({
        id: editorState.id,
        affiliateRecordId: normalizeRequiredString(String(editorState.values.affiliateRecordId ?? ""), "Affiliate"),
        amount: normalizeNumber(String(editorState.values.amount ?? "0"), "Amount"),
        paymentMethod: editorState.values.paymentMethod as PreferredPayoutMethod,
        paymentStatus: editorState.values.paymentStatus as PayoutStatus,
        commissionIds: parseStringArrayJsonInput(String(editorState.values.commissionIds ?? "[]"), "Commission IDs JSON"),
        notes: String(editorState.values.notes ?? ""),
        requestedAt: toIsoDateTimeValue(String(editorState.values.requestedAt ?? "")),
        approvedAt: toIsoDateTimeValue(String(editorState.values.approvedAt ?? "")),
        paidAt: toIsoDateTimeValue(String(editorState.values.paidAt ?? "")),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
      });
      toast.success(editorState.id ? "Payout updated." : "Payout created.");
      setEditorState(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save payout.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminPayout(deleteTarget.id);
      toast.success("Payout deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete payout.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Payout Operations"
      title={
        <>
          Process monthly <span className="text-[#F5B13A]">payout batches</span>
        </>
      }
      description="Create payout batches once commissions are approved, then move them through approval and paid states while keeping linked commissions synchronized."
      pageTitle="Payouts"
      pageDescription="This page upgrades the existing payout tools with full table filtering, pagination, searchable payout history, and direct record management."
    >
      {payoutsQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading payout records...</div>
      ) : payoutsQuery.isError || !payoutsQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {payoutsQuery.error instanceof Error ? payoutsQuery.error.message : "Unable to load payouts."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            <AffiliateMetricCard label="Eligible affiliates" value={payoutsQuery.data.eligibleAffiliates.length.toString()} icon={<Wallet className="h-5 w-5" />} />
            <AffiliateMetricCard label="Open payouts" value={payoutsQuery.data.payouts.filter((item) => item.paymentStatus !== "paid").length.toString()} />
            <AffiliateMetricCard label="Paid batches" value={payoutsQuery.data.payouts.filter((item) => item.paymentStatus === "paid").length.toString()} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Eligible affiliates</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {payoutsQuery.data.eligibleAffiliates.length > 0 ? (
                payoutsQuery.data.eligibleAffiliates.map((candidate) => (
                  <article key={candidate.id} className="rounded-2xl border border-slate-200 bg-[#F2F2F2] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-black text-slate-900">{candidate.affiliateName}</p>
                        <p className="mt-1 text-sm text-slate-600">{candidate.affiliateId}</p>
                        <p className="mt-3 text-sm font-semibold text-[#1d52a1]">{formatAffiliateCurrency(candidate.availableAmount)} available</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{payoutMethodLabels[candidate.payoutMethod]}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void runPayoutAction({ action: "create", affiliateId: candidate.id })}
                        className="rounded-full bg-[#1d52a1] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                      >
                        Create payout
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500">No affiliates have crossed the payout threshold yet.</p>
              )}
            </div>
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:flex-1">
                <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search affiliate or notes..." className="h-12 rounded-xl border-slate-200" />
                <Select value={statusFilter} onValueChange={(value: "all" | PayoutStatus) => { setStatusFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {payoutStatusOptions.map((entry) => (
                      <SelectItem key={entry} value={entry}>{entry === "all" ? "All statuses" : entry}</SelectItem>
                    ))}
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
                  Add payout
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      "affiliate-payouts.csv",
                      filteredPayouts.map((payout) => ({
                        affiliate_id: payout.affiliateId,
                        affiliate_name: payout.affiliateName,
                        amount: payout.amount,
                        payment_method: payout.paymentMethod,
                        payment_status: payout.paymentStatus,
                        requested_at: payout.requestedAt,
                        paid_at: payout.paidAt,
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
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{payout.affiliateName}</p>
                          <p className="text-xs text-slate-500">{payout.affiliateId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatAffiliateCurrency(payout.amount)}</TableCell>
                      <TableCell>{payoutMethodLabels[payout.paymentMethod]}</TableCell>
                      <TableCell>
                        <AffiliateStatusBadge type="payout" value={payout.paymentStatus} />
                      </TableCell>
                      <TableCell>{new Date(payout.requestedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(payout)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <SquarePen className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button type="button" onClick={() => void runPayoutAction({ action: "approve", payoutId: payout.id })} className="rounded-full bg-[#1d52a1] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#17488d]">Approve</button>
                          <button type="button" onClick={() => void runPayoutAction({ action: "paid", payoutId: payout.id })} className="rounded-full bg-slate-800 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-900">Mark paid</button>
                          <button type="button" onClick={() => void runPayoutAction({ action: "cancel", payoutId: payout.id })} className="rounded-full bg-[#E6242A] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#C41E23]">Cancel</button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: payout.id, label: `${payout.affiliateName} ${formatAffiliateCurrency(payout.amount)}` })}
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
              <p>Showing {paginated.items.length} of {filteredPayouts.length} filtered payouts.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit payout" : "Add payout"}
            description="Create, edit, or correct payout records directly from the admin panel."
            fields={fields}
            values={editorState?.values ?? createEmptyPayoutValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.id ? "Save changes" : "Create payout"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete payout"
            description={`Delete ${deleteTarget?.label ?? "this payout"} from the admin panel. Linked commissions will return to the approved state.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminPayouts;
