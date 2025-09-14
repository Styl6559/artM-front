import React, { useState, useEffect } from 'react';
import { heroImageCache } from '../lib/heroImageCache';

interface CachedHeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CachedHeroImage: React.FC<CachedHeroImageProps> = ({
  src,
  alt,
  className
}) => {
  const [cachedSrc, setCachedSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    
    heroImageCache.getImage(src).then(cachedUrl => {
      if (!isCancelled) {
        setCachedSrc(cachedUrl);
      }
    }).catch(() => {
      if (!isCancelled) {
        setCachedSrc(src); // Fallback to original
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <img
      src={cachedSrc}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      style={{ opacity: isLoading ? 0.7 : 1 }}
    />
  );
};

export default CachedHeroImage;