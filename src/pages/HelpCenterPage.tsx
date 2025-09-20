import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, MessageCircle, Mail, Phone, ArrowLeft, HelpCircle } from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our collection of paintings and apparel, add items to your cart, and proceed to checkout. You can shop as a guest, but you'll need to log in to complete the purchase. We accept all major payment methods through Razorpay."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets through Razorpay. All transactions are secured with industry-standard encryption for your safety."
    },
    {
      question: "How long does shipping take in India?",
      answer: "Delivery times vary by location: Delhi/Dehradun (3-4 days), Major cities like Mumbai, Bangalore (7 days), Remote areas (up to 10 days). All orders include free shipping with real-time tracking."
    },
    {
      question: "What is your return and refund policy?",
      answer: "We offer a 7-day return policy from delivery date. Items must be in original condition. Refunds are processed within 3 business days after we receive the returned item. Custom/personalized items may have different policies."
    },
    {
      question: "Are the paintings original or prints?",
      answer: "We clearly indicate whether each piece is an original painting or high-quality print. Original paintings come with authenticity certificates from our featured artists. All artworks are carefully packaged for safe delivery."
    },
    {
      question: "Do you offer custom designs or commissions?",
      answer: "Yes! Many of our artists accept custom commissions for both paintings and apparel designs. Contact us through our form with 'Custom Design' subject, and we'll connect you with suitable artists."
    },
    {
      question: "How can I become a featured artist on Rangleela?",
      answer: "We're always looking for talented artists! Submit your portfolio through our contact form with 'Artist Application' subject. Our curation team reviews all submissions and will get back to you within 7-10 business days."
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email and SMS. You can also check your order status in the 'My Orders' section of your account for real-time updates."
    },
    {
      question: "What if I receive a damaged item?",
      answer: "We take great care in packaging, but if you receive a damaged item, contact us immediately with photos. We'll arrange a replacement or full refund within 24-48 hours at no cost to you."
    }
  ];

  const categories = [
    {
      title: "Orders & Payment",
      description: "Order placement, payment methods, Razorpay integration, and billing queries",
      icon: "💳",
      link: "/contact?subject=order"
    },
    {
      title: "Shipping & Delivery",
      description: "India-wide delivery, tracking, packaging, and delivery timeframes",
      icon: "📦",
      link: "/shipping"
    },
    {
      title: "Returns & Refunds",
      description: "7-day return policy, refund process, and exchange guidelines",
      icon: "↩️",
      link: "/refund-policy"
    },
    {
      title: "Product Information",
      description: "Paintings, apparel, authenticity, and quality details",
      icon: "🎨",
      link: "/contact?subject=general"
    },
    {
      title: "Account & Profile",
      description: "Account management, profile settings, order history, and preferences",
      icon: "👤",
      link: "/profile"
    },
    {
      title: "Artist Services",
      description: "Joining as featured artist, commission work, and collaboration opportunities",
      icon: "🖌️",
      link: "/contact?subject=artist"
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" onClick={scrollToTop} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gallery</span>
          </Link>
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <HelpCircle className="relative w-16 h-16 text-emerald-600 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-lg text-gray-600 mb-8 font-light">
              Find answers to your questions about Rangleela's art collection and services
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 font-serif">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                onClick={scrollToTop}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 font-serif group-hover:text-emerald-600 transition-colors">{category.title}</h3>
                <p className="text-gray-600 text-sm font-light">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          {/* Search Bar above FAQ */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-6 h-6 z-10" />
            <input
              type="text"
              placeholder="Search help articles and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl shadow-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 font-serif placeholder-gray-400 hover:border-gray-300 transition-colors"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 font-serif">Frequently Asked Questions</h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200/50 last:border-b-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-emerald-50/50 transition-colors group"
                  >
                    <span className="font-medium text-gray-800 font-serif group-hover:text-emerald-700">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-600" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 font-serif">No results found for "{searchQuery}". Try different keywords or browse categories above.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Still Need Help?</h2>
            <p className="text-gray-600 font-light">
              Can't find what you're looking for? Our support team at Rangleela is here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/contact"
              onClick={scrollToTop}
              className="text-center p-6 bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl hover:shadow-lg hover:scale-100 transition-all duration-300 group"
            >
              <MessageCircle className="w-8 h-8 text-emerald-600 mx-auto mb-4 group-hover:text-emerald-700" />
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Contact Form</h3>
              <p className="text-gray-600 text-sm mb-4 font-light">
                Send us a detailed message with attachments
              </p>
              <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Send Message
              </div>
            </Link>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl hover:shadow-lg hover:scale-100 transition-all duration-300 group">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4 group-hover:text-blue-700" />
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Email Support</h3>
              <p className="text-gray-600 text-sm mb-4 font-light">
                Direct email for detailed assistance
              </p>
              <a 
                href="mailto:rangleela0506@gmail.com"
                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Send Email
              </a>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:shadow-lg hover:scale-100 transition-all duration-300 group">
              <Phone className="w-8 h-8 text-purple-600 mx-auto mb-4 group-hover:text-purple-700" />
              <h3 className="font-semibold text-gray-800 mb-2 font-serif">Phone Support</h3>
              <p className="text-gray-600 text-sm mb-4 font-light">
                Speak directly with our team
              </p>
              <a 
                href="tel:+919389556890"
                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Call Now
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
            <p className="text-gray-700 font-serif">
              <strong>Support Hours:</strong> Monday - Saturday, 10 AM - 7 PM IST<br />
              <span className="text-sm text-gray-600">We typically respond within 24 hours</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
