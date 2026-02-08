import { memo, useState, useCallback } from 'react';

// Optimized Image component with error handling
const OptimizedImage = memo(({ src, alt, className, loading = 'lazy', isDarkMode = false }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleError = useCallback(() => {
    setImgError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setImgLoaded(true);
  }, []);

  if (imgError) {
    return (
      <div className={`${className} bg-[rgba(0,0,0,0.05)] flex items-center justify-center`}>
        <div className="w-4 h-4 border-2 border-[rgba(0,0,0,0.2)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Apply white filter in dark mode for main logo (not favicon) and Private Mode icon
  const shouldApplyFilter = isDarkMode && (
    (src.includes('jensei-logo') && !src.includes('jensei-favicon')) ||
    src.includes('a15ebe8edc9e3a75a9dc9f38418a63e8d1164028')
  );

  return (
    <img 
      alt={alt}
      className={`${className} ${imgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
      src={src}
      loading={loading}
      decoding="async"
      onError={handleError}
      onLoad={handleLoad}
      style={{
        filter: shouldApplyFilter ? 'brightness(0) invert(1)' : 'none',
        transition: 'filter 0.15s ease-out',
        willChange: 'opacity, filter'
      }}
    />
  );
});
OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
