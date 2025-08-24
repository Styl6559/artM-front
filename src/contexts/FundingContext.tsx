import React, { createContext, useContext, useState, useEffect } from 'react';

interface FundingItem {
  _id: string;
  name: string;
  location?: string;
  city?: string;
  country?: string;
  headOffice?: string;
  hq?: string;
  fundSize?: number;
  ticketSize?: number;
  checkSize?: number;
  avgTicketSize?: number;
  grantSize?: number;
  fundingOffered?: string;
  fundingSupport?: string;
  stage?: string[];
  stageFocus?: string[];
  investCategory?: string[];
  sector?: string[];
  sectorFocus?: string[];
  sectors?: string[];
  authority?: string;
  contact?: string;
  websiteUrl?: string;
  linkedinProfileUrl?: string;
  applicationLink?: string;
  description?: string;
  portfolioHighlights?: string;
  eligibility?: string;
  programDuration?: string;
  batchFrequency?: string;
  applicationProcess?: string;
  category?: string;
}

interface FundingData {
  'angel-investors': FundingItem[];
  'venture-capital': FundingItem[];
  'micro-vcs': FundingItem[];
  'incubators': FundingItem[];
  'accelerators': FundingItem[];
  'govt-grants': FundingItem[];
}

interface FundingContextType {
  fundingData: FundingData;
  loading: boolean;
  error: string | null;
  loadFundingData: () => Promise<void>;
  getFundingByCategory: (category: keyof FundingData) => FundingItem[];
  getRandomFundingItems: (count?: number) => FundingItem[];
  searchFunding: (query: string, category?: keyof FundingData) => FundingItem[];
}

const FundingContext = createContext<FundingContextType | undefined>(undefined);

export const FundingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fundingData, setFundingData] = useState<FundingData>({
    'angel-investors': [],
    'venture-capital': [],
    'micro-vcs': [],
    'incubators': [],
    'accelerators': [],
    'govt-grants': []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const loadFundingData = async () => {
    if (loading) return; // Prevent multiple simultaneous loads
    // Only set loading to true if there is no cached data
    const cached = localStorage.getItem('aarly_funding_data');
    let hasCache = false;
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const isStale = Date.now() - timestamp > 60 * 60 * 1000; // 60 minutes
        if (!isStale) {
          hasCache = true;
        }
      } catch {}
    }
    if (!hasCache) setLoading(true);
    setError(null);

    try {
      const categories: (keyof FundingData)[] = [
        'angel-investors',
        'venture-capital', 
        'micro-vcs',
        'incubators',
        'accelerators',
        'govt-grants'
      ];

      // Load all categories in parallel
      const promises = categories.map(async (category) => {
        try {
          const response = await fetch(`${API_URL}/funding/public/${category}?limit=100`, {
            credentials: 'include'
          });
          const data = await response.json();
          
          if (data.success) {
            return { category, items: data.data.map((item: FundingItem) => ({ ...item, category })) };
          } else {
            console.error(`Failed to load ${category}:`, data.message);
            return { category, items: [] };
          }
        } catch (error) {
          console.error(`Error loading ${category}:`, error);
          return { category, items: [] };
        }
      });

      const results = await Promise.all(promises);
      
      const newFundingData: FundingData = {
        'angel-investors': [],
        'venture-capital': [],
        'micro-vcs': [],
        'incubators': [],
        'accelerators': [],
        'govt-grants': []
      };

      results.forEach(({ category, items }) => {
        newFundingData[category] = items;
      });

      setFundingData(newFundingData);
      
      // Cache the data in localStorage for faster subsequent loads
      localStorage.setItem('aarly_funding_data', JSON.stringify({
        data: newFundingData,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error('Error loading funding data:', error);
      setError('Failed to load funding data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load cached data on mount, then refresh if needed
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem('aarly_funding_data');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const isStale = Date.now() - timestamp > 60 * 60 * 1000; // 60 minutes
          
          if (!isStale) {
            setFundingData(data);
            return true; // Data loaded from cache
          }
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
      return false; // No valid cache
    };

    const hasCache = loadCachedData();
    
    // Always load fresh data, but don't show loading if we have cache
    if (!hasCache) {
      loadFundingData();
    } else {
      // Load fresh data in background
      setTimeout(loadFundingData, 1000);
    }
  }, []);

  const getFundingByCategory = (category: keyof FundingData): FundingItem[] => {
    return fundingData[category] || [];
  };

  const getRandomFundingItems = (count: number = 6): FundingItem[] => {
    const allItems: FundingItem[] = [];
    
    Object.values(fundingData).forEach(categoryItems => {
      allItems.push(...categoryItems);
    });

    // Shuffle array and return random items
    const shuffled = allItems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const searchFunding = (query: string, category?: keyof FundingData): FundingItem[] => {
    const searchIn = category ? [fundingData[category]] : Object.values(fundingData);
    const results: FundingItem[] = [];

    searchIn.forEach(categoryItems => {
      const filtered = categoryItems.filter(item => 
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.portfolioHighlights?.toLowerCase().includes(query.toLowerCase()) ||
        item.sector?.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        item.sectors?.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        item.sectorFocus?.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        item.investCategory?.some(s => s.toLowerCase().includes(query.toLowerCase()))
      );
      results.push(...filtered);
    });

    return results;
  };

  const value = {
    fundingData,
    loading,
    error,
    loadFundingData,
    getFundingByCategory,
    getRandomFundingItems,
    searchFunding
  };

  return (
    <FundingContext.Provider value={value}>
      {children}
    </FundingContext.Provider>
  );
};

export const useFunding = () => {
  const context = useContext(FundingContext);
  if (context === undefined) {
    throw new Error('useFunding must be used within a FundingProvider');
  }
  return context;
};
