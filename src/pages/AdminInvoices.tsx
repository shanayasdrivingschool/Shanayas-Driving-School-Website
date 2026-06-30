import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, FileText, Plus, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AffiliateMetricCard from "@/components/affiliate/AffiliateMetricCard";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
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
  toDateTimeInputValue,
  toIsoDateTimeValue,
} from "@/lib/adminCrud";
import { deleteAdminInvoice, saveAdminInvoice } from "@/lib/adminCrudApi";
import { buildCheckoutInvoicePath } from "@/lib/checkoutInvoiceService";
import { getAdminInvoices } from "@/lib/affiliateApi";
import { formatAffiliateCurrency } from "@/lib/affiliateProgram";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, matchesSearch, paginateItems } from "@/lib/adminPanel";
import type { CheckoutInvoiceStatus } from "@/lib/affiliateTypes";

const invoiceAvailabilityLabels = {
  draft: "Draft",
  open: "Open",
  expired: "Expired",
  paid: "Paid",
  cancelled: "Cancelled",
} as const;

const invoiceAvailabilityTone = {
  draft: "bg-slate-200 text-slate-700",
  open: "bg-[#1d52a1]/10 text-[#1d52a1]",
  expired: "bg-[#F5B13A]/15 text-[#9A6400]",
  paid: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-[#E6242A]/10 text-[#B91C1C]",
} as const;

type InvoiceAvailability = keyof typeof invoiceAvailabilityLabels;

type InvoiceEditorState = {
  id?: string;
  values: AdminFormValues;
};

const createEmptyInvoiceValues = (): AdminFormValues => ({
  publicToken: "",
  title: "",
  description: "",
  amount: "0",
  customerName: "",
  customerEmail: "",
  status: "open",
  expiresAt: "",
  paidAt: "",
  createdAt: "",
  metadata: formatJsonInput({}),
});

const getInvoiceAvailability = (invoice: {
  status: CheckoutInvoiceStatus;
  expiresAt: string | null;
  paidAt: string | null;
}): InvoiceAvailability => {
  if (invoice.status === "paid" || invoice.paidAt) {
    return "paid";
  }

  if (invoice.status === "cancelled") {
    return "cancelled";
  }

  if (invoice.status === "draft") {
    return "draft";
  }

  if (invoice.expiresAt) {
    const expiresAt = new Date(invoice.expiresAt);
    if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= Date.now()) {
      return "expired";
    }
  }

  return "open";
};

const copyText = async (value: string) => {
  if (typeof window === "undefined") {
    throw new Error("Window is unavailable.");
  }

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const AdminInvoices = () => {
  const queryClient = useQueryClient();
  const invoicesQuery = useQuery({
    queryKey: ["admin-invoices"],
    queryFn: getAdminInvoices,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceAvailability>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<InvoiceEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fields: AdminRecordDialogField[] = [
    { key: "publicToken", label: "Public token", type: "text", disabled: true, placeholder: "Generated automatically" },
    { key: "title", label: "Invoice title", type: "text", placeholder: "Road test balance" },
    { key: "amount", label: "Amount", type: "number", min: 0.01, step: "0.01" },
    { key: "customerName", label: "Customer name", type: "text", placeholder: "Student name" },
    { key: "customerEmail", label: "Customer email", type: "email", placeholder: "customer@example.com" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Open", value: "open" },
        { label: "Draft", value: "draft" },
        { label: "Paid", value: "paid" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    { key: "expiresAt", label: "Expires at", type: "datetime-local" },
    { key: "paidAt", label: "Paid at", type: "datetime-local" },
    { key: "createdAt", label: "Created at", type: "datetime-local" },
    { key: "description", label: "Description", type: "textarea", rows: 4, fullWidth: true },
    { key: "metadata", label: "Metadata JSON", type: "json", fullWidth: true },
  ];

  const filteredInvoices = useMemo(() => {
    const invoices = invoicesQuery.data?.invoices ?? [];

    return invoices.filter((invoice) => {
      const availability = getInvoiceAvailability(invoice);
      if (statusFilter !== "all" && availability !== statusFilter) return false;
      if (!matchesSearch(search, [invoice.title, invoice.customerEmail, invoice.customerName, invoice.publicToken])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(invoice.createdAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [dateFrom, dateTo, invoicesQuery.data?.invoices, search, statusFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredInvoices, page, ADMIN_ROWS_PER_PAGE),
    [filteredInvoices, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => setEditorState({ values: createEmptyInvoiceValues() });

  const openEdit = (invoice: NonNullable<typeof invoicesQuery.data>["invoices"][number]) => {
    setEditorState({
      id: invoice.id,
      values: {
        publicToken: invoice.publicToken,
        title: invoice.title,
        description: invoice.description ?? "",
        amount: invoice.amount.toString(),
        customerName: invoice.customerName ?? "",
        customerEmail: invoice.customerEmail ?? "",
        status: invoice.status,
        expiresAt: toDateTimeInputValue(invoice.expiresAt),
        paidAt: toDateTimeInputValue(invoice.paidAt),
        createdAt: toDateTimeInputValue(invoice.createdAt),
        metadata: formatJsonInput(invoice.metadata),
      },
    });
  };

  const handleCopyLink = async (publicToken: string) => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const invoicePath = buildCheckoutInvoicePath(publicToken);
      await copyText(`${origin}${invoicePath}`);
      toast.success("Invoice link copied.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to copy invoice link.");
    }
  };

  const handleSave = async () => {
    if (!editorState) return;

    setIsSaving(true);
    try {
      await saveAdminInvoice({
        id: editorState.id,
        publicToken: String(editorState.values.publicToken ?? ""),
        title: normalizeRequiredString(String(editorState.values.title ?? ""), "Invoice title"),
        description: String(editorState.values.description ?? ""),
        amount: normalizeNumber(String(editorState.values.amount ?? "0"), "Amount"),
        customerName: String(editorState.values.customerName ?? ""),
        customerEmail: String(editorState.values.customerEmail ?? ""),
        status: editorState.values.status as CheckoutInvoiceStatus,
        expiresAt: toIsoDateTimeValue(String(editorState.values.expiresAt ?? "")),
        paidAt: toIsoDateTimeValue(String(editorState.values.paidAt ?? "")),
        metadata: parseObjectJsonInput(String(editorState.values.metadata ?? "{}"), "Metadata JSON"),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
      });
      toast.success(editorState.id ? "Invoice updated." : "Invoice created.");
      setEditorState(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save invoice.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminInvoice(deleteTarget.id);
      toast.success("Invoice deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete invoice.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Invoice Links"
      title={
        <>
          Create private <span className="text-[#F5B13A]">checkout invoice links</span>
        </>
      }
      description="Set an exact amount, generate a private checkout link, and send customers straight into the existing payment page without exposing the invoice publicly in the catalog."
      pageTitle="Invoices"
      pageDescription="These records create private payment links for the regular checkout page. The amount is resolved on the server from the invoice record, not from the browser."
    >
      {invoicesQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading invoices...</div>
      ) : invoicesQuery.isError || !invoicesQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {invoicesQuery.error instanceof Error ? invoicesQuery.error.message : "Unable to load invoices."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AffiliateMetricCard label="Total invoices" value={invoicesQuery.data.totals.totalInvoices.toString()} icon={<FileText className="h-5 w-5" />} />
            <AffiliateMetricCard label="Open" value={invoicesQuery.data.totals.openInvoices.toString()} />
            <AffiliateMetricCard label="Paid" value={invoicesQuery.data.totals.paidInvoices.toString()} />
            <AffiliateMetricCard label="Open amount" value={formatAffiliateCurrency(invoicesQuery.data.totals.openAmount)} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:flex-1">
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title, customer, token..."
                  className="h-12 rounded-xl border-slate-200"
                />
                <Select value={statusFilter} onValueChange={(value: "all" | InvoiceAvailability) => { setStatusFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                Add invoice
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((invoice) => {
                    const availability = getInvoiceAvailability(invoice);

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{invoice.title}</p>
                            <p className="text-xs text-slate-500">{invoice.publicToken}</p>
                            {invoice.description ? <p className="mt-1 text-xs text-slate-500">{invoice.description}</p> : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{invoice.customerName ?? "No customer name"}</p>
                            <p className="text-xs text-slate-500">{invoice.customerEmail ?? "No customer email"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatAffiliateCurrency(invoice.amount)}</TableCell>
                        <TableCell>
                          <AdminStatusBadge
                            label={invoiceAvailabilityLabels[availability]}
                            toneClassName={invoiceAvailabilityTone[availability]}
                          />
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold text-slate-900">
                            {invoice.expiresAt ? new Date(invoice.expiresAt).toLocaleDateString() : "No expiry"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {invoice.lastOrderId ? `Last order ${invoice.lastOrderId.slice(0, 8).toUpperCase()}` : "No payment attempt yet"}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void handleCopyLink(invoice.publicToken)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              Copy link
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(invoice)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              <SquarePen className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: invoice.id, label: invoice.title })}
                              className="inline-flex items-center gap-1 rounded-full border border-[#E6242A] px-3 py-2 text-xs font-bold text-[#E6242A] transition-colors hover:bg-[#E6242A] hover:text-white"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
              <p>Showing {paginated.items.length} of {filteredInvoices.length} filtered invoices.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit invoice" : "Add invoice"}
            description="Create or update a private checkout invoice. The copied link lands on the normal checkout page with the amount resolved on the server."
            fields={fields}
            values={editorState?.values ?? createEmptyInvoiceValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.id ? "Save changes" : "Create invoice"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete invoice"
            description={`Delete ${deleteTarget?.label ?? "this invoice"} from the admin panel. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminInvoices;
