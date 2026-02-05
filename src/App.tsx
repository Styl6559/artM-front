import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster, toast } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

// Auth pages - import eagerly (first visit pages, no delay wanted)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';

// ⬇️ EAGER (REMOVED LAZY LOADING)
import Dashboard from './pages/Dashboard';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';

// Lazy load all other page components
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const MyOrdersPage = React.lazy(() => import('./pages/MyOrdersPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const HelpCenterPage = React.lazy(() => import('./pages/HelpCenterPage'));
const ShippingInfoPage = React.lazy(() => import('./pages/ShippingInfoPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const RefundPolicyPage = React.lazy(() => import('./pages/RefundPolicyPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminContacts = React.lazy(() => import('./pages/admin/AdminContacts'));
const AdminHeroImages = React.lazy(() => import('./pages/admin/AdminHeroImages'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));

import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';

// Helper component to reduce Suspense boilerplate
const Lazy: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={null}>{children}</Suspense>
);

function App() {

  useEffect(() => {
    const handleToastClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const toastElement =
        target.closest('[role="status"]') ||
        target.closest('[data-hot-toast]') ||
        target.closest('.react-hot-toast') ||
        target.closest('[class*="hot-toast"]');

      if (toastElement) {
        toast.dismiss();
      }
    };

    document.addEventListener('click', handleToastClick);
    return () => document.removeEventListener('click', handleToastClick);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <SearchProvider>
                <div className="App min-h-screen flex flex-col">
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify" element={<VerifyPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <Lazy><AdminDashboard /></Lazy>
                      </AdminRoute>
                    } />
                    <Route path="/admin/products" element={
                      <AdminRoute>
                        <Lazy><AdminProducts /></Lazy>
                      </AdminRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <AdminRoute>
                        <Lazy><AdminOrders /></Lazy>
                      </AdminRoute>
                    } />
                    <Route path="/admin/contacts" element={
                      <AdminRoute>
                        <Lazy><AdminContacts /></Lazy>
                      </AdminRoute>
                    } />
                    <Route path="/admin/hero-images" element={
                      <AdminRoute>
                        <Lazy><AdminHeroImages /></Lazy>
                      </AdminRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <AdminRoute>
                        <Lazy><AdminAnalytics /></Lazy>
                      </AdminRoute>
                    } />

                    {/* Public and Protected Routes */}
                    <Route path="/*" element={
                      <>
                        <Header />
                        <main className="flex-1">
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/shop/:category" element={<ShopPage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            <Route path="/about" element={<Lazy><AboutPage /></Lazy>} />
                            <Route path="/help" element={<Lazy><HelpCenterPage /></Lazy>} />
                            <Route path="/privacy" element={<Lazy><PrivacyPolicyPage /></Lazy>} />
                            <Route path="/terms" element={<Lazy><TermsOfServicePage /></Lazy>} />
                            <Route path="/contact" element={<Lazy><ContactPage /></Lazy>} />
                            <Route path="/shipping" element={<Lazy><ShippingInfoPage /></Lazy>} />
                            <Route path="/refund-policy" element={<Lazy><RefundPolicyPage /></Lazy>} />

                            <Route path="/search" element={
                              <ProtectedRoute>
                                <SearchPage />
                              </ProtectedRoute>
                            } />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/wishlist" element={<Lazy><WishlistPage /></Lazy>} />
                            <Route path="/profile" element={
                              <ProtectedRoute>
                                <Lazy><ProfilePage /></Lazy>
                              </ProtectedRoute>
                            } />
                            <Route path="/my-orders" element={
                              <ProtectedRoute>
                                <Lazy><MyOrdersPage /></Lazy>
                              </ProtectedRoute>
                            } />

                            <Route path="*" element={<Lazy><NotFoundPage /></Lazy>} />
                          </Routes>
                        </main>
                        <Footer />
                        <CookieConsent />
                      </>
                    } />
                  </Routes>

                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 2000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                        fontFamily: 'Inter, sans-serif',
                        cursor: 'pointer',
                      },
                      success: {
                        duration: 1500,
                        iconTheme: {
                          primary: '#10b981',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#ef4444',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                </div>
              </SearchProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
