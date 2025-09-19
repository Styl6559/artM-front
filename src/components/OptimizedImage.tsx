import React, { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean; // For above-the-fold images
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  style,
  priority = false,
  width,
  height,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate optimized Cloudinary URL if it's a Cloudinary image
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('cloudinary.com')) {
      // Extract the public ID and add optimization parameters
      const parts = originalSrc.split('/upload/');
      if (parts.length === 2) {
        const [baseUrl, path] = parts;
        // Add Cloudinary transformations for web optimization
        const transformations = [
          'f_auto', // Auto format (WebP, AVIF when supported)
          'q_auto:good', // Auto quality optimization
          'w_auto:100:800', // Auto width (responsive)
          'dpr_auto', // Auto device pixel ratio
          'c_limit' // Limit crop mode
        ].join(',');
        
        return `${baseUrl}/upload/${transformations}/${path}`;
      }
    }
    return originalSrc;
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ 
          width: width || '100%', 
          height: height || '100%',
          ...style 
        }}
      >
        <div className="text-gray-400 text-sm">Failed to load image</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center`}
          style={style}
        >
          <div className="w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={getOptimizedSrc(src)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        width={width}
        height={height}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: width && height ? `${width}px ${height}px` : '300px 300px',
          ...style
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;
