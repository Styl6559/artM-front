import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, MapPin, DollarSign, Target, ExternalLink, Mail, Linkedin, Star } from 'lucide-react';
import { useFunding } from '../../contexts/FundingContext';
import LoadingGrid from '../../components/ui/LoadingGrid';
import EmptyState from '../../components/ui/EmptyState';
import { FundingMobileNav } from '../../components/layout/FundingSidebar';

interface AngelInvestor {
  _id: string;
  name: string;
  linkedinProfileUrl: string;
  city: string;
  country: string;
  investCategory: string[];
  ticketSize: number;
  stage: string[];
  preferFounderProfile: string;
  portfolioHighlights: string;
  contact: string;
}

const AngelFundingPage: React.FC = () => {
  const { getFundingByCategory, loading, error } = useFunding();
  const [angels, setAngels] = useState<AngelInvestor[]>([]);
  const [filteredAngels, setFilteredAngels] = useState<AngelInvestor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedAngel, setSelectedAngel] = useState<AngelInvestor | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Get angels from centralized funding context
    const angelData = getFundingByCategory('angel-investors') as AngelInvestor[];
    setAngels(angelData);
    setFilteredAngels(angelData);
  }, [getFundingByCategory]);

  useEffect(() => {
    // Filter angels based on search
    if (!search.trim()) {
      setFilteredAngels(angels);
    } else {
      const filtered = angels.filter(angel =>
        angel.name?.toLowerCase().includes(search.toLowerCase()) ||
        angel.city?.toLowerCase().includes(search.toLowerCase()) ||
        angel.country?.toLowerCase().includes(search.toLowerCase()) ||
        angel.investCategory?.some(category => category.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredAngels(filtered);
    }
  }, [search, angels]);
  const handleAngelClick = (angel: AngelInvestor) => {
    setSelectedAngel(angel);
  };

  const closeModal = () => {
    setSelectedAngel(null);
  };

  return (
    <>
      <Helmet>
        <title>Angel Investors | Aarly</title>
        <meta name="description" content="Connect with angel investors for early-stage startup funding. Find angels that match your industry and stage." />
      </Helmet>
      
  <FundingMobileNav />
  <div className="mb-8 px-2 md:px-6 pt-4 md:pt-8 mt-6 md:mt-10">
        <h1 className="text-2xl font-bold mb-2 text-white">Angel Investors</h1>
        <p className="text-gray-400">
          Connect with angel investors who can provide early-stage funding and mentorship.
        </p>
      </div>

      {/* Search */}
      <div className="px-2 md:px-6 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-sm p-4">
          <input
            type="text"
            placeholder="Search angels by name, location, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Angel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-6 pb-8">
        {(loading && filteredAngels.length === 0) ? (
          <LoadingGrid count={6} columns={2} />
        ) : (
          filteredAngels.map((angel) => (
            <div
              key={angel._id}
              onClick={() => handleAngelClick(angel)}
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
                  <User className="w-8 h-8 text-pink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                    {angel.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{angel.city}, {angel.country}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-300">₹{(angel.ticketSize).toFixed(0)} Ticket</span>
                </div>
                {angel.investCategory && angel.investCategory.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-gray-300">{angel.investCategory.join(', ')}</span>
                  </div>
                )}
              </div>

              {angel.stage && angel.stage.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {angel.stage.slice(0, 3).map((stage) => (
                    <span
                      key={stage}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    >
                      {stage}
                    </span>
                  ))}
                  {angel.stage.length > 3 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
                      +{angel.stage.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center justify-end">
                <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300">
                  View Profile →
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredAngels.length === 0 && !loading && (
        <EmptyState
          title={search ? "No angels found" : "No angels available"}
          message={search ? "Try adjusting your search criteria" : "Angel investor data will appear here once loaded"}
          error={error}
        />
      )}

      {/* Angel Detail Modal */}
      {selectedAngel && (
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
                  <User className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-center">
                  <h1 className="text-base font-bold text-white leading-tight">{selectedAngel.name}</h1>
                  <div className="flex items-center gap-1 text-gray-400 text-xs justify-center">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedAngel.city}, {selectedAngel.country}</span>
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
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex flex-col items-start shadow-sm">
                <span className="text-xs font-semibold text-green-400 mb-1 uppercase tracking-wide">Ticket Size</span>
                <span className="text-2xl font-bold text-green-300">₹{Number(selectedAngel.ticketSize).toLocaleString()}</span>
              </div>
              {selectedAngel.investCategory && selectedAngel.investCategory.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Investment Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAngel.investCategory.map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedAngel.stage && selectedAngel.stage.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Stage Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAngel.stage.map((stage) => (
                      <span
                        key={stage}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedAngel.portfolioHighlights && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Portfolio Highlights</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{selectedAngel.portfolioHighlights}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {selectedAngel.linkedinProfileUrl && (
                  <a
                    href={selectedAngel.linkedinProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow w-full sm:w-auto"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View LinkedIn
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

export default AngelFundingPage;