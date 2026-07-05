import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PageTransition from "./components/PageTransition";
import GlobalSectionReveal from "./components/GlobalSectionReveal";
import MarketingScripts from "./components/MarketingScripts";
import SeoManager from "./components/SeoManager";
import { CartProvider } from "./components/cart/CartProvider";
import { AffiliateAuthProvider } from "./components/affiliate/AffiliateAuthProvider";
import { AdminAuthProvider } from "./components/admin/AdminAuthProvider";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";
import ReferralTracker from "./components/affiliate/ReferralTracker";
import Index from "./pages/Index";

const Courses = lazy(() => import("./pages/Courses"));
const CourseQuiz = lazy(() => import("./pages/CourseQuiz"));
const Packages = lazy(() => import("./pages/Packages"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutPayment = lazy(() => import("./pages/CheckoutPayment"));
const CheckoutSecurePayment = lazy(() => import("./pages/CheckoutSecurePayment"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const PackageProductPage = lazy(() => import("./pages/PackageProductPage"));
const PaymentPlanOptions = lazy(() => import("./pages/PaymentPlanOptions"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NewcomersGuide = lazy(() => import("./pages/NewcomersGuide"));
const KnowledgeTestPractice = lazy(() => import("./pages/KnowledgeTestPractice"));
const Policies = lazy(() => import("./pages/Policies"));
const PolicyDetail = lazy(() => import("./pages/PolicyDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const Apply = lazy(() => import("./pages/Apply"));
const EmployeeApply = lazy(() => import("./pages/EmployeeApply"));
const HiringDashboard = lazy(() => import("./pages/HiringDashboard"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const SearchPage = lazy(() => import("./pages/Search"));
const SeoLandingPage = lazy(() => import("./pages/SeoLandingPage"));
const CourseProductPage = lazy(() => import("./pages/CourseProductPage"));
const ExtraProductPage = lazy(() => import("./pages/ExtraProductPage"));
const AffiliateSignup = lazy(() => import("./pages/AffiliateSignup"));
const AffiliateLogin = lazy(() => import("./pages/AffiliateLogin"));
const AffiliateDashboard = lazy(() => import("./pages/AffiliateDashboard"));
const ReferralTerms = lazy(() => import("./pages/ReferralTerms"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminInvoices = lazy(() => import("./pages/AdminInvoices"));
const AdminCourses = lazy(() => import("./pages/AdminCourses"));
const AdminKnowledgeTestQuestions = lazy(() => import("./pages/AdminKnowledgeTestQuestions"));
const AdminLeads = lazy(() => import("./pages/AdminLeads"));
const AdminCoupons = lazy(() => import("./pages/AdminCoupons"));
const AdminAffiliates = lazy(() => import("./pages/AdminAffiliates"));
const AdminReferrals = lazy(() => import("./pages/AdminReferrals"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminCommissions = lazy(() => import("./pages/AdminCommissions"));
const AdminPayouts = lazy(() => import("./pages/AdminPayouts"));
const AdminRateLimits = lazy(() => import("./pages/AdminRateLimits"));
const ReferralRedirect = lazy(() => import("./pages/ReferralRedirect"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <SeoManager />
        <MarketingScripts />
        <ReferralTracker />
        <GlobalSectionReveal />
        <ScrollToTopButton />
        <PageTransition>
          <div className="site-page-scale">
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/driving-lessons" element={<SeoLandingPage pageId="driving-lessons" />} />
                <Route path="/driving-lessons-langford" element={<SeoLandingPage pageId="driving-lessons-langford" />} />
                <Route path="/defensive-driving" element={<SeoLandingPage pageId="defensive-driving" />} />
                <Route path="/road-test-prep" element={<SeoLandingPage pageId="road-test-prep" />} />
                <Route path="/road-test-prep-victoria" element={<SeoLandingPage pageId="road-test-prep-victoria" />} />
                <Route path="/road-test-vehicle" element={<SeoLandingPage pageId="road-test-vehicle" />} />
                <Route path="/intensive-driving-course" element={<SeoLandingPage pageId="intensive-driving-course" />} />
                <Route path="/pricing" element={<SeoLandingPage pageId="pricing" />} />
                <Route path="/faq" element={<SeoLandingPage pageId="faq" />} />
                <Route path="/courses/:slug" element={<CourseProductPage />} />
                <Route path="/extras/:slug" element={<ExtraProductPage />} />
                <Route path="/course-quiz" element={<CourseQuiz />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/information" element={<CheckoutPayment />} />
                <Route path="/checkout/payment" element={<CheckoutSecurePayment />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/payment-plan-options" element={<PaymentPlanOptions />} />
                <Route path="/packages/:slug" element={<PackageProductPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/newcomers-guide" element={<NewcomersGuide />} />
                <Route path="/knowledge-test-practice" element={<KnowledgeTestPractice />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/policies/:policyId" element={<PolicyDetail />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/thank-you" element={<Apply />} />
                <Route path="/careers/apply" element={<EmployeeApply />} />
                <Route path="/careers/dashboard" element={<HiringDashboard />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/affiliate/signup" element={<AffiliateSignup />} />
                <Route path="/affiliate/terms-and-conditions" element={<ReferralTerms />} />
                <Route path="/affiliate/login" element={<AffiliateLogin />} />
                <Route path="/affiliate/dashboard" element={<AffiliateAuthProvider><AffiliateDashboard /></AffiliateAuthProvider>} />
                <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
                <Route element={<AdminAuthProvider><AdminRouteGuard /></AdminAuthProvider>}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/invoices" element={<AdminInvoices />} />
                  <Route path="/admin/courses" element={<AdminCourses />} />
                  <Route path="/admin/knowledge-test" element={<AdminKnowledgeTestQuestions />} />
                  <Route path="/admin/leads" element={<AdminLeads />} />
                  <Route path="/admin/coupons" element={<AdminCoupons />} />
                  <Route path="/admin/affiliates" element={<AdminAffiliates />} />
                  <Route path="/admin/referrals" element={<AdminReferrals />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/commissions" element={<AdminCommissions />} />
                  <Route path="/admin/payouts" element={<AdminPayouts />} />
                  <Route path="/admin/rate-limits" element={<AdminRateLimits />} />
                </Route>
                <Route path="/ref/:affiliateCode" element={<ReferralRedirect />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </PageTransition>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;


