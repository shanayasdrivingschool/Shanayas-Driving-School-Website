import { SearchX } from "lucide-react";

type AdminEmptyStateProps = {
  /* What the table holds, lowercase and plural: "leads", "orders". Used in the sentence. */
  noun: string;
  /* True when filters/search are narrowing the list, so the message can say why it is empty
     and offer the way out, rather than implying the records do not exist. */
  filtered: boolean;
  onClearFilters?: () => void;
};

/* Every admin table previously rendered a bare header row and then nothing when a filter
   matched no records. A blank area reads as a broken page or a failed load -- the one thing
   it does not read as is "your filter excluded everything", which is almost always the
   cause. Naming the reason and offering the way back is the whole point of this component. */
const AdminEmptyState = ({ noun, filtered, onClearFilters }: AdminEmptyStateProps) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-12 text-center">
    <span className="rounded-full bg-slate-200/70 p-3 text-slate-500">
      <SearchX className="h-5 w-5" aria-hidden="true" />
    </span>

    <p className="text-base font-bold text-slate-900">
      {filtered ? `No ${noun} match these filters` : `No ${noun} yet`}
    </p>

    <p className="max-w-sm text-sm leading-relaxed text-slate-600">
      {filtered
        ? "Try widening the date range, clearing the search box, or switching the status filter back to all."
        : `${noun.charAt(0).toUpperCase()}${noun.slice(1)} will appear here as soon as the first one is recorded.`}
    </p>

    {filtered && onClearFilters ? (
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-1 rounded-full border border-[#1d52a1] px-4 py-2 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d52a1]"
      >
        Clear all filters
      </button>
    ) : null}
  </div>
);

export default AdminEmptyState;
