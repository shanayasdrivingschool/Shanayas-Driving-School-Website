import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCoursePrice } from "@/data/coursePricing";
import type { CartItem } from "@/lib/cart";
import type { CheckoutInstallmentCount, CheckoutPaymentMode } from "@/lib/checkoutPaymentPlan";

type CheckoutOrderSummaryProps = {
  allowItemEditing?: boolean;
  estimatedTaxes: number;
  isUsingDirectSelection: boolean;
  items: CartItem[];
  onEditCart: () => void;
  onRemoveItem: (itemKey: string) => void;
  onUpdateQuantity?: (itemKey: string, quantity: number) => void;
  paymentPlan?: {
    amountDueToday: number;
    installmentCount: CheckoutInstallmentCount | null;
    paymentMode: CheckoutPaymentMode;
    remainingBalance: number;
  };
  subtotal: number;
  summaryHeading: string;
  total: number;
};

const cardClassName = "rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8";
const sectionHeadingClassName = "text-2xl font-black text-slate-900 sm:text-3xl";

const SummaryItem = ({
  item,
  allowItemEditing,
  isUsingDirectSelection,
  onRemoveItem,
  onUpdateQuantity,
}: {
  item: CartItem;
  allowItemEditing: boolean;
  isUsingDirectSelection: boolean;
  onRemoveItem: (itemKey: string) => void;
  onUpdateQuantity?: (itemKey: string, quantity: number) => void;
}) => {
  const lineTotal = item.price * item.quantity;

  return (
    <article key={item.key} className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-black leading-tight text-slate-900 sm:text-lg">{item.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.locationName}</p>

          {allowItemEditing && !isUsingDirectSelection ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-[#F8FAFC] p-1">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity?.(item.key, item.quantity - 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                  aria-label={`Decrease quantity for ${item.title}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity?.(item.key, item.quantity + 1)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                  aria-label={`Increase quantity for ${item.title}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemoveItem(item.key)}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-[#E6242A]"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Qty: {item.quantity}
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-2xl font-black text-[#E6242A]">{formatCoursePrice(lineTotal)}</p>
        </div>
      </div>
    </article>
  );
};

export default function CheckoutOrderSummary({
  allowItemEditing = false,
  estimatedTaxes,
  isUsingDirectSelection,
  items,
  onEditCart,
  onRemoveItem,
  onUpdateQuantity,
  paymentPlan,
  subtotal,
  summaryHeading,
  total,
}: CheckoutOrderSummaryProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <section className="rounded-[32px] border border-slate-200 bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Selection summary</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900">{summaryHeading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {allowItemEditing
                ? "Update quantity, remove items, or go back to keep shopping before you continue."
                : "Review the items and totals for this step."}
            </p>
          </div>
          {isUsingDirectSelection ? (
            <Link
              to={items[0]?.editHref ?? "/packages"}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Edit selection
            </Link>
          ) : (
            <button
              type="button"
              onClick={onEditCart}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Edit cart
            </button>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <SummaryItem
              key={item.key}
              item={item}
              allowItemEditing={allowItemEditing}
              isUsingDirectSelection={isUsingDirectSelection}
              onRemoveItem={onRemoveItem}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      </section>

      <section className={cardClassName}>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Price breakdown</p>
        <h2 className={`mt-3 ${sectionHeadingClassName}`}>
          {paymentPlan?.paymentMode === "installment" ? "Payment summary" : "Booking total"}
        </h2>

        <div className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-[#F2F2F2] p-5">
          <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">{formatCoursePrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
            <span>Estimated GST</span>
            <span className="font-bold text-slate-900">{formatCoursePrice(estimatedTaxes)}</span>
          </div>
          {paymentPlan?.paymentMode === "installment" ? (
            <>
              <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
                <span>Order total</span>
                <span className="font-bold text-slate-900">{formatCoursePrice(total)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
                <span>Remaining balance</span>
                <span className="font-bold text-slate-900">{formatCoursePrice(paymentPlan.remainingBalance)}</span>
              </div>
            </>
          ) : null}
          <div className="border-t border-slate-300 pt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-black uppercase tracking-[0.12em] text-slate-900">
                {paymentPlan?.paymentMode === "installment" ? "Charge today" : "Final total"}
              </span>
              <span className="text-2xl font-black text-[#E6242A]">
                {formatCoursePrice(paymentPlan?.amountDueToday ?? total)}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          Stripe charges are created from the server-side pricing calculation before payment confirmation.
        </p>
      </section>
    </aside>
  );
}
