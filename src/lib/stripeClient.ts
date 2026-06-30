import { loadStripe } from "@stripe/stripe-js";

export const stripePublishableKey = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "").trim();
export const isStripeConfigured = stripePublishableKey.length > 0;

export const stripePromise = isStripeConfigured ? loadStripe(stripePublishableKey) : Promise.resolve(null);
