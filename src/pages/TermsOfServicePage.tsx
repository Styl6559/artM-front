import React from 'react';
import { FileText, AlertTriangle, Scale, Users, Shield, Gavel } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const TermsOfServicePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Aarly</title>
        <meta name="description" content="Read Aarly's terms of service and understand your rights and responsibilities when using our platform." />
      </Helmet>
      <div className="min-h-screen bg-gray-900 py-10 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 border border-gray-700 rounded-full mb-4 sm:mb-6">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">Terms of Service</h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">Please read these terms carefully before using Aarly.</p>
            <div className="mt-2 text-xs sm:text-sm text-gray-500">Last updated: January 2025</div>
          </div>

          {/* Main Card */}
          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-2xl p-5 sm:p-8 space-y-8">
            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Scale className="w-5 h-5 text-blue-400" /> Acceptance of Terms</h2>
              <p className="text-gray-300 text-sm sm:text-base ml-1">By using Aarly, you agree to these terms. If you do not agree, do not use our platform.</p>
            </section>
            {/* User Responsibilities */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-purple-400" /> User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base ml-4 space-y-1">
                <li>Provide accurate information</li>
                <li>Use the platform for legal purposes only</li>
                <li>Respect intellectual property</li>
                <li>Comply with all laws</li>
              </ul>
            </section>
            {/* Disclaimers */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-400" /> Disclaimers</h2>
              <p className="text-gray-300 text-sm sm:text-base ml-1">Aarly does not guarantee funding, accuracy of information, or third-party actions. Use at your own risk.</p>
            </section>
            {/* Limitation of Liability */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Gavel className="w-5 h-5 text-red-400" /> Limitation of Liability</h2>
              <p className="text-gray-300 text-sm sm:text-base ml-1">Aarly is not liable for any damages or losses from use of this platform.</p>
            </section>
            {/* Intellectual Property */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-400" /> Intellectual Property</h2>
              <p className="text-gray-300 text-sm sm:text-base ml-1">All content and features are the property of Aarly. Do not copy or reuse without permission.</p>
            </section>
            {/* Contact */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" /> Contact</h2>
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

export default TermsOfServicePage;