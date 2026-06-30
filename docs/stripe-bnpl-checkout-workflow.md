# Stripe BNPL Checkout Workflow

This checkout uses one Stripe `PaymentElement` for all supported methods:

- `card`
- `affirm`
- `afterpay_clearpay`

The customer stays in the same checkout UI. Stripe shows only the methods that are eligible for the current order.

## Customer flow

1. The customer reaches checkout and fills billing details.
2. The frontend creates or refreshes a Stripe `PaymentIntent`.
3. Stripe renders the `PaymentElement`.
4. The customer chooses `card`, `affirm`, or `afterpay_clearpay`.
5. If the customer chooses a BNPL option, Stripe opens the provider approval step and redirects back to the configured `return_url`.
6. The success page reads the Stripe result for customer-facing confirmation.
7. The webhook remains the source of truth for the final database update.

## Best practices in this implementation

- Keep one checkout form. Do not split card and BNPL into separate pages.
- Keep `automatic_payment_methods` enabled on the `PaymentIntent`.
- Do not set a top-level `payment_method_types` array for the full-payment flow.
- Keep `shipping` populated on the `PaymentIntent`.
- Keep `currency` aligned with your Stripe account and supported payment methods.
- Keep `return_url` on `stripe.confirmPayment`.
- Keep card enabled as the fallback option.
- Use the webhook, not the frontend, as the final source of payment status and method used.

## Payment method visibility rules

Stripe decides whether `affirm` and `afterpay_clearpay` appear based on eligibility, including:

- order amount
- currency
- customer country
- business country
- payment method availability in the current Stripe mode

If one or both BNPL methods do not appear for a customer, that does not automatically mean the integration is broken.

## Installment-plan rule

Your internal installment flow should continue to exclude BNPL methods.

Reason:

- `affirm` and `afterpay_clearpay` are already installment-style products
- your internal installment path uses delayed follow-up charging behavior
- mixing both models creates operational and support issues

## Dashboard setup

Enable these methods in Stripe for the exact environment you are using:

- `Affirm`
- `Afterpay / Clearpay`

Stripe keeps test and live dashboard payment-method settings separate.

## Webhook expectations

The webhook should keep handling:

- `payment_intent.processing`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`

It should also store:

- `payment_provider = 'stripe'`
- `payment_method_type`

Preferred source order for the actual method used:

1. `paymentIntent.payment_method.type` when expanded
2. `latest_charge.payment_method_details.type`
3. retrieved Stripe `PaymentMethod.type`

## Orders table notes

Because Stripe dynamic methods can evolve, do not lock `payment_method_type` to an overly narrow list.

Current allowed values in this repo:

- `card`
- `link`
- `affirm`
- `afterpay_clearpay`

If you later enable more Stripe methods, update the constraint again or remove the constraint entirely.

## Testing checklist

1. Enable `affirm` and `afterpay_clearpay` in Stripe dashboard for the current mode.
2. Apply the latest Supabase migrations.
3. Deploy the updated webhook and payment-intent edge functions.
4. Open checkout with an order that is eligible for BNPL.
5. Confirm the checkout UI shows the BNPL guidance block and the Stripe messaging element.
6. Confirm both BNPL methods appear when the order is eligible.
7. Complete a card payment.
8. Complete an Affirm payment.
9. Complete an Afterpay / Clearpay payment.
10. Confirm the order row stores `payment_provider` and `payment_method_type`.
