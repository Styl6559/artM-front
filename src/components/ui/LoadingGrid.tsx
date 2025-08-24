import React from 'react';

interface LoadingGridProps {
  count?: number;
  columns?: number;
}

const LoadingGrid: React.FC<LoadingGridProps> = ({ 
  count = 6,
  columns = 2
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-md border border-blue-100 p-6 animate-pulse">
          {/* Star Icon Placeholder */}
          <div className="absolute top-4 left-4 bg-white rounded-full p-1 shadow">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" />
            <div className="flex-1 min-w-0">
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 w-16 h-6" />
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 w-16 h-6" />
            <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 w-16 h-6" />
          </div>
          <div className="mt-6 flex items-center justify-end">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingGrid;
