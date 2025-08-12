import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
ShoppingCart, 
Heart, 
User, 
Menu, 
X,
LogOut,
Settings,
Package,
Sparkles,
Crown,
Star,
Palette,
Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems, wishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { 
      name: 'Gallery', 
      href: '/dashboard',
      icon: Sparkles,
      description: 'Discover Art',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      name: 'Paintings', 
      href: '/shop/painting',
      icon: Palette,
      description: 'Original Works',
      gradient: 'from-teal-500 to-cyan-500'
    },
    { 
      name: 'Apparel', 
      href: '/shop/apparel',
      icon: Crown,
      description: 'Wearable Art',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      name: 'Accessories', 
      href: '/shop/accessories',
      icon: Star,
      description: 'Designer Pieces',
      gradient: 'from-orange-500 to-amber-500'
    },
  ];

  const isCurrentPage = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="relative bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center group flex-shrink-0 mr-8">
            <div className="relative" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {/* Soft glow effect behind logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>

              {/* Logo container - fixed size */}
              <div className="relative h-12 w-36 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm border border-white/60 shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                <img
                  src={logo}
                  alt="Rangleela"
                  className="scale-[1.15] object-contain object-center"
                />
              </div>
            </div>
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center ml-16">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`group relative px-3 py-2 rounded-lg transition-all duration-300 ${
                  isCurrentPage(link.href)
                    ? `bg-gradient-to-r ${link.gradient} text-white shadow-md`
                    : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="flex items-center space-x-2">
                  <link.icon className={`w-4 h-4 ${
                    isCurrentPage(link.href) 
                      ? 'text-white' 
                      : 'text-emerald-600 group-hover:text-blue-500'
                  } transition-colors duration-300`} />
                  <span className="font-medium text-sm">{link.name}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0 ml-8 lg:ml-8 ml-auto mr-2">
            {isAuthenticated ? (
              <>
                {/* My Orders */}
                <Link 
                  to="/my-orders" 
                  className="relative group p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-all duration-300"
                  title="My Orders"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Package className="w-5 h-5" />
                </Link>

                {/* Cart */}
                <Link 
                  to="/cart" 
                  className="relative group p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-all duration-300"
                  title="Shopping Cart"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>

                {/* Wishlist */}
                <Link 
                  to="/wishlist" 
                  className="relative group p-2 rounded-lg text-gray-600 hover:text-pink-600 hover:bg-gray-100 transition-all duration-300"
                  title="Wishlist"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="hidden lg:flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className="relative">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="w-7 h-7 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-all duration-300"
                    title="Profile"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{user?.name}</p>
                            <p className="text-xs text-gray-600 max-w-[140px] truncate" title={user?.email}>{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="group flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50/50 transition-colors duration-300"
                        >
                          <Settings className="w-4 h-4 mr-3 text-emerald-600 group-hover:rotate-90 transition-transform duration-500" />
                          <span className="group-hover:text-emerald-700 text-sm">Profile Settings</span>
                        </Link>
                        <Link
                          to="/contact"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="group flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50/50 transition-colors duration-300"
                        >
                          <span className="relative mr-3 flex items-center">
                            <Phone className="w-4 h-4 text-blue-600 group-hover:animate-bounce" />
                          </span>
                          <span className="group-hover:text-blue-700 text-sm">Contact Us</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="group flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50/50 transition-colors duration-300"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-red-600 group-hover:translate-x-[6px] transition-transform duration-300" />
                          <span className="group-hover:text-red-700 text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-emerald-700 text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-sm px-4 py-2">
                    Join Us
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-all duration-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  isCurrentPage(link.href)
                    ? `bg-gradient-to-r ${link.gradient} text-white`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300 group"
                    onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <ShoppingCart className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
                    <span className="font-medium group-hover:text-emerald-700">My Cart</span>
                  </Link>
                  <Link
                    to="/my-orders"
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-orange-50/50 transition-all duration-300 group"
                    onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <Package className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
                    <span className="font-medium group-hover:text-orange-700">My Orders</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50/50 transition-all duration-300 group"
                    onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <Phone className="w-5 h-5 text-blue-600 group-hover:text-blue-700 group-hover:animate-bounce transition-colors duration-300" />
                    <span className="font-medium group-hover:text-blue-700">Contact Us</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
