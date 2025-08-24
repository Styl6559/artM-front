import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, MapPin, DollarSign, Users, ExternalLink, Mail, Linkedin, Star } from 'lucide-react';
import { useFunding } from '../../contexts/FundingContext';
import LoadingGrid from '../../components/ui/LoadingGrid';
import EmptyState from '../../components/ui/EmptyState';
import { FundingMobileNav } from '../../components/layout/FundingSidebar';

interface MicroVC {
  _id: string;
  name: string;
  websiteUrl: string;
  location: string;
  fundSize: number;
  checkSize: number;
  stage: string[];
  sector: string[];
  contact: string;
  portfolioHighlights: string;
}

const MicroVCFundingPage: React.FC = () => {
  const { getFundingByCategory, loading, error } = useFunding();
  const [microvcs, setMicroVCs] = useState<MicroVC[]>([]);
  const [filteredMicroVCs, setFilteredMicroVCs] = useState<MicroVC[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMicroVC, setSelectedMicroVC] = useState<MicroVC | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Get Micro VCs from centralized funding context
    const microvcData = getFundingByCategory('micro-vcs') as MicroVC[];
    setMicroVCs(microvcData);
    setFilteredMicroVCs(microvcData);
  }, [getFundingByCategory]);

  useEffect(() => {
    // Filter Micro VCs based on search
    if (!search.trim()) {
      setFilteredMicroVCs(microvcs);
    } else {
      const filtered = microvcs.filter(microvc =>
        microvc.name?.toLowerCase().includes(search.toLowerCase()) ||
        microvc.location?.toLowerCase().includes(search.toLowerCase()) ||
        microvc.sector?.some(sector => sector.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredMicroVCs(filtered);
    }
  }, [search, microvcs]);
  const handleMicroVCClick = (microvc: MicroVC) => {
    setSelectedMicroVC(microvc);
  };

  const closeModal = () => {
    setSelectedMicroVC(null);
  };

  return (
    <>
      <Helmet>
        <title>Micro VCs for Startups | Aarly</title>
        <meta name="description" content="Connect with micro venture capital firms for early-stage startup funding. Find the right micro VC for your business." />
      </Helmet>
      
  <FundingMobileNav />
  <div className="mb-8 px-2 md:px-6 pt-4 md:pt-8 mt-6 md:mt-10">
        <h1 className="text-2xl font-bold mb-2 text-white">Micro VCs</h1>
        <p className="text-gray-400">
          Connect with micro venture capital firms specializing in early-stage investments.
        </p>
      </div>

      {/* Search */}
      <div className="px-2 md:px-6 mb-6">
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-4">
          <input
            type="text"
            placeholder="Search Micro VCs by name, location, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Micro VC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6 pb-8">
        {(loading && filteredMicroVCs.length === 0) ? (
          <LoadingGrid count={6} columns={2} />
        ) : (
          filteredMicroVCs.map((microvc) => (
            <div
              key={microvc._id}
              onClick={() => handleMicroVCClick(microvc)}
              className="relative bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-md border border-gray-700 p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
            >
              {/* Star Icon */}
              <button
                className="absolute top-4 left-4 bg-gray-700 rounded-full p-1 shadow hover:bg-yellow-500/20 transition-colors border border-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle save functionality
                }}
              >
                <Star className="w-5 h-5 text-yellow-400" fill="none" />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center border border-green-500/30">
                  <Building2 className="w-8 h-8 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                    {microvc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{microvc.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-300">₹{(microvc.fundSize).toFixed(0)} Fund</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-gray-300">₹{(microvc.checkSize).toFixed(0)} Check</span>
                </div>
              </div>

              {microvc.stage && microvc.stage.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {microvc.stage.slice(0, 3).map((stage) => (
                    <span
                      key={stage}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    >
                      {stage}
                    </span>
                  ))}
                  {microvc.stage.length > 3 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
                      +{microvc.stage.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end">
                <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300">
                  View Details →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredMicroVCs.length === 0 && !loading && (
        <EmptyState
          title={search ? "No Micro VCs found" : "No Micro VCs available"}
          message={search ? "Try adjusting your search criteria" : "Micro VC data will appear here once loaded"}
          error={error}
        />
      )}

      {/* Micro VC Detail Modal */}
      {selectedMicroVC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
          <div
            className="relative bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full animate-slide-up mt-12"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            ref={modalRef}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-gray-800 rounded-t-2xl flex items-center justify-between px-4 py-3 border-b border-gray-700 shadow-sm">
              <button
                onClick={closeModal}
                className="flex items-center gap-1 text-gray-400 hover:text-blue-400 font-medium text-base px-1 py-1 rounded-lg transition-colors focus:outline-none"
                aria-label="Back"
              >
                <span className="text-lg">←</span>
              </button>
              <div className="flex items-center gap-2 mx-auto">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center border border-green-500/30">
                  <Building2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-center">
                  <h1 className="text-base font-bold text-white leading-tight">{selectedMicroVC.name}</h1>
                  <div className="flex items-center gap-1 text-gray-400 text-xs justify-center">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedMicroVC.location}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-red-400 text-xl px-1 py-1 rounded-lg transition-colors focus:outline-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-500/20 rounded-xl p-4 flex flex-col items-start shadow-sm border border-green-500/30">
                  <span className="text-xs font-semibold text-green-400 mb-1 uppercase tracking-wide">Fund Size</span>
                  <span className="text-2xl font-bold text-green-300">₹{Number(selectedMicroVC.fundSize).toLocaleString()}</span>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-4 flex flex-col items-start shadow-sm border border-blue-500/30">
                  <span className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wide">Check Size</span>
                  <span className="text-2xl font-bold text-blue-300">₹{Number(selectedMicroVC.checkSize).toLocaleString()}</span>
                </div>
              </div>
              {selectedMicroVC.stage && selectedMicroVC.stage.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Stage Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMicroVC.stage.map((stage) => (
                      <span
                        key={stage}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedMicroVC.sector && selectedMicroVC.sector.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Sector Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMicroVC.sector.map((sector) => (
                      <span
                        key={sector}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedMicroVC.portfolioHighlights && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Portfolio Highlights</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{selectedMicroVC.portfolioHighlights}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {selectedMicroVC.websiteUrl && (
                  <a
                    href={selectedMicroVC.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow w-full sm:w-auto"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MicroVCFundingPage;