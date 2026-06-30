import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Copy, DollarSign, LogOut, Receipt, Wallet } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import AffiliateMetricCard from "@/components/affiliate/AffiliateMetricCard";
import AffiliatePortalLayout from "@/components/affiliate/AffiliatePortalLayout";
import AffiliatePortalNav from "@/components/affiliate/AffiliatePortalNav";
import AffiliateStatusBadge from "@/components/affiliate/AffiliateStatusBadge";
import { useAffiliateAuth } from "@/components/affiliate/AffiliateAuthProvider";
import {
  affiliatePrimaryButtonClassName,
  affiliateSecondaryButtonClassName,
  affiliateSurfaceClassName,
} from "@/components/affiliate/styles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAffiliateDashboardData, signOutAffiliate } from "@/lib/affiliateApi";
import { formatAffiliateCurrency, payoutMethodLabels } from "@/lib/affiliateProgram";

const navLinks = [{ label: "Dashboard", to: "/affiliate/dashboard" }];

const AffiliateDashboard = () => {
  const { loading: authLoading, user } = useAffiliateAuth();
  const dashboardQuery = useQuery({
    queryKey: ["affiliate-dashboard"],
    queryFn: getAffiliateDashboardData,
    enabled: Boolean(user),
  });

  if (!authLoading && !user) {
    return <Navigate to="/affiliate/login" replace />;
  }

  const copyReferralLink = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Referral link copied.");
  };

  const handleSignOut = async () => {
    await signOutAffiliate();
    toast.success("Signed out.");
  };

  return (
    <AffiliatePortalLayout
      eyebrow="Member dashboard"
      title={
        <>
          <span className="text-white">Ruley Rewards</span> <span className="text-[#F5B13A]">Program</span>
        </>
      }
      description="This Ruley Rewards Program dashboard shows your referral link, invited-friend traffic, paid orders, earned commission, and payout progress in one place."
    >
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <AffiliatePortalNav links={navLinks} />

        {authLoading || dashboardQuery.isLoading ? (
          <div className={`${affiliateSurfaceClassName} mt-6 text-sm font-semibold text-slate-600`}>
            Loading Ruley Rewards Program dashboard...
          </div>
        ) : dashboardQuery.isError || !dashboardQuery.data ? (
          <div className={`${affiliateSurfaceClassName} mt-6`}>
            <h2 className="text-2xl font-black text-slate-900">Unable to load dashboard</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {dashboardQuery.error instanceof Error
                ? dashboardQuery.error.message
                : "The Ruley Rewards Program dashboard is unavailable right now."}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <article className={affiliateSurfaceClassName}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Program profile</p>
                    <h2 className="mt-3 text-3xl font-black text-slate-900">{dashboardQuery.data.affiliate.name}</h2>
                  </div>
                  <AffiliateStatusBadge type="affiliate" value={dashboardQuery.data.affiliate.status} />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#F2F2F2] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Referral ID</p>
                    <p className="mt-2 text-xl font-black text-[#1d52a1]">{dashboardQuery.data.affiliate.affiliateId}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F2F2F2] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Preferred payout</p>
                    <p className="mt-2 text-lg font-black text-slate-900">
                      {payoutMethodLabels[dashboardQuery.data.affiliate.preferredPayoutMethod]}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Referral link</p>
                  <p className="mt-3 break-all text-sm font-semibold text-slate-700">{dashboardQuery.data.referralLink}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => copyReferralLink(dashboardQuery.data.referralLink)}
                      className={affiliatePrimaryButtonClassName}
                    >
                      <Copy className="h-4 w-4" />
                      Copy referral link
                    </button>
                    <button type="button" onClick={() => void handleSignOut()} className={affiliateSecondaryButtonClassName}>
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </article>

              <article className="rounded-[30px] border border-slate-200 bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Referral status</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900">Monthly payout progress</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Payouts are processed monthly after approved referral earnings pass the minimum threshold and the admin team marks the batch as paid.
                </p>
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                    Minimum payout threshold: {formatAffiliateCurrency(dashboardQuery.data.stats.minimumPayout)}
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                    Pending payout now: {formatAffiliateCurrency(dashboardQuery.data.stats.pendingPayout)}
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                    Approved commission balance: {formatAffiliateCurrency(dashboardQuery.data.stats.approvedCommission)}
                  </p>
                </div>
                <Link to="/contact" className="mt-6 inline-flex text-sm font-bold text-[#1d52a1] underline-offset-4 hover:underline">
                  Contact us about payout questions
                </Link>
              </article>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              <AffiliateMetricCard
                label="Referral visits"
                value={dashboardQuery.data.stats.totalClicks.toLocaleString()}
                note="Validated visits tracked through your referral link."
              />
              <AffiliateMetricCard
                label="Referred purchases"
                value={dashboardQuery.data.stats.totalPurchases.toLocaleString()}
                note="Paid orders credited inside the referral window."
                icon={<Receipt className="h-5 w-5" />}
              />
              <AffiliateMetricCard
                label="Referral revenue"
                value={formatAffiliateCurrency(dashboardQuery.data.stats.totalRevenue)}
                note="Order value generated by successful referral purchases."
                icon={<DollarSign className="h-5 w-5" />}
              />
              <AffiliateMetricCard
                label="Total earnings"
                value={formatAffiliateCurrency(dashboardQuery.data.stats.totalCommission)}
                note="All earned rewards created from successful payments."
                icon={<Wallet className="h-5 w-5" />}
              />
              <AffiliateMetricCard
                label="Pending payout"
                value={formatAffiliateCurrency(dashboardQuery.data.stats.pendingPayout)}
                note="Approved commission that has not been paid out yet."
                icon={<Wallet className="h-5 w-5" />}
              />
            </div>

            <div className={`${affiliateSurfaceClassName} mt-6`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Friend bookings</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Referral purchases</h2>
                </div>
              </div>
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardQuery.data.orders.length > 0 ? (
                      dashboardQuery.data.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-semibold text-slate-900">{order.packageName}</TableCell>
                          <TableCell>{order.externalOrderId ?? order.id.slice(0, 8).toUpperCase()}</TableCell>
                          <TableCell className="capitalize">{order.paymentStatus}</TableCell>
                          <TableCell>{formatAffiliateCurrency(order.amount)}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-slate-500">
                          No referral purchases have been credited yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className={affiliateSurfaceClassName}>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Earnings history</p>
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardQuery.data.commissions.length > 0 ? (
                        dashboardQuery.data.commissions.map((commission) => (
                          <TableRow key={commission.id}>
                            <TableCell>{commission.orderReference ?? commission.orderId.slice(0, 8).toUpperCase()}</TableCell>
                            <TableCell>{formatAffiliateCurrency(commission.commissionAmount)}</TableCell>
                            <TableCell>
                              <AffiliateStatusBadge type="commission" value={commission.status} />
                            </TableCell>
                            <TableCell>{new Date(commission.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-500">
                            No earnings records yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className={affiliateSurfaceClassName}>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Payout history</p>
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardQuery.data.payouts.length > 0 ? (
                        dashboardQuery.data.payouts.map((payout) => (
                          <TableRow key={payout.id}>
                            <TableCell>{formatAffiliateCurrency(payout.amount)}</TableCell>
                            <TableCell>{payoutMethodLabels[payout.paymentMethod]}</TableCell>
                            <TableCell>
                              <AffiliateStatusBadge type="payout" value={payout.paymentStatus} />
                            </TableCell>
                            <TableCell>{new Date(payout.requestedAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-500">
                            No payouts have been created yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </AffiliatePortalLayout>
  );
};

export default AffiliateDashboard;
