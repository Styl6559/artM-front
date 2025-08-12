import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MessageCircle, Mail, Phone } from 'lucide-react';
import Button from '../components/ui/Button';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, browse our collection, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secured with SSL encryption."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days within the US. Express shipping (2-3 business days) and overnight shipping options are also available. International shipping times vary by location."
    },
    {
      question: "Can I return or exchange an item?",
      answer: "Yes, we offer a 30-day return policy for most items. Items must be in original condition. Original paintings and custom apparel may have different return policies."
    },
    {
      question: "Are the paintings original or prints?",
      answer: "We clearly mark whether each piece is an original painting or a high-quality print. Original paintings come with a certificate of authenticity from the artist."
    },
    {
      question: "How do I care for my artwork?",
      answer: "Keep paintings away from direct sunlight and humidity. For apparel, follow the care instructions on the label. We provide detailed care guides with each purchase."
    },
    {
      question: "Do you offer custom commissions?",
      answer: "Yes, many of our artists accept custom commissions. Contact us with your requirements, and we'll connect you with suitable artists."
    },
    {
      question: "How can I become a featured artist?",
      answer: "We're always looking for talented artists. Submit your portfolio through our artist application form, and our curation team will review your work."
    }
  ];

  const categories = [
    {
      title: "Orders & Payment",
      description: "Questions about placing orders, payment methods, and billing",
      icon: "💳"
    },
    {
      title: "Shipping & Delivery",
      description: "Information about shipping options, tracking, and delivery",
      icon: "📦"
    },
    {
      title: "Returns & Exchanges",
      description: "Return policy, exchange process, and refunds",
      icon: "↩️"
    },
    {
      title: "Product Information",
      description: "Details about our paintings, apparel, accessories, and authenticity",
      icon: "🎨"
    },
    {
      title: "Account & Profile",
      description: "Managing your account, profile settings, and preferences",
      icon: "👤"
    },
    {
      title: "Artist Services",
      description: "Information for artists wanting to join our platform",
      icon: "🖌️"
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to your questions or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-gray-600">
              Can't find what you're looking for? Our support team is here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm mb-4">
                Chat with our support team in real-time
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-orange-500">
                Start Chat
              </Button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Mail className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get detailed help via email
              </p>
              <Button variant="outline">
                Send Email
              </Button>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Phone className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Speak directly with our team
              </p>
              <Button variant="outline">
                Call Now
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <strong>Support Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;