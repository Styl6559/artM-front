import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = "RangLeela - Unique Paintings, Apparel & Accessories | Indian Art & Fashion",
  description = "Discover unique paintings, artistic apparel, and accessories from talented Indian creators at RangLeela. Shop authentic art, fashion, and handcrafted items where creativity meets style.",
  keywords = "paintings, art, apparel, accessories, Indian art, handmade, creative fashion, artistic clothing, unique designs, RangLeela",
  image = "/src/assets/round.png",
  url,
  type = "website",
  canonical,
  noindex = false,
  nofollow = false
}) => {
  const location = useLocation();
  
  // Generate canonical URL based on current location if not provided
  const baseUrl = "https://rangleela.com";
  const currentUrl = url || `${baseUrl}${location.pathname}${location.search}`;
  const canonicalUrl = canonical || currentUrl;
  
  // Generate robots meta content
  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Prevent duplicate content on similar URLs */}
      {location.search && (
        <link rel="alternate" href={`${baseUrl}${location.pathname}`} />
      )}
    </Helmet>
  );
};

export default SEO;
