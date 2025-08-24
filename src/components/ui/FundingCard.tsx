import React from 'react';
import { Star, MapPin, Building2, User, Rocket, Award, ExternalLink } from 'lucide-react';

interface FundingCardProps {
  id: string;
  name: string;
  category?: string;
  location: string;
  amount?: string;
  sector?: string[];
  stage?: string[];
  onClick: () => void;
  showCategoryLabel?: boolean;
}

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'angel-investors': return <User className="w-6 h-6 text-pink-400" />;
    case 'venture-capital': return <Building2 className="w-6 h-6 text-blue-400" />;
    case 'micro-vcs': return <Building2 className="w-6 h-6 text-green-400" />;
    case 'incubators': return <Building2 className="w-6 h-6 text-purple-400" />;
    case 'accelerators': return <Rocket className="w-6 h-6 text-orange-400" />;
    case 'govt-grants': return <Award className="w-6 h-6 text-emerald-400" />;
    default: return <Building2 className="w-6 h-6 text-gray-400" />;
  }
};

const getCategoryGradient = (category?: string) => {
  switch (category) {
    case 'angel-investors': return 'from-pink-500/20 to-purple-500/20';
    case 'venture-capital': return 'from-blue-500/20 to-indigo-500/20';
    case 'micro-vcs': return 'from-green-500/20 to-blue-500/20';
    case 'incubators': return 'from-purple-500/20 to-blue-500/20';
    case 'accelerators': return 'from-orange-500/20 to-red-500/20';
    case 'govt-grants': return 'from-emerald-500/20 to-green-500/20';
    default: return 'from-gray-500/20 to-gray-600/20';
  }
};

const FundingCard: React.FC<FundingCardProps> = ({
  id,
  name,
  category,
  location,
  amount,
  sector = [],
  stage = [],
  onClick,
  showCategoryLabel = false
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Save Button */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-yellow-500/20 border border-gray-600 hover:border-yellow-500/50 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          // Handle save functionality
        }}
      >
        <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400 transition-colors" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center border border-white/10`}>
          {getCategoryIcon(category)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          {showCategoryLabel && category && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                {category.replace(/-/g, ' ').toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Amount */}
      {amount && (
        <div className="mb-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="text-sm text-gray-400 mb-1">Funding Range</div>
          <div className="text-lg font-semibold text-white">{amount}</div>
        </div>
      )}

      {/* Sectors */}
      {Array.isArray(sector) && sector.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Sectors</div>
          <div className="text-sm text-gray-300">
            {sector.slice(0, 2).join(', ')}
            {sector.length > 2 && (
              <span className="text-gray-500"> +{sector.length - 2} more</span>
            )}
          </div>
        </div>
      )}

      {/* Stages */}
      {stage && stage.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {stage.slice(0, 3).map((stageItem) => (
              <span
                key={stageItem}
                className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30"
              >
                {stageItem}
              </span>
            ))}
            {stage.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-600/50 text-gray-400 rounded-full border border-gray-600">
                +{stage.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <span className="text-sm text-gray-500">Click to view details</span>
        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
      </div>
    </div>
  );
};

export default FundingCard;