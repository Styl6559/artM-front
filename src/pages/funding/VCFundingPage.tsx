import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, MapPin, DollarSign, Users, ExternalLink, Mail, Linkedin, Star } from 'lucide-react';
import { useFunding } from '../../contexts/FundingContext';
import LoadingGrid from '../../components/ui/LoadingGrid';
import EmptyState from '../../components/ui/EmptyState';
import { FundingMobileNav } from '../../components/layout/FundingSidebar';

interface VentureCapital {
  _id: string;
  name: string;
  websiteUrl: string;
  headOffice: string;
  fundSize: number;
  stageFocus: string[];
  sectorFocus: string[];
  avgTicketSize: number;
  applicationProcess: string;
  contact: string;
  portfolioHighlights: string;
  investmentThesis: string;
}

const VCFundingPage: React.FC = () => {
  const { getFundingByCategory, loading, error } = useFunding();
  const [vcs, setVCs] = useState<VentureCapital[]>([]);
  const [filteredVCs, setFilteredVCs] = useState<VentureCapital[]>([]);
  const [search, setSearch] = useState('');
  const [selectedVC, setSelectedVC] = useState<VentureCapital | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Get VCs from centralized funding context
    const vcData = getFundingByCategory('venture-capital') as VentureCapital[];
    setVCs(vcData);
    setFilteredVCs(vcData);
  }, [getFundingByCategory]);

  useEffect(() => {
    // Filter VCs based on search
    if (!search.trim()) {
      setFilteredVCs(vcs);
    } else {
      const filtered = vcs.filter(vc =>
        vc.name?.toLowerCase().includes(search.toLowerCase()) ||
        vc.headOffice?.toLowerCase().includes(search.toLowerCase()) ||
        vc.sectorFocus?.some(sector => sector.toLowerCase().includes(search.toLowerCase())) ||
        vc.stageFocus?.some(stage => stage.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredVCs(filtered);
    }
  }, [search, vcs]);
  const handleVCClick = (vc: VentureCapital) => {
    setSelectedVC(vc);
  };

  const closeModal = () => {
    setSelectedVC(null);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <Helmet>
        <title>Venture Capital Firms | Aarly</title>
        <meta name="description" content="Discover top venture capital firms for startup funding. Connect with VCs that match your stage and sector." />
      </Helmet>
      
  <FundingMobileNav />
  <div className="mb-8 px-2 md:px-6 pt-4 md:pt-8 mt-6 md:mt-10">
        <h1 className="text-2xl font-bold mb-2 text-white">Venture Capital Firms</h1>
        <p className="text-gray-400">
          Connect with leading venture capital firms for your startup funding needs.
        </p>
      </div>

      {/* Search */}
      <div className="px-2 md:px-6 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-sm p-4">
          <input
            type="text"
            placeholder="Search VCs by name, location, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* VC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6 pb-8">
        {(loading && filteredVCs.length === 0) ? (
          <LoadingGrid count={6} columns={2} />
        ) : (
          filteredVCs.map((vc) => (
            <div
              key={vc._id}
              onClick={() => handleVCClick(vc)}
              className="relative bg-gray-800 border border-gray-700 backdrop-blur-xl rounded-2xl shadow-md p-6 hover:shadow-xl hover:border-gray-600 transition-all hover:-translate-y-1 cursor-pointer group"
            >
              {/* Star Icon */}
              <button
                className="absolute top-4 left-4 bg-gray-700 border border-gray-600 rounded-full p-1 shadow hover:bg-yellow-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle save functionality
                }}
              >
                <Star className="w-5 h-5 text-yellow-400" fill="none" />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-700 border border-gray-600 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                    {vc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vc.headOffice}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-300">₹{(vc.fundSize).toFixed(0)} Fund</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="font-medium text-gray-300">₹{(vc.avgTicketSize).toFixed(0)} Avg</span>
                </div>
              </div>

              {vc.stageFocus && vc.stageFocus.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {vc.stageFocus.slice(0, 3).map((stage) => (
                    <span
                      key={stage}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    >
                      {stage}
                    </span>
                  ))}
                  {vc.stageFocus.length > 3 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
                      +{vc.stageFocus.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-400">{vc.applicationProcess}</span>
                <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300">
                  View Details →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredVCs.length === 0 && !loading && (
        <EmptyState
          title={search ? "No VCs found" : "No VCs available"}
          message={search ? "Try adjusting your search criteria" : "Venture capital data will appear here once loaded"}
          error={error}
        />
      )}

      {/* VC Detail Modal */}
      {selectedVC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
          <div
            className="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full animate-slide-up mt-12"
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
                <div className="w-9 h-9 rounded-xl bg-gray-700 border border-gray-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-center">
                  <h1 className="text-base font-bold text-white leading-tight">{selectedVC.name}</h1>
                  <div className="flex items-center gap-1 text-gray-400 text-xs justify-center">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedVC.headOffice}</span>
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
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 flex flex-col items-start shadow-sm">
                  <span className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wide">Fund Size</span>
                  <span className="text-2xl font-bold text-blue-300">₹{Number(selectedVC.fundSize).toLocaleString()}</span>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex flex-col items-start shadow-sm">
                  <span className="text-xs font-semibold text-green-400 mb-1 uppercase tracking-wide">Avg Ticket Size</span>
                  <span className="text-2xl font-bold text-green-300">₹{Number(selectedVC.avgTicketSize).toLocaleString()}</span>
                </div>
              </div>
              {selectedVC.stageFocus && selectedVC.stageFocus.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Stage Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVC.stageFocus.map((stage) => (
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
              {selectedVC.sectorFocus && selectedVC.sectorFocus.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Sector Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVC.sectorFocus.map((sector) => (
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
              {selectedVC.portfolioHighlights && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Portfolio Highlights</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{selectedVC.portfolioHighlights}</p>
                </div>
              )}
              <div className="bg-gray-700 border border-gray-600 rounded-xl p-4 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Application Process</h3>
                <p className="text-gray-300 text-sm">{selectedVC.applicationProcess}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {selectedVC.websiteUrl && (
                  <a
                    href={selectedVC.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow w-full sm:w-auto"
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

export default VCFundingPage;