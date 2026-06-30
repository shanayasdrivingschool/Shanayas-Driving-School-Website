import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Elements, PaymentElement, PaymentMethodMessagingElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { CheckCircle2, ChevronRight, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useCheckoutSelection } from "@/hooks/useCheckoutSelection";
import { formatCoursePrice } from "@/data/coursePricing";
import { getCaptchaVerification } from "@/lib/captcha";
import { findPublicCouponByCode } from "@/lib/couponService";
import {
  CHECKOUT_FORM_STORAGE_KEY,
  readStoredCheckoutFormValues,
  type CheckoutFormValues,
} from "@/lib/checkoutForm";
import {
  clearCheckoutPaymentSession,
  readCheckoutPaymentSession,
  writeCheckoutPaymentSession,
  type CheckoutAppliedCoupon,
  type CheckoutPaymentSession,
} from "@/lib/checkoutPaymentSession";
import { getCheckoutInvoiceByToken } from "@/lib/checkoutInvoiceService";
import { createCheckoutPaymentIntent } from "@/lib/stripeCheckoutService";
import { submitCheckoutOrder, type CheckoutAssessmentInput } from "@/lib/checkoutService";
import { ESTIMATED_GST_RATE, type CartItem } from "@/lib/cart";
import { isStripeConfigured, stripePromise } from "@/lib/stripeClient";

const cardClassName = "rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8";
const sectionHeadingClassName = "text-2xl font-black text-slate-900 sm:text-3xl";
const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-[#1d52a1]";
const AUTO_PREPARE_DEBOUNCE_MS = 900;

const getItemSelectionSignature = (item: CartItem) =>
  [
    item.key,
    item.quantity,
    item.price,
    item.customization?.lessonDurationMinutes ?? "",
  ].join(":");

type CheckoutInputErrorKey =
  | "addressLine1"
  | "city"
  | "consent"
  | "email"
  | "fullName"
  | "phone"
  | "postalCode"
  | "province";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const roundMoney = (value: number) => Number(value.toFixed(2));

const calculateCouponAdjustedSummary = (
  pricingSummary: {
    bundleDiscountAmount: number;
    bundleDiscountPercent: number;
    subtotal: number;
    subtotalBeforeDiscount: number;
  },
  appliedCoupons: CheckoutAppliedCoupon[],
) => {
  const couponDiscountPercent = Math.min(
    appliedCoupons.reduce((totalDiscount, coupon) => totalDiscount + coupon.discountPercent, 0),
    100,
  );
  const subtotalAfterBundleDiscount = pricingSummary.subtotal;
  const couponDiscountAmount = roundMoney(subtotalAfterBundleDiscount * (couponDiscountPercent / 100));
  const subtotal = roundMoney(Math.max(subtotalAfterBundleDiscount - couponDiscountAmount, 0));
  const estimatedTaxes = roundMoney(subtotal * ESTIMATED_GST_RATE);
  const total = roundMoney(subtotal + estimatedTaxes);

  return {
    appliedCoupons,
    bundleDiscountAmount: pricingSummary.bundleDiscountAmount,
    bundleDiscountPercent: pricingSummary.bundleDiscountPercent,
    couponDiscountAmount,
    couponDiscountPercent,
    discountAmount: couponDiscountAmount,
    discountPercent: couponDiscountPercent,
    estimatedTaxes,
    subtotal,
    subtotalAfterBundleDiscount,
    subtotalBeforeDiscount: pricingSummary.subtotalBeforeDiscount,
    total,
  };
};

const normalizeCouponCodes = (codes: string[]) =>
  Array.from(
    new Set(
      codes
        .map((code) => code.trim().toUpperCase())
        .filter((code) => code.length > 0),
    ),
  ).sort();

const buildInvoiceSummary = (amount: number) => {
  const normalizedAmount = roundMoney(amount);

  return {
    appliedCoupons: [] as CheckoutAppliedCoupon[],
    bundleDiscountAmount: 0,
    bundleDiscountPercent: 0,
    couponDiscountAmount: 0,
    couponDiscountPercent: 0,
    discountAmount: 0,
    discountPercent: 0,
    estimatedTaxes: 0,
    subtotal: normalizedAmount,
    subtotalAfterBundleDiscount: normalizedAmount,
    subtotalBeforeDiscount: normalizedAmount,
    total: normalizedAmount,
  };
};

const didPaymentIntentApplyRequestedCoupons = (
  requestedCodes: string[],
  appliedCoupons: CheckoutAppliedCoupon[],
) => {
  const normalizedRequested = normalizeCouponCodes(requestedCodes);
  const normalizedApplied = normalizeCouponCodes(appliedCoupons.map((coupon) => coupon.code));

  if (normalizedRequested.length !== normalizedApplied.length) {
    return false;
  }

  return normalizedRequested.every((code, index) => code === normalizedApplied[index]);
};

const getCouponErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("invalid_coupon_code")) {
    return "That coupon code is no longer valid. Please review it and try again.";
  }

  if (
    message.includes("coupon_not_active") ||
    message.includes("coupon_not_started") ||
    message.includes("coupon_expired")
  ) {
    return "That coupon is not active right now. Please review the offer and try again.";
  }

  if (message.includes("coupon_already_redeemed")) {
    return "That one-time coupon has already been used. Please remove it and try again.";
  }

  if (message.includes("invalid_coupon_payload") || message.includes("coupon_lookup_failed")) {
    return "Coupon validation is unavailable right now. Please try again shortly.";
  }

  return null;
};

const getPreparationErrorMessage = (error: unknown, isInvoiceCheckout = false) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("rate_limited")) {
    return "Checkout was requested too many times in a short period. Please wait a few seconds and retry loading payment.";
  }

  if (message.includes("rate_limit_check_failed")) {
    return "The checkout rate-limit check failed. Please retry loading payment.";
  }

  if (message.includes("unable to reach the checkout api")) {
    return "The checkout service could not be reached. Please retry loading payment.";
  }

  if (message.includes("unable to reach the payment intent api")) {
    return "The payment service could not be reached. Please retry loading payment.";
  }

  if (message.includes("missing_stripe_secret_key")) {
    return "Stripe is not fully configured on the backend. Add the live secret key and retry.";
  }

  if (message.includes("coupon_not_applied_to_payment")) {
    return "The payment service did not apply the selected coupon. Retry loading payment after deploying the latest payment function.";
  }

  if (message.includes("invoice_not_found") || message.includes("invalid_invoice_token")) {
    return "This private payment link is not valid anymore. Request a fresh invoice link.";
  }

  if (message.includes("invoice_expired")) {
    return "This private payment link has expired. Request a new invoice link.";
  }

  if (message.includes("invoice_already_paid")) {
    return "This invoice has already been paid.";
  }

  if (message.includes("invoice_not_available") || message.includes("invoice_order_mismatch")) {
    return "This invoice is not available for payment right now. Request a fresh link.";
  }

  if (message.includes("invoice_lookup_failed")) {
    return "The invoice could not be verified right now. Please retry in a moment.";
  }

  if (isInvoiceCheckout && message.includes("invalid_items")) {
    return "The payment service is not using the latest invoice checkout function yet. Redeploy the create-payment-intent function and retry.";
  }

  if (import.meta.env.DEV && error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "The payment details could not be loaded. Please retry or call us at +1 (250) 542-3673.";
};

const getInvoiceLookupErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("invoice_already_paid")) {
    return "This invoice has already been paid.";
  }

  if (message.includes("invoice_expired")) {
    return "This private payment link has expired. Request a new invoice link.";
  }

  if (
    message.includes("invoice_not_found") ||
    message.includes("invoice_not_available") ||
    message.includes("invalid_invoice_link")
  ) {
    return "This private payment link is no longer available. Request a fresh invoice link.";
  }

  return "This private payment link could not be loaded right now. Please retry or contact the school.";
};

const buildMinimalAssessment = (): CheckoutAssessmentInput => ({
  preferredContactMethods: ["email", "call"],
  studentName: "",
  studentAge: "",
  licenceStatus: "",
  hasValidBCLearnerLicence: "",
  drivingExperienceLevel: "",
  roadTestBookingStatus: "",
  preferredRoadTestLocation: "",
  trainingGoals: "",
  preferredLessonTimes: [],
  pickupLocation: "",
  preferredStartDate: "",
  schedulingNotes: "",
  additionalNotes: "",
  consentAcceptedAt: new Date().toISOString(),
});

const PaymentFormPreview = ({
  isBillingDetailsComplete,
  isPreparingPayment,
}: {
  isBillingDetailsComplete: boolean;
  isPreparingPayment: boolean;
}) => (
  <div className="mt-6">
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
      <p className="text-base font-bold text-slate-900">
        {isPreparingPayment
          ? "Loading secure payment methods..."
          : isBillingDetailsComplete
            ? "Secure payment methods are loading."
            : "Complete the billing details above to load the secure payment form."}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {isPreparingPayment
          ? "Stripe is preparing the live payment form for this order."
          : isBillingDetailsComplete
            ? "The live Stripe payment form will replace this preview automatically."
            : "Card, Affirm, and Afterpay / Clearpay options will appear at checkout when eligible."}
      </p>
    </div>
  </div>
);

const PaymentSubmissionPanel = ({
  amountDueToday,
  billingDetails,
  canSubmit,
  getBlockingMessage,
  onInvalidSubmit,
  orderId,
  querySuffix,
}: {
  amountDueToday: number;
  billingDetails: {
    addressLine1: string;
    city: string;
    country: string;
    email: string;
    fullName: string;
    phone: string;
    postalCode: string;
    province: string;
  };
  canSubmit: boolean;
  getBlockingMessage: () => string;
  onInvalidSubmit: () => void;
  orderId: string;
  querySuffix: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paymentAmountCents = Math.round(amountDueToday * 100);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!canSubmit) {
      onInvalidSubmit();
      setErrorMessage(getBlockingMessage());
      return;
    }

    if (!stripe || !elements || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message ?? "Please review the payment form and try again.");
        return;
      }

      const successSearchParams = new URLSearchParams(querySuffix.startsWith("?") ? querySuffix.slice(1) : "");
      successSearchParams.set("order_id", orderId);

      const returnUrl = new URL("/checkout/success", window.location.origin);
      returnUrl.search = successSearchParams.toString();

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl.toString(),
          payment_method_data: {
            billing_details: {
              address: {
                city: billingDetails.city,
                country: billingDetails.country,
                line1: billingDetails.addressLine1,
                postal_code: billingDetails.postalCode,
                state: billingDetails.province,
              },
              email: billingDetails.email,
              name: billingDetails.fullName,
              phone: billingDetails.phone,
            },
          },
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message ?? "Payment could not be completed. Please review the details and try again.");
        return;
      }

      const nextSearchParams = new URLSearchParams(successSearchParams);
      if (paymentIntent?.client_secret) nextSearchParams.set("payment_intent_client_secret", paymentIntent.client_secret);
      if (paymentIntent?.status) nextSearchParams.set("status", paymentIntent.status);
      navigate(`/checkout/success?${nextSearchParams.toString()}`);
    } catch (error) {
      console.error("Stripe confirmation failed:", error);
      setErrorMessage("Stripe could not confirm the payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <PaymentMethodMessagingElement
            options={{
              amount: paymentAmountCents,
              countryCode: "CA",
              currency: "CAD",
              paymentMethodTypes: ["affirm", "afterpay_clearpay"],
            }}
          />
        </div>

        <div id="payment-element">
          <PaymentElement
            options={{
              layout: "accordion",
              paymentMethodOrder: ["affirm", "afterpay_clearpay", "card"],
            }}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm leading-relaxed text-slate-600">
            If you choose Affirm or Afterpay / Clearpay, Stripe will open a secure approval step and return you
            automatically to the confirmation page after payment completes.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            If Afterpay / Clearpay still does not appear below, Stripe has marked the order ineligible or the method
            is not enabled in the current Stripe environment.
          </p>
        </div>
      </div>

      <button
        id="submit"
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-white transition-colors ${
          !stripe || !elements || isSubmitting ? "cursor-not-allowed bg-slate-300" : "bg-[#E6242A] hover:bg-[#C41E23]"
        }`}
      >
        {isSubmitting ? "Processing payment..." : `Pay ${formatCoursePrice(amountDueToday)} now`}
        <ChevronRight className="h-4 w-4" />
      </button>

      {errorMessage ? <p className="text-sm font-semibold text-[#E6242A]">{errorMessage}</p> : null}
    </form>
  );
};

const Checkout = () => {
  const {
    activeItems,
    goToCart,
    invoiceToken,
    isUsingDirectSelection,
    pricingSummary,
    querySuffix,
  } = useCheckoutSelection();
  const isInvoiceCheckout = invoiceToken.length > 0;
  const invoiceQuery = useQuery({
    queryKey: ["checkout-invoice", invoiceToken],
    queryFn: () => getCheckoutInvoiceByToken(invoiceToken),
    enabled: isInvoiceCheckout,
    retry: false,
  });
  const activeInvoice = invoiceQuery.data ?? null;
  const [formValues, setFormValues] = useState<CheckoutFormValues>(readStoredCheckoutFormValues);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<CheckoutInputErrorKey, boolean>>>({});
  const [prepareError, setPrepareError] = useState("");
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const [preparedPaymentSession, setPreparedPaymentSession] = useState<CheckoutPaymentSession | null>(() =>
    readCheckoutPaymentSession(),
  );
  const [couponCodeInput, setCouponCodeInput] = useState(() => readCheckoutPaymentSession()?.appliedCoupons[0]?.code ?? "");
  const [appliedCoupon, setAppliedCoupon] = useState<CheckoutAppliedCoupon | null>(
    () => readCheckoutPaymentSession()?.appliedCoupons[0] ?? null,
  );
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [blockedAutoPrepareKey, setBlockedAutoPrepareKey] = useState<string | null>(null);
  const effectiveAppliedCouponCode = isInvoiceCheckout ? "" : appliedCoupon?.code ?? "";
  const paymentPreparationSignature = useMemo(
    () =>
      isInvoiceCheckout
        ? `invoice:${invoiceToken}:${activeInvoice?.id ?? ""}`
        : `${activeItems.map(getItemSelectionSignature).join("|")}::${effectiveAppliedCouponCode}`,
    [activeInvoice?.id, activeItems, effectiveAppliedCouponCode, invoiceToken, isInvoiceCheckout],
  );
  const paymentPreparationRequestKey = useMemo(
    () =>
      [
        paymentPreparationSignature,
        formValues.fullName.trim(),
        formValues.email.trim().toLowerCase(),
        formValues.phone.trim(),
        formValues.addressLine1.trim(),
        formValues.city.trim(),
        formValues.province.trim(),
        formValues.postalCode.trim(),
        "CA",
      ].join("::"),
    [
      formValues.addressLine1,
      formValues.city,
      formValues.email,
      formValues.fullName,
      formValues.phone,
      formValues.postalCode,
      formValues.province,
      paymentPreparationSignature,
    ],
  );
  const latestPreparationRequestKeyRef = useRef(paymentPreparationRequestKey);
  const invoiceLookupError =
    isInvoiceCheckout && invoiceQuery.isError ? getInvoiceLookupErrorMessage(invoiceQuery.error) : "";

  useEffect(() => {
    if (preparedPaymentSession?.paymentMode !== "installment") {
      return;
    }

    clearCheckoutPaymentSession();
    setPreparedPaymentSession(null);
  }, [preparedPaymentSession]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(formValues));
  }, [formValues]);

  useEffect(() => {
    latestPreparationRequestKeyRef.current = paymentPreparationRequestKey;
  }, [paymentPreparationRequestKey]);

  useEffect(() => {
    if (!activeInvoice) {
      return;
    }

    setFormValues((current) => {
      const nextFullName = current.fullName.trim() ? current.fullName : (activeInvoice.customerName ?? "");
      const nextEmail = current.email.trim() ? current.email : (activeInvoice.customerEmail ?? "");

      if (nextFullName === current.fullName && nextEmail === current.email) {
        return current;
      }

      return {
        ...current,
        fullName: nextFullName,
        email: nextEmail,
      };
    });
  }, [activeInvoice]);

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<CheckoutInputErrorKey, string>> = {};
    if (!formValues.fullName.trim()) nextErrors.fullName = "Enter the billing name.";
    if (!formValues.email.trim()) nextErrors.email = "Enter an email address for updates.";
    else if (!emailPattern.test(formValues.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!formValues.phone.trim()) nextErrors.phone = "Enter a phone number for follow-up.";
    else if (formValues.phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Enter a valid phone number.";
    if (!formValues.addressLine1.trim()) nextErrors.addressLine1 = "Enter the billing address.";
    if (!formValues.city.trim()) nextErrors.city = "Enter the billing city.";
    if (!formValues.province.trim()) nextErrors.province = "Enter the province or state.";
    if (!formValues.postalCode.trim()) nextErrors.postalCode = "Enter the postal or ZIP code.";
    if (!formValues.consent) nextErrors.consent = "You must agree before completing payment.";
    return nextErrors;
  }, [
    formValues.addressLine1,
    formValues.city,
    formValues.consent,
    formValues.email,
    formValues.fullName,
    formValues.phone,
    formValues.postalCode,
    formValues.province,
  ]);

  const hasValidationErrors = Object.keys(errors).length > 0;
  const isBillingDetailsComplete =
    !errors.fullName &&
    !errors.email &&
    !errors.phone &&
    !errors.addressLine1 &&
    !errors.city &&
    !errors.province &&
    !errors.postalCode;
  const paymentSessionMatchesSelection =
    preparedPaymentSession &&
    (preparedPaymentSession.invoiceToken ?? null) === (invoiceToken || null) &&
    preparedPaymentSession.itemSnapshot.length === activeItems.length &&
    preparedPaymentSession.itemSnapshot.every((snapshot) =>
      activeItems.some(
        (item) =>
          item.key === snapshot.key &&
          item.quantity === snapshot.quantity &&
          (snapshot.selectionSignature ?? `${snapshot.key}:${snapshot.quantity}`) ===
            (snapshot.selectionSignature
              ? getItemSelectionSignature(item)
              : `${item.key}:${item.quantity}`),
      ),
    ) &&
    (preparedPaymentSession.appliedCoupons[0]?.code ?? "") === effectiveAppliedCouponCode;

  const activePaymentSession = paymentSessionMatchesSelection ? preparedPaymentSession : null;
  const stripeOptions = activePaymentSession
    ? {
        clientSecret: activePaymentSession.clientSecret,
        appearance: {
          theme: "stripe" as const,
          variables: {
            colorPrimary: "#1d52a1",
            colorText: "#0f172a",
            colorDanger: "#E6242A",
            borderRadius: "18px",
          },
        },
      }
    : null;

  const invoiceSummaryValues = useMemo(
    () => (activeInvoice ? buildInvoiceSummary(activeInvoice.amount) : null),
    [activeInvoice],
  );

  const summaryValues = activePaymentSession
    ? {
        appliedCoupons: activePaymentSession.appliedCoupons,
        bundleDiscountAmount: activePaymentSession.bundleDiscountAmount,
        bundleDiscountPercent: activePaymentSession.bundleDiscountPercent,
        couponDiscountAmount: activePaymentSession.couponDiscountAmount,
        couponDiscountPercent: activePaymentSession.couponDiscountPercent,
        discountAmount: activePaymentSession.discountAmount,
        discountPercent: activePaymentSession.discountPercent,
        subtotal: activePaymentSession.subtotal,
        subtotalAfterBundleDiscount: activePaymentSession.subtotalAfterBundleDiscount,
        subtotalBeforeDiscount: activePaymentSession.subtotalBeforeDiscount,
        estimatedTaxes: activePaymentSession.estimatedTaxes,
        total: activePaymentSession.total,
      }
    : isInvoiceCheckout
      ? (invoiceSummaryValues ?? buildInvoiceSummary(0))
      : calculateCouponAdjustedSummary(pricingSummary, appliedCoupon ? [appliedCoupon] : []);

  useEffect(() => {
    if (preparedPaymentSession && !paymentSessionMatchesSelection) {
      clearCheckoutPaymentSession();
      setPreparedPaymentSession(null);
    }
  }, [paymentSessionMatchesSelection, preparedPaymentSession]);

  const shouldShowError = (field: CheckoutInputErrorKey) => Boolean(touchedFields[field]);

  const resetPreparedPayment = () => {
    clearCheckoutPaymentSession();
    setPreparedPaymentSession(null);
  };

  const updateField = <Field extends keyof CheckoutFormValues,>(field: Field, value: CheckoutFormValues[Field]) => {
    if (prepareError) {
      setPrepareError("");
    }
    if (blockedAutoPrepareKey) {
      setBlockedAutoPrepareKey(null);
    }
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  const markTouched = (field: CheckoutInputErrorKey) => {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  };

  const applyCoupon = async () => {
    const normalizedCouponCode = couponCodeInput.trim().toUpperCase();

    if (!normalizedCouponCode) {
      setCouponError("Enter a coupon code to apply it.");
      return;
    }

    setIsApplyingCoupon(true);
    setPrepareError("");
    setBlockedAutoPrepareKey(null);

    try {
      const coupon = await findPublicCouponByCode(normalizedCouponCode);
      if (!coupon) {
        setCouponError("That coupon code is not valid right now.");
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCodeInput(coupon.code);
      setCouponError("");
      resetPreparedPayment();
    } catch {
      setCouponError("Coupon validation is unavailable right now. Please try again shortly.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponError("");
    setPrepareError("");
    setBlockedAutoPrepareKey(null);
    resetPreparedPayment();
  };

  const preparePayment = async () => {
    setPrepareError("");

    if ((!isInvoiceCheckout && activeItems.length === 0) || isPreparingPayment) return;
    if (isInvoiceCheckout && !activeInvoice) return;
    if (!isStripeConfigured) {
      setPrepareError("Stripe is not configured. Add the publishable key and try again.");
      return;
    }
    if (!isBillingDetailsComplete) {
      return;
    }

    setIsPreparingPayment(true);
    const requestKey = paymentPreparationRequestKey;
    const appliedCouponCodes = effectiveAppliedCouponCode ? [effectiveAppliedCouponCode] : [];

    try {
      const captcha = await getCaptchaVerification("checkout_submit");
      const order = await submitCheckoutOrder({
        appliedCouponCodes,
        bundleDiscountAmount: summaryValues.bundleDiscountAmount,
        bundleDiscountPercent: summaryValues.bundleDiscountPercent,
        couponDiscountAmount: summaryValues.couponDiscountAmount,
        couponDiscountPercent: summaryValues.couponDiscountPercent,
        fullName: formValues.fullName,
        email: formValues.email,
        phone: formValues.phone,
        billingAddress: {
          addressLine1: formValues.addressLine1,
          city: formValues.city,
          country: formValues.country,
          postalCode: formValues.postalCode,
          province: formValues.province,
        },
        sourcePage: isInvoiceCheckout ? "/checkout?invoice" : "/checkout",
        items: isInvoiceCheckout ? [] : activeItems,
        invoiceToken: isInvoiceCheckout ? invoiceToken : undefined,
        subtotalBeforeDiscount: summaryValues.subtotalBeforeDiscount,
        subtotalAfterBundleDiscount: summaryValues.subtotalAfterBundleDiscount,
        subtotal: summaryValues.subtotal,
        estimatedTaxes: summaryValues.estimatedTaxes,
        total: summaryValues.total,
        assessment: buildMinimalAssessment(),
        captchaProvider: captcha.provider ?? undefined,
        captchaToken: captcha.token ?? undefined,
        captchaAction: captcha.action ?? undefined,
      });

      const paymentIntent = await createCheckoutPaymentIntent({
        appliedCouponCodes,
        billingDetails: {
          addressLine1: formValues.addressLine1,
          city: formValues.city,
          country: formValues.country,
          email: formValues.email,
          fullName: formValues.fullName,
          phone: formValues.phone,
          postalCode: formValues.postalCode,
          province: formValues.province,
        },
        invoiceToken: isInvoiceCheckout ? invoiceToken : undefined,
        orderId: order.orderId,
        items: isInvoiceCheckout ? [] : activeItems,
      });

      if (!didPaymentIntentApplyRequestedCoupons(appliedCouponCodes, paymentIntent.appliedCoupons)) {
        throw new Error("coupon_not_applied_to_payment");
      }

      if (latestPreparationRequestKeyRef.current !== requestKey) {
        return;
      }

      const nextPaymentSession: CheckoutPaymentSession = {
        appliedCoupons: paymentIntent.appliedCoupons,
        amountDueToday: paymentIntent.amountDueToday,
        bundleDiscountAmount: paymentIntent.bundleDiscountAmount,
        bundleDiscountPercent: paymentIntent.bundleDiscountPercent,
        clientSecret: paymentIntent.clientSecret,
        couponDiscountAmount: paymentIntent.couponDiscountAmount,
        couponDiscountPercent: paymentIntent.couponDiscountPercent,
        discountAmount: paymentIntent.discountAmount,
        discountPercent: paymentIntent.discountPercent,
        estimatedTaxes: paymentIntent.estimatedTaxes,
        invoiceToken: isInvoiceCheckout ? invoiceToken : null,
        installmentCount: paymentIntent.installmentCount,
        itemSnapshot: activeItems.map((item) => ({
          key: item.key,
          quantity: item.quantity,
          selectionSignature: getItemSelectionSignature(item),
        })),
        orderId: paymentIntent.orderId,
        paymentMode: paymentIntent.paymentMode,
        remainingBalance: paymentIntent.remainingBalance,
        subtotalAfterBundleDiscount: paymentIntent.subtotalAfterBundleDiscount,
        subtotalBeforeDiscount: paymentIntent.subtotalBeforeDiscount,
        subtotal: paymentIntent.subtotal,
        total: paymentIntent.total,
      };

      writeCheckoutPaymentSession(nextPaymentSession);
      setPreparedPaymentSession(nextPaymentSession);
      setBlockedAutoPrepareKey(null);
    } catch (error) {
      if (latestPreparationRequestKeyRef.current !== requestKey) {
        return;
      }

      console.error("Payment preparation failed:", error);
      setBlockedAutoPrepareKey(requestKey);
      const nextCouponError = getCouponErrorMessage(error);
      if (nextCouponError) {
        setAppliedCoupon(null);
        setCouponError(nextCouponError);
        setPrepareError("");
      } else {
        setPrepareError(getPreparationErrorMessage(error, isInvoiceCheckout));
      }
    } finally {
      setIsPreparingPayment(false);
    }
  };

  useEffect(() => {
    if (
      ((!isInvoiceCheckout && activeItems.length === 0) || (isInvoiceCheckout && !activeInvoice)) ||
      !isStripeConfigured ||
      activePaymentSession ||
      isPreparingPayment ||
      !isBillingDetailsComplete ||
      blockedAutoPrepareKey === paymentPreparationRequestKey
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (latestPreparationRequestKeyRef.current === paymentPreparationRequestKey) {
        void preparePayment();
      }
    }, AUTO_PREPARE_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [
    activeInvoice,
    activeItems.length,
    activePaymentSession,
    effectiveAppliedCouponCode,
    blockedAutoPrepareKey,
    isBillingDetailsComplete,
    isInvoiceCheckout,
    isPreparingPayment,
    isStripeConfigured,
    paymentPreparationRequestKey,
  ]);

  const handleInvalidPaymentSubmit = () => {
    setTouchedFields({
      addressLine1: true,
      city: true,
      consent: true,
      email: true,
      fullName: true,
      phone: true,
      postalCode: true,
      province: true,
    });
  };

  const getPaymentBlockingMessage = () =>
    errors.fullName ??
    errors.phone ??
    errors.email ??
    errors.addressLine1 ??
    errors.city ??
    errors.province ??
    errors.postalCode ??
    errors.consent ??
    "Complete the billing details before paying.";

  const editSelectionHref =
    !isInvoiceCheckout && isUsingDirectSelection ? activeItems[0]?.editHref ?? "/packages" : null;
  const shouldShowCatalogEmptyState = !isInvoiceCheckout && activeItems.length === 0;
  const shouldShowInvoiceUnavailable = isInvoiceCheckout && !invoiceQuery.isLoading && !activeInvoice;

  return (
    <main className="bg-[#F8FAFC] text-[#202121]">
      <SiteHeader tone="brand" />

      <section className="bg-[#F8FAFC] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <Link to="/" className="transition-colors hover:text-[#1d52a1]">
                Home
              </Link>
              {!isInvoiceCheckout ? (
                <>
                  <span>/</span>
                  <Link to="/cart" className="transition-colors hover:text-[#1d52a1]">
                    Cart
                  </Link>
                </>
              ) : null}
              <span>/</span>
              <span className="text-slate-700">Checkout</span>
            </div>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">
                  {isInvoiceCheckout ? "Private invoice" : "Secure payment"}
                </p>
                <h1 className="mt-3 text-[2.3rem] font-black leading-none tracking-[-0.04em] text-slate-900 sm:text-[3rem]">
                  Checkout
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {isInvoiceCheckout
                    ? "Review the private invoice, complete billing information, and finish payment inside the secure Stripe form."
                    : "Review your booking details, complete billing information, and finish payment inside the secure Stripe form."}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
          {invoiceQuery.isLoading ? (
            <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#1d52a1]">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h2 className="mt-5 text-3xl font-black text-slate-900">Loading private invoice</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                We&apos;re verifying the invoice details and preparing the secure checkout.
              </p>
            </div>
          ) : shouldShowInvoiceUnavailable ? (
            <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E6242A]/10 text-[#E6242A]">
                <CreditCard className="h-8 w-8" />
              </span>
              <h2 className="mt-5 text-3xl font-black text-slate-900">Private invoice unavailable</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{invoiceLookupError}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                >
                  Contact the school
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          ) : shouldShowCatalogEmptyState ? (
            <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#1d52a1]">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h2 className="mt-5 text-3xl font-black text-slate-900">Choose a course or package before checkout</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Select one of the available training options first so the checkout page can show the correct order summary and payment amount.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/packages"
                  className="inline-flex items-center justify-center rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                >
                  Browse packages
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                >
                  Browse courses
                </Link>
              </div>
            </div>
          ) : (
            <>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.75fr)] lg:items-start">
              <div className="order-2 space-y-6 lg:order-1">
                <div className="space-y-6">
                  <section className={cardClassName}>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Billing details</p>
                    <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">Billing information</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                      Enter your billing contact details and address so the secure payment methods can load correctly.
                    </p>

                    {isInvoiceCheckout && activeInvoice ? (
                      <div className="mt-6 rounded-2xl border border-[#1d52a1]/15 bg-[#1d52a1]/5 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#1d52a1]">Private invoice</p>
                        <p className="mt-2 text-base font-black text-slate-900">{activeInvoice.title}</p>
                        {activeInvoice.customerEmail ? (
                          <p className="mt-1 text-sm text-slate-600">Issued for {activeInvoice.customerEmail}</p>
                        ) : null}
                        {activeInvoice.expiresAt ? (
                          <p className="mt-1 text-sm text-slate-600">
                            Pay before {new Date(activeInvoice.expiresAt).toLocaleString()}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-6 space-y-5">
                      <div>
                        <label htmlFor="checkout-full-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Full name <span className="text-[#E6242A]">*</span>
                        </label>
                        <input
                          id="checkout-full-name"
                          type="text"
                          value={formValues.fullName}
                          onBlur={() => markTouched("fullName")}
                          onChange={(event) => updateField("fullName", event.target.value)}
                          placeholder="Enter your billing name"
                          className={inputClass}
                        />
                        {shouldShowError("fullName") && errors.fullName ? (
                          <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>
                        ) : null}
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="checkout-phone" className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Phone number <span className="text-[#E6242A]">*</span>
                          </label>
                          <input
                            id="checkout-phone"
                            type="tel"
                            value={formValues.phone}
                            onBlur={() => markTouched("phone")}
                            onChange={(event) => updateField("phone", event.target.value)}
                            placeholder="+1 (250) 542-3673"
                            className={inputClass}
                          />
                          {shouldShowError("phone") && errors.phone ? (
                            <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                          ) : null}
                        </div>

                        <div>
                          <label htmlFor="checkout-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Email address <span className="text-[#E6242A]">*</span>
                          </label>
                          <input
                            id="checkout-email"
                            type="email"
                            value={formValues.email}
                            onBlur={() => markTouched("email")}
                            onChange={(event) => updateField("email", event.target.value)}
                            placeholder="you@example.com"
                            className={inputClass}
                          />
                          {shouldShowError("email") && errors.email ? (
                            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="checkout-address-line-1" className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Address line 1 <span className="text-[#E6242A]">*</span>
                        </label>
                        <input
                          id="checkout-address-line-1"
                          type="text"
                          value={formValues.addressLine1}
                          onBlur={() => markTouched("addressLine1")}
                          onChange={(event) => updateField("addressLine1", event.target.value)}
                          placeholder="Street address"
                          className={inputClass}
                        />
                        {shouldShowError("addressLine1") && errors.addressLine1 ? (
                          <p className="mt-2 text-sm text-red-500">{errors.addressLine1}</p>
                        ) : null}
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="checkout-city" className="mb-1.5 block text-sm font-semibold text-slate-700">
                            City <span className="text-[#E6242A]">*</span>
                          </label>
                          <input
                            id="checkout-city"
                            type="text"
                            value={formValues.city}
                            onBlur={() => markTouched("city")}
                            onChange={(event) => updateField("city", event.target.value)}
                            placeholder="Victoria"
                            className={inputClass}
                          />
                          {shouldShowError("city") && errors.city ? (
                            <p className="mt-2 text-sm text-red-500">{errors.city}</p>
                          ) : null}
                        </div>

                        <div>
                          <label htmlFor="checkout-province" className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Province / state <span className="text-[#E6242A]">*</span>
                          </label>
                          <input
                            id="checkout-province"
                            type="text"
                            value={formValues.province}
                            onBlur={() => markTouched("province")}
                            onChange={(event) => updateField("province", event.target.value)}
                            placeholder="BC"
                            className={inputClass}
                          />
                          {shouldShowError("province") && errors.province ? (
                            <p className="mt-2 text-sm text-red-500">{errors.province}</p>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="checkout-postal-code" className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Postal / ZIP code <span className="text-[#E6242A]">*</span>
                        </label>
                        <input
                          id="checkout-postal-code"
                          type="text"
                          value={formValues.postalCode}
                          onBlur={() => markTouched("postalCode")}
                          onChange={(event) => updateField("postalCode", event.target.value)}
                          placeholder="V8X 1A1"
                          className={inputClass}
                        />
                        {shouldShowError("postalCode") && errors.postalCode ? (
                          <p className="mt-2 text-sm text-red-500">{errors.postalCode}</p>
                        ) : null}
                      </div>

                      <div className="border-t border-slate-200 pt-5">
                        <label htmlFor="checkout-consent" className="flex items-start gap-3">
                          <input
                            id="checkout-consent"
                            type="checkbox"
                            checked={formValues.consent}
                            onBlur={() => markTouched("consent")}
                            onChange={(event) => updateField("consent", event.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1d52a1] focus:ring-[#1d52a1]"
                          />
                          <span className="text-sm leading-relaxed text-slate-700 sm:text-base">
                            I agree to the payment and booking terms.
                          </span>
                        </label>

                        {shouldShowError("consent") && errors.consent ? (
                          <p className="mt-3 text-sm text-red-500">{errors.consent}</p>
                        ) : null}
                      </div>
                    </div>

                    {!isStripeConfigured ? (
                      <p className="mt-3 text-sm font-semibold text-[#E6242A]">
                        Stripe publishable key is missing from the frontend environment.
                      </p>
                    ) : null}

                    {prepareError ? (
                      <p className="mt-3 text-sm font-semibold text-[#E6242A]">{prepareError}</p>
                    ) : null}
                  </section>
                </div>

                <section className={cardClassName}>
                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-1 h-5 w-5 text-[#1d52a1]" />
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Payment details</p>
                      <h2 className={`mt-2 ${sectionHeadingClassName}`}>Secure payment</h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                        Pay by card, Affirm, or Afterpay / Clearpay inside the same secure Stripe checkout.
                      </p>
                    </div>
                  </div>

                  {activePaymentSession && stripeOptions ? (
                    <div className="mt-6 space-y-4">
                      <p className="text-sm leading-relaxed text-slate-600">
                        Today you will pay the full amount of {formatCoursePrice(activePaymentSession.amountDueToday)}.
                      </p>
                      <Elements stripe={stripePromise} options={stripeOptions}>
                        <PaymentSubmissionPanel
                          amountDueToday={activePaymentSession.amountDueToday}
                          billingDetails={{
                            addressLine1: formValues.addressLine1,
                            city: formValues.city,
                            country: formValues.country,
                            email: formValues.email,
                            fullName: formValues.fullName,
                            phone: formValues.phone,
                            postalCode: formValues.postalCode,
                            province: formValues.province,
                          }}
                          canSubmit={!hasValidationErrors}
                          getBlockingMessage={getPaymentBlockingMessage}
                          onInvalidSubmit={handleInvalidPaymentSubmit}
                          orderId={activePaymentSession.orderId}
                          querySuffix={querySuffix}
                        />
                      </Elements>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <PaymentFormPreview
                        isBillingDetailsComplete={isBillingDetailsComplete}
                        isPreparingPayment={isPreparingPayment}
                      />
                      {prepareError ? (
                        <p className="text-sm font-semibold text-[#E6242A]">{prepareError}</p>
                      ) : null}
                      {prepareError ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBlockedAutoPrepareKey(null);
                            void preparePayment();
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-[#1d52a1] px-5 py-2.5 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white"
                        >
                          Retry loading payment
                        </button>
                      ) : null}
                    </div>
                  )}
                </section>
              </div>

              <aside className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-10">
                <section className={cardClassName}>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Order summary</p>
                  <h2 className={`mt-3 ${sectionHeadingClassName}`}>Your booking total</h2>

                  <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
                      <span>{isInvoiceCheckout ? "Invoice amount" : "Subtotal"}</span>
                      <span className="font-bold text-slate-900">
                        {formatCoursePrice(summaryValues.subtotalBeforeDiscount)}
                      </span>
                    </div>
                    {!isInvoiceCheckout && summaryValues.bundleDiscountAmount > 0 ? (
                      <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
                        <span>{summaryValues.bundleDiscountPercent}% course bundle savings</span>
                        <span className="font-bold text-[#1d52a1]">
                          -{formatCoursePrice(summaryValues.bundleDiscountAmount)}
                        </span>
                      </div>
                    ) : null}
                    {!isInvoiceCheckout && summaryValues.couponDiscountAmount > 0 ? (
                      <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
                        <span>Coupon savings</span>
                        <span className="font-bold text-[#1d52a1]">
                          -{formatCoursePrice(summaryValues.couponDiscountAmount)}
                        </span>
                      </div>
                    ) : null}
                    {!isInvoiceCheckout ? (
                      <div className="flex items-center justify-between gap-4 text-sm text-slate-600 sm:text-base">
                        <span>Estimated GST</span>
                        <span className="font-bold text-slate-900">{formatCoursePrice(summaryValues.estimatedTaxes)}</span>
                      </div>
                    ) : activeInvoice?.description ? (
                      <p className="text-sm leading-relaxed text-slate-600">{activeInvoice.description}</p>
                    ) : (
                      <p className="text-sm leading-relaxed text-slate-600">
                        This amount is fixed by the private invoice link.
                      </p>
                    )}
                    <div className="border-t border-slate-300 pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-base font-black uppercase tracking-[0.12em] text-slate-900">Total due</span>
                        <span className="text-3xl font-black text-[#E6242A]">{formatCoursePrice(summaryValues.total)}</span>
                      </div>
                    </div>
                    {!isInvoiceCheckout ? (
                    <div className="border-t border-slate-300 pt-4">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500">Coupon code</p>
                      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setCouponCodeInput(nextValue);
                            if (couponError) {
                              setCouponError("");
                            }
                            if (prepareError) {
                              setPrepareError("");
                            }
                            if (appliedCoupon && nextValue.trim().toUpperCase() !== appliedCoupon.code) {
                              setAppliedCoupon(null);
                              resetPreparedPayment();
                            }
                          }}
                          placeholder="Enter coupon code"
                          className={`${inputClass} sm:flex-1`}
                        />
                        {appliedCoupon ? (
                          <button
                            type="button"
                            onClick={removeCoupon}
                            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                          >
                            Remove coupon
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={applyCoupon}
                            disabled={isApplyingCoupon}
                            className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white transition-colors ${
                              isApplyingCoupon ? "cursor-wait bg-slate-400" : "bg-[#1d52a1] hover:bg-[#17488d]"
                            }`}
                          >
                            {isApplyingCoupon ? "Checking..." : "Apply coupon"}
                          </button>
                        )}
                      </div>
                      {summaryValues.appliedCoupons.length > 0 ? (
                        <p className="mt-2 text-xs font-semibold text-[#1d52a1]">
                          {summaryValues.appliedCoupons.map((coupon) => `${coupon.label} (${coupon.code})`).join(", ")} -{" "}
                          {summaryValues.couponDiscountPercent}% off
                        </p>
                      ) : null}
                      {couponError ? <p className="mt-2 text-xs font-semibold text-[#E6242A]">{couponError}</p> : null}
                    </div>
                    ) : null}
                  </div>
                </section>

                <section className={cardClassName}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Product details</p>
                      <h2 className="mt-3 text-2xl font-black text-slate-900">
                        {isInvoiceCheckout ? "Invoice details" : "Items in your order"}
                      </h2>
                    </div>

                    {editSelectionHref ? (
                      <Link
                        to={editSelectionHref}
                        className="text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
                      >
                        Edit selection
                      </Link>
                    ) : !isInvoiceCheckout ? (
                      <button
                        type="button"
                        onClick={goToCart}
                        className="text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
                      >
                        Edit cart
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-6 divide-y divide-slate-200">
                    {isInvoiceCheckout && activeInvoice ? (
                      <article className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="text-base font-black leading-tight text-slate-900">{activeInvoice.title}</h3>
                            {activeInvoice.customerName ? (
                              <p className="mt-1 text-sm text-slate-500">Issued for {activeInvoice.customerName}</p>
                            ) : null}
                            {activeInvoice.customerEmail ? (
                              <p className="mt-1 text-sm text-slate-500">{activeInvoice.customerEmail}</p>
                            ) : null}
                            {activeInvoice.expiresAt ? (
                              <p className="mt-2 text-sm text-slate-600">
                                Expires {new Date(activeInvoice.expiresAt).toLocaleString()}
                              </p>
                            ) : null}
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-lg font-black text-slate-900">
                              {formatCoursePrice(activeInvoice.amount)}
                            </p>
                          </div>
                        </div>
                      </article>
                    ) : activeItems.map((item) => {
                      const learningObjective = item.customization?.learningObjective ?? "";
                      const classObjectives = item.customization?.classObjectives ?? [];

                      return (
                        <article key={item.key} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h3 className="text-base font-black leading-tight text-slate-900">{item.title}</h3>
                                <p className="mt-1 text-sm text-slate-500">{item.locationName}</p>
                                <p className="mt-2 text-sm text-slate-600">
                                  Qty {item.quantity}
                                  {item.sessionDetail ? ` - ${item.sessionDetail}` : ""}
                                </p>
                                {learningObjective ? (
                                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                                    <span className="font-semibold text-slate-700">Learning objective:</span>{" "}
                                    {learningObjective}
                                  </p>
                                ) : classObjectives.length > 0 ? (
                                  <ul className="mt-3 space-y-1 text-xs leading-relaxed text-slate-500">
                                    {classObjectives.map((objective) => (
                                      <li key={objective.classNumber}>
                                        Class {objective.classNumber}:{" "}
                                        {objective.objective || "Focus can be decided later"}
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="text-lg font-black text-slate-900">
                                  {formatCoursePrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </aside>
            </div>
            </>
          )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Checkout;
