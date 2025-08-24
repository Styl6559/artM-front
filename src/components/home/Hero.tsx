import React from 'react';
import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/video.mp4"
      />
      {/* Overlay for text clarity */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 z-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
        }} />
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5 z-20">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-30 container mx-auto px-6 pt-10 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Find the Right</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Funding Partner
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with 300+ verified investors, VCs, and funding sources. 
            From pre-seed to Series C, find your perfect match.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">300+</div>
              <div className="text-sm text-gray-400">Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">₹120Cr+</div>
              <div className="text-sm text-gray-400">Funded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 text-lg font-semibold text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Feature Pills (hidden on mobile) */}
          <div className="hidden sm:flex flex-wrap justify-center gap-4 mt-12">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Verified Investors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Government Grants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-30" />
    </section>
  );
};

export default Hero;