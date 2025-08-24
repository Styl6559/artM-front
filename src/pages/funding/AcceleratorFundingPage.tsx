import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Rocket, MapPin, DollarSign, Calendar, Clock, ExternalLink, Mail, Star } from 'lucide-react';
import { useFunding } from '../../contexts/FundingContext';
import LoadingGrid from '../../components/ui/LoadingGrid';
import EmptyState from '../../components/ui/EmptyState';
import { FundingMobileNav } from '../../components/layout/FundingSidebar';

interface Accelerator {
  _id: string;
  name: string;
  websiteUrl: string;
  hq: string;
  batchFrequency: string;
  stage: string[];
  fundingOffered: string;
  programDuration: string;
  servicesProvided: string;
  sectors: string[];
  applicationLink: string;
  pastCohorts: string;
}

const AcceleratorFundingPage: React.FC = () => {
  const { getFundingByCategory, loading, error } = useFunding();
  const [accelerators, setAccelerators] = useState<Accelerator[]>([]);
  const [filteredAccelerators, setFilteredAccelerators] = useState<Accelerator[]>([]);
  const [search, setSearch] = useState('');
  const [selectedAccelerator, setSelectedAccelerator] = useState<Accelerator | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Get accelerators from centralized funding context
    const acceleratorData = getFundingByCategory('accelerators') as Accelerator[];
    setAccelerators(acceleratorData);
    setFilteredAccelerators(acceleratorData);
  }, [getFundingByCategory]);

  useEffect(() => {
    // Filter accelerators based on search
    if (!search.trim()) {
      setFilteredAccelerators(accelerators);
    } else {
      const filtered = accelerators.filter(accelerator =>
        accelerator.name?.toLowerCase().includes(search.toLowerCase()) ||
        accelerator.hq?.toLowerCase().includes(search.toLowerCase()) ||
        accelerator.sectors?.some(sector => sector.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredAccelerators(filtered);
    }
  }, [search, accelerators]);
  const handleAcceleratorClick = (accelerator: Accelerator) => {
    setSelectedAccelerator(accelerator);
  };

  const closeModal = () => {
    setSelectedAccelerator(null);
  };

  return (
    <>
      <Helmet>
        <title>Startup Accelerators | Aarly</title>
        <meta name="description" content="Find startup accelerators offering intensive programs, funding, and mentorship to scale your business." />
      </Helmet>
      
  <FundingMobileNav />
  <div className="mb-8 px-2 md:px-6 pt-4 md:pt-8 mt-6 md:mt-10">
        <h1 className="text-2xl font-bold mb-2 text-white">Startup Accelerators</h1>
        <p className="text-gray-400">
          Discover accelerators that offer intensive programs to help scale your startup.
        </p>
      </div>

      {/* Search */}
      <div className="px-2 md:px-6 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-sm p-4">
          <input
            type="text"
            placeholder="Search accelerators by name, location, or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Accelerator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6 pb-8">
        {(loading && filteredAccelerators.length === 0) ? (
          <LoadingGrid count={6} columns={2} />
        ) : (
          filteredAccelerators.map((accelerator) => (
            <div
              key={accelerator._id}
              onClick={() => handleAcceleratorClick(accelerator)}
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
                  <Rocket className="w-8 h-8 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                    {accelerator.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{accelerator.hq}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-300">{accelerator.fundingOffered}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-gray-300">{accelerator.programDuration}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-gray-300">{accelerator.batchFrequency}</span>
              </div>

              {accelerator.stage && accelerator.stage.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {accelerator.stage.slice(0, 3).map((stage) => (
                    <span
                      key={stage}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    >
                      {stage}
                    </span>
                  ))}
                  {accelerator.stage.length > 3 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
                      +{accelerator.stage.length - 3} more
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

      {filteredAccelerators.length === 0 && !loading && (
        <EmptyState
          title={search ? "No accelerators found" : "No accelerators available"}
          message={search ? "Try adjusting your search criteria" : "Accelerator data will appear here once loaded"}
          error={error}
        />
      )}

      {/* Accelerator Detail Modal */}
      {selectedAccelerator && (
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30">
                  <Rocket className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-center">
                  <h1 className="text-base font-bold text-white leading-tight">{selectedAccelerator.name}</h1>
                  <div className="flex items-center gap-1 text-gray-400 text-xs justify-center">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedAccelerator.hq}</span>
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
                <div className="bg-green-500/20 rounded-xl p-4 flex flex-col items-start shadow-sm border border-green-500/30">
                  <span className="text-xs font-semibold text-green-400 mb-1 uppercase tracking-wide">Funding Offered</span>
                  <span className="text-lg font-bold text-green-300">{selectedAccelerator.fundingOffered}</span>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-4 flex flex-col items-start shadow-sm border border-blue-500/30">
                  <span className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wide">Program Duration</span>
                  <span className="text-sm text-blue-300">{selectedAccelerator.programDuration}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-purple-500/20 rounded-xl p-4 flex flex-col items-start shadow-sm w-full sm:w-1/2 border border-purple-500/30">
                  <span className="text-xs font-semibold text-purple-400 mb-1 uppercase tracking-wide">Batch Frequency</span>
                  <span className="text-sm text-purple-300">{selectedAccelerator.batchFrequency}</span>
                </div>
                <div className="bg-gray-700 rounded-xl p-4 flex flex-col items-start shadow-sm w-full sm:w-1/2 border border-gray-600">
                  <span className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">HQ</span>
                  <span className="text-sm text-gray-300">{selectedAccelerator.hq}</span>
                </div>
              </div>
              {selectedAccelerator.stage && selectedAccelerator.stage.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Stage Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAccelerator.stage.map((stage) => (
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
              {selectedAccelerator.sectors && selectedAccelerator.sectors.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Sectors</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAccelerator.sectors.map((sector) => (
                      <span
                        key={sector}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedAccelerator.servicesProvided && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Services Provided</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{selectedAccelerator.servicesProvided}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {selectedAccelerator.applicationLink && (
                  <a
                    href={selectedAccelerator.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow w-full sm:w-auto"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
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

export default AcceleratorFundingPage;