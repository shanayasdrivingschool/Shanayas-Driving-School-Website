import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildPaginationWindow } from "@/lib/adminPanel";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const AdminPagination = ({ page, totalPages, onPageChange }: AdminPaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = buildPaginationWindow(page, totalPages);
  const firstPage = pages[0] ?? 1;
  const lastPage = pages[pages.length - 1] ?? totalPages;

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {firstPage > 1 ? (
          <PaginationItem>
            <PaginationLink href="#" onClick={(event) => { event.preventDefault(); onPageChange(1); }}>
              1
            </PaginationLink>
          </PaginationItem>
        ) : null}

        {firstPage > 2 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}

        {pages.map((entry) => (
          <PaginationItem key={entry}>
            <PaginationLink
              href="#"
              isActive={entry === page}
              onClick={(event) => {
                event.preventDefault();
                onPageChange(entry);
              }}
            >
              {entry}
            </PaginationLink>
          </PaginationItem>
        ))}

        {lastPage < totalPages - 1 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}

        {lastPage < totalPages ? (
          <PaginationItem>
            <PaginationLink href="#" onClick={(event) => { event.preventDefault(); onPageChange(totalPages); }}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        ) : null}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
            className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AdminPagination;
