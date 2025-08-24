import React from 'react';
import { Check, Star } from 'lucide-react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const features = [
    'Access to 300+ verified investors',
    'Government grants database',
    'AI-powered investor matching',
    'Direct contact information',
    'Advanced filtering options',
    'Save and organize opportunities',
    'Email notifications',
    'Priority customer support'
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to find funding for your startup, completely free.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="w-4 h-4" />
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Free Forever</h3>
              <p className="text-gray-400 mb-6">Everything you need to get started</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₹0</span>
                <span className="text-gray-400 ml-2">forever</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mt-0.5">
                    <Check size={12} className="text-green-400" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link to="/auth" className="block" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                Get Started Now
              </Button>
            </Link>

            <p className="text-center text-sm text-gray-500 mt-4">
              No credit card required • Setup in 2 minutes
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-8">Trusted by startups across India</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-500 font-semibold">2,500+ Startups</div>
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
            <div className="text-gray-500 font-semibold">₹120Cr+ Funded</div>
            <div className="w-1 h-1 bg-gray-600 rounded-full" />
            <div className="text-gray-500 font-semibold">95% Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;