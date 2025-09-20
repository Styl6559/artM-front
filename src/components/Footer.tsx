import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ArrowUp
} from 'lucide-react';
import logo from '../assets/round.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/10 rounded-full animate-float"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-blue-500/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-32 w-28 h-28 bg-orange-500/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-32 right-16 w-36 h-36 bg-violet-500/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                <img src={logo} alt="Rangleela Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold font-serif">Rangleela</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-serif">
              Discover unique paintings and artistic apparel from talented creators around India. 
              Where art meets fashion in perfect harmony.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center gap-6">
                <a href="https://www.facebook.com/share/1R8pbkqDuE" target="_blank" rel="noopener noreferrer" className="group">
                  <Facebook className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors duration-300" />
                </a>
                <a href="https://x.com/rangleela_X" target="_blank" rel="noopener noreferrer" className="group">
                  <Twitter className="w-6 h-6 text-slate-400 group-hover:text-slate-200 transition-colors duration-300" />
                </a>
                <a href="https://www.instagram.com/rangleela.official/" target="_blank" rel="noopener noreferrer" className="group">
                  <Instagram className="w-6 h-6 text-slate-400 group-hover:text-pink-400 transition-colors duration-300" />
                </a>
                <a href="https://www.youtube.com/channel/UCmFNqJDPT8YO8BDYPy5DNHA" target="_blank" rel="noopener noreferrer" className="group">
                  <Youtube className="w-7 h-7 text-slate-400 group-hover:text-red-400 transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/dashboard" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop/painting" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  Paintings
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop/apparel" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  Apparel
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop/accessories" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/help" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  to="/refund-policy" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={scrollToTop}
                  className="text-slate-300 hover:text-white transition-colors text-sm font-serif inline-block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-300 text-sm font-serif">rangleela0506@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300 text-sm font-serif">+91 93895 56890</span>
              </div>
                            <div className="flex items-center gap-3 mb-3">
                <MapPin className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-300 text-sm font-serif">Purshottam Vihar, Haridwar, Uttarakhand</span>
              </div>
            </div>
            
            {/* Newsletter */}
            {/* <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 font-serif text-white">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-serif"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-r-xl hover:from-emerald-600 hover:to-blue-600 transition-colors text-sm font-medium font-serif shadow-lg">
                  Subscribe
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm font-serif">
              © {currentYear} Rangleela. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                to="/privacy" 
                onClick={scrollToTop}
                className="text-slate-400 hover:text-white transition-colors text-sm font-serif"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                onClick={scrollToTop}
                className="text-slate-400 hover:text-white transition-colors text-sm font-serif"
              >
                Terms of Service
              </Link>
              <button
                onClick={scrollToTop}
                className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-serif group"
              >
                <ArrowUp className="w-4 h-4 mr-1 group-hover:-translate-y-1 transition-transform duration-300" />
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
