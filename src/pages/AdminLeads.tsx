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
  normalizeRequiredString,
  parseObjectJsonInput,
  toDateTimeInputValue,
  toIsoDateTimeValue,
} from "@/lib/adminCrud";
import { deleteAdminLead, saveAdminLead } from "@/lib/adminCrudApi";
import { getAdminLeads, updateLeadStatus } from "@/lib/affiliateApi";
import { ADMIN_ROWS_PER_PAGE, isWithinDateRange, leadStatusLabels, leadStatusTone, leadTypeLabels, matchesSearch, paginateItems } from "@/lib/adminPanel";
import type { LeadStatus, LeadType } from "@/lib/affiliateTypes";

const leadStatusOptions: LeadStatus[] = ["new", "pending_review", "reviewed", "shortlisted", "rejected"];
const leadTypeOptions: LeadType[] = ["contact", "student_assessment", "employee_application", "custom_package_request"];

type LeadTypeFilter = "all" | LeadType;

type LeadEditorState = {
  id?: string;
  label: string;
  values: AdminFormValues;
};

const buildLeadFields = (): AdminRecordDialogField[] => [
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
    options: leadStatusOptions.map((entry) => ({ label: leadStatusLabels[entry], value: entry })),
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
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
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
      await queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
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
      await queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete lead.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (leadId: string, nextStatus: LeadStatus) => {
    try {
      await updateLeadStatus({ leadId, status: nextStatus });
      toast.success("Lead status updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    } catch (error) {
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
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading leads...</div>
      ) : leadsQuery.isError || !leadsQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {leadsQuery.error instanceof Error ? leadsQuery.error.message : "Unable to load leads."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <AffiliateMetricCard label="All leads" value={leadsQuery.data.totals.totalLeads.toString()} />
            <AffiliateMetricCard label="Contact" value={leadsQuery.data.totals.contact.toString()} />
            <AffiliateMetricCard label="Assessment" value={leadsQuery.data.totals.studentAssessment.toString()} />
            <AffiliateMetricCard label="Hiring" value={leadsQuery.data.totals.employeeApplications.toString()} />
            <AffiliateMetricCard label="Custom package" value={leadsQuery.data.totals.customPackageRequests.toString()} />
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
                    {leadStatusOptions.map((entry) => (
                      <SelectItem key={entry} value={entry}>{leadStatusLabels[entry]}</SelectItem>
                    ))}
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
                className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
              >
                <Plus className="h-4 w-4" />
                Add lead
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((lead) => {
                    const effectiveLeadType = lead.requestType === "custom_package_request" ? "custom_package_request" : lead.leadType;

                    return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{lead.fullName ?? "Unnamed lead"}</p>
                            <p className="text-xs text-slate-500">{lead.email ?? lead.phone ?? "No contact details"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{leadTypeLabels[effectiveLeadType]}</TableCell>
                        <TableCell>{lead.sourcePage}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <AdminStatusBadge label={leadStatusLabels[lead.status]} toneClassName={leadStatusTone[lead.status]} />
                            <Select value={lead.status} onValueChange={(value: LeadStatus) => void handleStatusChange(lead.id, value)}>
                              <SelectTrigger className="h-9 w-[170px] rounded-xl border-slate-200 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {leadStatusOptions.map((entry) => (
                                  <SelectItem key={entry} value={entry}>{leadStatusLabels[entry]}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell>
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
                              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              <SquarePen className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: lead.id, label: lead.fullName ?? lead.email ?? lead.id })}
                              className="inline-flex items-center gap-1 rounded-full bg-[#E6242A] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#C41E23]"
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
              <p>Showing {paginated.items.length} of {filteredLeads.length} filtered leads.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.id ? "Edit lead" : "Add lead"}
            description="Create a manual lead record or update an existing submission directly from the admin panel."
            fields={buildLeadFields()}
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
