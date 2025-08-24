import React from 'react';
import { Search, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: 'search' | 'error';
  error?: string | null;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  icon = 'search',
  error = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon === 'search' ? (
          <Search className="w-8 h-8 text-gray-400" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm max-w-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default EmptyState;