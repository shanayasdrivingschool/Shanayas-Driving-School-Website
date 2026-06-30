import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Plus, SquarePen, TicketPercent, Trash2 } from "lucide-react";
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
  type AdminFormValues,
  normalizeNumber,
  normalizeRequiredString,
  toDateTimeInputValue,
  toIsoDateTimeValue,
} from "@/lib/adminCrud";
import { deleteAdminCoupon, saveAdminCoupon } from "@/lib/adminCrudApi";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, matchesSearch, paginateItems } from "@/lib/adminPanel";
import { getAdminCoupons } from "@/lib/affiliateApi";
import type { CouponType } from "@/lib/affiliateTypes";
import { type CouponAvailability, getCouponAvailability } from "@/lib/couponService";
import { downloadCsv } from "@/lib/exportCsv";

const couponTypeLabels: Record<CouponType, string> = {
  one_time: "One-time",
  periodic: "Periodic",
};

const couponAvailabilityLabels: Record<CouponAvailability, string> = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
  redeemed: "Redeemed",
  inactive: "Inactive",
};

const couponAvailabilityTone: Record<CouponAvailability, string> = {
  active: "bg-[#1d52a1]/10 text-[#1d52a1]",
  scheduled: "bg-[#F5B13A]/15 text-[#9A6400]",
  expired: "bg-slate-200 text-slate-700",
  redeemed: "bg-[#E6242A]/10 text-[#B91C1C]",
  inactive: "bg-slate-200 text-slate-700",
};

type CouponEditorState = {
  id?: string;
  values: AdminFormValues;
};

const createEmptyCouponValues = (): AdminFormValues => ({
  code: "",
  label: "",
  description: "",
  couponType: "periodic",
  discountPercent: "10",
  autoApply: false,
  isActive: true,
  startsAt: "",
  endsAt: "",
  usageCount: "0",
  lastRedeemedAt: "",
  createdAt: "",
});

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const couponsQuery = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: getAdminCoupons,
  });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CouponType>("all");
  const [stateFilter, setStateFilter] = useState<"all" | CouponAvailability>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<CouponEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fields: AdminRecordDialogField[] = [
    { key: "code", label: "Coupon code", type: "text", placeholder: "SAVE20" },
    { key: "label", label: "Label", type: "text", placeholder: "Spring Offer" },
    {
      key: "couponType",
      label: "Coupon type",
      type: "select",
      options: [
        { label: "Periodic", value: "periodic" },
        { label: "One-time", value: "one_time" },
      ],
    },
    { key: "discountPercent", label: "Discount percent", type: "number", min: 0.01, max: 100, step: "0.01" },
    { key: "startsAt", label: "Starts at", type: "datetime-local" },
    { key: "endsAt", label: "Ends at", type: "datetime-local" },
    { key: "usageCount", label: "Usage count", type: "number", min: 0, step: "1" },
    { key: "lastRedeemedAt", label: "Last redeemed at", type: "datetime-local" },
    { key: "createdAt", label: "Created at", type: "datetime-local" },
    { key: "autoApply", label: "Auto apply on packages", type: "switch" },
    { key: "isActive", label: "Coupon active", type: "switch" },
    { key: "description", label: "Description", type: "textarea", fullWidth: true, rows: 4 },
  ];

  const filteredCoupons = useMemo(() => {
    const coupons = couponsQuery.data?.coupons ?? [];

    return coupons.filter((coupon) => {
      const availability = getCouponAvailability(coupon);
      if (typeFilter !== "all" && coupon.couponType !== typeFilter) return false;
      if (stateFilter !== "all" && availability !== stateFilter) return false;
      if (!matchesSearch(search, [coupon.code, coupon.label, coupon.description])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(coupon.createdAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [couponsQuery.data?.coupons, dateFrom, dateTo, search, stateFilter, typeFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredCoupons, page, ADMIN_ROWS_PER_PAGE),
    [filteredCoupons, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => setEditorState({ values: createEmptyCouponValues() });

  const openEdit = (coupon: NonNullable<typeof couponsQuery.data>["coupons"][number]) => {
    setEditorState({
      id: coupon.id,
      values: {
        code: coupon.code,
        label: coupon.label,
        description: coupon.description ?? "",
        couponType: coupon.couponType,
        discountPercent: coupon.discountPercent.toString(),
        autoApply: coupon.autoApply,
        isActive: coupon.isActive,
        startsAt: toDateTimeInputValue(coupon.startsAt),
        endsAt: toDateTimeInputValue(coupon.endsAt),
        usageCount: coupon.usageCount.toString(),
        lastRedeemedAt: toDateTimeInputValue(coupon.lastRedeemedAt),
        createdAt: toDateTimeInputValue(coupon.createdAt),
      },
    });
  };

  const handleSave = async () => {
    if (!editorState) return;

    setIsSaving(true);
    try {
      await saveAdminCoupon({
        id: editorState.id,
        code: normalizeRequiredString(String(editorState.values.code ?? ""), "Coupon code"),
        label: normalizeRequiredString(String(editorState.values.label ?? ""), "Label"),
        description: String(editorState.values.description ?? ""),
        couponType: editorState.values.couponType as CouponType,
        discountPercent: normalizeNumber(String(editorState.values.discountPercent ?? "0"), "Discount percent"),
        autoApply: Boolean(editorState.values.autoApply),
        isActive: Boolean(editorState.values.isActive),
        startsAt: toIsoDateTimeValue(String(editorState.values.startsAt ?? "")),
        endsAt: toIsoDateTimeValue(String(editorState.values.endsAt ?? "")),
        usageCount: normalizeNumber(String(editorState.values.usageCount ?? "0"), "Usage count"),
        lastRedeemedAt: toIsoDateTimeValue(String(editorState.values.lastRedeemedAt ?? "")),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
      });
      toast.success(editorState.id ? "Coupon updated." : "Coupon created.");
      setEditorState(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save coupon.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminCoupon(deleteTarget.id);
      toast.success("Coupon deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete coupon.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Coupon Control"
      title={
        <>
          Manage database-backed <span className="text-[#F5B13A]">coupon rules</span>
        </>
      }
      description="Create one-time and periodic coupons, set active windows, track redemption, and control which offers can be applied from the packages page."
      pageTitle="Coupons"
      pageDescription="This page manages the coupon records stored in Supabase. The packages page now validates coupon codes against these database records instead of hardcoded values."
    >
      {couponsQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading coupons...</div>
      ) : couponsQuery.isError || !couponsQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {couponsQuery.error instanceof Error ? couponsQuery.error.message : "Unable to load coupons."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AffiliateMetricCard label="Total coupons" value={couponsQuery.data.totals.totalCoupons.toString()} icon={<TicketPercent className="h-5 w-5" />} />
            <AffiliateMetricCard label="Currently active" value={couponsQuery.data.totals.activeCoupons.toString()} />
            <AffiliateMetricCard label="Periodic" value={couponsQuery.data.totals.periodicCoupons.toString()} />
            <AffiliateMetricCard label="Redeemed one-time" value={couponsQuery.data.totals.redeemedCoupons.toString()} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:flex-1">
                <Input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Search code, label, description..."
                  className="h-12 rounded-xl border-slate-200"
                />
                <Select value={typeFilter} onValueChange={(value: "all" | CouponType) => { setTypeFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Coupon type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All coupon types</SelectItem>
                    <SelectItem value="periodic">Periodic</SelectItem>
                    <SelectItem value="one_time">One-time</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={stateFilter} onValueChange={(value: "all" | CouponAvailability) => { setStateFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Availability" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All states</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="redeemed">Redeemed</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                  Add coupon
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      "coupons.csv",
                      filteredCoupons.map((coupon) => ({
                        code: coupon.code,
                        label: coupon.label,
                        coupon_type: coupon.couponType,
                        discount_percent: coupon.discountPercent,
                        auto_apply: coupon.autoApply,
                        is_active: coupon.isActive,
                        availability: getCouponAvailability(coupon),
                        usage_count: coupon.usageCount,
                        starts_at: coupon.startsAt,
                        ends_at: coupon.endsAt,
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
                    <TableHead>Coupon</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((coupon) => {
                    const availability = getCouponAvailability(coupon);

                    return (
                      <TableRow key={coupon.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{coupon.code}</p>
                            <p className="text-xs text-slate-500">{coupon.label}</p>
                            {coupon.description ? <p className="mt-1 text-xs text-slate-500">{coupon.description}</p> : null}
                          </div>
                        </TableCell>
                        <TableCell>{couponTypeLabels[coupon.couponType]}</TableCell>
                        <TableCell>{coupon.discountPercent}%</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            <AdminStatusBadge
                              label={couponAvailabilityLabels[availability]}
                              toneClassName={couponAvailabilityTone[availability]}
                            />
                            {coupon.autoApply ? (
                              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                                Auto
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{coupon.usageCount}</p>
                            <p className="text-xs text-slate-500">
                              {coupon.lastRedeemedAt ? `Last used ${new Date(coupon.lastRedeemedAt).toLocaleDateString()}` : "No redemptions"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(coupon)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              <SquarePen className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: coupon.id, label: coupon.code })}
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
              <p>Showing {paginated.items.length} of {filteredCoupons.length} filtered coupons.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit coupon" : "Add coupon"}
            description="Create or update a database-backed coupon used by the packages page and validated during submission."
            fields={fields}
            values={editorState?.values ?? createEmptyCouponValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.id ? "Save changes" : "Create coupon"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete coupon"
            description={`Delete ${deleteTarget?.label ?? "this coupon"} from the admin panel. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminCoupons;
