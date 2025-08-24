import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, LogOut, User, ChevronDown } from 'lucide-react';
import { useUi } from '../../contexts/UiContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mobileMenuOpen, setMobileMenuOpen } = useUi();
  const { user, logout, isAuthenticated } = useAuth();
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleAuthClick = () => {
    // close mobile menu and scroll to top for a consistent transition
    try { setMobileMenuOpen(false); } catch (e) { /* ignore */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled || !isHomePage
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Logo imgClassName="h-10 w-auto" />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {isHomePage ? (
            <>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/funding/vc"
                    className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Funding
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link
                    to="/investor-match"
                    className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Investor Match
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link
                    to="/content"
                    className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Content
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => scrollToSection('how-it-works')} 
                    className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                  >
                    How It Works
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                  </button>
                  <button 
                    onClick={() => scrollToSection('pricing')} 
                    className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                  >
                    Pricing
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {isAuthenticated && (
                <>
                  <Link
                    to="/funding/vc"
                    className={`font-medium transition-colors relative group ${
                      location.pathname.startsWith('/funding')
                        ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Funding
                    {location.pathname.startsWith('/funding') && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />
                    )}
                  </Link>
                  <Link
                    to="/investor-match"
                    className={`font-medium transition-colors relative group ${
                      location.pathname.startsWith('/investor-match')
                        ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Investor Match
                    {location.pathname.startsWith('/investor-match') && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />
                    )}
                  </Link>
                  <Link
                    to="/content"
                    className={`font-medium transition-colors relative group ${
                      location.pathname.startsWith('/content')
                        ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Content
                    {location.pathname.startsWith('/content') && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />
                    )}
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`font-medium transition-colors relative group ${
                      location.pathname.startsWith('/dashboard')
                        ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Dashboard
                    {location.pathname.startsWith('/dashboard') && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400" />
                    )}
                  </Link>
                </>
              )}
              {!isHomePage && !isAuthenticated && !isAuthPage && (
                <Link
                  to="/"
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Home size={18} />
                  <span>Home</span>
                </Link>
              )}
            </>
          )}

          {/* User Menu or Auth Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="font-medium text-white">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button onClick={handleAuthClick} className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-6 py-4 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-gray-800">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="block text-gray-300 hover:text-white font-medium py-2 transition-colors"
                  onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/funding/vc"
                  className="block text-gray-300 hover:text-white font-medium py-2 transition-colors"
                  onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  Funding
                </Link>
                <Link
                  to="/investor-match"
                  className="block text-gray-300 hover:text-white font-medium py-2 transition-colors"
                  onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  Investor Match
                </Link>
                <Link
                  to="/content"
                  className="block text-gray-300 hover:text-white font-medium py-2 transition-colors"
                  onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  Content
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium py-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="block text-gray-300 hover:text-white font-medium py-2 transition-colors text-left"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block text-gray-300 hover:text-white font-medium py-2 transition-colors text-left"
                >
                  Pricing
                </button>
                <Button 
                  onClick={handleAuthClick}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;