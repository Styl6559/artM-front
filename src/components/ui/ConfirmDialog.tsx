import React, { useEffect } from 'react';
import { X, Home } from 'lucide-react';
import { useUi } from '../../contexts/UiContext';

const ConfirmDialog: React.FC = () => {
  const { confirmDialog, toggleConfirmDialog } = useUi();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleConfirmDialog(null);
      }
    };

    if (confirmDialog) {
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [confirmDialog, toggleConfirmDialog]);

  if (!confirmDialog) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          toggleConfirmDialog(null);
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-fade-in-down"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Home size={20} className="text-blue-600" />
            </div>
            <h2 
              id="dialog-title"
              className="text-xl font-bold text-gray-900"
            >
              {confirmDialog.title}
            </h2>
          </div>
          <p 
            id="dialog-description"
            className="text-gray-600"
          >
            {confirmDialog.message}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              className="px-4 py-2.5 text-gray-700 font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => toggleConfirmDialog(null)}
            >
              {confirmDialog.cancelText}
            </button>
            <button
              className="px-4 py-2.5 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => {
                confirmDialog.onConfirm();
                toggleConfirmDialog(null);
              }}
            >
              {confirmDialog.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 