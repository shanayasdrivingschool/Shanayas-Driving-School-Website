import { useQuery } from "@tanstack/react-query";
import { Activity, CreditCard, FileText, ShoppingCart, ShieldAlert, Users, Wallet } from "lucide-react";
import AffiliateMetricCard from "@/components/affiliate/AffiliateMetricCard";
import AffiliateStatusBadge from "@/components/affiliate/AffiliateStatusBadge";
import AdminPortalShell from "@/components/admin/AdminPortalShell";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { affiliateSurfaceClassName } from "@/components/affiliate/styles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminDashboard } from "@/lib/affiliateApi";
import { formatAffiliateCurrency } from "@/lib/affiliateProgram";
import { leadStatusLabels, leadStatusTone, leadTypeLabels, paymentStatusLabels, paymentStatusTone } from "@/lib/adminPanel";

const AdminDashboard = () => {
  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });

  return (
    <AdminPortalShell
      eyebrow="Admin Control"
      title={
        <>
          Monitor the <span className="text-[#F5B13A]">full operations stack</span>
        </>
      }
      description="Live oversight for leads, affiliates, payouts, orders, and suspicious activity using the exact Supabase records already persisted by the site."
      pageTitle="Dashboard overview"
      pageDescription="Track the health of the sales and referral funnel, then drill into the latest submissions and revenue events without leaving the branded admin workspace."
    >
      {dashboardQuery.isLoading ? (
        <div className={`${affiliateSurfaceClassName} text-sm font-semibold text-slate-600`}>Loading admin dashboard...</div>
      ) : dashboardQuery.isError || !dashboardQuery.data ? (
        <div className={`${affiliateSurfaceClassName} text-sm leading-relaxed text-slate-600`}>
          {dashboardQuery.error instanceof Error ? dashboardQuery.error.message : "Unable to load the admin dashboard."}
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AffiliateMetricCard label="Total leads" value={dashboardQuery.data.totals.totalLeads.toString()} icon={<FileText className="h-5 w-5" />} />
            <AffiliateMetricCard label="Affiliates" value={dashboardQuery.data.totals.totalAffiliates.toString()} icon={<Users className="h-5 w-5" />} />
            <AffiliateMetricCard label="Referral clicks" value={dashboardQuery.data.totals.totalReferralClicks.toString()} icon={<Activity className="h-5 w-5" />} />
            <AffiliateMetricCard label="Orders" value={dashboardQuery.data.totals.totalOrders.toString()} icon={<ShoppingCart className="h-5 w-5" />} />
            <AffiliateMetricCard label="Commissions" value={dashboardQuery.data.totals.totalCommissions.toString()} icon={<Wallet className="h-5 w-5" />} />
            <AffiliateMetricCard label="Payouts" value={dashboardQuery.data.totals.totalPayouts.toString()} icon={<CreditCard className="h-5 w-5" />} />
            <AffiliateMetricCard label="Suspicious activity" value={dashboardQuery.data.totals.suspiciousActivityCount.toString()} icon={<ShieldAlert className="h-5 w-5" />} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className={affiliateSurfaceClassName}>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Recent leads</p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Latest submissions</h3>
              <div className="mt-5 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardQuery.data.recentLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{lead.fullName ?? "Unnamed lead"}</p>
                            <p className="text-xs text-slate-500">{lead.email ?? lead.phone ?? lead.sourcePage}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.requestType === "custom_package_request"
                            ? leadTypeLabels.custom_package_request
                            : leadTypeLabels[lead.leadType]}
                        </TableCell>
                        <TableCell>
                          <AdminStatusBadge label={leadStatusLabels[lead.status]} toneClassName={leadStatusTone[lead.status]} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className={affiliateSurfaceClassName}>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Recent orders</p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">Latest purchases</h3>
              <div className="mt-5 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardQuery.data.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-900">{order.externalOrderId ?? order.packageName}</p>
                            <p className="text-xs text-slate-500">{order.customerEmail ?? order.affiliateName ?? "No linked email"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatAffiliateCurrency(order.amount)}</TableCell>
                        <TableCell>
                          <AdminStatusBadge label={paymentStatusLabels[order.paymentStatus]} toneClassName={paymentStatusTone[order.paymentStatus]} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className={affiliateSurfaceClassName}>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Recent affiliate signups</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">Newest partners</h3>
            <div className="mt-5 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardQuery.data.recentAffiliateSignups.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{affiliate.name}</p>
                          <p className="text-xs text-slate-500">{affiliate.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{affiliate.preferredPayoutMethod.replace("_", " ")}</TableCell>
                      <TableCell>
                        <AffiliateStatusBadge type="affiliate" value={affiliate.status} />
                      </TableCell>
                      <TableCell>{new Date(affiliate.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </AdminPortalShell>
  );
};

export default AdminDashboard;
