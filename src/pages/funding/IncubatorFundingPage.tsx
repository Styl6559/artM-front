import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, MapPin, DollarSign, Calendar, ExternalLink, Mail, Star } from 'lucide-react';
import { useFunding } from '../../contexts/FundingContext';
import LoadingGrid from '../../components/ui/LoadingGrid';
import EmptyState from '../../components/ui/EmptyState';
import { FundingMobileNav } from '../../components/layout/FundingSidebar';

interface Incubator {
  _id: string;
  name: string;
  websiteUrl: string;
  location: string;
  fundingSupport: string;
  otherBenefits: string;
  eligibility: string;
  applicationProcess: string;
  contact: string;
  alumniStartups: string;
}

const IncubatorFundingPage: React.FC = () => {
  const { getFundingByCategory, loading, error } = useFunding();
  const [incubators, setIncubators] = useState<Incubator[]>([]);
  const [filteredIncubators, setFilteredIncubators] = useState<Incubator[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIncubator, setSelectedIncubator] = useState<Incubator | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Get incubators from centralized funding context
    const incubatorData = getFundingByCategory('incubators') as Incubator[];
    setIncubators(incubatorData);
    setFilteredIncubators(incubatorData);
  }, [getFundingByCategory]);

  useEffect(() => {
    // Filter incubators based on search
    if (!search.trim()) {
      setFilteredIncubators(incubators);
    } else {
      const filtered = incubators.filter(incubator =>
        incubator.name?.toLowerCase().includes(search.toLowerCase()) ||
        incubator.location?.toLowerCase().includes(search.toLowerCase()) ||
        incubator.fundingSupport?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredIncubators(filtered);
    }
  }, [search, incubators]);
  const handleIncubatorClick = (incubator: Incubator) => {
    setSelectedIncubator(incubator);
  };

  const closeModal = () => {
    setSelectedIncubator(null);
  };

  return (
    <>
      <Helmet>
        <title>Startup Incubators | Aarly</title>
        <meta name="description" content="Discover startup incubators offering funding, mentorship, and resources for early-stage companies." />
      </Helmet>
      
  <FundingMobileNav />
  <div className="mb-8 px-2 md:px-6 pt-4 md:pt-8 mt-6 md:mt-10">
        <h1 className="text-2xl font-bold mb-2 text-white">Startup Incubators</h1>
        <p className="text-gray-400">
          Find incubators that provide funding, mentorship, and resources for your startup journey.
        </p>
      </div>

      {/* Search */}
      <div className="px-2 md:px-6 mb-6">
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-4">
          <input
            type="text"
            placeholder="Search incubators by name, location, or focus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Incubator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6 pb-8">
        {(loading && filteredIncubators.length === 0) ? (
          <LoadingGrid count={6} columns={2} />
        ) : (
          filteredIncubators.map((incubator) => (
            <div
              key={incubator._id}
              onClick={() => handleIncubatorClick(incubator)}
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
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
                  <Building2 className="w-8 h-8 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                    {incubator.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{incubator.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-300">{incubator.fundingSupport}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-gray-300">{incubator.applicationProcess}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300">
                  View Details →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredIncubators.length === 0 && !loading && (
        <EmptyState
          title={search ? "No incubators found" : "No incubators available"}
          message={search ? "Try adjusting your search criteria" : "Incubator data will appear here once loaded"}
          error={error}
        />
      )}

      {/* Incubator Detail Modal */}
      {selectedIncubator && (
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-center">
                  <h1 className="text-base font-bold text-white leading-tight">{selectedIncubator.name}</h1>
                  <div className="flex items-center gap-1 text-gray-400 text-xs justify-center">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedIncubator.location}</span>
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
              <div className="bg-green-500/20 rounded-xl p-4 flex flex-col items-start shadow-sm border border-green-500/30">
                <span className="text-xs font-semibold text-green-400 mb-1 uppercase tracking-wide">Funding Support</span>
                <span className="text-lg font-bold text-green-300">{selectedIncubator.fundingSupport}</span>
              </div>
              {selectedIncubator.otherBenefits && (
                <div className="bg-blue-500/20 rounded-xl p-4 flex flex-col items-start shadow-sm border border-blue-500/30">
                  <span className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wide">Other Benefits</span>
                  <span className="text-sm text-blue-300">{selectedIncubator.otherBenefits}</span>
                </div>
              )}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Eligibility</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{selectedIncubator.eligibility}</p>
              </div>
              <div className="bg-purple-500/20 rounded-xl p-4 flex flex-col items-start shadow-sm border border-purple-500/30">
                <span className="text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wide">Application Process</span>
                <span className="text-sm text-purple-300">{selectedIncubator.applicationProcess}</span>
              </div>
              {selectedIncubator.alumniStartups && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Alumni Startups</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{selectedIncubator.alumniStartups}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {selectedIncubator.websiteUrl && (
                  <a
                    href={selectedIncubator.websiteUrl}
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

export default IncubatorFundingPage;