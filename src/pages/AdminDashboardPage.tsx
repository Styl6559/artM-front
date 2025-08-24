import React, { useState } from 'react';
import { Target, Newspaper, Mail, DollarSign, Send, MessageCircle } from 'lucide-react';
import InvestorMatchManagement from '../components/admin/InvestorMatchManagement';
import NewsManagement from '../components/admin/NewsManagement';
import ContactManagement from '../components/admin/ContactManagement';
import FundingManagement from '../components/admin/FundingManagement';
import NewsletterManagement from '../components/admin/NewsletterManagement';
import WhatsAppManagement from '../components/admin/WhatsAppManagement';

type TabType = 'investor-match' | 'news' | 'contacts' | 'funding' | 'newsletter' | 'whatsapp';

const fundingCategories = [
  { value: 'angel-investors', label: 'Angel Investors' },
  { value: 'venture-capital', label: 'Venture Capital' },
  { value: 'micro-vcs', label: 'Micro VCs' },
  { value: 'incubators', label: 'Incubators' },
  { value: 'accelerators', label: 'Accelerators' },
  { value: 'govt-grants', label: 'Government Grants' }
];

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('investor-match');
  const [selectedFundingCategory, setSelectedFundingCategory] = useState('angel-investors');

  const tabs = [
    { id: 'investor-match', label: 'Investor Match', icon: Target },
    { id: 'news', label: "Fin'Newz", icon: Newspaper },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'funding', label: 'Funding', icon: DollarSign },
    { id: 'newsletter', label: 'Newsletter', icon: Send },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'investor-match':
        return <InvestorMatchManagement />;
      case 'news':
        return <NewsManagement />;
      case 'contacts':
        return <ContactManagement />;
      case 'funding':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {fundingCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedFundingCategory(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFundingCategory === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <FundingManagement category={selectedFundingCategory} />
          </div>
        );
      case 'newsletter':
        return <NewsletterManagement />;
      case 'whatsapp':
        return <WhatsAppManagement />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform content and settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;