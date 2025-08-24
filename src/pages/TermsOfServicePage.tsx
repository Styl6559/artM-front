import React from 'react';
import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Last updated: August 8, 2025
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              Welcome to Rangleela. These Terms of Service ("Terms") govern your use of our website and services. 
              By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part 
              of these terms, then you may not access the service.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <p className="text-blue-800 text-sm">
                  By using Rangleela, you confirm that you are at least 18 years old or have parental consent.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Service */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Our Service</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Permitted Uses</h3>
            <p className="text-gray-600 mb-4">You may use our service to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Browse and purchase artwork and apparel</li>
              <li>Create and manage your account</li>
              <li>Communicate with our customer service</li>
              <li>Subscribe to our newsletter and updates</li>
              <li>Leave reviews and feedback</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Uses</h3>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Upload malicious code or viruses</li>
              <li>Infringe on intellectual property rights</li>
              <li>Harass or abuse other users or our staff</li>
              <li>Create fake accounts or impersonate others</li>
            </ul>
          </section>

          {/* Account Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Terms</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>You are responsible for safeguarding your account password</li>
              <li>You must notify us immediately of any unauthorized use</li>
              <li>We reserve the right to terminate accounts that violate these terms</li>
              <li>One person or legal entity may not maintain more than one account</li>
            </ul>
          </section>

          {/* Purchases and Payments */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Purchases and Payments</h2>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
            <p className="text-gray-600 mb-4">
              All prices are listed in INR (Indian Rupees) and are subject to change without notice. We reserve the right to modify 
              or discontinue products at any time.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment</h3>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Payment is due at the time of purchase</li>
              <li>We accept major credit cards, debit cards, UPI, and net banking</li>
              <li>All transactions are processed securely through Razorpay</li>
              <li>You authorize us to charge your payment method for all purchases</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Acceptance</h3>
            <p className="text-gray-600 mb-6">
              We reserve the right to refuse or cancel any order for any reason, including but not limited to 
              product availability, errors in pricing, or suspected fraudulent activity.
            </p>
          </section>

          {/* Shipping and Returns */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping and Returns</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping</h3>
            <p className="text-gray-600 mb-4">
              We ship across India and to select international locations. Shipping costs and delivery times vary by location and shipping method selected.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Returns</h3>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Most items can be returned within 7 days of delivery</li>
              <li>Items must be in original condition with all packaging</li>
              <li>Custom artworks and personalized items cannot be returned</li>
              <li>Return shipping costs may apply unless item was damaged or incorrect</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
            <p className="text-gray-600 mb-4">
              The service and its original content, features, and functionality are and will remain the exclusive property 
              of Rangleela and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-gray-600 mb-6">
              All artwork sold on our platform is the intellectual property of the respective artists. Purchasing artwork 
              grants you ownership of the physical piece but not reproduction rights unless explicitly stated.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Disclaimers</h2>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 text-sm">
                <strong>Important:</strong> The information on this service is provided on an "as is" basis. 
                We make no warranties, expressed or implied, and hereby disclaim all other warranties.
              </p>
            </div>

            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>We do not guarantee the accuracy of product descriptions or images</li>
              <li>Colors may vary due to monitor settings and photography</li>
              <li>We are not responsible for delays caused by shipping carriers</li>
              <li>Artwork authenticity is guaranteed to the best of our knowledge</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              In no event shall Rangleela, its directors, employees, partners, agents, suppliers, or affiliates be liable 
              for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of 
              profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These Terms shall be interpreted and governed by the laws of India, 
              without regard to its conflict of law provisions. Any disputes arising from these terms will be 
              resolved in the courts of Uttarakhand, India.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
              try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> rangleela0506@gmail.com</p>
              <p><strong>Phone:</strong> +91 70177 34431</p>
              <p><strong>Address:</strong> Awaz Vikas, Kashipur, Uttarakhand</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
