import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Plus, RotateCcw, SquarePen, Trash2, Wallet, XCircle } from "lucide-react";
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
import { deleteAdminCommission, saveAdminCommission } from "@/lib/adminCrudApi";
import { getAdminAffiliates, getAdminCommissions, getAdminOrders, updateCommissionStatus } from "@/lib/affiliateApi";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, matchesSearch, paginateItems } from "@/lib/adminPanel";
import { downloadCsv } from "@/lib/exportCsv";
import { formatAffiliateCurrency } from "@/lib/affiliateProgram";
import type { CommissionStatus } from "@/lib/affiliateTypes";

const commissionStatusOptions: CommissionStatus[] = ["pending", "approved", "paid", "reversed", "rejected"];

type CommissionEditorState = {
  id?: string;
  values: AdminFormValues;
};

const createEmptyCommissionValues = (): AdminFormValues => ({
  affiliateRecordId: "",
  orderId: "",
  purchaseAmount: "0",
  commissionRate: "0.05",
  commissionAmount: "0",
  status: "pending",
  reversalReason: "",
  createdAt: "",
  approvedAt: "",
  paidAt: "",
  reversedAt: "",
});

const AdminCommissions = () => {
  const queryClient = useQueryClient();
  const commissionsQuery = useQuery({
    queryKey: ["admin-commissions"],
    queryFn: getAdminCommissions,
  });
  const affiliatesQuery = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: getAdminAffiliates,
  });
  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CommissionStatus>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<CommissionEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const affiliateOptions = (affiliatesQuery.data?.affiliates ?? []).map((affiliate) => ({
    value: affiliate.id,
    label: `${affiliate.name} (${affiliate.affiliateId})`,
  }));
  const orderOptions = (ordersQuery.data?.orders ?? []).map((order) => ({
    value: order.id,
    label: `${order.externalOrderId ?? order.id.slice(0, 8).toUpperCase()} - ${order.packageName}`,
  }));

  const fields: AdminRecordDialogField[] = [
    { key: "affiliateRecordId", label: "Affiliate", type: "select", options: affiliateOptions },
    { key: "orderId", label: "Order", type: "select", options: orderOptions },
    { key: "purchaseAmount", label: "Purchase amount", type: "number", min: 0, step: "0.01" },
    { key: "commissionRate", label: "Commission rate", type: "number", min: 0, max: 1, step: "0.01" },
    { key: "commissionAmount", label: "Commission amount", type: "number", min: 0, step: "0.01" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: commissionStatusOptions.map((entry) => ({ label: entry, value: entry })),
    },
    { key: "createdAt", label: "Created at", type: "datetime-local" },
    { key: "approvedAt", label: "Approved at", type: "datetime-local" },
    { key: "paidAt", label: "Paid at", type: "datetime-local" },
    { key: "reversedAt", label: "Reversed at", type: "datetime-local" },
    { key: "reversalReason", label: "Reversal reason", type: "textarea", fullWidth: true, rows: 4 },
  ];

  const filteredCommissions = useMemo(() => {
    const commissions = commissionsQuery.data?.commissions ?? [];

    return commissions.filter((commission) => {
      if (statusFilter !== "all" && commission.status !== statusFilter) return false;
      if (!matchesSearch(search, [commission.affiliateId, commission.affiliateName, commission.orderReference, commission.reversalReason])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(commission.createdAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [commissionsQuery.data?.commissions, dateFrom, dateTo, search, statusFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredCommissions, page, ADMIN_ROWS_PER_PAGE),
    [filteredCommissions, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => setEditorState({ values: createEmptyCommissionValues() });

  const openEdit = (commission: NonNullable<typeof commissionsQuery.data>["commissions"][number]) => {
    setEditorState({
      id: commission.id,
      values: {
        affiliateRecordId: commission.affiliateRecordId,
        orderId: commission.orderId,
        purchaseAmount: commission.purchaseAmount.toString(),
        commissionRate: commission.commissionRate.toString(),
        commissionAmount: commission.commissionAmount.toString(),
        status: commission.status,
        reversalReason: commission.reversalReason ?? "",
        createdAt: toDateTimeInputValue(commission.createdAt),
        approvedAt: toDateTimeInputValue(commission.approvedAt),
        paidAt: toDateTimeInputValue(commission.paidAt),
        reversedAt: toDateTimeInputValue(commission.reversedAt),
      },
    });
  };

  const mutateStatus = async (commissionId: string, status: Extract<CommissionStatus, "approved" | "paid" | "reversed" | "rejected">) => {
    try {
      await updateCommissionStatus({
        commissionId,
        status,
        reversalReason: status === "reversed" ? "Reversed by admin review." : status === "rejected" ? "Rejected by admin review." : undefined,
      });
      toast.success(`Commission ${status}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update commission.");
    }
  };

  const handleSave = async () => {
    if (!editorState) return;
    setIsSaving(true);
    try {
      await saveAdminCommission({
        id: editorState.id,
        affiliateRecordId: normalizeRequiredString(String(editorState.values.affiliateRecordId ?? ""), "Affiliate"),
        orderId: normalizeRequiredString(String(editorState.values.orderId ?? ""), "Order"),
        purchaseAmount: normalizeNumber(String(editorState.values.purchaseAmount ?? "0"), "Purchase amount"),
        commissionRate: normalizeNumber(String(editorState.values.commissionRate ?? "0.05"), "Commission rate"),
        commissionAmount: normalizeNumber(String(editorState.values.commissionAmount ?? "0"), "Commission amount"),
        status: editorState.values.status as CommissionStatus,
        reversalReason: String(editorState.values.reversalReason ?? ""),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
        approvedAt: toIsoDateTimeValue(String(editorState.values.approvedAt ?? "")),
        paidAt: toIsoDateTimeValue(String(editorState.values.paidAt ?? "")),
        reversedAt: toIsoDateTimeValue(String(editorState.values.reversedAt ?? "")),
      });
      toast.success(editorState.id ? "Commission updated." : "Commission created.");
      setEditorState(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save commission.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAdminCommission(deleteTarget.id);
      toast.success("Commission deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete commission.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Commission Control"
      title={
        <>
          Manage the <span className="text-[#F5B13A]">commission lifecycle</span>
        </>
      }
      description="Approve, reject, reverse, and settle affiliate commission records while keeping the existing order-linked payout flow intact."
      pageTitle="Commissions"
      pageDescription="Search and page through the full commission ledger, then apply approval-state changes using the existing Supabase admin edge route."
    >
      {commissionsQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading commissions...</div>
      ) : commissionsQuery.isError || !commissionsQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {commissionsQuery.error instanceof Error ? commissionsQuery.error.message : "Unable to load commissions."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AffiliateMetricCard label="Pending" value={commissionsQuery.data.totals.pending.toString()} icon={<Wallet className="h-5 w-5" />} />
            <AffiliateMetricCard label="Approved" value={commissionsQuery.data.totals.approved.toString()} />
            <AffiliateMetricCard label="Paid" value={commissionsQuery.data.totals.paid.toString()} />
            <AffiliateMetricCard label="Reversed" value={commissionsQuery.data.totals.reversed.toString()} icon={<RotateCcw className="h-5 w-5" />} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:flex-1">
                <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search affiliate or order..." className="h-12 rounded-xl border-slate-200" />
                <Select value={statusFilter} onValueChange={(value: "all" | CommissionStatus) => { setStatusFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {commissionStatusOptions.map((entry) => (
                      <SelectItem key={entry} value={entry}>{entry}</SelectItem>
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
                  Add commission
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      "affiliate-commissions.csv",
                      filteredCommissions.map((commission) => ({
                        affiliate_id: commission.affiliateId,
                        affiliate_name: commission.affiliateName,
                        order_reference: commission.orderReference,
                        purchase_amount: commission.purchaseAmount,
                        commission_amount: commission.commissionAmount,
                        status: commission.status,
                        created_at: commission.createdAt,
                        reversal_reason: commission.reversalReason,
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
                    <TableHead>Order</TableHead>
                    <TableHead>Purchase</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{commission.affiliateName}</p>
                          <p className="text-xs text-slate-500">{commission.affiliateId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{commission.orderReference ?? commission.orderId.slice(0, 8).toUpperCase()}</TableCell>
                      <TableCell>{formatAffiliateCurrency(commission.purchaseAmount)}</TableCell>
                      <TableCell>{formatAffiliateCurrency(commission.commissionAmount)}</TableCell>
                      <TableCell>
                        <AffiliateStatusBadge type="commission" value={commission.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => void mutateStatus(commission.id, "approved")} className="rounded-full bg-[#1d52a1] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#17488d]">Approve</button>
                          <button type="button" onClick={() => void mutateStatus(commission.id, "paid")} className="rounded-full bg-slate-800 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-900">Mark paid</button>
                          <button type="button" onClick={() => void mutateStatus(commission.id, "reversed")} className="rounded-full bg-[#E6242A] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#C41E23]">Reverse</button>
                          <button type="button" onClick={() => void mutateStatus(commission.id, "rejected")} className="rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100">
                            <span className="inline-flex items-center gap-1"><XCircle className="h-3.5 w-3.5" />Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(commission)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <SquarePen className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: commission.id, label: commission.orderReference ?? commission.id })}
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
              <p>Showing {paginated.items.length} of {filteredCommissions.length} filtered commission records.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit commission" : "Add commission"}
            description="Create, edit, or correct commission records directly from the admin panel."
            fields={fields}
            values={editorState?.values ?? createEmptyCommissionValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.id ? "Save changes" : "Create commission"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete commission"
            description={`Delete ${deleteTarget?.label ?? "this commission"} from the admin panel. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminCommissions;
