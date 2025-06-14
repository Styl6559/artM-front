import React, { useState, useEffect } from 'react';
import { Cookie, X, Shield, Eye } from 'lucide-react';
import Button from './ui/Button';

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('artistic-manifestation-cookie-consent');
    if (!consent) {
      // Show consent after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('artistic-manifestation-cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('artistic-manifestation-cookie-consent', 'rejected');
    // Clear any existing cookies/localStorage except essential ones
    const essentialKeys = ['artistic-manifestation-cookie-consent'];
    Object.keys(localStorage).forEach(key => {
      if (!essentialKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 max-w-2xl w-full overflow-hidden">
        {/* Artistic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-orange-50/50"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500"></div>
        
        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-3 shadow-lg">
                <Cookie className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 font-serif">🍪 Cookie Preferences</h3>
                <p className="text-slate-600 font-light">We value your privacy and artistic experience</p>
              </div>
            </div>
            <button
              onClick={rejectCookies}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <p className="text-slate-700 leading-relaxed font-serif">
              We use cookies to enhance your artistic journey, remember your preferences, and provide personalized 
              recommendations. Your cart and wishlist are stored locally to ensure a seamless shopping experience.
            </p>

            {/* Cookie Details */}
            {showDetails && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200">
                <h4 className="font-bold text-slate-800 mb-4 font-serif flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                  What we store:
                </h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• <strong>Essential:</strong> Authentication tokens, cart items, preferences</li>
                  <li>• <strong>Functional:</strong> Language settings, theme preferences</li>
                  <li>• <strong>Analytics:</strong> Anonymous usage data to improve our service</li>
                  <li>• <strong>Marketing:</strong> Personalized art recommendations (optional)</li>
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={acceptCookies}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 font-serif"
              >
                Accept All Cookies
              </Button>
              <Button
                onClick={rejectCookies}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 font-serif"
              >
                Reject Non-Essential
              </Button>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-800 font-serif"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showDetails ? 'Hide' : 'View'} Details
              </Button>
            </div>

            {/* Privacy Notice */}
            <div className="text-center">
              <p className="text-xs text-slate-500 font-serif">
                🎨 By continuing, you agree to our artistic cookie policy. 
                <br />
                You can change your preferences anytime in settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;