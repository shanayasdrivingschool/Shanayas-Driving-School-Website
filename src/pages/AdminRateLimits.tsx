import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, SquarePen, Trash2 } from "lucide-react";
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
import {
  type AdminFormValues,
  normalizeNumber,
  normalizeRequiredString,
  toDateTimeInputValue,
  toIsoDateTimeValue,
} from "@/lib/adminCrud";
import { deleteAdminRateLimit, saveAdminRateLimit } from "@/lib/adminCrudApi";
import { getAdminRateLimits } from "@/lib/affiliateApi";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, matchesSearch, paginateItems } from "@/lib/adminPanel";

type RateLimitEditorState = {
  originalKey?: string;
  values: AdminFormValues;
};

const createEmptyRateLimitValues = (): AdminFormValues => ({
  key: "",
  endpoint: "",
  windowStart: "",
  count: "0",
  createdAt: "",
  updatedAt: "",
});

const AdminRateLimits = () => {
  const queryClient = useQueryClient();
  const rateLimitsQuery = useQuery({
    queryKey: ["admin-rate-limits"],
    queryFn: getAdminRateLimits,
  });
  const [search, setSearch] = useState("");
  const [windowFilter, setWindowFilter] = useState<"all" | "flagged" | "normal">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<RateLimitEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ key: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fields: AdminRecordDialogField[] = [
    { key: "key", label: "Hash key", type: "text", placeholder: "rate-limit hash key" },
    { key: "endpoint", label: "Endpoint", type: "text", placeholder: "/functions/v1/submit-lead" },
    { key: "windowStart", label: "Window start", type: "datetime-local" },
    { key: "count", label: "Request count", type: "number", min: 0, step: "1" },
    { key: "createdAt", label: "Created at", type: "datetime-local" },
    { key: "updatedAt", label: "Updated at", type: "datetime-local" },
  ];

  const filteredRows = useMemo(() => {
    const rows = rateLimitsQuery.data?.rateLimits ?? [];

    return rows.filter((row) => {
      const flagged = row.count >= 5;
      if (windowFilter === "flagged" && !flagged) return false;
      if (windowFilter === "normal" && flagged) return false;
      if (!matchesSearch(search, [row.endpoint, row.key])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(row.updatedAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [dateFrom, dateTo, rateLimitsQuery.data?.rateLimits, search, windowFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredRows, page, ADMIN_ROWS_PER_PAGE),
    [filteredRows, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => setEditorState({ values: createEmptyRateLimitValues() });

  const openEdit = (row: NonNullable<typeof rateLimitsQuery.data>["rateLimits"][number]) => {
    setEditorState({
      originalKey: row.key,
      values: {
        key: row.key,
        endpoint: row.endpoint,
        windowStart: toDateTimeInputValue(row.windowStart),
        count: row.count.toString(),
        createdAt: toDateTimeInputValue(row.createdAt),
        updatedAt: toDateTimeInputValue(row.updatedAt),
      },
    });
  };

  const handleSave = async () => {
    if (!editorState) return;

    setIsSaving(true);
    try {
      await saveAdminRateLimit({
        originalKey: editorState.originalKey,
        key: normalizeRequiredString(String(editorState.values.key ?? ""), "Hash key"),
        endpoint: normalizeRequiredString(String(editorState.values.endpoint ?? ""), "Endpoint"),
        windowStart: normalizeRequiredString(toIsoDateTimeValue(String(editorState.values.windowStart ?? "")) ?? "", "Window start"),
        count: normalizeNumber(String(editorState.values.count ?? "0"), "Request count"),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
        updatedAt: toIsoDateTimeValue(String(editorState.values.updatedAt ?? "")),
      });
      toast.success(editorState.originalKey ? "Rate-limit window updated." : "Rate-limit window created.");
      setEditorState(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-rate-limits"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save rate-limit window.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminRateLimit(deleteTarget.key);
      toast.success("Rate-limit window deleted.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-rate-limits"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete rate-limit window.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Traffic Controls"
      title={
        <>
          Watch live <span className="text-[#F5B13A]">rate-limit pressure</span>
        </>
      }
      description="Monitor spam attempts, burst traffic, and endpoint pressure using the existing edge_rate_limits table that already backs public form and referral protection."
      pageTitle="Rate limits"
      pageDescription="This is the operational spam-monitoring view for public edge endpoints. High-count windows are surfaced here so admins can spot abuse patterns fast."
    >
      {rateLimitsQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading rate-limit windows...</div>
      ) : rateLimitsQuery.isError || !rateLimitsQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {rateLimitsQuery.error instanceof Error ? rateLimitsQuery.error.message : "Unable to load rate-limit activity."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            <AffiliateMetricCard label="Tracked windows" value={rateLimitsQuery.data.totals.totalWindows.toString()} />
            <AffiliateMetricCard label="Flagged windows" value={rateLimitsQuery.data.totals.flaggedWindows.toString()} />
            <AffiliateMetricCard label="Unique endpoints" value={rateLimitsQuery.data.totals.uniqueEndpoints.toString()} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:flex-1">
                <Input
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                  placeholder="Search endpoint or hash key..."
                  className="h-12 rounded-xl border-slate-200"
                />
                <Select value={windowFilter} onValueChange={(value: "all" | "flagged" | "normal") => { setWindowFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Window type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All windows</SelectItem>
                    <SelectItem value="flagged">Flagged windows</SelectItem>
                    <SelectItem value="normal">Normal windows</SelectItem>
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
                Add window
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Hash key</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Window start</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((row) => (
                    <TableRow key={`${row.key}-${row.windowStart}`}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{row.endpoint}</p>
                          <p className="text-xs text-slate-500">{row.count >= 5 ? "Flagged traffic window" : "Normal traffic window"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate text-xs text-slate-500">{row.key}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${row.count >= 5 ? "bg-[#E6242A]/10 text-[#B91C1C]" : "bg-[#1d52a1]/10 text-[#1d52a1]"}`}>
                          {row.count}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(row.windowStart).toLocaleString()}</TableCell>
                      <TableCell>{new Date(row.updatedAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <SquarePen className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ key: row.key, label: `${row.endpoint} (${row.key.slice(0, 8)})` })}
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
              <p>Showing {paginated.items.length} of {filteredRows.length} filtered windows.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.originalKey ? "Edit rate-limit window" : "Add rate-limit window"}
            description="Create, edit, or correct edge rate-limit windows directly from the admin panel."
            fields={fields}
            values={editorState?.values ?? createEmptyRateLimitValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.originalKey ? "Save changes" : "Create window"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete rate-limit window"
            description={`Delete ${deleteTarget?.label ?? "this rate-limit window"} from the admin panel. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminRateLimits;
