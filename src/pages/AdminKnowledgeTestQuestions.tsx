import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleHelp, Download, FileText, ListChecks, Plus, Search, SquarePen, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import AffiliateMetricCard from "@/components/affiliate/AffiliateMetricCard";
import { affiliateSurfaceClassName } from "@/components/affiliate/styles";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminPortalShell from "@/components/admin/AdminPortalShell";
import AdminRecordDialog, { type AdminRecordDialogField } from "@/components/admin/AdminRecordDialog";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminFormValues } from "@/lib/adminCrud";
import { normalizeRequiredString } from "@/lib/adminCrud";
import {
  deleteAdminKnowledgeTestQuestion,
  importAdminKnowledgeTestQuestions,
  saveAdminKnowledgeTestQuestion,
} from "@/lib/adminCrudApi";
import { getAdminKnowledgeTestQuestions } from "@/lib/affiliateApi";
import { ADMIN_ROWS_PER_PAGE, matchesSearch, paginateItems } from "@/lib/adminPanel";
import type {
  AdminKnowledgeTestQuestionUpsertInput,
  AdminKnowledgeTestQuestionRecord,
  KnowledgeTestQuestionCategory,
  KnowledgeTestQuestionOptionKey,
} from "@/lib/affiliateTypes";
import { parseCsvRecords } from "@/lib/csv";
import { downloadCsv } from "@/lib/exportCsv";
import {
  getKnowledgeTestQuestionOptionText,
  knowledgeTestQuestionCategories,
  knowledgeTestQuestionCategoryLabels,
  knowledgeTestQuestionOptionLabels,
} from "@/lib/knowledgeTestService";

type QuestionEditorState = {
  recordId?: string;
  values: AdminFormValues;
};

const categoryTone: Record<KnowledgeTestQuestionCategory, string> = {
  road_signs: "bg-[#1d52a1]/10 text-[#1d52a1]",
  rules_of_the_road: "bg-[#F5B13A]/15 text-[#9A6400]",
  hazard_awareness: "bg-emerald-100 text-emerald-700",
  safe_driving: "bg-slate-200 text-slate-700",
  road_markings: "bg-[#E6242A]/10 text-[#B91C1C]",
};

const createEmptyQuestionValues = (): AdminFormValues => ({
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "a",
  category: "rules_of_the_road",
  explanation: "",
});

const toEditorValues = (question: AdminKnowledgeTestQuestionRecord): AdminFormValues => ({
  questionText: question.questionText,
  optionA: question.optionA,
  optionB: question.optionB,
  optionC: question.optionC,
  optionD: question.optionD,
  correctOption: question.correctOption,
  category: question.category,
  explanation: question.explanation ?? "",
});

const editorFields: AdminRecordDialogField[] = [
  {
    key: "questionText",
    label: "Question text",
    type: "textarea",
    fullWidth: true,
    rows: 4,
    placeholder: "What should you do when you approach a flashing red traffic light?",
  },
  { key: "optionA", label: "Option A", type: "text", placeholder: "Come to a complete stop, then proceed when it is safe" },
  { key: "optionB", label: "Option B", type: "text", placeholder: "Slow down and continue if no vehicles are coming" },
  { key: "optionC", label: "Option C", type: "text", placeholder: "Yield only to pedestrians" },
  { key: "optionD", label: "Option D", type: "text", placeholder: "Continue through the intersection" },
  {
    key: "correctOption",
    label: "Correct answer",
    type: "select",
    options: (["a", "b", "c", "d"] satisfies KnowledgeTestQuestionOptionKey[]).map((option) => ({
      label: `Option ${knowledgeTestQuestionOptionLabels[option]}`,
      value: option,
    })),
  },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: knowledgeTestQuestionCategories.map((category) => ({
      label: category.label,
      value: category.value,
    })),
  },
  {
    key: "explanation",
    label: "Explanation",
    type: "textarea",
    fullWidth: true,
    rows: 5,
    placeholder: "Explain why the correct answer is right so students can learn from the result screen.",
  },
];

const buildQuestionInput = (values: AdminFormValues, recordId?: string) => ({
  id: recordId,
  questionText: normalizeRequiredString(String(values.questionText ?? ""), "Question text"),
  optionA: normalizeRequiredString(String(values.optionA ?? ""), "Option A"),
  optionB: normalizeRequiredString(String(values.optionB ?? ""), "Option B"),
  optionC: normalizeRequiredString(String(values.optionC ?? ""), "Option C"),
  optionD: normalizeRequiredString(String(values.optionD ?? ""), "Option D"),
  correctOption: values.correctOption as KnowledgeTestQuestionOptionKey,
  category: values.category as KnowledgeTestQuestionCategory,
  explanation: String(values.explanation ?? "").trim(),
});

const csvTemplateRows = [
  {
    category: "rules_of_the_road",
    question_text: "What should you do when you approach a flashing red traffic light?",
    option_a: "Come to a complete stop, then proceed when it is safe",
    option_b: "Slow down and continue if no vehicles are coming",
    option_c: "Yield only to pedestrians",
    option_d: "Continue through the intersection because it is not a full red light",
    correct_option: "a",
    explanation: "A flashing red light is treated like a stop sign. You must stop completely and only continue when it is safe.",
  },
];

const normalizeCsvKey = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

const importedCategoryMap: Record<string, KnowledgeTestQuestionCategory> = {
  road_signs: "road_signs",
  roadsigns: "road_signs",
  rules_of_the_road: "rules_of_the_road",
  rulesoftheroad: "rules_of_the_road",
  rules: "rules_of_the_road",
  hazard_awareness: "hazard_awareness",
  hazardawareness: "hazard_awareness",
  safe_driving: "safe_driving",
  safedriving: "safe_driving",
  road_markings: "road_markings",
  roadmarkings: "road_markings",
};

const normalizeImportedOption = (value: string, rowNumber: number): KnowledgeTestQuestionOptionKey => {
  const normalized = value.trim().toLowerCase().replace(/^option\s+/, "");

  if (normalized === "a" || normalized === "b" || normalized === "c" || normalized === "d") {
    return normalized;
  }

  throw new Error(`Row ${rowNumber}: correct_option must be A, B, C, or D.`);
};

const normalizeImportedCategory = (value: string, rowNumber: number): KnowledgeTestQuestionCategory => {
  const normalized = normalizeCsvKey(value);
  const category = importedCategoryMap[normalized];

  if (!category) {
    throw new Error(
      `Row ${rowNumber}: category must be one of road_signs, rules_of_the_road, hazard_awareness, safe_driving, or road_markings.`,
    );
  }

  return category;
};

const buildQuestionInputFromCsv = (
  rawRecord: Record<string, string>,
  rowNumber: number,
): AdminKnowledgeTestQuestionUpsertInput => {
  const record = Object.entries(rawRecord).reduce<Record<string, string>>((normalized, [key, value]) => {
    normalized[normalizeCsvKey(key)] = value;
    return normalized;
  }, {});

  const questionText = record.question_text || record.question || record.questiontext;
  const optionA = record.option_a || record.optiona;
  const optionB = record.option_b || record.optionb;
  const optionC = record.option_c || record.optionc;
  const optionD = record.option_d || record.optiond;
  const correctOption = record.correct_option || record.correctoption || record.answer;
  const category = record.category;

  return {
    id: record.id?.trim() || undefined,
    questionText: normalizeRequiredString(questionText ?? "", `Row ${rowNumber}: question_text`),
    optionA: normalizeRequiredString(optionA ?? "", `Row ${rowNumber}: option_a`),
    optionB: normalizeRequiredString(optionB ?? "", `Row ${rowNumber}: option_b`),
    optionC: normalizeRequiredString(optionC ?? "", `Row ${rowNumber}: option_c`),
    optionD: normalizeRequiredString(optionD ?? "", `Row ${rowNumber}: option_d`),
    correctOption: normalizeImportedOption(correctOption ?? "", rowNumber),
    category: normalizeImportedCategory(category ?? "", rowNumber),
    explanation: record.explanation?.trim() || null,
  };
};

const AdminKnowledgeTestQuestions = () => {
  const queryClient = useQueryClient();
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const questionsQuery = useQuery({
    queryKey: ["admin-knowledge-test-questions"],
    queryFn: getAdminKnowledgeTestQuestions,
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | KnowledgeTestQuestionCategory>("all");
  const [page, setPage] = useState(1);
  const [editorState, setEditorState] = useState<QuestionEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const filteredQuestions = useMemo(() => {
    const questions = questionsQuery.data?.questions ?? [];

    return questions.filter((question) => {
      if (categoryFilter !== "all" && question.category !== categoryFilter) return false;
      if (
        !matchesSearch(search, [
          question.questionText,
          question.optionA,
          question.optionB,
          question.optionC,
          question.optionD,
          question.explanation,
          knowledgeTestQuestionCategoryLabels[question.category],
        ])
      ) {
        return false;
      }

      return true;
    });
  }, [categoryFilter, questionsQuery.data?.questions, search]);

  const paginated = useMemo(
    () => paginateItems(filteredQuestions, page, ADMIN_ROWS_PER_PAGE),
    [filteredQuestions, page],
  );

  const setFormValue = (key: string, value: string | boolean) => {
    setEditorState((current) => (current ? { ...current, values: { ...current.values, [key]: value } } : current));
  };

  const refreshQuestions = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-knowledge-test-questions"] });
    await queryClient.invalidateQueries({ queryKey: ["knowledge-test-questions"] });
  };

  const handleSave = async () => {
    if (!editorState) return;

    setIsSaving(true);
    try {
      await saveAdminKnowledgeTestQuestion(buildQuestionInput(editorState.values, editorState.recordId));
      toast.success(editorState.recordId ? "Question updated." : "Question created.");
      setEditorState(null);
      await refreshQuestions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save question.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminKnowledgeTestQuestion(deleteTarget.id);
      toast.success("Question deleted.");
      setDeleteTarget(null);
      await refreshQuestions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete question.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setIsImporting(true);
    try {
      const csvText = await file.text();
      const records = parseCsvRecords(csvText);

      if (records.length === 0) {
        throw new Error("CSV file does not contain any question rows.");
      }

      const questions = records.map((record, index) => buildQuestionInputFromCsv(record, index + 2));
      const result = await importAdminKnowledgeTestQuestions(questions);
      toast.success(
        `CSV import complete: ${questions.length} question${questions.length === 1 ? "" : "s"} processed (${result.inserted} inserted, ${result.updated} updated).`,
      );
      await refreshQuestions();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to import CSV.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AdminPortalShell
      eyebrow="Knowledge Test Control"
      title={
        <>
          Manage the <span className="text-[#F5B13A]">ICBC practice question bank</span>
        </>
      }
      description="Add, edit, and remove learner test practice questions without touching code. The public practice page reads directly from this Supabase-backed question bank."
      pageTitle="Knowledge Test"
      pageDescription="Use this page to maintain question wording, answer options, categories, and learning explanations. Changes appear on the public practice test after the next query refresh."
    >
      {questionsQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading question bank...</div>
      ) : questionsQuery.isError || !questionsQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {questionsQuery.error instanceof Error ? questionsQuery.error.message : "Unable to load questions."}
        </div>
      ) : (
        <>
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => void handleImportFile(event)}
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AffiliateMetricCard label="Total questions" value={questionsQuery.data.totals.totalQuestions.toString()} icon={<CircleHelp className="h-5 w-5" />} />
            <AffiliateMetricCard label="Categories covered" value={questionsQuery.data.totals.categoriesCovered.toString()} icon={<ListChecks className="h-5 w-5" />} />
            <AffiliateMetricCard label="With explanations" value={questionsQuery.data.totals.withExplanations.toString()} icon={<FileText className="h-5 w-5" />} />
            <AffiliateMetricCard label="Search results" value={filteredQuestions.length.toString()} icon={<Search className="h-5 w-5" />} />
          </div>

          <div className={affiliateSurfaceClassName}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="grid gap-4 md:grid-cols-2 xl:flex-1">
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search questions, answers, or explanations..."
                  className="h-12 rounded-xl border-slate-200"
                />
                <Select
                  value={categoryFilter}
                  onValueChange={(value: "all" | KnowledgeTestQuestionCategory) => {
                    setCategoryFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {knowledgeTestQuestionCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditorState({ values: createEmptyQuestionValues() })}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                >
                  <Plus className="h-4 w-4" />
                  Add question
                </button>
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  disabled={isImporting}
                  className="inline-flex items-center gap-2 rounded-full border border-[#1d52a1] px-4 py-2 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload className="h-4 w-4" />
                  {isImporting ? "Importing..." : "Import CSV"}
                </button>
                <button
                  type="button"
                  onClick={() => downloadCsv("knowledge-test-import-template.csv", csvTemplateRows)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <FileText className="h-4 w-4" />
                  Download template
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      "knowledge-test-questions.csv",
                      filteredQuestions.map((question) => ({
                        category: question.category,
                        question_text: question.questionText,
                        option_a: question.optionA,
                        option_b: question.optionB,
                        option_c: question.optionC,
                        option_d: question.optionD,
                        correct_option: question.correctOption,
                        explanation: question.explanation ?? "",
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

            <Alert className="mt-6 rounded-3xl border-[#1d52a1]/20 bg-[#1d52a1]/5 text-slate-800 [&>svg]:text-[#1d52a1]">
              <FileText className="h-4 w-4" />
              <AlertTitle className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">
                CSV import format
              </AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  Use the same columns as the export file: <code>category</code>, <code>question_text</code>, <code>option_a</code>, <code>option_b</code>, <code>option_c</code>, <code>option_d</code>, <code>correct_option</code>, and optional <code>explanation</code>.
                </p>
                <p>
                  Add an optional <code>id</code> column if you want the import to update existing questions instead of inserting new ones.
                </p>
              </AlertDescription>
            </Alert>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Correct answer</TableHead>
                    <TableHead>Explanation</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.items.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="min-w-[360px]">
                        <div>
                          <p className="font-semibold text-slate-900">{question.questionText}</p>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                            A. {question.optionA} B. {question.optionB}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AdminStatusBadge
                          label={knowledgeTestQuestionCategoryLabels[question.category]}
                          toneClassName={categoryTone[question.category]}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-slate-900">
                          {knowledgeTestQuestionOptionLabels[question.correctOption]}.{" "}
                          {getKnowledgeTestQuestionOptionText(question, question.correctOption)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {question.explanation?.trim() ? question.explanation : "No explanation added yet."}
                        </p>
                      </TableCell>
                      <TableCell>{new Date(question.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditorState({ recordId: question.id, values: toEditorValues(question) })}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            <SquarePen className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ id: question.id, label: question.questionText })}
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
              <p>Showing {paginated.items.length} of {filteredQuestions.length} filtered questions.</p>
              <AdminPagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
            </div>
          </div>

          <AdminRecordDialog
            open={Boolean(editorState)}
            onOpenChange={(open) => !open && setEditorState(null)}
            title={editorState?.recordId ? "Edit question" : "Add question"}
            description="Create or update a multiple-choice learner knowledge test question. The public practice test uses these records directly."
            fields={editorFields}
            values={editorState?.values ?? createEmptyQuestionValues()}
            onValueChange={setFormValue}
            onSave={() => void handleSave()}
            isSaving={isSaving}
            saveLabel={editorState?.recordId ? "Save changes" : "Create question"}
          />

          <AdminDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete question"
            description={`Delete ${deleteTarget?.label ?? "this question"} from the practice test bank. This cannot be undone.`}
            isDeleting={isDeleting}
            onDelete={() => void handleDelete()}
          />
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminKnowledgeTestQuestions;
