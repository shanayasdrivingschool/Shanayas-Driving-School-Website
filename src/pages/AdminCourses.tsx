import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Download, Eye, EyeOff, Plus, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AffiliateMetricCard from "@/components/affiliate/AffiliateMetricCard";
import { affiliateSurfaceClassName } from "@/components/affiliate/styles";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminPortalShell from "@/components/admin/AdminPortalShell";
import AdminRecordDialog, { type AdminRecordDialogField } from "@/components/admin/AdminRecordDialog";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCoursePrice } from "@/data/coursePricing";
import {
  type AdminFormValues,
  formatJsonInput,
  normalizeNumber,
  normalizeRequiredString,
  parseStringArrayJsonInput,
} from "@/lib/adminCrud";
import { deleteAdminCourse, saveAdminCourse } from "@/lib/adminCrudApi";
import { ADMIN_ROWS_PER_PAGE, matchesSearch, paginateItems } from "@/lib/adminPanel";
import { getAdminCourses } from "@/lib/affiliateApi";
import type { AdminCourseRecord } from "@/lib/affiliateTypes";
import { downloadCsv } from "@/lib/exportCsv";

const levelOptions: AdminCourseRecord["level"][] = ["Beginner", "Intermediate", "Advanced", "Test Prep", "Flexible", "Senior Support"];
const deliveryOptions: AdminCourseRecord["deliveryFormat"][] = ["In-class", "In-car", "In-class + In-car"];

const visibilityTone = {
  visible: "bg-[#1d52a1]/10 text-[#1d52a1]",
  hidden: "bg-slate-200 text-slate-700",
} as const;

type CourseEditorState = {
  recordId?: string;
  values: AdminFormValues;
};

const createEmptyCourseValues = (displayOrder: number): AdminFormValues => ({
  slug: "",
  title: "",
  level: "Beginner",
  deliveryFormat: "In-car",
  duration: "",
  detail: "",
  description: "",
  image: "",
  tone: "bg-white text-black border border-gray-200",
  fixedPrice: "",
  sixtyMinuteClasses: "0",
  ninetyMinuteClasses: "0",
  discountPercent: "0",
  displayOrder: displayOrder.toString(),
  isVisible: true,
  highlights: formatJsonInput([], "array"),
  quizTags: formatJsonInput([], "array"),
});

const toEditorValues = (course: AdminCourseRecord): AdminFormValues => ({
  slug: course.slug,
  title: course.title,
  level: course.level,
  deliveryFormat: course.deliveryFormat,
  duration: course.duration,
  detail: course.detail,
  description: course.description,
  image: course.image,
  tone: course.tone,
  fixedPrice: course.fixedPrice === null ? "" : course.fixedPrice.toString(),
  sixtyMinuteClasses: course.sixtyMinuteClasses.toString(),
  ninetyMinuteClasses: course.ninetyMinuteClasses.toString(),
  discountPercent: course.discountPercent.toString(),
  displayOrder: course.displayOrder.toString(),
  isVisible: course.isVisible,
  highlights: formatJsonInput(course.highlights, "array"),
  quizTags: formatJsonInput(course.quizTags, "array"),
});

const fieldsForEditor = (isEditing: boolean): AdminRecordDialogField[] => [
  {
    key: "slug",
    label: "Course slug",
    type: "text",
    placeholder: "beginner-driving-course",
    description: "Used in the public course URL. Keep existing slugs stable so routes and package references keep working.",
    disabled: isEditing,
  },
  { key: "title", label: "Title", type: "text", placeholder: "Beginner's Driving Course" },
  {
    key: "level",
    label: "Level",
    type: "select",
    options: levelOptions.map((option) => ({ label: option, value: option })),
  },
  {
    key: "deliveryFormat",
    label: "Delivery format",
    type: "select",
    options: deliveryOptions.map((option) => ({ label: option, value: option })),
  },
  { key: "duration", label: "Duration", type: "text", placeholder: "10 x 90 min beginner lessons" },
  { key: "detail", label: "Detail label", type: "text", placeholder: "10 x 90 min beginner lessons" },
  { key: "image", label: "Image URL", type: "text", placeholder: "https://images.unsplash.com/..." },
  { key: "tone", label: "Card tone classes", type: "text", placeholder: "bg-white text-black border border-gray-200" },
  {
    key: "fixedPrice",
    label: "Fixed price",
    type: "number",
    min: 0,
    step: "0.01",
    description: "Leave blank if pricing should be calculated from lesson counts.",
  },
  { key: "sixtyMinuteClasses", label: "60 min classes", type: "number", min: 0, step: "1" },
  { key: "ninetyMinuteClasses", label: "90 min classes", type: "number", min: 0, step: "1" },
  { key: "discountPercent", label: "Discount percent", type: "number", min: 0, max: 100, step: "0.01" },
  { key: "displayOrder", label: "Display order", type: "number", min: 0, step: "1" },
  { key: "isVisible", label: "Visible on public pages", type: "switch" },
  { key: "description", label: "Description", type: "textarea", fullWidth: true, rows: 4 },
  {
    key: "highlights",
    label: "Highlights JSON",
    type: "json",
    fullWidth: true,
    description: "Enter a JSON array of strings.",
  },
  {
    key: "quizTags",
    label: "Quiz tags JSON",
    type: "json",
    fullWidth: true,
    description: "Enter a JSON array of strings. Used by the course recommendation logic.",
  },
];

const buildCourseInput = (values: AdminFormValues, recordId?: string) => {
  const fixedPriceRaw = String(values.fixedPrice ?? "").trim();
  const fixedPrice = fixedPriceRaw ? normalizeNumber(fixedPriceRaw, "Fixed price") : null;
  const sixtyMinuteClasses = normalizeNumber(String(values.sixtyMinuteClasses ?? "0"), "60 min classes");
  const ninetyMinuteClasses = normalizeNumber(String(values.ninetyMinuteClasses ?? "0"), "90 min classes");
  const discountPercent = normalizeNumber(String(values.discountPercent ?? "0"), "Discount percent");

  if (fixedPrice !== null && (sixtyMinuteClasses > 0 || ninetyMinuteClasses > 0)) {
    throw new Error("Use either a fixed price or lesson counts for pricing, not both.");
  }

  if (fixedPrice === null && sixtyMinuteClasses === 0 && ninetyMinuteClasses === 0) {
    throw new Error("Add a fixed price or at least one lesson count.");
  }

  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount percent must be between 0 and 100.");
  }

  return {
    recordId,
    slug: normalizeRequiredString(String(values.slug ?? ""), "Course slug"),
    title: normalizeRequiredString(String(values.title ?? ""), "Title"),
    level: values.level as AdminCourseRecord["level"],
    deliveryFormat: values.deliveryFormat as AdminCourseRecord["deliveryFormat"],
    duration: normalizeRequiredString(String(values.duration ?? ""), "Duration"),
    detail: normalizeRequiredString(String(values.detail ?? ""), "Detail label"),
    description: normalizeRequiredString(String(values.description ?? ""), "Description"),
    highlights: parseStringArrayJsonInput(String(values.highlights ?? "[]"), "Highlights"),
    tone: normalizeRequiredString(String(values.tone ?? ""), "Card tone classes"),
    image: normalizeRequiredString(String(values.image ?? ""), "Image URL"),
    quizTags: parseStringArrayJsonInput(String(values.quizTags ?? "[]"), "Quiz tags"),
    fixedPrice,
    sixtyMinuteClasses,
    ninetyMinuteClasses,
    discountPercent,
    isVisible: Boolean(values.isVisible),
    displayOrder: normalizeNumber(String(values.displayOrder ?? "0"), "Display order"),
  };
};

const toUpsertInput = (course: AdminCourseRecord, overrides?: Partial<Pick<AdminCourseRecord, "isVisible">>) => ({
  recordId: course.recordId,
  slug: course.slug,
  title: course.title,
  level: course.level,
  deliveryFormat: course.deliveryFormat,
  duration: course.duration,
  detail: course.detail,
  description: course.description,
  highlights: course.highlights,
  tone: course.tone,
  image: course.image,
  quizTags: course.quizTags,
  fixedPrice: course.fixedPrice,
  sixtyMinuteClasses: course.sixtyMinuteClasses,
  ninetyMinuteClasses: course.ninetyMinuteClasses,
  discountPercent: course.discountPercent,
  isVisible: overrides?.isVisible ?? course.isVisible,
  displayOrder: course.displayOrder,
});

const AdminCourses = () => {
  const queryClient = useQueryClient();
  const coursesQuery = useQuery({
    queryKey: ["admin-courses"],
    queryFn: getAdminCourses,
  });
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "visible" | "hidden">("all");
  const [levelFilter, setLevelFilter] = useState<"all" | AdminCourseRecord["level"]>("all");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<CourseEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null);

  const filteredCourses = useMemo(() => {
    const courses = coursesQuery.data?.courses ?? [];

    return courses.filter((course) => {
      if (visibilityFilter === "visible" && !course.isVisible) return false;
      if (visibilityFilter === "hidden" && course.isVisible) return false;
      if (levelFilter !== "all" && course.level !== levelFilter) return false;
      if (!matchesSearch(search, [course.title, course.slug, course.description, course.detail])) return false;
      return true;
    });
  }, [coursesQuery.data?.courses, levelFilter, search, visibilityFilter]);

  const paginated = useMemo(
    () => paginateItems(filteredCourses, page, ADMIN_ROWS_PER_PAGE),
    [filteredCourses, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const openCreate = () => {
    const nextDisplayOrder = (coursesQuery.data?.courses.length ?? 0) + 1;
    setEditorState({ values: createEmptyCourseValues(nextDisplayOrder) });
  };

  const openEdit = (course: AdminCourseRecord) => {
    setEditorState({
      recordId: course.recordId,
      values: toEditorValues(course),
    });
  };

  const refreshCourses = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    await queryClient.invalidateQueries({ queryKey: ["public-courses"] });
  };

  const handleSave = async () => {
    if (!editorState) return;

    setIsSaving(true);
    try {
      await saveAdminCourse(buildCourseInput(editorState.values, editorState.recordId));
      toast.success(editorState.recordId ? "Course updated." : "Course created.");
      setEditorState(null);
      await refreshCourses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save course.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminCourse(deleteTarget.id);
      toast.success("Course deleted.");
      setDeleteTarget(null);
      await refreshCourses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete course.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleVisibility = async (course: AdminCourseRecord) => {
    setBusyCourseId(course.recordId);
    try {
      await saveAdminCourse(toUpsertInput(course, { isVisible: !course.isVisible }));
      toast.success(course.isVisible ? "Course hidden." : "Course published.");
      await refreshCourses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update course visibility.");
    } finally {
      setBusyCourseId(null);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Course Control"
      title={
        <>
          Manage public <span className="text-[#F5B13A]">course pricing and visibility</span>
        </>
      }
      description="Add new courses, adjust prices, apply course-specific discounts, and hide or publish individual courses from the same admin workspace."
      pageTitle="Courses"
      pageDescription="This page manages the course records stored in Supabase. Public course pages, the course list, and the custom package builder now read from these records instead of relying only on the hardcoded catalog."
    >
      {coursesQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading courses...</div>
      ) : coursesQuery.isError || !coursesQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {coursesQuery.error instanceof Error ? coursesQuery.error.message : "Unable to load courses."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AffiliateMetricCard label="Total courses" value={coursesQuery.data.totals.totalCourses.toString()} icon={<BookOpen className="h-5 w-5" />} />
            <AffiliateMetricCard label="Visible" value={coursesQuery.data.totals.visibleCourses.toString()} />
            <AffiliateMetricCard label="Hidden" value={coursesQuery.data.totals.hiddenCourses.toString()} />
            <AffiliateMetricCard label="Discounted" value={coursesQuery.data.totals.discountedCourses.toString()} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:flex-1">
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title, slug, description..."
                  className="h-12 rounded-xl border-slate-200"
                />
                <Select value={visibilityFilter} onValueChange={(value: "all" | "visible" | "hidden") => { setVisibilityFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Visibility" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All visibility states</SelectItem>
                    <SelectItem value="visible">Visible</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={(value: "all" | AdminCourseRecord["level"]) => { setLevelFilter(value); setPage(1); }}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All levels</SelectItem>
                    {levelOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                >
                  <Plus className="h-4 w-4" />
                  Add course
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      "courses.csv",
                      filteredCourses.map((course) => ({
                        slug: course.slug,
                        title: course.title,
                        level: course.level,
                        delivery_format: course.deliveryFormat,
                        base_price: course.basePrice,
                        discounted_price: course.discountedPrice,
                        discount_percent: course.discountPercent,
                        visible: course.isVisible,
                        display_order: course.displayOrder,
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
                    <TableHead>Course</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((course) => {
                    const hasDiscount = course.discountedPrice < course.basePrice;

                    return (
                      <TableRow key={course.recordId}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{course.title}</p>
                            <p className="text-xs text-slate-500">/{course.slug}</p>
                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{course.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {hasDiscount ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-slate-400 line-through">{formatCoursePrice(course.basePrice)}</span>
                                <span className="font-semibold text-[#E6242A]">{formatCoursePrice(course.discountedPrice)}</span>
                              </div>
                            ) : (
                              <p className="font-semibold text-slate-900">{formatCoursePrice(course.discountedPrice)}</p>
                            )}
                            <p className="text-xs text-slate-500">
                              {course.fixedPrice !== null
                                ? "Fixed course price"
                                : `${course.sixtyMinuteClasses} x 60 min, ${course.ninetyMinuteClasses} x 90 min`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{course.level}</p>
                            <p className="text-xs text-slate-500">{course.deliveryFormat}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            <AdminStatusBadge
                              label={course.isVisible ? "Visible" : "Hidden"}
                              toneClassName={course.isVisible ? visibilityTone.visible : visibilityTone.hidden}
                            />
                            {course.discountPercent > 0 ? (
                              <span className="inline-flex rounded-full bg-[#E6242A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#E6242A]">
                                {course.discountPercent}% off
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>{course.displayOrder}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void toggleVisibility(course)}
                              disabled={busyCourseId === course.recordId}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {course.isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              {course.isVisible ? "Hide" : "Unhide"}
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(course)}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                            >
                              <SquarePen className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id: course.recordId, label: course.title })}
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
              <p>Showing {paginated.items.length} of {filteredCourses.length} filtered courses.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.recordId ? "Edit course" : "Add course"}
            description="Create or update a database-backed course used by the public course pages, package builder, and pricing views."
            fields={fieldsForEditor(Boolean(editorState?.recordId))}
            values={editorState?.values ?? createEmptyCourseValues((coursesQuery.data?.courses.length ?? 0) + 1)}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.recordId ? "Save changes" : "Create course"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete course"
            description={`Delete ${deleteTarget?.label ?? "this course"} from the admin panel. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminCourses;
