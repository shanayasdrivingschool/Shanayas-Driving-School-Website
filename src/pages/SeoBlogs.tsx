import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bold,
  BookOpen,
  CheckCircle2,
  Eye,
  ExternalLink,
  FilePenLine,
  Globe2,
  GripVertical,
  Heading2,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Link2,
  Megaphone,
  PanelRightClose,
  PanelRightOpen,
  Pilcrow,
  Plus,
  Quote,
  Save,
  Search,
  Trash2,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
import AdminMetricCard from "@/components/admin/AdminMetricCard";
import SeoPortalShell from "@/components/seo/SeoPortalShell";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import {
  adminDangerOutlineButtonClassName,
  adminPrimaryButtonClassName,
  adminRowButtonClassName,
  adminSecondaryButtonClassName,
  adminSurfaceClassName,
} from "@/components/admin/styles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteSeoBlogPost, publishSeoBlogPost, saveSeoBlogPost, uploadSeoBlogImage } from "@/lib/seoCrudApi";
import { getSeoBlogPosts } from "@/lib/seoApi";
import {
  buildBlogSchemaPreview,
  createBlogAnnotation,
  createBlogContentBlock,
  createBlogFaq,
  createEmptyBlogPost,
  slugifyBlogTitle,
  validateBlogPublication,
  validateBlogPost,
  type AdminBlogPostUpsertInput,
  type BlogBlockType,
  type BlogContentBlock,
  type BlogPostRecord,
  type BlogPostStatus,
} from "@/lib/blogAdmin";
import { adminQueryOptions, refreshAdminQueries } from "@/lib/adminQueries";
import { sanitizeBlogHtml } from "@/lib/blogHtml";
import { cn } from "@/lib/utils";

const statusLabels: Record<BlogPostStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

const statusTones: Record<BlogPostStatus, string> = {
  draft: "bg-slate-200 text-slate-700",
  in_review: "bg-amber-100 text-amber-800",
  approved: "bg-blue-100 text-blue-800",
  scheduled: "bg-violet-100 text-violet-800",
  published: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-600",
};

const readinessLabels = {
  needs_revision: "Needs revision",
  awaiting_evidence_review: "Draft awaiting evidence/review",
  ready: "Ready",
} as const;

const publicationLabels = {
  draft_only: "Draft only",
  implemented_locally: "Implemented locally",
  live_confirmed: "Live confirmed",
  publication_unverified: "Publication unverified",
} as const;

const blockLabels: Record<BlogBlockType, string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  bulleted_list: "Bulleted list",
  numbered_list: "Numbered list",
  quote: "Quote",
  callout: "Callout",
  link: "Link",
  rich_html: "Imported rich content",
};

const BLOG_BLOCK_DRAG_TYPE = "application/x-shanaya-blog-block";

const blockLibraryItems: Array<{
  choice: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  { choice: "paragraph", label: "Paragraph", description: "Regular body copy", icon: <Pilcrow className="h-4 w-4" /> },
  { choice: "heading:2", label: "Heading 2", description: "Main page section", icon: <Heading2 className="h-4 w-4" /> },
  { choice: "heading:3", label: "Heading 3", description: "Subsection heading", icon: <Heading2 className="h-4 w-4" /> },
  { choice: "bulleted_list", label: "Bulleted list", description: "Unordered points", icon: <List className="h-4 w-4" /> },
  { choice: "numbered_list", label: "Numbered list", description: "Ordered steps", icon: <ListOrdered className="h-4 w-4" /> },
  { choice: "quote", label: "Quote", description: "Highlighted quotation", icon: <Quote className="h-4 w-4" /> },
  { choice: "callout", label: "Callout", description: "Important note or tip", icon: <Megaphone className="h-4 w-4" /> },
  { choice: "link", label: "Link", description: "Internal or external link", icon: <Link2 className="h-4 w-4" /> },
];

const createBlockFromChoice = (choice: string) => {
  const [typeValue, levelValue] = choice.split(":");
  const type = typeValue as BlogBlockType;
  const block = createBlogContentBlock(type);
  if (type === "heading" && levelValue) {
    block.level = Number(levelValue) as 1 | 2 | 3 | 4 | 5 | 6;
  }
  return block;
};

const getSafeBlockHref = (block: BlogContentBlock) => {
  const url = block.url?.trim() ?? "";
  if (block.linkKind === "internal") return url.startsWith("/") && !url.startsWith("//") ? url : "#";
  return /^https:\/\//i.test(url) ? url : "#";
};

const fieldClassName = "h-11 rounded-xl border-slate-200";
const textareaClassName = "rounded-xl border-slate-200 leading-relaxed";
const richContentClassName = "space-y-5 text-[17px] leading-8 text-slate-700 [&_a]:font-semibold [&_a]:text-[#1d52a1] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#1d52a1] [&_blockquote]:bg-blue-50 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_h1]:pt-5 [&_h1]:text-4xl [&_h1]:font-black [&_h1]:leading-tight [&_h1]:text-slate-900 [&_h2]:pt-5 [&_h2]:text-3xl [&_h2]:font-black [&_h2]:leading-tight [&_h2]:text-slate-900 [&_h3]:pt-4 [&_h3]:text-2xl [&_h3]:font-black [&_h3]:text-slate-900 [&_h4]:pt-3 [&_h4]:text-xl [&_h4]:font-black [&_h5]:pt-2 [&_h5]:text-lg [&_h5]:font-black [&_h6]:pt-2 [&_h6]:text-base [&_h6]:font-black [&_li]:ml-6 [&_ol]:list-decimal [&_table]:w-full [&_table]:min-w-[40rem] [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-slate-200 [&_td]:p-3 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-100 [&_th]:p-3 [&_th]:text-left [&_ul]:list-disc";

const toLocalDateTime = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toIsoDateTime = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

const clonePost = (post: BlogPostRecord): AdminBlogPostUpsertInput => ({
  ...post,
  contentBlocks: post.contentBlocks.map((block) => ({ ...block, items: block.items ? [...block.items] : undefined })),
  faqs: post.faqs.map((faq) => ({ ...faq })),
  relatedSlugs: [...post.relatedSlugs],
  annotations: post.annotations.map((annotation) => ({ ...annotation })),
  brief: { ...post.brief },
});

const createPreviewPost = (): AdminBlogPostUpsertInput => {
  const preview = createEmptyBlogPost();
  const paragraph = createBlogContentBlock("paragraph");
  const heading = createBlogContentBlock("heading");
  const list = createBlogContentBlock("bulleted_list");

  return {
    ...preview,
    title: "How to Prepare for Your ICBC Knowledge Test",
    slug: "prepare-for-icbc-knowledge-test",
    category: "Knowledge Test",
    excerpt: "A local preparation guide for new drivers studying for the ICBC knowledge test in Greater Victoria.",
    seoTitle: "How to Prepare for the ICBC Knowledge Test",
    metaDescription: "Learn how to organize your ICBC knowledge-test study plan, practise road signs and check current requirements before test day.",
    canonicalPath: "/blog/prepare-for-icbc-knowledge-test/",
    sourceOrigin: "code_import",
    publishedSnapshot: { slug: "prepare-for-icbc-knowledge-test", title: "How to Prepare for Your ICBC Knowledge Test" },
    publishedRevisionAt: "2026-10-08T00:00:00.000Z",
    contentBlocks: [
      { ...paragraph, text: "Start with ICBC's current Learn to Drive Smart guide, then use practice questions to find the topics that need another review." },
      { ...heading, level: 2, text: "Build a focused study plan" },
      { ...createBlogContentBlock("paragraph"), text: "Short, repeated study sessions make it easier to review road signs, rules and hazard-awareness concepts without rushing." },
      { ...list, items: ["Read one guide section", "Complete a practice set", "Review every missed answer", "Repeat weak topics"] },
    ],
    faqs: [{ ...createBlogFaq(), question: "What should I study first?", answer: "Begin with the current ICBC Learn to Drive Smart guide and check the official test information before making your plan." }],
    brief: {
      ...preview.brief,
      primaryReader: "A new driver preparing for the passenger-vehicle knowledge test",
      targetQuestion: "How should I organize my ICBC knowledge-test preparation?",
      intendedOutcome: "Leave with a clear, repeatable study plan",
      overlap: "A planning guide rather than a duplicate bank of practice questions",
      originalContribution: "A practical study loop and pre-test checklist",
    },
  };
};

const Field = ({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="font-bold text-slate-900">{label}</Label>
    {help ? <p className="text-xs leading-relaxed text-slate-500">{help}</p> : null}
    {children}
  </div>
);

const ToggleField = ({
  label,
  help,
  checked,
  onChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
    <div>
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{help}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

type ContentBlocksEditorProps = {
  blocks: BlogContentBlock[];
  onChange: (blocks: BlogContentBlock[]) => void;
};

type BlockLibraryProps = {
  blocks: BlogContentBlock[];
  onChange: (blocks: BlogContentBlock[]) => void;
  onInsert: (choice: string) => void;
};

const BlockLibrary = ({ blocks, onChange, onInsert }: BlockLibraryProps) => {
  const [panelMode, setPanelMode] = useState<"add" | "structure">("add");
  const [structureDropIndex, setStructureDropIndex] = useState<number | null>(null);
  const [activeStructureInsert, setActiveStructureInsert] = useState<number | null>(null);

  const insertAt = (choice: string, index: number) => {
    const next = [...blocks];
    next.splice(index, 0, createBlockFromChoice(choice));
    onChange(next);
    setActiveStructureInsert(null);
  };

  const handleStructureDrop = (event: DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    setStructureDropIndex(null);
    try {
      const payload = JSON.parse(event.dataTransfer.getData(BLOG_BLOCK_DRAG_TYPE)) as
        | { kind: "new"; choice: string }
        | { kind: "move"; id: string };
      if (payload.kind === "new") {
        insertAt(payload.choice, targetIndex);
        return;
      }
      const sourceIndex = blocks.findIndex((block) => block.id === payload.id);
      if (sourceIndex < 0) return;
      const next = blocks.filter((block) => block.id !== payload.id);
      next.splice(sourceIndex < targetIndex ? targetIndex - 1 : targetIndex, 0, blocks[sourceIndex]);
      onChange(next);
    } catch {
      // Ignore unrelated drag data.
    }
  };

  const StructureInsertPoint = ({ index }: { index: number }) => {
    const [blockSearch, setBlockSearch] = useState("");
    const filteredItems = blockLibraryItems.filter((item) => {
      const query = blockSearch.trim().toLowerCase();
      return !query || `${item.label} ${item.description}`.toLowerCase().includes(query);
    });

    return (
      <div
        className={cn("group relative h-6 cursor-pointer", structureDropIndex === index && "bg-blue-50")}
        onClick={() => setActiveStructureInsert(index)}
        onDragEnter={(event) => { event.preventDefault(); setStructureDropIndex(index); }}
        onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === "copy" ? "copy" : "move"; }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setStructureDropIndex(null); }}
        onDrop={(event) => handleStructureDrop(event, index)}
      >
        <span className={cn("absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-blue-200 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100", (structureDropIndex === index || activeStructureInsert === index) && "bg-[#1d52a1] opacity-100")} />
        <DropdownMenu onOpenChange={(open) => { if (!open) { setActiveStructureInsert((current) => current === index ? null : current); setBlockSearch(""); } }}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Insert content in structure at position ${index + 1}`}
              className={cn("absolute left-1/2 top-1/2 z-10 inline-flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-200 bg-white text-[#1d52a1] opacity-0 hover:border-[#1d52a1] hover:bg-blue-50 group-hover:opacity-100 group-focus-within:opacity-100", (structureDropIndex === index || activeStructureInsert === index) && "opacity-100")}
              onClick={(event) => { event.stopPropagation(); setActiveStructureInsert(index); }}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-2">
            <div className="relative mb-2" onKeyDown={(event) => event.stopPropagation()}>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input autoFocus value={blockSearch} onChange={(event) => setBlockSearch(event.target.value)} onClick={(event) => event.stopPropagation()} className="h-10 rounded-lg border-slate-200 pl-9 shadow-none" placeholder="Search blocks…" aria-label="Search structure blocks" />
            </div>
            {filteredItems.map((item) => (
              <DropdownMenuItem key={item.choice} className="gap-3 rounded-lg px-3 py-2.5" onSelect={() => insertAt(item.choice, index)}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">{item.icon}</span>
                <span><span className="block text-sm font-bold text-slate-800">{item.label}</span><span className="block text-xs text-slate-500">{item.description}</span></span>
              </DropdownMenuItem>
            ))}
            {!filteredItems.length ? <p className="px-3 py-5 text-center text-sm text-slate-500">No matching blocks.</p> : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const blockSummary = (block: BlogContentBlock) => {
    if (block.type === "heading") return block.text || "Untitled heading";
    if (block.type === "bulleted_list" || block.type === "numbered_list") return (block.items ?? []).filter(Boolean).join(", ") || "Empty list";
    if (block.type === "link") return block.text || block.url || "Empty link";
    return block.text || blockLabels[block.type];
  };

  return (
    <aside className="hidden pr-4 xl:block">
      <div className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="px-1 pb-3">
          <h2 className="text-sm font-black text-slate-900">Content blocks</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">Add new blocks or arrange this page.</p>
        </div>
        <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button type="button" className={cn("rounded-md px-2 py-1.5 text-xs font-bold", panelMode === "add" ? "bg-white text-[#1d52a1] shadow-sm" : "text-slate-500")} onClick={() => setPanelMode("add")}>Add</button>
          <button type="button" className={cn("rounded-md px-2 py-1.5 text-xs font-bold", panelMode === "structure" ? "bg-white text-[#1d52a1] shadow-sm" : "text-slate-500")} onClick={() => setPanelMode("structure")}>Structure</button>
        </div>

        {panelMode === "add" ? (
          <div className="mt-2 space-y-1.5">
            {blockLibraryItems.map((item) => (
              <button
                key={item.choice}
                type="button"
                draggable
                className="group flex w-full cursor-grab items-center gap-2 rounded-lg border border-transparent px-2 py-2 text-left transition-colors hover:border-blue-100 hover:bg-blue-50 active:cursor-grabbing"
                onClick={() => onInsert(item.choice)}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "copy";
                  event.dataTransfer.setData(BLOG_BLOCK_DRAG_TYPE, JSON.stringify({ kind: "new", choice: item.choice }));
                  event.dataTransfer.setData("text/plain", item.label);
                }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition-colors group-hover:bg-white group-hover:text-[#1d52a1]">{item.icon}</span>
                <span className="min-w-0"><span className="block text-xs font-bold text-slate-800">{item.label}</span><span className="block text-[10px] leading-tight text-slate-400">{item.description}</span></span>
                <GripVertical className="ml-auto h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500" />
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-2">
            <StructureInsertPoint index={0} />
            {blocks.map((block, index) => (
              <div key={block.id}>
                <div
                  className="group flex items-start gap-2 rounded-lg border border-transparent px-2 py-2 hover:border-blue-100 hover:bg-blue-50"
                  onDragOver={(event) => {
                    event.preventDefault();
                    const bounds = event.currentTarget.getBoundingClientRect();
                    setStructureDropIndex(event.clientY < bounds.top + bounds.height / 2 ? index : index + 1);
                    event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === "copy" ? "copy" : "move";
                  }}
                  onDrop={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    handleStructureDrop(event, event.clientY < bounds.top + bounds.height / 2 ? index : index + 1);
                  }}
                >
                  <button
                    type="button"
                    draggable
                    aria-label={`Drag ${block.type === "heading" ? `heading ${block.level ?? 2}` : blockLabels[block.type]} in structure`}
                    className="mt-0.5 cursor-grab rounded text-slate-300 group-hover:text-[#1d52a1] active:cursor-grabbing"
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData(BLOG_BLOCK_DRAG_TYPE, JSON.stringify({ kind: "move", id: block.id }));
                    }}
                    onDragEnd={() => setStructureDropIndex(null)}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <span className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">{block.type === "heading" ? `H${block.level ?? 2}` : blockLabels[block.type]}</span><span className="mt-0.5 block line-clamp-2 text-xs leading-snug text-slate-700">{blockSummary(block)}</span></span>
                </div>
                <StructureInsertPoint index={index + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

type RichHtmlBlockEditorProps = {
  block: BlogContentBlock;
  onChange: (patch: Partial<BlogContentBlock>) => void;
};

const RichHtmlBlockEditor = ({ block, onChange }: RichHtmlBlockEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkKind, setLinkKind] = useState<"internal" | "external">("internal");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);

  const captureSelection = () => {
    const selection = window.getSelection();
    const editor = editorRef.current;
    if (!selection || !selection.rangeCount || !editor) return;
    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) savedRangeRef.current = range.cloneRange();
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    if (!range) return null;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    return range;
  };

  const syncContent = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = sanitizeBlogHtml(editor.innerHTML);
    if (editor.innerHTML !== html) editor.innerHTML = html;
    onChange({ html, text: editor.textContent?.trim() ?? "" });
  };

  const runEditorCommand = (command: string, value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    restoreSelection();
    document.execCommand(command, false, value);
    captureSelection();
    syncContent();
  };

  const changeBlockTag = (tagName: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    captureSelection();
    editor.focus();
    const range = restoreSelection();
    if (!range) {
      toast.error("Place the cursor in a paragraph or heading first.");
      return;
    }

    const selectedText = range.toString().trim();
    const getEditableBlock = (node: Node | null) => {
      const element = node instanceof Element ? node : node?.parentElement;
      const candidate = element?.closest("p, h1, h2, h3, h4, h5, h6");
      return candidate && editor.contains(candidate) ? candidate : null;
    };
    const startBlock = getEditableBlock(range.startContainer);
    const endBlock = getEditableBlock(range.endContainer);
    let target = startBlock;
    if (selectedText && target && !target.textContent?.includes(selectedText) && endBlock?.textContent?.includes(selectedText)) {
      target = endBlock;
    }
    if (selectedText) {
      const exactMatch = Array.from(editor.querySelectorAll("p, h1, h2, h3, h4, h5, h6")).find(
        (element) => element.textContent?.trim() === selectedText,
      );
      if (exactMatch) target = exactMatch;
    }
    if (!target) {
      toast.error("Heading levels can be applied to paragraphs and headings.");
      return;
    }

    const replacement = document.createElement(tagName);
    while (target.firstChild) replacement.appendChild(target.firstChild);
    target.replaceWith(replacement);
    const nextRange = document.createRange();
    nextRange.selectNodeContents(replacement);
    nextRange.collapse(false);
    savedRangeRef.current = nextRange;
    restoreSelection();
    syncContent();
  };

  const closestLink = (node: Node | null) => {
    const element = node instanceof Element ? node : node?.parentElement;
    const link = element?.closest("a");
    return link && editorRef.current?.contains(link) ? link : null;
  };

  const openLinkEditor = () => {
    captureSelection();
    const range = savedRangeRef.current;
    const link = closestLink(range?.startContainer ?? null);
    const href = link?.getAttribute("href") ?? "";
    const external = /^https:\/\//i.test(href);
    setLinkKind(external ? "external" : "internal");
    setLinkText(link?.textContent ?? range?.toString() ?? "");
    setLinkUrl(href);
    setOpenInNewTab(link?.getAttribute("target") === "_blank");
    setLinkPanelOpen(true);
  };

  const applyLink = () => {
    const editor = editorRef.current;
    const href = linkUrl.trim();
    const safeInternal = href.startsWith("/") && !href.startsWith("//");
    const safeExternal = /^https:\/\//i.test(href);
    if ((linkKind === "internal" && !safeInternal) || (linkKind === "external" && !safeExternal)) {
      toast.error(linkKind === "internal" ? "Internal links must begin with one slash (/)." : "External links must use a complete HTTPS URL.");
      return;
    }
    if (!editor) return;

    editor.focus();
    const range = restoreSelection();
    const existingLink = closestLink(range?.startContainer ?? null);
    const link = existingLink ?? document.createElement("a");
    link.setAttribute("href", href);
    if (linkKind === "external" && openInNewTab) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }

    if (existingLink) {
      if (linkText.trim()) existingLink.textContent = linkText.trim();
    } else if (range) {
      if (!range.collapsed && !linkText.trim()) {
        try {
          range.surroundContents(link);
        } catch {
          link.appendChild(range.extractContents());
          range.insertNode(link);
        }
      } else {
        link.textContent = linkText.trim() || href;
        range.deleteContents();
        range.insertNode(link);
      }
      const nextRange = document.createRange();
      nextRange.setStartAfter(link);
      nextRange.collapse(true);
      savedRangeRef.current = nextRange;
      restoreSelection();
    } else {
      link.textContent = linkText.trim() || href;
      editor.append(link);
    }

    setLinkPanelOpen(false);
    syncContent();
  };

  const toolbarButtonClassName = "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-[#1d52a1]";

  return (
    <div className="overflow-hidden rounded-xl border border-blue-100 bg-blue-50/30">
      <div className="border-b border-blue-100 bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Change paragraph or heading level"
            defaultValue=""
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#1d52a1]"
            onMouseDown={captureSelection}
            onChange={(event) => {
              if (event.target.value) changeBlockTag(event.target.value);
              event.currentTarget.value = "";
            }}
          >
            <option value="" disabled>Paragraph / heading</option>
            <option value="p">Paragraph</option>
            {[1, 2, 3, 4, 5, 6].map((level) => <option key={level} value={`h${level}`}>Heading {level} (H{level})</option>)}
          </select>
          <button type="button" className={toolbarButtonClassName} aria-label="Bold" title="Bold" onMouseDown={(event) => { event.preventDefault(); runEditorCommand("bold"); }}><Bold className="h-4 w-4" /></button>
          <button type="button" className={toolbarButtonClassName} aria-label="Italic" title="Italic" onMouseDown={(event) => { event.preventDefault(); runEditorCommand("italic"); }}><Italic className="h-4 w-4" /></button>
          <button type="button" className={toolbarButtonClassName} aria-label="Bulleted list" title="Bulleted list" onMouseDown={(event) => { event.preventDefault(); runEditorCommand("insertUnorderedList"); }}><List className="h-4 w-4" /></button>
          <button type="button" className={toolbarButtonClassName} aria-label="Numbered list" title="Numbered list" onMouseDown={(event) => { event.preventDefault(); runEditorCommand("insertOrderedList"); }}><ListOrdered className="h-4 w-4" /></button>
          <button type="button" className={cn(toolbarButtonClassName, linkPanelOpen && "border-[#1d52a1] bg-blue-50 text-[#1d52a1]")} aria-label="Add or edit link" title="Add or edit link" onMouseDown={captureSelection} onClick={openLinkEditor}><Link2 className="h-4 w-4" /></button>
          <button type="button" className={toolbarButtonClassName} aria-label="Remove link" title="Remove link" onMouseDown={(event) => { event.preventDefault(); runEditorCommand("unlink"); }}><Unlink className="h-4 w-4" /></button>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Place the cursor in a paragraph or heading to change H1–H6. Select text to format it or add a link.</p>
        {linkPanelOpen ? (
          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
            <div className="grid gap-2 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <select value={linkKind} onChange={(event) => { const value = event.target.value as "internal" | "external"; setLinkKind(value); if (value === "internal") setOpenInNewTab(false); }} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700">
                <option value="internal">Internal link</option>
                <option value="external">External link</option>
              </select>
              <Input aria-label="Visible link text" value={linkText} onChange={(event) => setLinkText(event.target.value)} className="h-10 rounded-lg border-slate-200 bg-white shadow-none" placeholder="Visible link text" />
            </div>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input aria-label="Link destination" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} className="h-10 min-w-0 flex-1 rounded-lg border-slate-200 bg-white shadow-none" placeholder={linkKind === "external" ? "https://example.com/page" : "/blog/article-slug/"} />
              {linkKind === "external" ? <label className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold text-slate-600"><Switch checked={openInNewTab} onCheckedChange={setOpenInNewTab} /> Open in new tab</label> : null}
              <button type="button" className="h-10 rounded-lg bg-[#1d52a1] px-4 text-xs font-black text-white hover:bg-[#163f7d]" onClick={applyLink}>Apply link</button>
              <button type="button" className="h-10 rounded-lg px-3 text-xs font-bold text-slate-500 hover:bg-white" onClick={() => setLinkPanelOpen(false)}>Cancel</button>
            </div>
          </div>
        ) : null}
      </div>
      <div
        ref={editorRef}
        role="textbox"
        aria-label="Editable imported article body"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        className={cn(richContentClassName, "min-h-[12rem] bg-white p-5 outline-none ring-inset ring-[#1d52a1]/20 focus:ring-4")}
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(block.html ?? "") }}
        onMouseUp={captureSelection}
        onKeyUp={captureSelection}
        onBlur={syncContent}
      />
    </div>
  );
};

const ContentBlocksEditor = ({ blocks, onChange }: ContentBlocksEditorProps) => {
  const [insertChoice, setInsertChoice] = useState("");
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [activeInsertIndex, setActiveInsertIndex] = useState<number | null>(null);

  const updateBlock = (index: number, patch: Partial<BlogContentBlock>) => {
    onChange(blocks.map((block, blockIndex) => (blockIndex === index ? { ...block, ...patch } : block)));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const insertBlockAt = (choice: string, index: number) => {
    if (!choice) return;
    const next = [...blocks];
    next.splice(index, 0, createBlockFromChoice(choice));
    onChange(next);
    setActiveInsertIndex(null);
  };

  const insertBlock = (choice: string) => {
    insertBlockAt(choice, blocks.length);
    setInsertChoice("");
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    setDropIndex(null);

    try {
      const payload = JSON.parse(event.dataTransfer.getData(BLOG_BLOCK_DRAG_TYPE)) as
        | { kind: "new"; choice: string }
        | { kind: "move"; id: string };

      if (payload.kind === "new") {
        const next = [...blocks];
        next.splice(targetIndex, 0, createBlockFromChoice(payload.choice));
        onChange(next);
        return;
      }

      const sourceIndex = blocks.findIndex((block) => block.id === payload.id);
      if (sourceIndex < 0) return;
      const next = blocks.filter((block) => block.id !== payload.id);
      const adjustedIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
      next.splice(adjustedIndex, 0, blocks[sourceIndex]);
      onChange(next);
    } catch {
      // Ignore unrelated drag data.
    }
  };

  const DropTarget = ({ index }: { index: number }) => {
    const [blockSearch, setBlockSearch] = useState("");
    const filteredBlockItems = blockLibraryItems.filter((item) => {
      const query = blockSearch.trim().toLowerCase();
      return !query || `${item.label} ${item.description}`.toLowerCase().includes(query);
    });

    return (
      <div
      className={cn("group relative h-7 cursor-pointer transition-colors", dropIndex === index && "bg-blue-50")}
      onClick={() => setActiveInsertIndex(index)}
      onDragEnter={(event) => {
        event.preventDefault();
        setDropIndex(index);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === "copy" ? "copy" : "move";
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropIndex(null);
      }}
      onDrop={(event) => handleDrop(event, index)}
    >
      <span className={cn(
        "absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-blue-200 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
        (dropIndex === index || activeInsertIndex === index) && "bg-[#1d52a1] opacity-100",
      )} />
      <DropdownMenu onOpenChange={(open) => {
        if (!open) {
          setActiveInsertIndex((current) => current === index ? null : current);
          setBlockSearch("");
        }
      }}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Insert content at position ${index + 1}`}
            className={cn(
              "absolute left-1/2 top-1/2 z-10 inline-flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-blue-200 bg-white text-[#1d52a1] opacity-0 transition-[opacity,transform] hover:border-[#1d52a1] hover:bg-blue-50 group-hover:opacity-100 group-focus-within:opacity-100",
              (dropIndex === index || activeInsertIndex === index) && "opacity-100",
            )}
            onClick={(event) => {
              event.stopPropagation();
              setActiveInsertIndex(index);
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-64 p-2">
          <div className="relative mb-2" onKeyDown={(event) => event.stopPropagation()}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              autoFocus
              value={blockSearch}
              onChange={(event) => setBlockSearch(event.target.value)}
              onClick={(event) => event.stopPropagation()}
              className="h-10 rounded-lg border-slate-200 pl-9 shadow-none"
              placeholder="Search blocks…"
              aria-label="Search content blocks"
            />
          </div>
          {filteredBlockItems.map((item) => (
            <DropdownMenuItem key={item.choice} className="gap-3 rounded-lg px-3 py-2.5" onSelect={() => insertBlockAt(item.choice, index)}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">{item.icon}</span>
              <span><span className="block text-sm font-bold text-slate-800">{item.label}</span><span className="block text-xs text-slate-500">{item.description}</span></span>
            </DropdownMenuItem>
          ))}
          {!filteredBlockItems.length ? <p className="px-3 py-5 text-center text-sm text-slate-500">No matching blocks.</p> : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    );
  };

  const headingClass = (level: number) => {
    if (level === 1) return "text-4xl sm:text-5xl";
    if (level === 2) return "text-3xl sm:text-4xl";
    if (level === 3) return "text-2xl sm:text-3xl";
    if (level === 4) return "text-xl sm:text-2xl";
    return "text-lg sm:text-xl";
  };

  return (
    <div>
      <DropTarget index={0} />
      {blocks.map((block, index) => (
        <div
          key={block.id}
          onDragOver={(event) => {
            event.preventDefault();
            const bounds = event.currentTarget.getBoundingClientRect();
            setDropIndex(event.clientY < bounds.top + bounds.height / 2 ? index : index + 1);
            event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === "copy" ? "copy" : "move";
          }}
          onDrop={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            handleDrop(event, event.clientY < bounds.top + bounds.height / 2 ? index : index + 1);
          }}
        >
          <div className="group relative -mx-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 focus-within:bg-slate-50">
          <div className="mb-1 flex items-center gap-2 opacity-40 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              type="button"
              draggable
              className="cursor-grab rounded p-1.5 text-slate-400 hover:bg-white hover:text-[#1d52a1] active:cursor-grabbing"
              aria-label={`Drag ${block.type === "heading" ? `heading ${block.level ?? 2}` : blockLabels[block.type]} block`}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData(BLOG_BLOCK_DRAG_TYPE, JSON.stringify({ kind: "move", id: block.id }));
              }}
              onDragEnd={() => setDropIndex(null)}
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
            {block.type === "heading" ? (
              <Select value={String(block.level ?? 2)} onValueChange={(value) => updateBlock(index, { level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6 })}>
                <SelectTrigger aria-label="Heading level" className="h-7 w-[4.5rem] rounded-md border-slate-200 bg-white px-2 text-[11px] font-black text-slate-600 shadow-none focus:ring-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((level) => <SelectItem key={level} value={String(level)}>H{level}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{blockLabels[block.type]}</span>
            )}
            <div className="ml-auto flex gap-1">
              <button type="button" className="rounded p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-20" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move block up"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button type="button" className="rounded p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-20" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} aria-label="Move block down"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button type="button" className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" onClick={() => onChange(blocks.filter((_, blockIndex) => blockIndex !== index))} aria-label="Delete block"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          {block.type === "rich_html" ? (
            <RichHtmlBlockEditor block={block} onChange={(patch) => updateBlock(index, patch)} />
          ) : block.type === "bulleted_list" || block.type === "numbered_list" ? (
            <div className="space-y-1.5">
              {(block.items ?? [""]).map((item, itemIndex) => (
                <div key={`${block.id}-${itemIndex}`} className="flex gap-2">
                  <span className="mt-2.5 w-5 text-center text-base font-bold text-slate-400">
                    {block.type === "bulleted_list" ? "•" : `${itemIndex + 1}.`}
                  </span>
                  <Input
                    value={item}
                    onChange={(event) => updateBlock(index, { items: (block.items ?? [""]).map((current, currentIndex) => currentIndex === itemIndex ? event.target.value : current) })}
                    className="h-10 border-transparent bg-transparent px-2 text-[17px] shadow-none hover:border-slate-200 focus-visible:border-slate-300 focus-visible:ring-0"
                    placeholder="List item"
                  />
                  <button
                    type="button"
                    className="rounded p-2 text-slate-300 hover:bg-red-50 hover:text-red-600"
                    onClick={() => updateBlock(index, { items: (block.items ?? []).filter((_, currentIndex) => currentIndex !== itemIndex) })}
                    aria-label="Remove list item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button type="button" className="ml-7 inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold text-[#1d52a1] hover:bg-blue-50" onClick={() => updateBlock(index, { items: [...(block.items ?? []), ""] })}>
                <Plus className="h-3.5 w-3.5" /> Add list item
              </button>
            </div>
          ) : block.type === "link" ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
                <Select value={block.linkKind ?? "internal"} onValueChange={(value) => updateBlock(index, {
                  linkKind: value as "internal" | "external",
                  openInNewTab: value === "external" ? block.openInNewTab : false,
                })}>
                  <SelectTrigger aria-label="Link type" className="h-11 rounded-xl border-slate-200 bg-white shadow-none"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal link</SelectItem>
                    <SelectItem value="external">External link</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={block.text} onChange={(event) => updateBlock(index, { text: event.target.value })} className={fieldClassName} placeholder="Visible link text" />
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={block.url ?? ""}
                    onChange={(event) => updateBlock(index, { url: event.target.value })}
                    className={cn(fieldClassName, "bg-white pl-9")}
                    placeholder={block.linkKind === "external" ? "https://example.com/page" : "/blog/article-slug/"}
                  />
                </div>
                {block.linkKind === "external" ? (
                  <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-600">
                    <Switch checked={Boolean(block.openInNewTab)} onCheckedChange={(checked) => updateBlock(index, { openInNewTab: checked })} />
                    Open in new tab
                  </label>
                ) : null}
              </div>
            </div>
          ) : block.type === "heading" ? (
            <Textarea
              value={block.text}
              onChange={(event) => updateBlock(index, { text: event.target.value })}
              className={cn("min-h-0 resize-none border-0 bg-transparent px-0 py-1 font-black leading-tight text-slate-900 shadow-none focus-visible:ring-0", headingClass(block.level ?? 2))}
              rows={1}
              placeholder={`Heading ${block.level ?? 2}`}
            />
          ) : block.type === "quote" ? (
            <Textarea value={block.text} onChange={(event) => updateBlock(index, { text: event.target.value })} className="min-h-[96px] resize-none rounded-none border-0 border-l-4 border-[#1d52a1] bg-blue-50/60 px-5 py-4 text-lg font-semibold italic leading-relaxed shadow-none focus-visible:ring-0" rows={3} placeholder="Add a quotation…" />
          ) : block.type === "callout" ? (
            <Textarea value={block.text} onChange={(event) => updateBlock(index, { text: event.target.value })} className="min-h-[96px] resize-none rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-[17px] leading-relaxed shadow-none focus-visible:ring-1 focus-visible:ring-amber-300" rows={3} placeholder="Add a helpful note…" />
          ) : (
            <Textarea
              value={block.text}
              onChange={(event) => updateBlock(index, { text: event.target.value })}
              className="min-h-[110px] resize-none border-0 bg-transparent px-0 py-1 text-[17px] leading-8 text-slate-700 shadow-none focus-visible:ring-0"
              rows={4}
              placeholder="Start writing…"
            />
          )}
          </div>
          <DropTarget index={index + 1} />
        </div>
      ))}
      <div className="mt-6 flex items-center gap-3 border-t border-dashed border-slate-200 pt-5">
        <Select value={insertChoice} onValueChange={(value) => { setInsertChoice(value); insertBlock(value); }}>
          <SelectTrigger className="h-11 w-56 rounded-full border-[#1d52a1] bg-white px-4 font-bold text-[#1d52a1] shadow-none">
            <Plus className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Insert content" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            {[1, 2, 3, 4, 5, 6].map((level) => <SelectItem key={level} value={`heading:${level}`}>Heading {level}</SelectItem>)}
            <SelectItem value="bulleted_list">Bulleted list</SelectItem>
            <SelectItem value="numbered_list">Numbered list</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
            <SelectItem value="callout">Callout box</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-slate-400">Choose what to add next.</p>
      </div>
    </div>
  );
};

const ArticlePreview = ({ post }: { post: AdminBlogPostUpsertInput }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    {post.coverImageUrl ? (
      <img src={post.coverImageUrl} alt={post.coverImageAlt} className="aspect-[16/7] w-full object-cover" />
    ) : (
      <div className="flex aspect-[16/5] items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">Cover image preview</div>
    )}
    <article className="mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-12">
      <p className="text-sm font-bold uppercase tracking-wider text-[#1d52a1]">{post.category || "Category"}</p>
      <h1 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">{post.title || "Article title"}</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-500">{post.excerpt || "The article excerpt will appear here."}</p>
      <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-slate-700">
        {post.contentBlocks.map((block) => {
          if (block.type === "rich_html") {
            return <div key={block.id} className={cn(richContentClassName, "overflow-x-auto")} dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(block.html ?? "") }} />;
          }
          if (block.type === "heading") {
            const Tag = `h${block.level ?? 2}` as keyof JSX.IntrinsicElements;
            return <Tag key={block.id} className="pt-4 text-2xl font-black text-slate-900">{block.text || "Untitled section"}</Tag>;
          }
          if (block.type === "bulleted_list" || block.type === "numbered_list") {
            const Tag = block.type === "bulleted_list" ? "ul" : "ol";
            return <Tag key={block.id} className={block.type === "bulleted_list" ? "list-disc space-y-2 pl-6" : "list-decimal space-y-2 pl-6"}>{(block.items ?? []).filter(Boolean).map((item, index) => <li key={index}>{item}</li>)}</Tag>;
          }
          if (block.type === "link") {
            const opensNewTab = block.linkKind === "external" && block.openInNewTab;
            return <p key={block.id}><a href={getSafeBlockHref(block)} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noopener noreferrer" : undefined} className="inline-flex items-center gap-1 font-bold text-[#1d52a1] underline underline-offset-4">{block.text || block.url || "Link"}{block.linkKind === "external" ? <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> : null}</a></p>;
          }
          if (block.type === "quote") return <blockquote key={block.id} className="border-l-4 border-[#1d52a1] bg-blue-50 px-5 py-4 font-semibold">{block.text}</blockquote>;
          if (block.type === "callout") return <aside key={block.id} className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">{block.text}</aside>;
          return <p key={block.id}>{block.text || "Empty paragraph"}</p>;
        })}
      </div>
      {post.faqs.length ? (
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-black text-slate-900">Frequently asked questions</h2>
          <div className="mt-5 space-y-5">{post.faqs.map((faq) => <div key={faq.id}><h3 className="font-bold text-slate-900">{faq.question}</h3><p className="mt-2 text-slate-600">{faq.answer}</p></div>)}</div>
        </section>
      ) : null}
    </article>
  </div>
);

const SeoBlogs = ({ previewMode = false }: { previewMode?: boolean }) => {
  const queryClient = useQueryClient();
  const blogsQuery = useQuery({ queryKey: ["seo-blog-posts"], queryFn: getSeoBlogPosts, ...adminQueryOptions, enabled: !previewMode });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogPostStatus>("all");
  const [editor, setEditor] = useState<AdminBlogPostUpsertInput | null>(() => previewMode ? createPreviewPost() : null);
  const [viewMode, setViewMode] = useState<"write" | "preview">("write");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPostRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const posts = useMemo(() => blogsQuery.data?.posts ?? [], [blogsQuery.data?.posts]);
  const filteredPosts = useMemo(() => posts.filter((post) => {
    if (statusFilter !== "all" && post.status !== statusFilter) return false;
    const query = search.trim().toLowerCase();
    return !query || [post.title, post.slug, post.category].some((value) => value.toLowerCase().includes(query));
  }), [posts, search, statusFilter]);

  const issues = useMemo(() => editor ? validateBlogPost(editor) : [], [editor]);
  const errors = issues.filter((issue) => issue.level === "error");
  const publicationErrors = useMemo(
    () => editor ? validateBlogPublication(editor).filter((issue) => issue.level === "error") : [],
    [editor],
  );

  const setValue = <K extends keyof AdminBlogPostUpsertInput>(key: K, value: AdminBlogPostUpsertInput[K]) => {
    setEditor((current) => current ? { ...current, [key]: value } : current);
  };

  const handleTitleChange = (value: string) => {
    setEditor((current) => {
      if (!current) return current;
      const previousAutoSlug = slugifyBlogTitle(current.title);
      const shouldUpdateSlug = !current.slug || current.slug === previousAutoSlug;
      const slug = shouldUpdateSlug ? slugifyBlogTitle(value) : current.slug;
      return { ...current, title: value, slug, canonicalPath: current.canonicalPath || (slug ? `/blog/${slug}/` : "") };
    });
  };

  const openNew = () => {
    setEditor(createEmptyBlogPost());
    setViewMode("write");
  };

  const openEdit = (post: BlogPostRecord) => {
    const draft = clonePost(post);
    setEditor(post.publishedSnapshot ? { ...draft, status: "draft" } : draft);
    setViewMode("write");
  };

  const handleSave = async (nextStatus?: BlogPostStatus) => {
    if (!editor) return;
    const candidate = { ...editor, status: nextStatus ?? editor.status };
    const candidateIssues = validateBlogPost(candidate);
    const blocking = candidateIssues.filter((issue) => issue.level === "error");

    if (!candidate.title.trim() || !candidate.slug.trim()) {
      toast.error("Add a title and valid slug before saving.");
      return;
    }
    if ((nextStatus ?? candidate.status) !== "draft" && blocking.length) {
      toast.error(`Resolve ${blocking.length} validation ${blocking.length === 1 ? "error" : "errors"} before changing workflow status.`);
      return;
    }

    if (previewMode) {
      setEditor(candidate);
      toast.success("Preview updated locally. No database record was created.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveSeoBlogPost(candidate);
      setEditor({ ...candidate, id: result.id });
      refreshAdminQueries(queryClient, ["seo-blog-posts"]);
      toast.success(nextStatus === "in_review" ? "Draft sent for review." : "Blog draft saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save the blog draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteSeoBlogPost(deleteTarget.id);
      refreshAdminQueries(queryClient, ["seo-blog-posts"]);
      setDeleteTarget(null);
      toast.success("Blog draft deleted. A database revision is retained by the migration history policy.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete the blog draft.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = async () => {
    if (!editor || previewMode) return;
    const blocking = validateBlogPublication(editor).filter((issue) => issue.level === "error");
    if (blocking.length) {
      toast.error(`Resolve ${blocking.length} publication ${blocking.length === 1 ? "requirement" : "requirements"} first.`);
      return;
    }

    setIsPublishing(true);
    try {
      const wasRepublish = Boolean(editor.publishedSnapshot);
      const saved = await saveSeoBlogPost(editor);
      const snapshot = await publishSeoBlogPost(saved.id);
      const now = new Date().toISOString();
      setEditor({
        ...editor,
        id: saved.id,
        status: "published",
        publicationState: "live_confirmed",
        publishedAt: editor.publishedAt || now,
        publishedRevisionAt: now,
        publishedSnapshot: snapshot,
      });
      refreshAdminQueries(queryClient, ["seo-blog-posts"]);
      void queryClient.invalidateQueries({ queryKey: ["public-blog-posts"] });
      setPublishOpen(false);
      toast.success(wasRepublish ? "Article changes republished." : "Article published to the public blog.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to publish the article.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    setIsUploading(true);
    try {
      if (previewMode) {
        const previewUrl = URL.createObjectURL(file);
        setValue("coverImageUrl", previewUrl);
        if (!editor.ogImageUrl) setValue("ogImageUrl", previewUrl);
        toast.success("Local image preview added. It was not uploaded.");
        return;
      }
      const result = await uploadSeoBlogImage(file, editor.slug);
      setValue("coverImageUrl", result.publicUrl);
      if (!editor.ogImageUrl) setValue("ogImageUrl", result.publicUrl);
      toast.success("Cover image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload the image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  if (editor) {
    const schemaPreview = buildBlogSchemaPreview(editor);
    return (
      <SeoPortalShell pageTitle={editor.id ? "Edit blog article" : "Create blog article"} pageDescription="Build, preview, review and publish the article with its SEO metadata and schema.">
        <div className="sticky top-[3.8rem] z-20 -mx-4 border-y border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className={adminSecondaryButtonClassName} onClick={() => setEditor(null)}><ArrowLeft className="h-4 w-4" /> All blogs</button>
            <div className="ml-auto flex flex-wrap gap-2">
              <button type="button" className={adminSecondaryButtonClassName} onClick={() => setViewMode((current) => current === "write" ? "preview" : "write")}><Eye className="h-4 w-4" /> {viewMode === "write" ? "Preview" : "Continue writing"}</button>
              <button type="button" className={adminSecondaryButtonClassName} onClick={() => void handleSave()} disabled={isSaving}><Save className="h-4 w-4" /> {isSaving ? "Saving…" : "Save draft"}</button>
              <button type="button" className={adminPrimaryButtonClassName} onClick={() => void handleSave("in_review")} disabled={isSaving || errors.length > 0}><CheckCircle2 className="h-4 w-4" /> Send for review</button>
              {!previewMode ? <button type="button" className={adminPrimaryButtonClassName} onClick={() => publicationErrors.length ? toast.error(publicationErrors[0].message) : setPublishOpen(true)} disabled={isSaving || isPublishing} title={publicationErrors.length ? `${publicationErrors.length} publication requirements remain.` : undefined}><Globe2 className="h-4 w-4" /> {editor.publishedSnapshot ? "Republish" : "Publish"}</button> : null}
            </div>
          </div>
        </div>

        <div className={cn("rounded-xl border px-4 py-3 text-sm leading-relaxed", editor.publishedSnapshot ? "border-blue-200 bg-blue-50 text-blue-900" : "border-amber-200 bg-amber-50 text-amber-900")}>
          <strong>{editor.publishedSnapshot ? "Published version protected." : previewMode ? "Development preview only." : "Draft not public yet."}</strong>{" "}
          {editor.publishedSnapshot
            ? "You are editing a separate draft. Saving or sending it for review will not change the current public article."
            : previewMode
              ? "Changes stay in this browser session and are not saved or uploaded."
              : "Preview the article, move it to Approved, mark it Ready, then use Publish to make a reviewed snapshot public."}
        </div>

        <div className={cn("grid items-start transition-[grid-template-columns] duration-300", isSidebarCollapsed ? "xl:grid-cols-[14rem_minmax(0,1fr)_3rem]" : "xl:grid-cols-[14rem_minmax(0,1fr)_3rem_20rem]")}>
          <BlockLibrary
            blocks={editor.contentBlocks}
            onChange={(blocks) => setValue("contentBlocks", blocks)}
            onInsert={(choice) => {
              setValue("contentBlocks", [...editor.contentBlocks, createBlockFromChoice(choice)]);
              setViewMode("write");
            }}
          />

          <div className="min-w-0">
            {viewMode === "preview" ? <div><div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-900">Private draft preview — visible only inside the protected SEO Studio. This is not the public article.</div><ArticlePreview post={editor} /></div> : (
              <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    <span>{editor.category || "Choose a category"}</span><span>·</span><span>Draft canvas</span>
                  </div>
                  <Textarea value={editor.title} onChange={(event) => handleTitleChange(event.target.value)} className="mt-5 min-h-[90px] resize-none border-0 px-0 py-0 text-4xl font-black leading-[1.08] tracking-tight text-slate-900 shadow-none placeholder:text-slate-300 focus-visible:ring-0 sm:text-5xl" rows={2} placeholder="Add your article title…" />
                  <Textarea value={editor.excerpt} onChange={(event) => setValue("excerpt", event.target.value)} className="mt-3 min-h-[78px] resize-none border-0 px-0 py-0 text-lg leading-8 text-slate-500 shadow-none placeholder:text-slate-300 focus-visible:ring-0" rows={2} placeholder="Write a short summary for readers…" />

                  <div className="my-8">
                    {editor.coverImageUrl ? (
                      <div className="group relative overflow-hidden rounded-xl"><img src={editor.coverImageUrl} alt={editor.coverImageAlt} className="aspect-[16/8] w-full object-cover" /><label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-slate-950/0 font-bold text-transparent transition-colors group-hover:bg-slate-950/50 group-hover:text-white"><ImagePlus className="mr-2 h-5 w-5" /> Replace cover image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => void handleImageUpload(event)} /></label></div>
                    ) : (
                      <label className="flex aspect-[16/5] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm font-bold text-slate-500 transition-colors hover:border-[#1d52a1] hover:bg-blue-50 hover:text-[#1d52a1]"><ImagePlus className="mb-2 h-6 w-6" /> Add a cover image<span className="mt-1 text-xs font-normal text-slate-400">JPEG, PNG, WebP or AVIF · up to 5 MB</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => void handleImageUpload(event)} disabled={isUploading} /></label>
                    )}
                  </div>

                  <ContentBlocksEditor blocks={editor.contentBlocks} onChange={(blocks) => setValue("contentBlocks", blocks)} />

                  <section className="mt-12 border-t border-slate-200 pt-8">
                    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black text-slate-900">Frequently asked questions</h2><p className="mt-1 text-sm text-slate-500">These answers appear on the page and can power FAQ schema.</p></div><button type="button" className={adminSecondaryButtonClassName} onClick={() => setValue("faqs", [...editor.faqs, createBlogFaq()])}><Plus className="h-4 w-4" /> Add question</button></div>
                    <div className="mt-5 space-y-3">{editor.faqs.map((faq, index) => <div key={faq.id} className="group rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2"><span className="text-xs font-black uppercase tracking-wider text-slate-400">Question {index + 1}</span><button type="button" className="ml-auto rounded p-1.5 text-slate-300 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100" onClick={() => setValue("faqs", editor.faqs.filter((item) => item.id !== faq.id))}><Trash2 className="h-4 w-4" /></button></div><Input value={faq.question} onChange={(event) => setValue("faqs", editor.faqs.map((item) => item.id === faq.id ? { ...item, question: event.target.value } : item))} className="mt-2 h-11 border-0 px-0 text-lg font-bold shadow-none focus-visible:ring-0" placeholder="Type the question…" /><Textarea value={faq.answer} onChange={(event) => setValue("faqs", editor.faqs.map((item) => item.id === faq.id ? { ...item, answer: event.target.value } : item))} className="min-h-[80px] resize-none border-0 px-0 text-base leading-7 text-slate-600 shadow-none focus-visible:ring-0" rows={2} placeholder="Type the answer…" /></div>)}</div>
                  </section>
                </div>
              </article>
            )}
          </div>

          <div className="relative hidden h-full min-h-[calc(100dvh-12rem)] items-start justify-center xl:flex">
            <button
              type="button"
              aria-expanded={!isSidebarCollapsed}
              aria-label={isSidebarCollapsed ? "Show settings panel" : "Hide settings panel"}
              title={isSidebarCollapsed ? "Show settings" : "Hide settings"}
              className="sticky top-36 z-20 mt-4 inline-flex h-12 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition-colors hover:border-[#1d52a1] hover:bg-blue-50 hover:text-[#1d52a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
            >
              {isSidebarCollapsed ? <PanelRightOpen className="h-4 w-4" /> : <PanelRightClose className="h-4 w-4" />}
            </button>
          </div>

          <aside className={cn("space-y-4 xl:sticky xl:top-36 xl:self-start", isSidebarCollapsed && "xl:hidden")}>
            <div className={adminSurfaceClassName}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-black text-slate-900">Ready to review?</h2>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", errors.length ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700")}>{errors.length} errors</span>
              </div>
              <div className="mt-4 max-h-52 space-y-3 overflow-y-auto">{!issues.length ? <p className="flex gap-2 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4 shrink-0" /> No automated issues found.</p> : issues.map((issue, index) => <div key={`${issue.field}-${index}`} className="flex gap-2 text-xs leading-relaxed"><AlertTriangle className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", issue.level === "error" ? "text-red-600" : "text-amber-600")} /><span><strong className="text-slate-800">{issue.field}:</strong> <span className="text-slate-600">{issue.message}</span></span></div>)}</div>
            </div>

            <details open className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-black text-slate-900">Post settings</summary><div className="mt-4 space-y-4"><Field label="Category"><Input value={editor.category} onChange={(event) => setValue("category", event.target.value)} className={fieldClassName} /></Field><Field label="URL slug" help={editor.publishedSnapshot ? "Locked to preserve the current article URL, backlinks and search history." : undefined}><Input value={editor.slug} disabled={Boolean(editor.publishedSnapshot)} onChange={(event) => setValue("slug", slugifyBlogTitle(event.target.value))} className={fieldClassName} /></Field><Field label="Workflow"><Select value={editor.status} onValueChange={(value) => setValue("status", value as BlogPostStatus)}><SelectTrigger className={fieldClassName}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="in_review">In review</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select></Field><Field label="Readiness"><Select value={editor.readiness} onValueChange={(value) => setValue("readiness", value as typeof editor.readiness)}><SelectTrigger className={fieldClassName}><SelectValue /></SelectTrigger><SelectContent>{Object.entries(readinessLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></Field><Field label="Publication record" help="Updated automatically by the Publish action."><div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">{publicationLabels[editor.publicationState]}</div></Field><Field label="Scheduled time"><Input type="datetime-local" value={toLocalDateTime(editor.scheduledFor)} onChange={(event) => setValue("scheduledFor", toIsoDateTime(event.target.value))} className={fieldClassName} /></Field></div></details>

            <details className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-black text-slate-900">Cover image details</summary><div className="mt-4 space-y-4"><label className={cn(adminSecondaryButtonClassName, "cursor-pointer")}><ImagePlus className="h-4 w-4" /> {isUploading ? "Uploading…" : "Choose image"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(event) => void handleImageUpload(event)} disabled={isUploading} /></label><Field label="Image URL"><Input value={editor.coverImageUrl} onChange={(event) => setValue("coverImageUrl", event.target.value)} className={fieldClassName} /></Field><Field label="Alternative text"><Input value={editor.coverImageAlt} onChange={(event) => setValue("coverImageAlt", event.target.value)} className={fieldClassName} /></Field><Field label="Caption"><Input value={editor.coverImageCaption} onChange={(event) => setValue("coverImageCaption", event.target.value)} className={fieldClassName} /></Field><Field label="Credit"><Input value={editor.coverImageCredit} onChange={(event) => setValue("coverImageCredit", event.target.value)} className={fieldClassName} /></Field></div></details>

            <details className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-black text-slate-900">SEO and social</summary><div className="mt-4 space-y-4"><Field label={`SEO title (${editor.seoTitle.length}/60)`}><Input value={editor.seoTitle} onChange={(event) => setValue("seoTitle", event.target.value)} className={fieldClassName} placeholder={editor.title} /></Field><Field label={`Meta description (${editor.metaDescription.length}/160)`}><Textarea value={editor.metaDescription} onChange={(event) => setValue("metaDescription", event.target.value)} className={textareaClassName} rows={4} /></Field><Field label="Canonical path"><Input value={editor.canonicalPath} onChange={(event) => setValue("canonicalPath", event.target.value)} className={fieldClassName} /></Field><Field label="Robots"><Select value={editor.robots} onValueChange={(value) => setValue("robots", value as typeof editor.robots)}><SelectTrigger className={fieldClassName}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="noindex, follow">Noindex, follow</SelectItem><SelectItem value="index, follow">Index, follow</SelectItem><SelectItem value="noindex, nofollow">Noindex, nofollow</SelectItem></SelectContent></Select></Field><Field label="Social title"><Input value={editor.ogTitle} onChange={(event) => setValue("ogTitle", event.target.value)} className={fieldClassName} /></Field><Field label="Social description"><Textarea value={editor.ogDescription} onChange={(event) => setValue("ogDescription", event.target.value)} className={textareaClassName} rows={3} /></Field><Field label="Social image URL"><Input value={editor.ogImageUrl} onChange={(event) => setValue("ogImageUrl", event.target.value)} className={fieldClassName} /></Field><div className="rounded-lg border border-slate-200 p-3"><p className="truncate text-[10px] text-emerald-700">shanayasdrivingschool.com › blog › {editor.slug}</p><p className="mt-1 text-sm font-semibold text-[#1a0dab]">{editor.seoTitle || editor.title}</p><p className="mt-1 line-clamp-3 text-xs text-slate-500">{editor.metaDescription || "Add a meta description."}</p></div></div></details>

            <details className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-black text-slate-900">Schema</summary><div className="mt-4 space-y-4"><Field label="Article type"><Select value={editor.schemaType} onValueChange={(value) => setValue("schemaType", value as typeof editor.schemaType)}><SelectTrigger className={fieldClassName}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="BlogPosting">BlogPosting</SelectItem><SelectItem value="Article">Article</SelectItem></SelectContent></Select></Field><ToggleField label="Breadcrumb schema" help="Generate the visible breadcrumb structure." checked={editor.breadcrumbSchemaEnabled} onChange={(checked) => setValue("breadcrumbSchemaEnabled", checked)} /><ToggleField label="FAQ schema" help="Use the visible FAQs from the canvas." checked={editor.faqSchemaEnabled} onChange={(checked) => setValue("faqSchemaEnabled", checked)} /><details><summary className="cursor-pointer text-xs font-bold text-[#1d52a1]">View generated JSON-LD</summary><pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-[10px] leading-relaxed text-slate-200">{JSON.stringify(schemaPreview, null, 2)}</pre></details></div></details>

            <details className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-black text-slate-900">Editorial brief</summary><div className="mt-4 space-y-4">{([ ["primaryReader", "Primary reader"], ["targetQuestion", "Target question"], ["location", "Location"], ["intendedOutcome", "Intended outcome"], ["scope", "Scope"], ["overlap", "Existing coverage and overlap"], ["evidenceGaps", "Evidence gaps"], ["originalContribution", "Original contribution"], ["responsibleAuthor", "Responsible organization"], ["nextStep", "Reader's next step"], ["maintenanceDate", "Maintenance trigger"] ] as const).map(([key, label]) => <Field key={key} label={label}><Textarea value={editor.brief[key]} onChange={(event) => setValue("brief", { ...editor.brief, [key]: event.target.value })} className={textareaClassName} rows={3} /></Field>)}</div></details>

            <details className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer font-black text-slate-900">Review and annotations</summary><div className="mt-4 space-y-4"><Field label="Public author"><Input value={editor.authorName} onChange={(event) => setValue("authorName", event.target.value)} className={fieldClassName} /></Field><ToggleField label="Subject review required" help="Use for practical instruction or consequential claims." checked={editor.reviewRequired} onChange={(checked) => setValue("reviewRequired", checked)} /><Field label="Actual reviewer"><Input value={editor.reviewerName} onChange={(event) => setValue("reviewerName", event.target.value)} className={fieldClassName} /></Field><Field label="Review date"><Input type="datetime-local" value={toLocalDateTime(editor.reviewedAt)} onChange={(event) => setValue("reviewedAt", toIsoDateTime(event.target.value))} className={fieldClassName} /></Field><Field label="Review scope"><Textarea value={editor.reviewScope} onChange={(event) => setValue("reviewScope", event.target.value)} className={textareaClassName} rows={3} /></Field><div className="border-t border-slate-200 pt-4"><button type="button" className={adminSecondaryButtonClassName} onClick={() => setValue("annotations", [...editor.annotations, createBlogAnnotation()])}><Plus className="h-4 w-4" /> Add private note</button><div className="mt-3 space-y-3">{editor.annotations.map((annotation) => <div key={annotation.id} className="rounded-lg border border-slate-200 p-3"><Input value={annotation.field} onChange={(event) => setValue("annotations", editor.annotations.map((item) => item.id === annotation.id ? { ...item, field: event.target.value } : item))} className={fieldClassName} placeholder="Claim or section" /><Textarea value={annotation.note} onChange={(event) => setValue("annotations", editor.annotations.map((item) => item.id === annotation.id ? { ...item, note: event.target.value } : item))} className={cn(textareaClassName, "mt-2")} rows={3} placeholder="Source, condition or note" /><div className="mt-2 flex items-center justify-between"><label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><Switch checked={annotation.resolved} onCheckedChange={(checked) => setValue("annotations", editor.annotations.map((item) => item.id === annotation.id ? { ...item, resolved: checked } : item))} /> Resolved</label><button type="button" className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" onClick={() => setValue("annotations", editor.annotations.filter((item) => item.id !== annotation.id))}><Trash2 className="h-4 w-4" /></button></div></div>)}</div></div></div></details>
          </aside>
        </div>
        <AlertDialog open={publishOpen} onOpenChange={setPublishOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{editor.publishedSnapshot ? "Republish this article?" : "Publish this article?"}</AlertDialogTitle>
              <AlertDialogDescription>
                This saves the current editor content as the public version at /blog/{editor.slug}/. The previous published snapshot remains in revision history, and later draft edits will stay private until you republish.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPublishing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={(event) => { event.preventDefault(); void handlePublish(); }} disabled={isPublishing} className="bg-[#1d52a1] hover:bg-[#17488d]">
                {isPublishing ? "Publishing…" : editor.publishedSnapshot ? "Republish article" : "Publish article"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SeoPortalShell>
    );
  }

  return (
    <SeoPortalShell pageTitle="Blog manager" pageDescription="Create structured blog drafts with content, media, SEO, schema and editorial checks in one place.">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900"><strong>Publishing workflow:</strong> preview drafts privately, complete review, mark them Approved and Ready, then publish a protected public snapshot. Later edits remain private until republished.</div>
      {blogsQuery.isLoading ? <div className={adminSurfaceClassName}>Loading blog drafts…</div> : blogsQuery.isError ? <div className={adminSurfaceClassName}>{blogsQuery.error instanceof Error ? blogsQuery.error.message : "Unable to load blog drafts."}</div> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <AdminMetricCard label="All posts" value={String(blogsQuery.data?.totals.total ?? 0)} icon={<BookOpen className="h-5 w-5" />} />
            <AdminMetricCard label="Drafts" value={String(blogsQuery.data?.totals.drafts ?? 0)} icon={<FilePenLine className="h-5 w-5" />} />
            <AdminMetricCard label="In review" value={String(blogsQuery.data?.totals.inReview ?? 0)} icon={<Eye className="h-5 w-5" />} />
            <AdminMetricCard label="Scheduled" value={String(blogsQuery.data?.totals.scheduled ?? 0)} icon={<CheckCircle2 className="h-5 w-5" />} />
            <AdminMetricCard label="Published records" value={String(blogsQuery.data?.totals.published ?? 0)} icon={<CheckCircle2 className="h-5 w-5" />} />
          </div>
          <div className={adminSurfaceClassName}>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[16rem] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} className={cn(fieldClassName, "pl-9")} placeholder="Search title, slug or category" /></div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}><SelectTrigger className="h-11 w-44 rounded-xl border-slate-200"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>
              <button type="button" className={adminPrimaryButtonClassName} onClick={openNew}><Plus className="h-4 w-4" /> New blog</button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Article</TableHead><TableHead>Status</TableHead><TableHead>Readiness</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{filteredPosts.length ? filteredPosts.map((post) => <TableRow key={post.id}><TableCell><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-slate-900">{post.title}</p>{post.publishedSnapshot ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#1d52a1]">Current website article</span> : null}</div><p className="mt-1 text-xs text-slate-500">/blog/{post.slug}/ · {post.category || "No category"}</p></TableCell><TableCell><AdminStatusBadge label={statusLabels[post.status]} toneClassName={statusTones[post.status]} /></TableCell><TableCell className="text-sm text-slate-600">{readinessLabels[post.readiness]}</TableCell><TableCell className="whitespace-nowrap text-sm text-slate-500">{new Date(post.updatedAt).toLocaleDateString("en-CA")}</TableCell><TableCell><div className="flex justify-end gap-2"><button type="button" className={adminRowButtonClassName} onClick={() => openEdit(post)}><FilePenLine className="h-3.5 w-3.5" /> {post.publishedSnapshot ? "Edit draft" : "Edit"}</button>{!post.publishedSnapshot && post.status !== "published" ? <button type="button" className={adminDangerOutlineButtonClassName} onClick={() => setDeleteTarget(post)}><Trash2 className="h-3.5 w-3.5" /> Delete</button> : null}</div></TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm text-slate-500">No blog drafts match these filters.</TableCell></TableRow>}</TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
      <AdminDeleteDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} title="Delete blog draft?" description={`Delete “${deleteTarget?.title ?? "this draft"}” from the CMS workspace?`} isDeleting={isDeleting} onDelete={() => void handleDelete()} />
    </SeoPortalShell>
  );
};

export default SeoBlogs;
