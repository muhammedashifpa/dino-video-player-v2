const CLOUDINARY_CLOUD_NAME = 'dlirsqqey';

/**
 * Transforms any image URL into a Cloudinary fetch URL with automatic
 * format, quality, and width optimizations.
 *
 * @param {string} url   - Original image URL
 * @param {number} width - Desired display width in px (default: 400)
 * @returns {string} Cloudinary fetch URL, or the original URL if input is empty
 */
export function optimizeThumbnail(url, width = 400) {
  if (!url) return '';
  const encodedUrl = encodeURIComponent(url);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${width}/${encodedUrl}`;
}
