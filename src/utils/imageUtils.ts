const CLOUDINARY_CLOUD_NAME = 'dlirsqqey';

/**
 * Transforms any image URL into a Cloudinary fetch URL with automatic
 * format, quality, and width optimizations.
 *
 * @param {string} url   - Original image URL
 * @param {number} width - Desired display width in px (default: 400)
 * @returns {string} Cloudinary fetch URL, or the original URL if input is empty
 */
export function optimizeThumbnail(url: string | null | undefined, width: number = 400): string {
  if (!url) return '';
  const encodedUrl = encodeURIComponent(url);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${width}/${encodedUrl}`;
}

/**
 * Transforms a Cloudinary video URL to include automatic format and quality optimizations.
 * Falls back to original URL if it's not a Cloudinary URL or if optimization is already applied.
 * 
 * @param {string} url - Original video URL
 * @returns {string} Optimized video URL
 */
export function optimizeVideo(url: string | null | undefined): string {
  if (!url) return '';
  
  // If it's already a Cloudinary URL and doesn't have transformations, add them
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    // Only add if not already present
    if (!url.includes('/f_auto,q_auto/')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    return url;
  }
  
  // For non-Cloudinary URLs or different patterns, use the fetch API if possible
  // However, for this project, the mock data uses res.cloudinary.com/dlirsqqey/video/upload/
  // So we specialize for that pattern first.
  
  return url;
}
