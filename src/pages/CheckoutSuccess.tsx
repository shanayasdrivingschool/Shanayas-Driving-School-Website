import { useEffect, useState, type CSSProperties } from "react";
import { Check, Clock3, Copy, CreditCard } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useCart } from "@/components/cart/CartProvider";
import { CHECKOUT_FORM_STORAGE_KEY, readStoredCheckoutFormValues } from "@/lib/checkoutForm";
import { getCheckoutInstallmentLabel } from "@/lib/checkoutPaymentPlan";
import { CHECKOUT_PAYMENT_SESSION_STORAGE_KEY } from "@/lib/checkoutPaymentSession";
import { stripePromise } from "@/lib/stripeClient";

type PaymentState = "loading" | "succeeded" | "processing" | "failed";

const formatBookingReference = (orderId: string | null) => {
  if (!orderId) {
    return null;
  }

  const normalized = orderId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (normalized.length < 8) {
    return orderId.toUpperCase();
  }

  return `SDS-${normalized.slice(0, 4)}-${normalized.slice(-4)}`;
};

const animationDelayStyle = (delay: string): CSSProperties =>
  ({
    ["--payment-delay" as "--payment-delay"]: delay,
  }) as CSSProperties;

const confettiStyle = (x: string, y: string): CSSProperties =>
  ({
    ["--confetti-x" as "--confetti-x"]: x,
    ["--confetti-y" as "--confetti-y"]: y,
  }) as CSSProperties;

const confettiDots = [
  { x: "28px", y: "0px", tone: "brand" },
  { x: "14px", y: "-24px", tone: "success" },
  { x: "-14px", y: "-24px", tone: "brand" },
  { x: "-28px", y: "0px", tone: "success" },
  { x: "-14px", y: "24px", tone: "brand" },
  { x: "14px", y: "24px", tone: "success" },
] as const;

const AnimatedSuccessIcon = () => (
  <div className="payment-complete-icon" role="img" aria-label="Payment successful">
    <svg viewBox="0 0 80 80" aria-hidden="true" className="payment-complete-icon-svg">
      <circle className="payment-complete-icon-ring" cx="40" cy="40" r="38" />
      <circle className="payment-complete-icon-fill" cx="40" cy="40" r="30" />
      <polyline className="payment-complete-icon-check" points="24,40 35,52 56,28" />
    </svg>
    {confettiDots.map((dot) => (
      <span
        key={`${dot.x}-${dot.y}`}
        aria-hidden="true"
        className={`payment-complete-confetti payment-complete-confetti-${dot.tone}`}
        style={confettiStyle(dot.x, dot.y)}
      />
    ))}
  </div>
);

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [paymentState, setPaymentState] = useState<PaymentState>(
    searchParams.get("status") === "succeeded"
      ? "succeeded"
      : searchParams.get("status") === "processing"
        ? "processing"
        : "loading",
  );
  const [contactPhone] = useState(() => readStoredCheckoutFormValues().phone.trim());
  const [isCopied, setIsCopied] = useState(false);

  const orderId = searchParams.get("order_id");
  const bookingReference = formatBookingReference(orderId);
  const paymentMode = searchParams.get("payment_mode") === "installment" ? "installment" : "full";
  const installmentCountValue = Number(searchParams.get("installment_count"));
  const installmentCount = installmentCountValue === 2 || installmentCountValue === 3 ? installmentCountValue : null;
  const installmentLabel =
    paymentMode === "installment" && installmentCount ? getCheckoutInstallmentLabel(installmentCount) : null;
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");
  const retrySearchParams = new URLSearchParams(searchParams);

  retrySearchParams.delete("payment_intent");
  retrySearchParams.delete("payment_intent_client_secret");
  retrySearchParams.delete("redirect_status");
  retrySearchParams.delete("status");
  retrySearchParams.delete("order_id");

  const retryQuery = retrySearchParams.toString();
  const isSucceeded = paymentState === "succeeded";
  const successHeadingId = "payment-complete-heading";
  const successDescriptionId = "payment-complete-description";
  const nextSteps = [
    contactPhone
      ? `Our team will call you on ${contactPhone} to confirm your booking details.`
      : "Our team will call you to confirm your booking details.",
    "You'll receive a confirmation email with your schedule.",
    "Complete your remaining documents before your first session.",
  ];

  useEffect(() => {
    let ignore = false;

    const resolvePaymentState = async () => {
      if (!paymentIntentClientSecret) {
        if (!ignore) {
          setPaymentState((current) => (current === "loading" ? "processing" : current));
        }
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        if (!ignore) {
          setPaymentState("failed");
        }
        return;
      }

      const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
      if (ignore) {
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        setPaymentState("succeeded");
      } else if (paymentIntent?.status === "processing") {
        setPaymentState("processing");
      } else {
        setPaymentState("failed");
      }
    };

    void resolvePaymentState();

    return () => {
      ignore = true;
    };
  }, [paymentIntentClientSecret]);

  useEffect(() => {
    if (paymentState !== "succeeded") {
      return;
    }

    clearCart();

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(CHECKOUT_FORM_STORAGE_KEY);
      window.sessionStorage.removeItem(CHECKOUT_PAYMENT_SESSION_STORAGE_KEY);
    }
  }, [clearCart, paymentState]);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  const handleCopyReference = async () => {
    if (!bookingReference || typeof window === "undefined") {
      return;
    }

    const fallbackCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = bookingReference;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    };

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(bookingReference);
      } else {
        fallbackCopy();
      }

      setIsCopied(true);
    } catch {
      fallbackCopy();
      setIsCopied(true);
    }
  };

  const content =
    paymentState === "succeeded"
      ? {
          icon: <AnimatedSuccessIcon />,
          title: paymentMode === "installment" ? "First installment received" : "Payment complete",
          description:
            paymentMode === "installment"
              ? `Your first payment${installmentLabel ? ` for the ${installmentLabel.toLowerCase()} plan` : ""} was received successfully. The booking is recorded and the remaining balance stays on the installment plan.`
              : "Your booking payment was received successfully. The order has been submitted and the team can continue with the booking process.",
        }
      : paymentState === "processing"
        ? {
            icon: <Clock3 className="h-8 w-8" />,
            title: paymentMode === "installment" ? "Installment processing" : "Payment processing",
            description:
              paymentMode === "installment"
                ? "Stripe is still finalizing the installment payment. If you completed authentication already, the booking should update shortly."
                : "Stripe is still finalizing the payment. If you completed authentication already, the booking should update shortly.",
          }
        : {
            icon: <CreditCard className="h-8 w-8" />,
            title: paymentMode === "installment" ? "Installment needs attention" : "Payment needs attention",
            description:
              paymentMode === "installment"
                ? "The installment payment did not finish successfully. Return to the payment page and try again with the secure Stripe form."
                : "The payment did not finish successfully. Return to the payment page and try again with the secure Stripe form.",
        };

  return (
    <main role="main" className="payment-complete-page">
      <SiteHeader tone="light" />

      <div className="payment-complete-shell">
        {isSucceeded ? (
          <section
            className="payment-complete-card"
            role="dialog"
            aria-label="Payment confirmation"
            aria-labelledby={successHeadingId}
            aria-describedby={successDescriptionId}
          >
            <div className="payment-complete-block payment-complete-icon-area" style={animationDelayStyle("0.14s")}>
              <AnimatedSuccessIcon />
            </div>

            <h1
              id={successHeadingId}
              className="payment-complete-block payment-complete-title"
              style={animationDelayStyle("0.22s")}
            >
              {content.title}
            </h1>

            <p
              id={successDescriptionId}
              className="payment-complete-block payment-complete-description"
              style={animationDelayStyle("0.3s")}
            >
              {content.description}
            </p>

            {bookingReference ? (
              <div
                className="payment-complete-block payment-complete-reference"
                style={animationDelayStyle("0.38s")}
                tabIndex={0}
                aria-label={`Booking reference ${bookingReference}`}
              >
                <p className="payment-complete-reference-label">Booking reference</p>
                <p className="payment-complete-reference-code">{bookingReference}</p>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  aria-label="Copy booking reference"
                  className={`payment-complete-copy-button${isCopied ? " is-copied" : ""}`}
                >
                  <span className="payment-complete-copy-icon" aria-hidden="true">
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </span>
                  <span aria-live="polite" className="payment-complete-copy-text">
                    {isCopied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
            ) : null}

            <div className="payment-complete-block payment-complete-button-row" style={animationDelayStyle("0.46s")}>
              <Link
                to="/packages"
                aria-label="Continue browsing available packages"
                className="payment-complete-button payment-complete-button-primary"
              >
                Continue browsing
              </Link>
              <Link
                to="/contact"
                aria-label="Contact the school for support"
                className="payment-complete-button payment-complete-button-secondary"
              >
                Contact the school
              </Link>
            </div>

            <div className="payment-complete-block payment-complete-divider" style={animationDelayStyle("0.54s")} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="payment-complete-block" style={animationDelayStyle("0.62s")}>
              <p className="payment-complete-next-label">What happens next</p>
              <ol className="payment-complete-step-list">
                {nextSteps.map((step, index) => (
                  <li key={step} className="payment-complete-step">
                    <span className="payment-complete-step-number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <p className="payment-complete-step-text">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : (
          <section
            className="payment-complete-card payment-complete-status-card"
            role="dialog"
            aria-label="Payment status"
          >
            <span className="payment-complete-status-icon" aria-hidden="true">
              {content.icon}
            </span>
            <h1 className="payment-complete-title">{content.title}</h1>
            <p className="payment-complete-description">{content.description}</p>

            {bookingReference ? (
              <div className="payment-complete-reference" tabIndex={0} aria-label={`Booking reference ${bookingReference}`}>
                <p className="payment-complete-reference-label">Booking reference</p>
                <p className="payment-complete-reference-code">{bookingReference}</p>
              </div>
            ) : null}

            <div className="payment-complete-button-row">
              {paymentState === "failed" ? (
                <Link
                  to={retryQuery ? `/checkout?${retryQuery}` : "/checkout"}
                  aria-label="Return to the checkout payment page"
                  className="payment-complete-button payment-complete-button-danger"
                >
                  Return to payment
                </Link>
              ) : (
                <Link
                  to="/packages"
                  aria-label="Continue browsing available packages"
                  className="payment-complete-button payment-complete-button-primary"
                >
                  Continue browsing
                </Link>
              )}

              <Link
                to="/contact"
                aria-label="Contact the school for support"
                className="payment-complete-button payment-complete-button-secondary"
              >
                Contact the school
              </Link>
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
    </main>
  );
};

export default CheckoutSuccess;
