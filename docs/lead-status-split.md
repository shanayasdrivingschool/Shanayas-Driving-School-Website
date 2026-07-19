# Lead Status Split — Spec

Split the single shared `LeadStatus` union into two type-scoped pipelines so the student funnel
stops borrowing hiring vocabulary. Prerequisite for
[Meta CRM Conversions API](./meta-crm-conversions-api.md) — the Meta stage mapping hangs off these
values, so this lands first.

## Problem

`LeadStatus` in [affiliateTypes.ts:14](../src/lib/affiliateTypes.ts#L14) is one flat union of five
values shared by all four `lead_type`s:

```ts
export type LeadStatus = "new" | "pending_review" | "reviewed" | "shortlisted" | "rejected";
```

Those names came from the Careers flow. A prospective student who booked a lesson is currently
marked **"Shortlisted"**, and one who lives outside the service area is **"Rejected"**. The admin
dropdown offers all five values on every row regardless of type, so a hiring applicant can be set
to a student status and vice versa.

## Design decision: one column, two vocabularies

Keep the single `leads.status` text column. Do **not** add a second column or a separate table.
The split happens in TypeScript, and the dropdown is driven by the row's `lead_type`.

Rationale: a second column means dual-write, drift between the two, and a rewrite of every
`getDirectAdminLeads` consumer. Widening the union costs one migration and gives compile-time
exhaustiveness for free — `leadStatusLabels` and `leadStatusTone` are `Record<LeadStatus, string>`,
so TypeScript fails the build if any new status is missed.

---

## The two pipelines

### Student pipeline
Applies to `lead_type` of `student_assessment`, `contact`, `custom_package_request`.

| Value | Label | Meaning | Meta event |
| --- | --- | --- | --- |
| `new` | New | Just arrived, nobody has called yet | `Lead` |
| `contacted` | Contacted | We reached a human, conversation happened | *(none)* |
| `qualified` | Qualified | Real prospect, in service area, wants lessons | `LeadQualified` |
| `booked` | Booked | Lesson or package booked | `LeadConverted` ← optimisation target |
| `unqualified` | Unqualified | Out of area, spam, wrong intent, unreachable after 3 tries | `LeadDisqualified` |
| `lost` | Lost | Was a good lead, went elsewhere or went quiet on price | *(none)* |

**`unqualified` and `lost` must stay separate.** They feel like the same outcome operationally but
carry opposite meanings to Meta. `unqualified` says *"this lead was bad, stop finding me these."*
`lost` says *"this lead was fine, we just didn't close it."* Collapsing them into one bucket and
reporting it as `LeadDisqualified` teaches Meta to avoid the exact audience that is working — the
most damaging thing you can do with this integration.

**No `enrolled` / paid status.** Payment lives in `orders` with its own `PaymentStatus`. Duplicating
revenue state onto `leads` creates two sources of truth for the same fact. `booked` is the terminal
student status; anything after that is an order.

`booked` is the Meta optimisation event rather than a payment stage because it fires faster and at
higher volume, which is what Conversion Leads optimisation needs.

### Hiring pipeline — unchanged
Applies to `lead_type` of `employee_application`.

| Value | Label |
| --- | --- |
| `new` | New |
| `pending_review` | Pending review |
| `reviewed` | Reviewed |
| `shortlisted` | Shortlisted |
| `rejected` | Rejected |

Deliberately untouched. `mapEmployeeStatus` in
[leadService.ts:234](../src/lib/leadService.ts#L234) feeds `HiringDashboard` through
`EmployeeApplicationRecord`, and `submitEmployeeLead` writes `status: "pending_review"` on insert.
Renaming these would ripple into the hiring UI for no benefit. No Meta events are sent for
`employee_application` leads — job applicants are not ad leads.

`new` is shared by both pipelines and is the default for every insert.

---

## Changes

### 1. Types — [`src/lib/affiliateTypes.ts:14`](../src/lib/affiliateTypes.ts#L14)

```ts
export type StudentLeadStatus =
  | "new" | "contacted" | "qualified" | "booked" | "unqualified" | "lost";

export type HiringLeadStatus =
  | "new" | "pending_review" | "reviewed" | "shortlisted" | "rejected";

export type LeadStatus = StudentLeadStatus | HiringLeadStatus;   // 10 distinct values
```

Existing `LeadStatusUpdateInput` at line 511 keeps taking `LeadStatus` — no signature change.

### 2. Labels, tones, and a type-scoped option helper — [`src/lib/adminPanel.ts`](../src/lib/adminPanel.ts)

Extend both records to all ten values. Suggested tones, matching the existing brand palette:

```ts
contacted:   "bg-sky-100 text-sky-700",
qualified:   "bg-[#1d52a1]/10 text-[#1d52a1]",
booked:      "bg-emerald-100 text-emerald-700",
unqualified: "bg-[#E6242A]/10 text-[#B91C1C]",
lost:        "bg-slate-200 text-slate-700",
```

`booked` inherits the emerald that `shortlisted` uses today, so the "this one is a win" colour cue
stays consistent across both pipelines. `unqualified` takes the existing red, `lost` neutral grey —
visually reinforcing that `lost` is not a failure of the lead.

Add the helper the UI drives off:

```ts
export const STUDENT_LEAD_STATUSES: StudentLeadStatus[] =
  ["new", "contacted", "qualified", "booked", "unqualified", "lost"];

export const HIRING_LEAD_STATUSES: HiringLeadStatus[] =
  ["new", "pending_review", "reviewed", "shortlisted", "rejected"];

export const leadStatusesForType = (leadType: LeadType): LeadStatus[] =>
  leadType === "employee_application" ? HIRING_LEAD_STATUSES : STUDENT_LEAD_STATUSES;
```

### 3. Admin UI — [`src/pages/AdminLeads.tsx`](../src/pages/AdminLeads.tsx)

- **Line 29** — delete the flat `leadStatusOptions` array.
- **Line ~337** (inline row dropdown) — options come from `leadStatusesForType(lead.lead_type)`.
  A hiring row can no longer be set to `booked`.
- **Lines 52–56** (editor form `status` select) — same helper, keyed off the record being edited.
  If the editor can create a lead before `lead_type` is chosen, make the status field react to the
  `lead_type` field rather than defaulting to the student set.
- **Line ~270** (status *filter* dropdown) — shows **all ten**, since the table is unfiltered by
  type by default. Consider grouping with `SelectGroup` labels "Student" / "Hiring" so the list
  reads clearly.
- **Line 78** — the `status: "new"` default is still correct.

[`AdminDashboard.tsx:77`](../src/pages/AdminDashboard.tsx#L77) reads `leadStatusLabels` directly and
needs no change once the record is complete.

### 4. Migration — `supabase/migrations/20260720020000_lead_status_split.sql`

> **Check the live schema first.** `public.leads` is not defined in `supabase/migrations/` — only
> its RLS policies appear, in `20260313020000_admin_panel.sql`. The table was created outside
> source control, so confirm whether a `CHECK` constraint on `status` exists before writing this:
>
> ```sql
> select conname, pg_get_constraintdef(oid)
> from pg_constraint
> where conrelid = 'public.leads'::regclass and contype = 'c';
> ```
>
> If one exists it must be dropped and recreated with the ten values. If none exists the column is
> free text and only the backfill below is needed — but add the constraint anyway, since the Meta
> stage mapping depends on these values being exactly right.

```sql
-- Widen the allowed status set (drop the old constraint by its real name first)
alter table public.leads drop constraint if exists leads_status_check;

alter table public.leads add constraint leads_status_check check (
  status in (
    'new', 'contacted', 'qualified', 'booked', 'unqualified', 'lost',
    'pending_review', 'reviewed', 'shortlisted', 'rejected'
  )
);

-- Backfill student-side leads only. Hiring leads keep their statuses untouched.
update public.leads set status = 'qualified'
  where lead_type <> 'employee_application' and status = 'reviewed';

update public.leads set status = 'booked'
  where lead_type <> 'employee_application' and status = 'shortlisted';

update public.leads set status = 'unqualified'
  where lead_type <> 'employee_application' and status = 'rejected';

update public.leads set status = 'new'
  where lead_type <> 'employee_application' and status = 'pending_review';
```

The backfill maps `rejected → unqualified` because historically that bucket held out-of-area and
junk leads. If any of those rows were actually good leads lost on price, they should be moved to
`lost` by hand afterwards — but since none of this history has been reported to Meta, it only
affects internal reporting.

### 5. No change needed

- `updateDirectLeadStatus` ([adminApiDirect.ts:450](../src/lib/adminApiDirect.ts#L450)) —
  writes `input.status` through untyped, works as-is.
- `updateLeadStatus` ([affiliateApi.ts:672](../src/lib/affiliateApi.ts#L672)) — thin passthrough.
- `submit-lead` edge function — still inserts `status: 'new'`.
- `mapEmployeeStatus` ([leadService.ts:234](../src/lib/leadService.ts#L234)) — its `statusMap`
  already falls through to `"Pending Review"` for unknown values, so student statuses appearing on
  a hiring row would degrade safely rather than crash.

---

## Meta mapping after this lands

Replaces the placeholder table in
[meta-crm-conversions-api.md](./meta-crm-conversions-api.md) §4a:

| `leads.status` | `event_name` |
| --- | --- |
| `new` | `Lead` |
| `contacted` | *(not sent)* |
| `qualified` | `LeadQualified` |
| `booked` | `LeadConverted` |
| `unqualified` | `LeadDisqualified` |
| `lost` | *(not sent)* |
| any hiring status | *(not sent — `employee_application` is excluded entirely)* |

## Test checklist

- [ ] Hiring row's dropdown shows only the five hiring statuses; student row only the six student ones
- [ ] Status filter lists all ten and filters correctly across both types
- [ ] `HiringDashboard` still renders correct badges after the migration
- [ ] `AdminDashboard` recent-leads badges render for every new status (no `undefined` label)
- [ ] Backfill moved student leads only — spot-check that an `employee_application` row still reads `shortlisted`
- [ ] `npm run build` passes (proves the `Record<LeadStatus, …>` maps are exhaustive)
