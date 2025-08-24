import React from 'react';
import { Search, Filter, Send, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Search size={24} className="text-blue-400" />,
    title: 'Discover Opportunities',
    description: 'Search through our curated database of 300+ investors, VCs, and funding sources tailored to your startup stage and sector.',
  },
  {
    icon: <Filter size={24} className="text-purple-400" />,
    title: 'Smart Filtering',
    description: 'Filter by investment size, stage, geography, and sector focus to find the most relevant funding opportunities.',
  },
  {
    icon: <Send size={24} className="text-green-400" />,
    title: 'Direct Connect',
    description: 'Get verified contact information and application links to reach out directly to investors and funding sources.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How Aarly Works</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three simple steps to find your perfect funding match
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 h-full hover:border-gray-600 transition-all">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section (compact) */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Find Your Funding?
          </h3>
          <p className="text-base md:text-lg text-blue-100 mb-4 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have successfully raised funding through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-md font-semibold transition-all flex items-center justify-center gap-2 text-sm">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-white/30 text-white hover:bg-white/10 px-6 py-2 rounded-md font-semibold transition-all text-sm">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;