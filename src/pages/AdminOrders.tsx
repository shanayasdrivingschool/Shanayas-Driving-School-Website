import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AffiliateMetricCard from "@/components/affiliate/AffiliateMetricCard";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
import AdminJsonDialog from "@/components/admin/AdminJsonDialog";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminPortalShell from "@/components/admin/AdminPortalShell";
import AdminRecordDialog, { type AdminRecordDialogField } from "@/components/admin/AdminRecordDialog";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { affiliateSurfaceClassName } from "@/components/affiliate/styles";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  formatJsonInput,
  type AdminFormValues,
  normalizeNumber,
  normalizeRequiredString,
  parseObjectJsonInput,
  parseStringArrayJsonInput,
  toDateTimeInputValue,
  toIsoDateTimeValue,
} from "@/lib/adminCrud";
import { deleteAdminOrder, saveAdminOrder } from "@/lib/adminCrudApi";
import { getAdminAffiliates, getAdminOrders } from "@/lib/affiliateApi";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, matchesSearch, paginateItems, paymentStatusLabels, paymentStatusTone } from "@/lib/adminPanel";
import { formatAffiliateCurrency } from "@/lib/affiliateProgram";
import type { PaymentStatus } from "@/lib/affiliateTypes";

const paymentStatusOptions: PaymentStatus[] = [
  "pending",
  "pending_payment",
  "processing_payment",
  "paid",
  "cancelled",
  "refunded",
  "failed",
];
const NONE_VALUE = "__none";

type OrderEditorState = {
  id?: string;
  values: AdminFormValues;
};

const createEmptyOrderValues = (): AdminFormValues => ({
  externalOrderId: "",
  customerId: "",
  customerEmail: "",
  packageName: "",
  amount: "0",
  paymentStatus: "pending_payment",
  affiliateRecordId: NONE_VALUE,
  affiliateClickId: "",
  referralCode: "",
  customerIp: "",
  customerUserAgent: "",
  fingerprintHash: "",
  isSelfReferral: false,
  isSuspicious: false,
  fraudFlags: formatJsonInput([], "array"),
  metadata: formatJsonInput({}),
  purchasedAt: "",
  createdAt: "",
});

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });
  const affiliatesQuery = useQuery({
    queryKey: ["admin-affiliates"],
    queryFn: getAdminAffiliates,
  });
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"all" | PaymentStatus>("all");
  const [riskFilter, setRiskFilter] = useState<"all" | "flagged" | "clean">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<OrderEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const affiliateOptions = [
    { value: NONE_VALUE, label: "No affiliate" },
    ...(affiliatesQuery.data?.affiliates ?? []).map((affiliate) => ({
      value: affiliate.id,
      label: `${affiliate.name} (${affiliate.affiliateId})`,
    })),
  ];

  const fields: AdminRecordDialogField[] = [
    { key: "externalOrderId", label: "External order ID", type: "text", placeholder: "ORDER-1023" },
    { key: "customerEmail", label: "Customer email", type: "email", placeholder: "customer@example.com" },
    { key: "customerId", label: "Customer ID", type: "text", placeholder: "Auth user UUID" },
    { key: "packageName", label: "Package name", type: "text", placeholder: "Road test package" },
    { key: "amount", label: "Amount", type: "number", min: 0, step: "0.01" },
    {
      key: "paymentStatus",
      label: "Payment status",
      type: "select",
      options: paymentStatusOptions.map((entry) => ({ label: paymentStatusLabels[entry], value: entry })),
    },
    {
      key: "affiliateRecordId",
      label: "Affiliate",
      type: "select",
      options: affiliateOptions,
    },
    { key: "affiliateClickId", label: "Affiliate click ID", type: "text", placeholder: "Linked click UUID" },
    { key: "referralCode", label: "Referral code", type: "text", placeholder: "AFF1023" },
    { key: "customerIp", label: "Customer IP", type: "text", placeholder: "203.0.113.10" },
    { key: "fingerprintHash", label: "Fingerprint hash", type: "text", placeholder: "visitor fingerprint" },
    { key: "purchasedAt", label: "Purchased at", type: "datetime-local" },
    { key: "createdAt", label: "Created at", type: "datetime-local" },
    { key: "isSelfReferral", label: "Self referral", type: "switch" },
    { key: "isSuspicious", label: "Suspicious order", type: "switch" },
    { key: "customerUserAgent", label: "Customer user agent", type: "textarea", rows: 4, fullWidth: true },
    { key: "fraudFlags", label: "Fraud flags JSON", type: "json", fullWidth: true },
    { key: "metadata", label: "Metadata JSON", type: "json", fullWidth: true },
  ];

  const filteredOrders = useMemo(() => {
    const orders = ordersQuery.data?.orders ?? [];

    return orders.filter((order) => {
      if (paymentStatus !== "all" && order.paymentStatus !== paymentStatus) return false;
      if (riskFilter === "flagged" && !order.isSuspicious && !order.isSelfReferral) return false;
      if (riskFilter === "clean" && (order.isSuspicious || order.isSelfReferral)) return false;
      if (!matchesSearch(search, [order.externalOrderId, order.customerEmail, order.packageName, order.referralCode, order.affiliateName])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(order.createdAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [dateFrom, dateTo, ordersQuery.data?.orders, paymentStatus, riskFilter, search]);

  const paginated = useMemo(
    () => paginateItems(filteredOrders, page, ADMIN_ROWS_PER_PAGE),
    [filteredOrders, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => setEditorState({ values: createEmptyOrderValues() });

  const openEdit = (order: NonNullable<typeof ordersQuery.data>["orders"][number]) => {
    setEditorState({
      id: order.id,
      values: {
        externalOrderId: order.externalOrderId ?? "",
        customerId: order.customerId ?? "",
        customerEmail: order.customerEmail ?? "",
        packageName: order.packageName,
        amount: order.amount.toString(),
        paymentStatus: order.paymentStatus,
        affiliateRecordId: order.affiliateRecordId ?? NONE_VALUE,
        affiliateClickId: order.affiliateClickId ?? "",
        referralCode: order.referralCode ?? "",
        customerIp: order.customerIp ?? "",
        customerUserAgent: order.customerUserAgent ?? "",
        fingerprintHash: order.fingerprintHash ?? "",
        isSelfReferral: order.isSelfReferral,
        isSuspicious: order.isSuspicious,
        fraudFlags: formatJsonInput(order.fraudFlags, "array"),
        metadata: formatJsonInput(order.metadata),
        purchasedAt: toDateTimeInputValue(order.purchasedAt),
        createdAt: toDateTimeInputValue(order.createdAt),
      },
    });
  };

  const handleSave = async () => {
    if (!editorState) return;
    setIsSaving(true);
    try {
      await saveAdminOrder({
        id: editorState.id,
        externalOrderId: String(editorState.values.externalOrderId ?? ""),
        customerId: String(editorState.values.customerId ?? ""),
        customerEmail: String(editorState.values.customerEmail ?? ""),
        packageName: normalizeRequiredString(String(editorState.values.packageName ?? ""), "Package name"),
        amount: normalizeNumber(String(editorState.values.amount ?? "0"), "Amount"),
        paymentStatus: editorState.values.paymentStatus as PaymentStatus,
        affiliateRecordId: editorState.values.affiliateRecordId === NONE_VALUE ? null : String(editorState.values.affiliateRecordId ?? ""),
        affiliateClickId: String(editorState.values.affiliateClickId ?? ""),
        referralCode: String(editorState.values.referralCode ?? ""),
        customerIp: String(editorState.values.customerIp ?? ""),
        customerUserAgent: String(editorState.values.customerUserAgent ?? ""),
        fingerprintHash: String(editorState.values.fingerprintHash ?? ""),
        isSelfReferral: Boolean(editorState.values.isSelfReferral),
        isSuspicious: Boolean(editorState.values.isSuspicious),
        fraudFlags: parseStringArrayJsonInput(String(editorState.values.fraudFlags ?? "[]"), "Fraud flags JSON"),
        metadata: parseObjectJsonInput(String(editorState.values.metadata ?? "{}"), "Metadata JSON"),
        purchasedAt: toIsoDateTimeValue(String(editorState.values.purchasedAt ?? "")),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
      });
      toast.success(editorState.id ? "Order updated." : "Order created.");
      setEditorState(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save order.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAdminOrder(deleteTarget.id);
      toast.success("Order deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete order.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Order Monitoring"
      title={
        <>
          Inspect every <span className="text-[#F5B13A]">purchase and fraud signal</span>
        </>
      }
      description="Monitor all persisted orders, filter by payment state, inspect metadata JSON, and isolate suspicious or self-referred purchases quickly."
      pageTitle="Orders"
      pageDescription="This view reads directly from public.orders and surfaces customer, affiliate, metadata, and risk information without changing the schema."
    >
      {ordersQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading orders...</div>
      ) : ordersQuery.isError || !ordersQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {ordersQuery.error instanceof Error ? ordersQuery.error.message : "Unable to load orders."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-7">
            <AffiliateMetricCard label="All orders" value={ordersQuery.data.totals.totalOrders.toString()} />
            <AffiliateMetricCard label="Paid" value={ordersQuery.data.totals.paid.toString()} />
            <AffiliateMetricCard label="Pending payment" value={ordersQuery.data.totals.pendingPayment.toString()} />
            <AffiliateMetricCard label="Processing" value={ordersQuery.data.totals.processingPayment.toString()} />
            <AffiliateMetricCard label="Refunded" value={ordersQuery.data.totals.refunded.toString()} />
            <AffiliateMetricCard label="Cancelled" value={ordersQuery.data.totals.cancelled.toString()} />
            <AffiliateMetricCard label="Suspicious" value={ordersQuery.data.totals.suspicious.toString()} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:flex-1">
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by order, email, package, referral..."
                  className="h-12 rounded-xl border-slate-200"
                />

                <Select value={paymentStatus} onValueChange={(value: "all" | PaymentStatus) => { setPaymentStatus(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Payment status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All payment states</SelectItem>
                    {paymentStatusOptions.map((entry) => (
                      <SelectItem key={entry} value={entry}>{paymentStatusLabels[entry]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={riskFilter} onValueChange={(value: "all" | "flagged" | "clean") => { setRiskFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Risk profile" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All risk states</SelectItem>
                    <SelectItem value="flagged">Flagged only</SelectItem>
                    <SelectItem value="clean">Clean only</SelectItem>
                  </SelectContent>
                </Select>

                <Input type="date" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} className="h-12 rounded-xl border-slate-200" />
                <Input type="date" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} className="h-12 rounded-xl border-slate-200" />
              </div>

              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
              >
                <Plus className="h-4 w-4" />
                Add order
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{order.externalOrderId ?? order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-slate-500">{order.packageName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{order.customerEmail ?? "No customer email"}</p>
                          <p className="text-xs text-slate-500">{order.customerIp ?? "IP unavailable"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{order.affiliateName ?? "No affiliate"}</p>
                          <p className="text-xs text-slate-500">{order.referralCode ?? "No referral code"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatAffiliateCurrency(order.amount)}</TableCell>
                      <TableCell>
                        <AdminStatusBadge label={paymentStatusLabels[order.paymentStatus]} toneClassName={paymentStatusTone[order.paymentStatus]} />
                      </TableCell>
                      <TableCell>
                        {order.isSuspicious || order.isSelfReferral || order.fraudFlags.length > 0 ? (
                          <div className="space-y-1 text-xs text-[#B91C1C]">
                            {order.isSuspicious ? <p className="font-bold">Suspicious</p> : null}
                            {order.isSelfReferral ? <p className="font-bold">Self referral</p> : null}
                            {order.fraudFlags.length > 0 ? <p>{order.fraudFlags.join(", ")}</p> : null}
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500">Clean</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <AdminJsonDialog
                            title={order.externalOrderId ?? "Order metadata"}
                            description={`Metadata stored for ${order.customerEmail ?? order.packageName}`}
                            payload={order.metadata}
                            triggerLabel="View metadata"
                          />
                          <button
                            type="button"
                            onClick={() => openEdit(order)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <SquarePen className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: order.id, label: order.externalOrderId ?? order.packageName })}
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
              <p>Showing {paginated.items.length} of {filteredOrders.length} filtered orders.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit order" : "Add order"}
            description="Create, edit, or correct order records directly from the admin panel."
            fields={fields}
            values={editorState?.values ?? createEmptyOrderValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.id ? "Save changes" : "Create order"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete order"
            description={`Delete ${deleteTarget?.label ?? "this order"} from the admin panel. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminOrders;
