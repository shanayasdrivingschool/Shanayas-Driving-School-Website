import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AdminDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isDeleting?: boolean;
  onDelete: () => void;
};

const AdminDeleteDialog = ({
  open,
  onOpenChange,
  title,
  description,
  isDeleting = false,
  onDelete,
}: AdminDeleteDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-xl rounded-[28px] border border-slate-200 bg-white p-0 shadow-xl">
      <DialogHeader className="border-b border-slate-200 px-6 py-5">
        <DialogTitle className="text-2xl font-black text-slate-900">{title}</DialogTitle>
        <DialogDescription className="text-sm text-slate-600">{description}</DialogDescription>
      </DialogHeader>
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
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-full bg-[#E6242A] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#C41E23] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete record"}
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AdminDeleteDialog;
