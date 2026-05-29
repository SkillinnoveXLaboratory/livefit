import React, { Suspense, lazy, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { buildAdminRedirectPath, getAdminToken } from './lib/admin';

const WorkFit = lazy(() => import('./pages/WorkFit'));
const SolutionDetail = lazy(() => import('./pages/SolutionDetail'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Inquiry = lazy(() => import('./pages/Inquiry'));
const HowToBook = lazy(() => import('./pages/HowToBook'));
const Pricing = lazy(() => import('./pages/Pricing'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Solutions = lazy(() => import('./pages/Solutions'));
const WorkFitSolutionDetail = lazy(() => import('./pages/WorkFitSolutionDetail'));
const LiveFitPortal = lazy(() => import('./pages/LiveFitPortal'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Playlists = lazy(() => import('./pages/Playlists'));
const Gallery = lazy(() => import('./pages/Gallery'));

const RouteFallback = () => (
  <div className="min-h-screen bg-[#F5F5F3]" />
);

const ProtectedRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<LiveFitPortal />} />
      <Route path="/workfit" element={<WorkFit />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/solutions/employee-burnout" element={<WorkFitSolutionDetail solutionId="employee-burnout" />} />
      <Route path="/solutions/posture-back-pain" element={<WorkFitSolutionDetail solutionId="posture-back-pain" />} />
      <Route path="/solutions/stress-mental-health" element={<WorkFitSolutionDetail solutionId="stress-mental-health" />} />
      <Route path="/solutions/low-employee-engagement" element={<WorkFitSolutionDetail solutionId="low-employee-engagement" />} />
      <Route path="/solutions/low-productivity-energy" element={<WorkFitSolutionDetail solutionId="low-productivity-energy" />} />
      <Route path="/solutions/hybrid-work-challenges" element={<WorkFitSolutionDetail solutionId="hybrid-work-challenges" />} />
      <Route path="/solutions/high-healthcare-costs" element={<WorkFitSolutionDetail solutionId="high-healthcare-costs" />} />
      <Route path="/solutions/boring-wellness-programs" element={<WorkFitSolutionDetail solutionId="boring-wellness-programs" />} />
      <Route path="/solutions/:slug" element={<SolutionDetail />} />
      <Route path="/livefitinquiry" element={<Schedule />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/playlists" element={<Playlists />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/success" element={<Success />} />
      <Route path="/workfit-membership" element={<Navigate to="/workfit" replace />} />
      <Route path="/workfitinquiry" element={<Inquiry />} />
      <Route path="/how-it-works" element={<HowToBook />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/termsofservice" element={<TermsOfService />} />
    </Routes>
  </Layout>
);

const Success = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get('plan');
  const paymentId = params.get('payment_id');
  const orderId = params.get('order_id');
  const amount = params.get('amount');
  const currency = params.get('currency') || 'INR';
  const currencyLabel = currency === 'INR' ? '₹' : `${currency} `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F3] px-6 py-20">
      <div className="w-full max-w-2xl text-center bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-serif font-bold text-sky-950 mb-4 italic">Payment Successful!</h1>
        <p className="text-sky-900/60 mb-8">Thank you for joining LiveFit. Your payment confirmation has been emailed to you and the admin.</p>

        {(plan || paymentId || orderId || amount) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-10">
            {plan && (
              <div className="rounded-2xl bg-sky-50/70 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-sky-900/50 mb-1">Plan</p>
                <p className="text-sm font-bold text-sky-950">{plan}</p>
              </div>
            )}
            {amount && (
              <div className="rounded-2xl bg-sky-50/70 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-sky-900/50 mb-1">Amount</p>
                <p className="text-sm font-bold text-sky-950">
                  {currencyLabel}{Number(amount).toLocaleString('en-IN')}
                </p>
              </div>
            )}
            {paymentId && (
              <div className="rounded-2xl bg-sky-50/70 p-4 md:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-sky-900/50 mb-1">Payment ID</p>
                <p className="text-sm font-bold text-sky-950 break-all">{paymentId}</p>
              </div>
            )}
            {orderId && (
              <div className="rounded-2xl bg-sky-50/70 p-4 md:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-sky-900/50 mb-1">Order ID</p>
                <p className="text-sm font-bold text-sky-950 break-all">{orderId}</p>
              </div>
            )}
          </div>
        )}

        <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-sky-950 text-white rounded-full font-black uppercase tracking-widest text-[10px]">
          Back to Home
        </button>
      </div>
    </div>
  );
};

const AdminProtectedRoute = () => {
  const location = useLocation();
  const adminToken = getAdminToken();

  if (!adminToken) {
    const nextPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={buildAdminRedirectPath(nextPath)} replace />;
  }

  return <AdminDashboard />;
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />
          <Route
            path="/admin"
            element={<AdminProtectedRoute />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
