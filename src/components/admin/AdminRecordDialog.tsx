import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AdminFormValue, AdminFormValues } from "@/lib/adminCrud";
import { cn } from "@/lib/utils";

export type AdminRecordDialogField = {
  key: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "json" | "select" | "datetime-local" | "switch";
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  min?: number;
  max?: number;
  step?: number | string;
  rows?: number;
  options?: Array<{ label: string; value: string }>;
};

type AdminRecordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: AdminRecordDialogField[];
  values: AdminFormValues;
  isSaving?: boolean;
  saveLabel?: string;
  onValueChange: (key: string, value: AdminFormValue) => void;
  onSave: () => void;
};

const AdminRecordDialog = ({
  open,
  onOpenChange,
  title,
  description,
  fields,
  values,
  isSaving = false,
  saveLabel = "Save record",
  onValueChange,
  onSave,
}: AdminRecordDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl rounded-[28px] border border-slate-200 bg-white p-0 shadow-xl">
      <DialogHeader className="border-b border-slate-200 px-6 py-5">
        <DialogTitle className="text-2xl font-black text-slate-900">{title}</DialogTitle>
        <DialogDescription className="text-sm text-slate-600">{description}</DialogDescription>
      </DialogHeader>

      <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const rawValue = values[field.key];
            const stringValue = typeof rawValue === "string" ? rawValue : "";
            const booleanValue = Boolean(rawValue);

            return (
              <div key={field.key} className={cn("space-y-2", field.fullWidth && "md:col-span-2")}>
                {field.type === "switch" ? (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <Label className="text-sm font-bold text-slate-900">{field.label}</Label>
                      {field.description ? <p className="mt-1 text-xs text-slate-500">{field.description}</p> : null}
                    </div>
                    <Switch checked={booleanValue} onCheckedChange={(checked) => onValueChange(field.key, checked)} disabled={field.disabled} />
                  </div>
                ) : (
                  <>
                    <Label className="text-sm font-bold text-slate-900">{field.label}</Label>
                    {field.description ? <p className="text-xs text-slate-500">{field.description}</p> : null}

                    {field.type === "textarea" || field.type === "json" ? (
                      <Textarea
                        value={stringValue}
                        onChange={(event) => onValueChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        rows={field.rows ?? (field.type === "json" ? 10 : 5)}
                        className={cn(
                          "rounded-2xl border-slate-200",
                          field.type === "json" && "min-h-[220px] font-mono text-xs leading-relaxed",
                        )}
                      />
                    ) : field.type === "select" ? (
                      <Select value={stringValue} onValueChange={(value) => onValueChange(field.key, value)} disabled={field.disabled}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200">
                          <SelectValue placeholder={field.placeholder ?? field.label} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={field.type}
                        value={stringValue}
                        onChange={(event) => onValueChange(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="h-12 rounded-xl border-slate-200"
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <DialogFooter className="border-t border-slate-200 px-6 py-5">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-full bg-[#1d52a1] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#17488d] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : saveLabel}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AdminRecordDialog;
