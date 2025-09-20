import React from 'react';
import { Shield, Eye, Lock, Users } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Last updated: August 8, 2025
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 mb-4">
              At Rangleela, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or make a purchase from us.
            </p>
            <p className="text-gray-600">
              By using our service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Create an account</li>
              <li>Make a purchase</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or promotions</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Information Collected Automatically</h3>
            <p className="text-gray-600 mb-4">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your account or transactions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Providers</h3>
            <p className="text-gray-600 mb-4">
              We may share your information with trusted third-party service providers who assist us in operating our website, 
              conducting our business, or serving you, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Payment processors</li>
              <li>Shipping companies</li>
              <li>Email service providers</li>
              <li>Analytics providers</li>
              <li>Customer service platforms</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Requirements</h3>
            <p className="text-gray-600 mb-6">
              We may disclose your information if required to do so by law or in response to valid requests by public authorities.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Object to certain processing activities</li>
            </ul>
            <p className="text-gray-600">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, 
              and understand where our visitors are coming from. You can control cookies through your browser settings.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600">
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
              information, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy 
              Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> rangleela0506@gmail.com</p>
              <p><strong>Phone:</strong> +91 93895 56890</p>
              <p><strong>Address:</strong> Purshottam Vihar, Haridwar, Uttarakhand</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
