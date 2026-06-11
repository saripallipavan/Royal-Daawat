import { useState } from 'react';
import fallbackImage from '../assets/logo.jpg';

const ImageWithFallback = ({ src, alt, className, style, ...props }) => {
  const [prevSrc, setPrevSrc] = useState(src);
  const [imgSrc, setImgSrc] = useState(src || fallbackImage);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(src || fallbackImage);
    setHasError(false);
    setIsLoading(true);
  }

  const handleError = (e) => {
    if (!hasError) {
      setImgSrc(fallbackImage);
      setHasError(true);
      setIsLoading(false);
    }
    if (props.onError) {
      props.onError(e);
    }
  };

  const handleLoad = (e) => {
    setIsLoading(false);
    if (props.onLoad) {
      props.onLoad(e);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', borderRadius: style?.borderRadius, overflow: 'hidden' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: '#1a1a1a',
          animation: 'pulse 1.5s infinite ease-in-out',
          borderRadius: style?.borderRadius
        }} />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={{ 
          ...style, 
          opacity: isLoading ? 0 : 1, 
          transition: style?.transition ? `${style.transition}, opacity 0.3s ease` : 'opacity 0.3s ease'
        }}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; background-color: #2a2a2a; }
          50% { opacity: 1; background-color: #3a3a3a; }
          100% { opacity: 0.6; background-color: #2a2a2a; }
        }
      `}</style>
    </div>
  );
};

export default ImageWithFallback;
