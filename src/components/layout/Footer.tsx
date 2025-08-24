import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Mail, ArrowRight, Linkedin, Instagram, MessageCircle, Send, Heart } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const [whatsappForm, setWhatsappForm] = React.useState({ phoneNumber: '' });
  const [whatsappSuccess, setWhatsappSuccess] = React.useState(false);
  const [whatsappLoading, setWhatsappLoading] = React.useState(false);
  const [whatsappError, setWhatsappError] = React.useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  const handleWhatsAppSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappLoading(true);
    setWhatsappError('');
    
    try {
      const response = await fetch(`${API_URL}/whatsapp/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(whatsappForm),
      });

      const data = await response.json();
      
      if (data.success) {
        setWhatsappSuccess(true);
        setWhatsappForm({ phoneNumber: '' });
        setTimeout(() => setWhatsappSuccess(false), 3000);
      } else {
        setWhatsappError(data.message || 'Failed to subscribe to WhatsApp updates');
      }
    } catch (error) {
      console.error('WhatsApp subscription error:', error);
      setWhatsappError('Failed to subscribe to WhatsApp updates');
    } finally {
      setWhatsappLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Logo imgClassName="h-10 w-auto mb-4" />
            <p className="text-gray-400 mb-6 max-w-sm">
              Find the right investors, grants, and startup support — instantly. 
              Connecting ambitious entrepreneurs with funding opportunities.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-gray-400 hover:text-blue-400 transition-colors" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-gray-400 hover:text-blue-400 transition-colors" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-pink-500 hover:bg-pink-500/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-gray-400 hover:text-pink-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/funding/vc" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Venture Capital</Link></li>
              <li><Link to="/funding/microvc" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Micro VCs</Link></li>
              <li><Link to="/funding/angel" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Angel Investors</Link></li>
              <li><Link to="/funding/accelerator" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Accelerators</Link></li>
              <li><Link to="/funding/incubator" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Incubators</Link></li>
              <li><Link to="/funding/grants" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Government Grants</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-gray-400 hover:text-white transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Disclaimer</Link></li>
            </ul>
          </div>

          {/* WhatsApp Updates */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-green-400" />
              WhatsApp Updates
            </h3>
            <p className="text-gray-400 text-sm mb-4">Get funding updates on WhatsApp</p>
            <form onSubmit={handleWhatsAppSubscribe} className="space-y-3">
              <input
                type="tel"
                placeholder="9876543210"
                value={whatsappForm.phoneNumber}
                onChange={(e) => setWhatsappForm({ phoneNumber: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-gray-500"
                required
                maxLength={10}
              />
              <button
                type="submit"
                disabled={whatsappLoading}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
              >
                {whatsappLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={14} />
                    Subscribe
                  </>
                )}
              </button>
            </form>
            {whatsappSuccess && (
              <p className="text-green-400 text-xs mt-2">✓ Subscribed successfully!</p>
            )}
            {whatsappError && (
              <p className="text-red-400 text-xs mt-2">{whatsappError}</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Aarly. All rights reserved.
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            Made with <Heart size={12} className="text-red-400 mx-1" /> by Aarly Team
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;