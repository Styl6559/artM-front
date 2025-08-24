import React from 'react';
import { Lock, TrendingUp, Users, Award, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const PreviewCard = ({ title, type, amount, location, sectors, locked = true }: any) => {
  return (
    <Card className="bg-gray-800 border-gray-700 p-6 relative overflow-hidden">
      {locked && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
          <Lock className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-sm font-medium text-blue-400">Sign up to unlock</span>
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{type}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Amount</span>
          <span className="text-sm font-medium text-white">{amount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Location</span>
          <span className="text-sm font-medium text-white">{location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Sectors</span>
          <span className="text-sm font-medium text-white">{sectors}</span>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        View Details
      </Button>
    </Card>
  );
};

const PreviewSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Preview Our Database</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get access to verified investors, government grants, and funding opportunities 
            curated specifically for Indian startups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <PreviewCard
            title="Sequoia Capital India"
            type="Venture Capital"
            amount="$5M - $50M"
            location="Bangalore, India"
            sectors="SaaS, Fintech, AI"
            locked={true}
          />
          <PreviewCard
            title="Startup India Seed Fund"
            type="Government Grant"
            amount="₹20L - ₹5Cr"
            location="Pan India"
            sectors="All Sectors"
            locked={true}
          />
          <PreviewCard
            title="Blume Ventures"
            type="Early Stage VC"
            amount="$250K - $2M"
            location="Mumbai, India"
            sectors="Consumer, B2B"
            locked={true}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">150+</div>
            <div className="text-sm text-gray-400">Venture Capitals</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">100+</div>
            <div className="text-sm text-gray-400">Government Grants</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-gray-400">Accelerators</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600/20 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">200+</div>
            <div className="text-sm text-gray-400">Angel Investors</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/auth" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Unlock Full Access
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;