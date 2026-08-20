import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminMetricCard from "@/components/admin/AdminMetricCard";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
import AdminJsonDialog from "@/components/admin/AdminJsonDialog";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminPortalShell from "@/components/admin/AdminPortalShell";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminRecordDialog, { type AdminRecordDialogField } from "@/components/admin/AdminRecordDialog";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { adminSurfaceClassName } from "@/components/admin/styles";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  formatJsonInput,
  type AdminFormValues,
  normalizeRequiredString,
  parseObjectJsonInput,
  toDateTimeInputValue,
  toIsoDateTimeValue,
} from "@/lib/adminCrud";
import { deleteAdminLead, saveAdminLead } from "@/lib/adminCrudApi";
import { getAdminLeads, updateLeadStatus } from "@/lib/affiliateApi";
import {
  ADMIN_ROWS_PER_PAGE,
  HIRING_LEAD_STATUSES,
  isWithinDateRange,
  leadStatusLabels,
  leadStatusTone,
  leadStatusesForType,
  leadTypeLabels,
  matchesSearch,
  paginateItems,
  STUDENT_LEAD_STATUSES,
} from "@/lib/adminPanel";
import type { AdminLeadsResponse, LeadStatus, LeadType } from "@/lib/affiliateTypes";
import { adminQueryOptions, optimisticAdminUpdate, refreshAdminQueries } from "@/lib/adminQueries";
import {
  adminDangerButtonClassName,
  adminPrimaryButtonClassName,
  adminRowButtonClassName,
} from "@/components/admin/styles";

const leadTypeOptions: LeadType[] = ["contact", "student_assessment", "employee_application", "custom_package_request"];

type LeadTypeFilter = "all" | LeadType;

type LeadEditorState = {
  id?: string;
  label: string;
  values: AdminFormValues;
};

const buildLeadFields = (leadType: LeadType): AdminRecordDialogField[] => [
  {
    key: "leadType",
    label: "Lead type",
    type: "select",
    options: leadTypeOptions.map((entry) => ({ label: leadTypeLabels[entry], value: entry })),
  },
  { key: "fullName", label: "Full name", type: "text", placeholder: "Lead full name" },
  { key: "email", label: "Email", type: "email", placeholder: "lead@example.com" },
  { key: "phone", label: "Phone", type: "text", placeholder: "+1 555 123 4567" },
  { key: "sourcePage", label: "Source page", type: "text", placeholder: "/contact" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: leadStatusesForType(leadType).map((entry) => ({ label: leadStatusLabels[entry], value: entry })),
  },
  {
    key: "createdAt",
    label: "Submitted at",
    type: "datetime-local",
    description: "Leave blank to use the current time for new records.",
  },
  {
    key: "payload",
    label: "Payload JSON",
    type: "json",
    fullWidth: true,
    description: "Structured details stored for this lead.",
  },
];

const createEmptyLeadValues = (): AdminFormValues => ({
  leadType: "contact",
  fullName: "",
  email: "",
  phone: "",
  sourcePage: "/admin/manual",
  status: "new",
  createdAt: "",
  payload: formatJsonInput({}),
});

const AdminLeads = () => {
  const queryClient = useQueryClient();
  const leadsQuery = useQuery({
    queryKey: ["admin-leads"],
    queryFn: getAdminLeads,
    ...adminQueryOptions,
  });
  const [search, setSearch] = useState("");
  const [leadType, setLeadType] = useState<LeadTypeFilter>("all");
  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<LeadEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredLeads = useMemo(() => {
    const leads = leadsQuery.data?.leads ?? [];

    return leads.filter((lead) => {
      const effectiveLeadType = lead.requestType === "custom_package_request" ? "custom_package_request" : lead.leadType;

      if (leadType !== "all" && effectiveLeadType !== leadType) return false;
      if (status !== "all" && lead.status !== status) return false;
      if (!matchesSearch(search, [lead.fullName, lead.email, lead.phone, lead.sourcePage])) return false;
      if ((dateFrom || dateTo) && !isWithinDateRange(lead.createdAt, dateFrom, dateTo)) return false;
      return true;
    });
  }, [dateFrom, dateTo, leadType, leadsQuery.data?.leads, search, status]);

  const paginated = useMemo(
    () => paginateItems(filteredLeads, page, ADMIN_ROWS_PER_PAGE),
    [filteredLeads, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => {
      if (!current) return current;
      const values = { ...current.values, [key]: value };

      // Student and hiring leads use separate status vocabularies. Switching the lead type can
      // strand the status on a value the new pipeline does not offer, so fall back to "new".
      if (key === "leadType") {
        const allowed = leadStatusesForType(value as LeadType);
        if (!allowed.includes(values.status as LeadStatus)) {
          values.status = "new";
        }
      }

      return { ...current, values };
    });
  };

  const openCreate = () => {
    setEditorState({
      label: "Create lead",
      values: createEmptyLeadValues(),
    });
  };

  const openEdit = (lead: NonNullable<typeof leadsQuery.data>["leads"][number]) => {
    const effectiveLeadType = lead.requestType === "custom_package_request" ? "custom_package_request" : lead.leadType;
    setEditorState({
      id: lead.id,
      label: lead.fullName ?? lead.email ?? "Edit lead",
      values: {
        leadType: effectiveLeadType,
        fullName: lead.fullName ?? "",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        sourcePage: lead.sourcePage,
        status: lead.status,
        createdAt: toDateTimeInputValue(lead.createdAt),
        payload: formatJsonInput(lead.payload),
      },
    });
  };

  const handleSave = async () => {
    if (!editorState) return;
    setIsSaving(true);
    try {
      await saveAdminLead({
        id: editorState.id,
        leadType: editorState.values.leadType as LeadType,
        fullName: String(editorState.values.fullName ?? ""),
        email: String(editorState.values.email ?? ""),
        phone: String(editorState.values.phone ?? ""),
        sourcePage: normalizeRequiredString(String(editorState.values.sourcePage ?? ""), "Source page"),
        status: editorState.values.status as LeadStatus,
        payload: parseObjectJsonInput(String(editorState.values.payload ?? "{}"), "Payload JSON"),
        createdAt: toIsoDateTimeValue(String(editorState.values.createdAt ?? "")),
      });
      toast.success(editorState.id ? "Lead updated." : "Lead created.");
      setEditorState(null);
      refreshAdminQueries(queryClient, ["admin-leads", "admin-dashboard"]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save lead.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAdminLead(deleteTarget.id);
      toast.success("Lead deleted.");
      setDeleteTarget(null);
      refreshAdminQueries(queryClient, ["admin-leads", "admin-dashboard"]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete lead.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (leadId: string, nextStatus: LeadStatus) => {
    const rollback = optimisticAdminUpdate<AdminLeadsResponse>(queryClient, "admin-leads", (current) => ({
      ...current,
      leads: current.leads.map((lead) => (lead.id === leadId ? { ...lead, status: nextStatus } : lead)),
    }));

    try {
      await updateLeadStatus({ leadId, status: nextStatus });
      toast.success("Lead status updated.");
      refreshAdminQueries(queryClient, ["admin-leads", "admin-dashboard"]);
    } catch (error) {
      rollback();
      toast.error(error instanceof Error ? error.message : "Unable to update lead status.");
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Lead Management"
      title={
        <>
          Review every <span className="text-[#F5B13A]">stored lead record</span>
        </>
      }
      description="Inspect form submissions, check payload structure, update lead statuses, and separate contact traffic from assessment, hiring, and package requests."
      pageTitle="Leads"
      pageDescription="Every row on this page comes directly from public.leads. Filters are client-side so admins can search, inspect, and page through the full returned dataset quickly."
    >
      {leadsQuery.isLoading ? (
        <div className={`${adminSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading leads...</div>
      ) : leadsQuery.isError || !leadsQuery.data ? (
        <div className={`${adminSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {leadsQuery.error instanceof Error ? leadsQuery.error.message : "Unable to load leads."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <AdminMetricCard label="All leads" value={leadsQuery.data.totals.totalLeads.toString()} />
            <AdminMetricCard label="Contact" value={leadsQuery.data.totals.contact.toString()} />
            <AdminMetricCard label="Assessment" value={leadsQuery.data.totals.studentAssessment.toString()} />
            <AdminMetricCard label="Hiring" value={leadsQuery.data.totals.employeeApplications.toString()} />
            <AdminMetricCard label="Custom package" value={leadsQuery.data.totals.customPackageRequests.toString()} />
          </div>

          <div className={adminSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:flex-1">
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name, email, phone..."
                  className="h-12 rounded-xl border-slate-200"
                />

                <Select
                  value={leadType}
                  onValueChange={(value: LeadTypeFilter) => {
                    setLeadType(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Lead type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All lead types</SelectItem>
                    {leadTypeOptions.map((entry) => (
                      <SelectItem key={entry} value={entry}>{leadTypeLabels[entry]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={status}
                  onValueChange={(value: "all" | LeadStatus) => {
                    setStatus(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="new">{leadStatusLabels.new}</SelectItem>
                    <SelectGroup>
                      <SelectLabel>Student</SelectLabel>
                      {STUDENT_LEAD_STATUSES.filter((entry) => entry !== "new").map((entry) => (
                        <SelectItem key={entry} value={entry}>{leadStatusLabels[entry]}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Hiring</SelectLabel>
                      {HIRING_LEAD_STATUSES.filter((entry) => entry !== "new").map((entry) => (
                        <SelectItem key={entry} value={entry}>{leadStatusLabels[entry]}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(event) => {
                    setDateFrom(event.target.value);
                    setPage(1);
                  }}
                  className="h-12 rounded-xl border-slate-200"
                />

                <Input
                  type="date"
                  value={dateTo}
                  onChange={(event) => {
                    setDateTo(event.target.value);
                    setPage(1);
                  }}
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>

              <button
                type="button"
                onClick={openCreate}
                className={adminPrimaryButtonClassName}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add lead
              </button>
            </div>

            {/* Below md the table is replaced outright rather than scrolled sideways. Six
                columns cannot fit a phone, and the Actions column -- the only route to
                open, edit or delete a lead -- ended up off the right edge where it could
                not be reached at all. Every field and every control the table offers is
                repeated in the cards below, so nothing is desktop-only. */}
            <div className="mt-6 space-y-3 md:hidden">
              {paginated.items.map((lead) => {
                const effectiveLeadType =
                  lead.requestType === "custom_package_request" ? "custom_package_request" : lead.leadType;

                return (
                  <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{lead.fullName ?? "Unnamed lead"}</p>
                        <p className="break-words text-xs text-slate-500">
                          {lead.email ?? lead.phone ?? "No contact details"}
                        </p>
                      </div>
                      <AdminStatusBadge
                        label={leadStatusLabels[lead.status]}
                        toneClassName={leadStatusTone[lead.status]}
                      />
                    </div>

                    <dl className="mt-3 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 text-xs">
                      <dt className="font-bold text-slate-500">Type</dt>
                      <dd className="text-slate-700">{leadTypeLabels[effectiveLeadType]}</dd>
                      <dt className="font-bold text-slate-500">Source</dt>
                      <dd className="break-all text-slate-700">{lead.sourcePage}</dd>
                      <dt className="font-bold text-slate-500">Submitted</dt>
                      <dd className="text-slate-700">{new Date(lead.createdAt).toLocaleString()}</dd>
                    </dl>

                    <Select
                      value={lead.status}
                      onValueChange={(value: LeadStatus) => void handleStatusChange(lead.id, value)}
                    >
                      <SelectTrigger className="mt-3 h-10 w-full rounded-xl border-slate-200 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {leadStatusesForType(effectiveLeadType).map((entry) => (
                          <SelectItem key={entry} value={entry}>
                            {leadStatusLabels[entry]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <AdminJsonDialog
                        title={lead.fullName ?? "Lead payload"}
                        description={`Payload stored for ${lead.email ?? lead.sourcePage}`}
                        payload={lead.payload}
                        triggerLabel="View payload"
                      />
                      <button
                        type="button"
                        onClick={() => openEdit(lead)}
                        className={adminRowButtonClassName}
                      >
                        <SquarePen className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ id: lead.id, label: lead.fullName ?? lead.email ?? lead.id })
                        }
                        className={adminDangerButtonClassName}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden lg:table-cell">Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((lead) => {
                    const effectiveLeadType = lead.requestType === "custom_package_request" ? "custom_package_request" : lead.leadType;

                    return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">{lead.fullName ?? "Unnamed lead"}</p>
                            <p className="break-words text-xs text-slate-500">{lead.email ?? lead.phone ?? "No contact details"}</p>
                            {/* Six columns cannot fit a phone, so Type, Source and Submitted are
                                hidden at that width and restated here instead. Hiding a column
                                outright would have cost the information; this only moves it. */}
                            <dl className="mt-2 space-y-0.5 text-xs text-slate-500 lg:hidden">
                              <div className="md:hidden">
                                <dt className="sr-only">Type</dt>
                                <dd>{leadTypeLabels[effectiveLeadType]}</dd>
                              </div>
                              <div>
                                <dt className="sr-only">Source</dt>
                                <dd className="break-all">{lead.sourcePage}</dd>
                              </div>
                              <div>
                                <dt className="sr-only">Submitted</dt>
                                <dd>{new Date(lead.createdAt).toLocaleString()}</dd>
                              </div>
                            </dl>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{leadTypeLabels[effectiveLeadType]}</TableCell>
                        <TableCell className="hidden lg:table-cell">{lead.sourcePage}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <AdminStatusBadge label={leadStatusLabels[lead.status]} toneClassName={leadStatusTone[lead.status]} />
                            <Select value={lead.status} onValueChange={(value: LeadStatus) => void handleStatusChange(lead.id, value)}>
                              <SelectTrigger className="h-9 w-full min-w-[8rem] rounded-xl border-slate-200 text-xs md:w-[170px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {leadStatusesForType(effectiveLeadType).map((entry) => (
                                  <SelectItem key={entry} value={entry}>{leadStatusLabels[entry]}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{new Date(lead.createdAt).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <AdminJsonDialog
                              title={lead.fullName ?? "Lead payload"}
                              description={`Payload stored for ${lead.email ?? lead.sourcePage}`}
                              payload={lead.payload}
                              triggerLabel="View payload"
                            />
                            <button
                              type="button"
                              onClick={() => openEdit(lead)}
                              className={adminRowButtonClassName}
                            >
                              <SquarePen className="h-3.5 w-3.5" aria-hidden="true" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: lead.id, label: lead.fullName ?? lead.email ?? lead.id })}
                              className={adminDangerButtonClassName}
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
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

            {/* A filter that matches nothing used to leave a bare header row above blank
                space, which reads as a failed load rather than as an excluded result. */}
            {filteredLeads.length === 0 ? (
              <div className="mt-6">
                <AdminEmptyState
                  noun="leads"
                  filtered={(leadsQuery.data?.leads ?? []).length > 0}
                />
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
              <p>Showing {paginated.items.length} of {filteredLeads.length} filtered leads.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit lead" : "Add lead"}
            description="Create a manual lead record or update an existing submission directly from the admin panel."
            fields={buildLeadFields((editorState?.values.leadType as LeadType) ?? "contact")}
            values={editorState?.values ?? createEmptyLeadValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.id ? "Save changes" : "Create lead"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete lead"
            description={`Delete ${deleteTarget?.label ?? "this lead"} from the admin panel. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminLeads;
