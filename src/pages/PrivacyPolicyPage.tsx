import React from 'react';
import { Shield, Eye, Lock, Database, Users, Mail, Phone, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Aarly</title>
        <meta name="description" content="Learn how Aarly protects your privacy and handles your personal information." />
      </Helmet>
      <div className="min-h-screen bg-gray-900 py-10 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 border border-gray-700 rounded-full mb-4 sm:mb-6">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">Privacy Policy</h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto">How we collect, use, and protect your information.</p>
            <div className="mt-2 text-xs sm:text-sm text-gray-500">Last updated: January 2025</div>
          </div>

          {/* Main Card */}
          <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-2xl p-5 sm:p-8 space-y-8">
            {/* What We Collect */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-400" /> What We Collect</h2>
              <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base ml-4 space-y-1">
                <li>Information you provide (name, email, company, funding preferences)</li>
                <li>Usage data (how you use our platform)</li>
              </ul>
            </section>
            {/* How We Use */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Database className="w-5 h-5 text-green-400" /> How We Use</h2>
              <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base ml-4 space-y-1">
                <li>To provide and improve our services</li>
                <li>To match you with relevant funding opportunities</li>
                <li>To communicate updates and respond to inquiries</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>
            {/* Your Rights */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-400" /> Your Rights</h2>
              <ul className="list-disc list-inside text-gray-300 text-sm sm:text-base ml-4 space-y-1">
                <li>Access, update, or delete your data</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
              </ul>
            </section>
            {/* Contact */}
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" /> Contact</h2>
              <div className="text-gray-300 text-sm sm:text-base space-y-1 ml-1">
                <div>Email: privacy@aarly.co</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;