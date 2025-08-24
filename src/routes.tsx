import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from './components/layout/HomeLayout';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/layout/DashboardLayout';
import FundingLayout from './components/layout/FundingLayout';
import DashboardPage from './pages/DashboardPage';
import VCFundingPage from './pages/funding/VCFundingPage';
import MicroVCFundingPage from './pages/funding/MicroVCFundingPage';
import IncubatorFundingPage from './pages/funding/IncubatorFundingPage';
import AcceleratorFundingPage from './pages/funding/AcceleratorFundingPage';
import AngelFundingPage from './pages/funding/AngelFundingPage';
import GrantsFundingPage from './pages/funding/GrantsFundingPage';
import ContentPage from './pages/FinNewzPage';
import InvestorMatchPage from './pages/InvestorMatchPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import DisclaimerPage from './pages/DisclaimerPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import WhatsAppOptOutPage from './pages/WhatsAppOptOutPage';

const NotFound = () => (
  <div style={{ padding: 40, textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'auth', element: <AuthPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'terms-of-service', element: <TermsOfServicePage /> },
      { path: 'disclaimer', element: <DisclaimerPage /> },
      { path: 'whatsapp/opt-out/:token', element: <WhatsAppOptOutPage /> },
    ]
  },
  
  // Protected routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/funding',
    element: (
      <ProtectedRoute>
        <FundingLayout>
          <VCFundingPage />
        </FundingLayout>
      </ProtectedRoute>
    ),
    children: [
      { path:  'vc', element: <VCFundingPage /> },
      { path: 'microvc', element: <MicroVCFundingPage /> },
      { path: 'incubator', element: <IncubatorFundingPage /> },
      { path: 'accelerator', element: <AcceleratorFundingPage /> },
      { path: 'angel', element: <AngelFundingPage /> },
      { path: 'grants', element: <GrantsFundingPage /> },
    ]
  },
  {
    path: '/content',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ContentPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/investor-match',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <InvestorMatchPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <DashboardLayout>
          <AdminDashboardPage />
        </DashboardLayout>
      </AdminRoute>
    ),
  },
  
  // Legacy protected routes (for backward compatibility)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '*', element: <NotFound /> }
    ]
  },
]);
