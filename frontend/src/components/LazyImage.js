import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  onError,
  onLoad,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNhYWEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Increased for better UX
      }
    );

    if (imgRef.current) {
      // Check if already in viewport immediately
      const rect = imgRef.current.getBoundingClientRect();
      const isCurrentlyVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );

      if (isCurrentlyVisible) {
        setIsInView(true);
      } else {
        observer.observe(imgRef.current);
      }
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {!isInView ? (
        <img
          src={placeholder}
          alt="Loading..."
          className="lazy-placeholder"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(2px)',
            transition: 'filter 0.3s ease'
          }}
        />
      ) : (
        <img
          src={hasError ? placeholder : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            ...style
          }}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
