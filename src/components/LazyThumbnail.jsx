import { useState } from 'react';
import { optimizeThumbnail } from '../utils/imageUtils';

/**
 * LazyThumbnail
 *
 * Renders an optimized thumbnail with a blurred low-quality placeholder
 * that fades out once the full image has loaded. Uses native lazy loading
 * so off-screen images are never fetched until needed.
 *
 * Props:
 *   src          {string} - Original thumbnail URL
 *   alt          {string} - Alt text for the full image
 *   width        {number} - Target display width used for Cloudinary optimization (default: 400)
 *   imgClassName {string} - Extra classes applied to the full <img> (e.g. hover effects)
 */
const LazyThumbnail = ({ src, alt, width = 400, imgClassName = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // A 20px-wide version loads in milliseconds and looks fine when blurred.
  const lqipUrl = optimizeThumbnail(src, 20);
  const fullUrl = optimizeThumbnail(src, width);

  return (
    // Dark background prevents layout shift before any image arrives.
    <div className="relative w-full h-full bg-slate-900">
      {/* Blurred placeholder — always present, fades out once full image loads */}
      <img
        src={lqipUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 pointer-events-none"
        style={{
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Full-quality image — fades in once loaded */}
      <img
        src={fullUrl}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover ${imgClassName}`}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  );
};

export default LazyThumbnail;
