# Affirm Dashboard And Webhook Handoff

## Stripe Dashboard

The following Stripe Dashboard settings need to be confirmed outside the codebase:

- Use the correct Stripe account and mode before testing.
- Enable `Affirm` in `Settings -> Payment methods`.
- Keep dynamic payment methods enabled for the account.
- Verify the account can present `Affirm` for `CAD` payments in Canada.
- Use test keys for test-mode validation and live keys only for production rollout.

## Existing Code Assumptions

The current codebase already does the following:

- Creates PaymentIntents with `automatic_payment_methods.enabled = true`.
- Uses `cad` currency.
- Sends shipping details in the PaymentIntent.
- Sends a `return_url` to `/checkout/success`.
- Does not send an Affirm-specific `capture_method` override during PaymentIntent creation.
- Shows `PaymentMethodMessagingElement` and prioritizes `affirm` in the `PaymentElement`.

## Stripe Webhook Work Needed Later

The current webhook updates payment status, but it does not yet persist the final payment method into the new `orders` columns.

You will need to update `supabase/functions/stripe-webhook/index.ts` later to:

- Read the final payment method from the webhook event object, not from the frontend.
- Set `orders.payment_provider = 'stripe'`.
- Set `orders.payment_method_type` based on the actual Stripe payment result.

Recommended event types to keep handling:

- `payment_intent.processing`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`

## Recommended Webhook Mapping

For Stripe-hosted payment methods on a PaymentIntent, the final method is typically available from the PaymentIntent's attached payment method details or the latest charge details returned in the event payload or a follow-up retrieve.

Use this mapping when you wire the webhook:

- If the successful method is `affirm`, set `payment_method_type = 'affirm'`.
- If the successful method is a card, set `payment_method_type = 'card'`.
- Always set `payment_provider = 'stripe'`.

## Stripe Dashboard Items Needed For Later Validation

When you do end-to-end testing in Stripe Dashboard, verify:

- The payment appears in the `Payments` tab.
- The PaymentIntent shows the expected currency and amount.
- The payment method shown by Stripe is `Affirm` for the BNPL flow.
- Redirect-based completion returns to `/checkout/success`.
- Failed or abandoned Affirm attempts do not mark the order as paid.

## Deployment Order

1. Apply the new database migration.
2. Deploy the updated `create-payment-intent` edge function.
3. Test the frontend checkout flow.
4. Update and deploy the Stripe webhook after you are ready to persist `payment_method_type` and `payment_provider`.
