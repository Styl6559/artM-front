import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster, toast } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load all page components
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const VerifyPage = React.lazy(() => import('./pages/VerifyPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ShopPage = React.lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
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

function App() {

  // Add global click listener to dismiss toasts when clicked
  useEffect(() => {
    const handleToastClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if clicked element is part of a toast notification
      // React-hot-toast uses div with role="status" and specific class names
      const toastElement = target.closest('[role="status"]') || 
                          target.closest('[data-hot-toast]') || 
                          target.closest('.react-hot-toast') ||
                          target.closest('[class*="hot-toast"]');
      
      if (toastElement) {
        toast.dismiss(); // Dismiss all toasts on click
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
                  <Route path="/login" element={<Suspense fallback={<LoadingSpinner />}><LoginPage /></Suspense>} />
                  <Route path="/register" element={<Suspense fallback={<LoadingSpinner />}><RegisterPage /></Suspense>} />
                  <Route path="/verify" element={<Suspense fallback={<LoadingSpinner />}><VerifyPage /></Suspense>} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminDashboard />
                      </Suspense>
                    </AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminProducts />
                      </Suspense>
                    </AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminOrders />
                      </Suspense>
                    </AdminRoute>
                  } />
                  <Route path="/admin/contacts" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminContacts />
                      </Suspense>
                    </AdminRoute>
                  } />
                  <Route path="/admin/hero-images" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminHeroImages />
                      </Suspense>
                    </AdminRoute>
                  } />
                  <Route path="/admin/analytics" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminAnalytics />
                      </Suspense>
                    </AdminRoute>
                  } />
                  
                  {/* Public and Protected Routes with Header/Footer */}
                  <Route path="/*" element={
                    <>
                      <Header />
                      <main className="flex-1">
                        <Routes>
                          {/* Public Pages */}
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>} />
                          <Route path="/shop/:category" element={<Suspense fallback={<LoadingSpinner />}><ShopPage /></Suspense>} />
                          <Route path="/product/:id" element={<Suspense fallback={<LoadingSpinner />}><ProductDetailPage /></Suspense>} />
                          <Route path="/about" element={<Suspense fallback={<LoadingSpinner />}><AboutPage /></Suspense>} />
                          <Route path="/help" element={<Suspense fallback={<LoadingSpinner />}><HelpCenterPage /></Suspense>} />
                          <Route path="/privacy" element={<Suspense fallback={<LoadingSpinner />}><PrivacyPolicyPage /></Suspense>} />
                          <Route path="/terms" element={<Suspense fallback={<LoadingSpinner />}><TermsOfServicePage /></Suspense>} />
                          <Route path="/contact" element={<Suspense fallback={<LoadingSpinner />}><ContactPage /></Suspense>} />
                          <Route path="/shipping" element={<Suspense fallback={<LoadingSpinner />}><ShippingInfoPage /></Suspense>} />
                          <Route path="/refund-policy" element={<Suspense fallback={<LoadingSpinner />}><RefundPolicyPage /></Suspense>} />
                          
                          {/* Protected Routes */}
                          <Route path="/search" element={
                            <ProtectedRoute>
                              <Suspense fallback={<LoadingSpinner />}>
                                <SearchPage />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          <Route path="/cart" element={<Suspense fallback={<LoadingSpinner />}><CartPage /></Suspense>} />
                          <Route path="/wishlist" element={<Suspense fallback={<LoadingSpinner />}><WishlistPage /></Suspense>} />
                          <Route path="/profile" element={
                            <ProtectedRoute>
                              <Suspense fallback={<LoadingSpinner />}>
                                <ProfilePage />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          <Route path="/my-orders" element={
                            <ProtectedRoute>
                              <Suspense fallback={<LoadingSpinner />}>
                                <MyOrdersPage />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          
                          {/* Catch-all route - show 404 page for unknown routes */}
                          <Route path="*" element={<Suspense fallback={<LoadingSpinner />}><NotFoundPage /></Suspense>} />
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
                    duration: 2000, // Shorter duration for better UX
                    style: {
                      background: '#363636',
                      color: '#fff',
                      fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer', // Indicate clickable
                    },
                    success: {
                      duration: 1500, // Very short for success messages
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
