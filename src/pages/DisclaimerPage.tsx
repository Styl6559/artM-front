import React from 'react';
import { AlertTriangle, Info, Shield, ExternalLink, FileText, Scale } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const DisclaimerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer - Aarly</title>
        <meta name="description" content="Important disclaimers and limitations regarding Aarly's funding discovery platform and services." />
      </Helmet>
      <div className="min-h-screen bg-gray-900 py-10 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 border border-gray-700 rounded-full mb-4 sm:mb-6">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">Disclaimer</h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">Important information about the limitations and scope of Aarly's services.</p>
            <div className="mt-2 text-xs sm:text-sm text-gray-500">Last updated: January 2025</div>
          </div>

          {/* Main Card */}
          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-2xl p-5 sm:p-8 space-y-8">
            {/* General Disclaimer */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Info className="w-5 h-5 text-blue-400" /> General Disclaimer</h2>
              <p className="text-gray-300 text-sm sm:text-base ml-1">All information on this platform is for general purposes only. We do not guarantee completeness, accuracy, or reliability. Use at your own risk.</p>
            </section>
            {/* No Guarantee of Funding */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" /> No Guarantee of Funding</h2>
              <p className="text-gray-300 text-sm sm:text-base ml-1">Aarly does not guarantee you will receive funding. All funding decisions are made by third parties and depend on many factors.</p>
            </section>
            {/* Not Investment Advice */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Scale className="w-5 h-5 text-red-400" /> Not Investment or Legal Advice</h2>
              <p className="text-gray-300 text-sm sm:text-base ml-1">Nothing on this platform is investment, legal, or financial advice. Please consult professionals before making decisions.</p>
            </section>
            {/* Limitation of Liability */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Scale className="w-5 h-5 text-gray-400" /> Limitation of Liability</h2>
              <p className="text-gray-300 text-sm sm:text-base ml-1">Aarly and its team are not liable for any damages or losses from use of this platform.</p>
            </section>
            {/* Contact */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Info className="w-5 h-5 text-blue-400" /> Contact</h2>
              <div className="text-gray-300 text-sm sm:text-base space-y-1 ml-1">
                <div>Email: legal@aarly.co</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerPage;