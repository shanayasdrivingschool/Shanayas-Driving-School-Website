import { useState } from "react";
import { Check, Copy, FileJson, LayoutList } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type AdminJsonDialogProps = {
  title: string;
  description: string;
  payload: unknown;
  triggerLabel: string;
};

type ScalarValue = string | number | boolean | null;

type ReadableObjectViewProps = {
  title?: string;
  value: Record<string, unknown>;
  compact?: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isScalarValue = (value: unknown): value is ScalarValue =>
  value === null || ["string", "number", "boolean"].includes(typeof value);

const isScalarArray = (value: unknown): value is ScalarValue[] =>
  Array.isArray(value) && value.every((item) => isScalarValue(item));

const formatLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const isLikelyIsoDate = (value: string) => /^(\d{4}-\d{2}-\d{2})([tT ].*)?$/.test(value.trim());

const formatScalarValue = (value: ScalarValue) => {
  if (value === null) {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toLocaleString() : String(value);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "Not provided";
  }

  if (isLikelyIsoDate(trimmed)) {
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString();
    }
  }

  return trimmed;
};

const getCollectionSummary = (value: unknown) => {
  if (Array.isArray(value)) {
    return `${value.length} ${value.length === 1 ? "item" : "items"}`;
  }

  if (isRecord(value)) {
    const count = Object.keys(value).length;
    return `${count} ${count === 1 ? "field" : "fields"}`;
  }

  return "1 value";
};

const ValuePill = ({ value }: { value: ScalarValue }) => {
  const isBoolean = typeof value === "boolean";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
        isBoolean
          ? value
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-white text-slate-700",
      )}
    >
      {formatScalarValue(value)}
    </span>
  );
};

const FieldValue = ({ value }: { value: unknown }) => {
  if (isScalarValue(value)) {
    return <p className="text-sm font-semibold leading-relaxed text-slate-900">{formatScalarValue(value)}</p>;
  }

  if (isScalarArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm font-semibold text-slate-500">No items selected</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <ValuePill key={`${String(item)}-${index}`} value={item} />
        ))}
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm font-semibold text-slate-500">No items available</p>;
    }

    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d52a1]">Item {index + 1}</p>
              <span className="text-xs font-semibold text-slate-500">{getCollectionSummary(item)}</span>
            </div>
            {isRecord(item) ? <ReadableObjectView value={item} compact /> : <FieldValue value={item} />}
          </div>
        ))}
      </div>
    );
  }

  if (isRecord(value)) {
    return <ReadableObjectView value={value} compact />;
  }

  return <p className="text-sm font-semibold text-slate-500">No value</p>;
};

function ReadableObjectView({ title, value, compact = false }: ReadableObjectViewProps) {
  const entries = Object.entries(value);
  const directFields = entries.filter(([, entryValue]) => isScalarValue(entryValue) || isScalarArray(entryValue));
  const groupedFields = entries.filter(([, entryValue]) => !isScalarValue(entryValue) && !isScalarArray(entryValue));

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500">
        No structured details were saved for this record.
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      {title ? (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E6242A]">{title}</p>
          <span className="text-xs font-semibold text-slate-500">{getCollectionSummary(value)}</span>
        </div>
      ) : null}

      {directFields.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
          <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {directFields.map(([key, entryValue]) => (
              <div key={key} className="rounded-2xl border border-white bg-white px-4 py-3 shadow-sm shadow-slate-200/40">
                <dt className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{formatLabel(key)}</dt>
                <dd className="mt-2">
                  <FieldValue value={entryValue} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {groupedFields.map(([key, entryValue]) => (
        <section key={key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d52a1]">{formatLabel(key)}</p>
            <span className="text-xs font-semibold text-slate-500">{getCollectionSummary(entryValue)}</span>
          </div>
          <FieldValue value={entryValue} />
        </section>
      ))}
    </div>
  );
}

const AdminJsonDialog = ({ title, description, payload, triggerLabel }: AdminJsonDialogProps) => {
  const [copied, setCopied] = useState(false);
  const rawJson = JSON.stringify(payload ?? {}, null, 2) ?? "{}";

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(rawJson);
      setCopied(true);
      toast.success("JSON copied to clipboard.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Unable to copy JSON from this browser.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
        >
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-0 shadow-xl">
        <DialogHeader className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <DialogTitle className="text-2xl font-black text-slate-900">{title}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-slate-600">{description}</DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => void handleCopyJson()}
              className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-[#1d52a1] px-4 py-2 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy JSON"}
            </button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="summary" className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-5">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-auto rounded-full bg-slate-100 p-1">
              <TabsTrigger
                value="summary"
                className="rounded-full px-4 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900"
              >
                <LayoutList className="h-4 w-4" />
                Readable view
              </TabsTrigger>
              <TabsTrigger
                value="json"
                className="rounded-full px-4 py-2 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900"
              >
                <FileJson className="h-4 w-4" />
                Raw JSON
              </TabsTrigger>
            </TabsList>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {getCollectionSummary(payload)}
            </p>
          </div>

          <TabsContent value="summary" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80">
              <div className="flex-1 overflow-y-auto p-5">
                {isRecord(payload) ? (
                  <ReadableObjectView value={payload} />
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <FieldValue value={payload} />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="json" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-slate-950">
              <div className="flex-1 overflow-y-auto p-5">
                <pre className="min-h-full overflow-x-auto text-xs leading-relaxed text-slate-100">
                  {rawJson}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminJsonDialog;


