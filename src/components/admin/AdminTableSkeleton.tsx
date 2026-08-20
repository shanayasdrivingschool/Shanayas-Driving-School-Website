import { affiliateSurfaceClassName } from "@/components/affiliate/styles";
import { Skeleton } from "@/components/ui/skeleton";

type AdminTableSkeletonProps = {
  metricCards?: number;
  rows?: number;
};

/* Stands in for an admin table while its first fetch is in flight.

   The point is that the page arrives whole. The previous single line of "Loading..." text
   replaced the entire view, so opening a page read as a blank interstitial and then a
   sudden jump to content. Mirroring the real layout -- metric cards, filter bar, table
   rows -- means the structure is there immediately and only the values fill in, with no
   shift when they do. */
const AdminTableSkeleton = ({ metricCards = 3, rows = 8 }: AdminTableSkeletonProps) => (
  <>
    {metricCards > 0 ? (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: metricCards }, (_, index) => (
          <div key={index} className={`${affiliateSurfaceClassName} !p-6`}>
            <Skeleton className="h-3 w-24 bg-slate-200" />
            <Skeleton className="mt-4 h-8 w-16 bg-slate-200" />
          </div>
        ))}
      </div>
    ) : null}

    <div className={affiliateSurfaceClassName}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-12 rounded-xl bg-slate-200" />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <Skeleton className="h-10 rounded-lg bg-slate-200" />
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton
            key={index}
            className="h-14 rounded-lg bg-slate-100"
            /* Fades the rows down the list so the block reads as depth rather than as a
               solid grey slab the eye tries to parse as content. */
            style={{ opacity: Math.max(0.35, 1 - index * 0.09) }}
          />
        ))}
      </div>
    </div>
  </>
);

export default AdminTableSkeleton;
