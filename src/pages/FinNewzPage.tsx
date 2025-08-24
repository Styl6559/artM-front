import React, { useEffect, useState, useCallback } from 'react';
import { Newspaper, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  category: string;
  publishedAt: string;
  author: {
    name: string;
  };
}

// Optimized Image Component with lazy loading and caching
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}> = ({ src, alt, className = '', priority = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse" />
      )}
      {error ? (
        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Failed to load</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          style={{ 
            contentVisibility: 'auto',
            containIntrinsicSize: '100% 192px'
          }}
        />
      )}
    </div>
  );
};

const FinNewzPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Cache for news data to avoid refetching
  const CACHE_KEY = 'aarly_news_cache';
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  // Preload first few images for faster loading
  const preloadImages = useCallback((articles: NewsItem[]) => {
    articles.slice(0, 3).forEach(article => {
      if (article.image?.url) {
        const img = new Image();
        img.src = article.image.url;
      }
    });
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const isStale = Date.now() - timestamp > CACHE_DURATION;
          
          if (!isStale) {
            setArticles(data);
            setLoading(false);
            preloadImages(data);
            return;
          }
        } catch (e) {
          // Invalid cache, continue to fetch
        }
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/public/news`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success) {
            setArticles(data.data);
            // Cache the data
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              data: data.data,
              timestamp: Date.now()
            }));
            preloadImages(data.data);
          } else {
            setError('Failed to load news articles');
          }
        } else {
          setError(`Failed to load news articles: ${response.statusText}`);
        }
      } catch (err: any) {
        setError('Could not load news articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [preloadImages]);

  const handleArticleClick = (article: NewsItem) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      <Helmet>
        <title>Content - Startup News | Aarly</title>
        <meta name="description" content="Stay updated with the latest startup news, trends, and insights on Aarly Content." />
        <link rel="canonical" href="https://aarly.co/content" />
        <meta property="og:title" content="Content - Startup News | Aarly" />
        <meta property="og:description" content="Stay updated with the latest startup news, trends, and insights on Aarly Content." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aarly.co/content" />
        <meta property="og:image" content="/Screenshot 2025-06-29 140116.png" />
      </Helmet>
      <div className="min-h-screen bg-gray-900 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Newspaper size={48} className="text-blue-400 transition-transform hover:scale-110" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Content
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Latest startup and business news from our editorial team
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
                  <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 text-lg font-semibold">{error}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <div
                  key={article._id}
                  onClick={() => handleArticleClick(article)}
                  className="group bg-gray-800 hover:bg-gray-750 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-xl"
                >
                  {article.image?.url && (
                    <OptimizedImage
                      src={article.image.url}
                      alt={article.title}
                      className="rounded-lg mb-4 h-48 group-hover:scale-105 transition-transform duration-500"
                      priority={i < 3} // Prioritize first 3 images
                    />
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-white text-lg mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                    {article.description.length > 120 
                      ? `${article.description.substring(0, 120)}...` 
                      : article.description
                    }
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">By {article.author.name}</span>
                    <span className="inline-flex items-center gap-1 text-blue-400 font-medium text-sm group-hover:text-blue-300 transition-colors">
                      Read More
                      <ArrowRight size={14} className="transform transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500/20 text-blue-400 text-sm font-semibold px-3 py-1 rounded-full">
                    {selectedArticle.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-3xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>
              
              {selectedArticle.image?.url && (
                <OptimizedImage
                  src={selectedArticle.image.url}
                  alt={selectedArticle.title}
                  className="w-full h-80 rounded-lg mb-6"
                  priority={true}
                />
              )}
              
              <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
                {selectedArticle.title}
              </h1>
              
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {selectedArticle.description}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400">
                  Written by <span className="text-blue-400 font-medium">{selectedArticle.author.name}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FinNewzPage; 