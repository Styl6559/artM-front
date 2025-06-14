import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminContacts from './pages/admin/AdminContacts';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
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
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/help" element={<HelpCenterPage />} />
                          <Route path="/privacy" element={<PrivacyPolicyPage />} />
                          <Route path="/terms" element={<TermsOfServicePage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/shipping" element={<ShippingInfoPage />} />
                          
                          {/* Protected Routes */}
                          <Route path="/search" element={
                            <ProtectedRoute>
                              <SearchPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/cart" element={
                            <ProtectedRoute>
                              <CartPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/wishlist" element={
                            <ProtectedRoute>
                              <WishlistPage />
                            </ProtectedRoute>
                          } />
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
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                      fontFamily: 'Inter, sans-serif',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 4000,
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
  );
}

export default App;
