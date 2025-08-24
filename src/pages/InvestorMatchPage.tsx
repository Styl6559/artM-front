import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { ArrowRight, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface InvestorMatch {
  _id: string;
  name: string;
  stage: string;
  industry: string;
  traction: string;
  description: string;
  checkSize: string;
  location: string;
  website?: string;
  email?: string;
  linkedin?: string;
}

const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
const tractions = ['Idea', 'MVP', 'Users', 'Revenue', 'Profitable'];

const InvestorMatchPage: React.FC = () => {
  const [form, setForm] = useState({ stage: '', industry: '', traction: '' });
  const [matches, setMatches] = useState<InvestorMatch[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Load unique industries from backend
  React.useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    try {
      const response = await fetch(`${API_URL}/public/investor-matches`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const uniqueIndustries = [...new Set(data.data.map((item: InvestorMatch) => item.industry))] as string[];
          setIndustries(uniqueIndustries);
        }
      } else {
        console.error('Error loading industries:', response.statusText);
        // Fallback industries
        setIndustries(['Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'SaaS', 'AI/ML']);
      }
    } catch (error) {
      console.error('Error loading industries:', error);
      // Fallback industries
      setIndustries(['Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'SaaS', 'AI/ML']);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (form.stage) queryParams.append('stage', form.stage);
      if (form.industry) queryParams.append('industry', form.industry);
      if (form.traction) queryParams.append('traction', form.traction);

      const response = await fetch(`${API_URL}/public/investor-matches?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setMatches(data.data);
        } else {
          setMatches([]);
        }
      } else {
        console.error('Error fetching matches:', response.statusText);
        setMatches([]);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Investor Match for Startups | Aarly</title>
        <meta name="description" content="Find the best investors for your startup. Use Aarly's Investor Match to connect with VCs, angels, and micro VCs tailored to your needs." />
        <link rel="canonical" href="https://aarly.co/investor-match" />
        <meta property="og:title" content="Investor Match for Startups | Aarly" />
        <meta property="og:description" content="Find the best investors for your startup. Use Aarly's Investor Match to connect with VCs, angels, and micro VCs tailored to your needs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aarly.co/investor-match" />
        <meta property="og:image" content="/Screenshot 2025-06-29 140116.png" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect Investor Match
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect with investors who align with your startup's stage, industry, and traction level
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                      Startup Stage
                    </label>
                    <select 
                      name="stage" 
                      value={form.stage} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Stage</option>
                      {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                      Industry Focus
                    </label>
                    <select 
                      name="industry" 
                      value={form.industry} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Industry</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                      Traction Level
                    </label>
                    <select 
                      name="traction" 
                      value={form.traction} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select Traction</option>
                      {tractions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 mx-auto shadow-lg"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Find Matching Investors
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Section */}
          {matches.length > 0 ? (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Found {matches.length} Matching Investor{matches.length !== 1 ? 's' : ''}
                </h2>
                <div className="text-sm text-gray-400">
                  Results based on your criteria
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map(inv => (
                  <div key={inv.name} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{inv.name}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Stage:</span>
                            <span className="ml-2 text-blue-400 font-medium">{inv.stage}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Industry:</span>
                            <span className="ml-2 text-blue-400 font-medium">{inv.industry}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Traction:</span>
                            <span className="ml-2 text-green-400 font-medium">{inv.traction}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Check Size:</span>
                            <span className="ml-2 text-green-400 font-medium">{inv.checkSize}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-gray-400">Location:</span>
                          <span className="ml-2 text-purple-400 font-medium">{inv.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{inv.description}</p>
                    
                    {(inv.website || inv.email || inv.linkedin) && (
                      <div className="flex flex-wrap gap-3">
                        {inv.website && (
                          <a 
                            href={inv.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full transition-colors"
                          >
                            Website
                          </a>
                        )}
                        {inv.email && (
                          <a 
                            href={`mailto:${inv.email}`} 
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-full transition-colors"
                          >
                            Email
                          </a>
                        )}
                        {inv.linkedin && (
                          <a 
                            href={inv.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-full transition-colors"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : !loading && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-12">
                <User size={48} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No matches found yet</h3>
                <p className="text-gray-400">
                  Fill out the form above and click "Find Matching Investors" to discover investors that align with your startup profile.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvestorMatchPage; 