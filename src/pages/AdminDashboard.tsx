import { useQuery } from "@tanstack/react-query";
import AdminMetricCard from "@/components/admin/AdminMetricCard";
import AdminPortalShell from "@/components/admin/AdminPortalShell";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { adminSurfaceClassName } from "@/components/admin/styles";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminDashboard } from "@/lib/affiliateApi";
import { affiliateStatusLabels, formatAffiliateCurrency } from "@/lib/affiliateProgram";
import { affiliateStatusTone, leadStatusLabels, leadStatusTone, leadTypeLabels, paymentStatusLabels, paymentStatusTone } from "@/lib/adminPanel";
import { adminQueryOptions } from "@/lib/adminQueries";

const AdminDashboard = () => {
  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
    ...adminQueryOptions,
  });

  return (
    <AdminPortalShell
      pageTitle="Dashboard"
      pageDescription="Enquiries, orders, and referral activity at Shanaya’s Driving School"
    >
      {dashboardQuery.isLoading ? (
        <div className={`${adminSurfaceClassName} text-sm text-slate-600`}>Loading admin dashboard...</div>
      ) : dashboardQuery.isError || !dashboardQuery.data ? (
        <div className={`${adminSurfaceClassName} text-sm leading-relaxed text-slate-600`} role="alert">
          {dashboardQuery.error instanceof Error ? dashboardQuery.error.message : "Unable to load the admin dashboard."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            <AdminMetricCard label="Total leads" value={dashboardQuery.data.totals.totalLeads.toLocaleString("en-CA")} />
            <AdminMetricCard label="Affiliates" value={dashboardQuery.data.totals.totalAffiliates.toLocaleString("en-CA")} />
            <AdminMetricCard label="Referral clicks" value={dashboardQuery.data.totals.totalReferralClicks.toLocaleString("en-CA")} />
            <AdminMetricCard label="Orders" value={dashboardQuery.data.totals.totalOrders.toLocaleString("en-CA")} />
            <AdminMetricCard label="Commissions" value={dashboardQuery.data.totals.totalCommissions.toLocaleString("en-CA")} />
            <AdminMetricCard label="Payouts" value={dashboardQuery.data.totals.totalPayouts.toLocaleString("en-CA")} />
            <AdminMetricCard label="Suspicious activity" value={dashboardQuery.data.totals.suspiciousActivityCount.toLocaleString("en-CA")} />
          </div>

          <div className="grid min-w-0 gap-6 2xl:grid-cols-[1.15fr_1fr]">
            <div className={`${adminSurfaceClassName} min-w-0`}>
              <h2 className="text-lg font-medium text-slate-900">Recent leads</h2>
              <div className="mt-4 overflow-x-auto">
                <Table className="min-w-[28rem]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardQuery.data.recentLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-slate-500">No leads yet</TableCell>
                      </TableRow>
                    ) : null}
                    {dashboardQuery.data.recentLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{lead.fullName ?? "Unnamed lead"}</p>
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

            <div className={`${adminSurfaceClassName} min-w-0`}>
              <h2 className="text-lg font-medium text-slate-900">Recent orders</h2>
              <div className="mt-4 overflow-x-auto">
                <Table className="min-w-[28rem]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardQuery.data.recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-slate-500">No orders yet</TableCell>
                      </TableRow>
                    ) : null}
                    {dashboardQuery.data.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{order.externalOrderId ?? order.packageName}</p>
                            <p className="text-xs text-slate-500">{order.customerEmail ?? order.affiliateName ?? "No linked email"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums whitespace-nowrap">{formatAffiliateCurrency(order.amount)}</TableCell>
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

          <div className={`${adminSurfaceClassName} min-w-0`}>
            <h2 className="text-lg font-medium text-slate-900">Recent affiliate signups</h2>
            <div className="mt-4 overflow-x-auto">
              <Table className="min-w-[28rem]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardQuery.data.recentAffiliateSignups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-slate-500">No affiliate signups yet</TableCell>
                    </TableRow>
                  ) : null}
                  {dashboardQuery.data.recentAffiliateSignups.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{affiliate.name}</p>
                          <p className="text-xs text-slate-500">{affiliate.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{affiliate.preferredPayoutMethod.replace("_", " ")}</TableCell>
                      <TableCell>
                        <AdminStatusBadge label={affiliateStatusLabels[affiliate.status]} toneClassName={affiliateStatusTone[affiliate.status]} />
                      </TableCell>
                      <TableCell className="tabular-nums">{new Date(affiliate.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}</TableCell>
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
