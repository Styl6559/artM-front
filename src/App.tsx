import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster, toast } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import Dashboard from './pages/Dashboard';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import AboutPage from './pages/AboutPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ShippingInfoPage from './pages/ShippingInfoPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminContacts from './pages/admin/AdminContacts';
import AdminHeroImages from './pages/admin/AdminHeroImages';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';

function App() {
  const [serverAwake, setServerAwake] = useState(false);

  // Wake up backend server on first load
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then(() => setServerAwake(true))
      .catch(() => setServerAwake(true)); // Even on error, let app load
  }, []);

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

  if (!serverAwake) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading, please wait...</p>
      </div>
    );
  }

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
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  } />
                  <Route path="/admin/contacts" element={
                    <AdminRoute>
                      <AdminContacts />
                    </AdminRoute>
                  } />
                  <Route path="/admin/hero-images" element={
                    <AdminRoute>
                      <AdminHeroImages />
                    </AdminRoute>
                  } />
                  <Route path="/admin/analytics" element={
                    <AdminRoute>
                      <AdminAnalytics />
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
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/shop/:category" element={<ShopPage />} />
                          <Route path="/product/:id" element={<ProductDetailPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/help" element={<HelpCenterPage />} />
                          <Route path="/privacy" element={<PrivacyPolicyPage />} />
                          <Route path="/terms" element={<TermsOfServicePage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/shipping" element={<ShippingInfoPage />} />
                          <Route path="/refund-policy" element={<RefundPolicyPage />} />
                          
                          {/* Protected Routes */}
                          <Route path="/search" element={
                            <ProtectedRoute>
                              <SearchPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/profile" element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          } />
                          <Route path="/my-orders" element={
                            <ProtectedRoute>
                              <MyOrdersPage />
                            </ProtectedRoute>
                          } />
                          
                          {/* Catch-all route - redirect unknown routes to dashboard */}
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
