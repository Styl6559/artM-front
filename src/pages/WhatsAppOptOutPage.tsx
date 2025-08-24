import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';

const WhatsAppOptOutPage: React.FC = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (token) {
      handleOptOut();
    }
  }, [token]);

  const handleOptOut = async () => {
    try {
      const response = await fetch(`${API_URL}/whatsapp/opt-out/${token}`);
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setMessage('You have successfully opted out from WhatsApp updates.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to opt out from WhatsApp updates.');
      }
    } catch (error) {
      console.error('Opt-out error:', error);
      setStatus('error');
      setMessage('An error occurred while processing your request.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <MessageCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Updates</h1>
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600">Processing your request...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">Successfully Opted Out</h2>
              <p className="text-gray-600">{message}</p>
            </div>
            <p className="text-sm text-gray-500">
              You will no longer receive WhatsApp updates from Aarly. You can resubscribe anytime from our website.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-12 h-12 text-red-600 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-red-800 mb-2">Opt-out Failed</h2>
              <p className="text-gray-600">{message}</p>
            </div>
            <p className="text-sm text-gray-500">
              If you continue to receive messages, please contact our support team.
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Aarly
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppOptOutPage;