const CLOUDINARY_CLOUD_NAME = 'dcrhbqjbo';

/**
 * Transforms any image URL into a Cloudinary fetch URL with automatic
 * format, quality, and width optimizations.
 *
 * @param {string} url   - Original image URL
 * @param {number} width - Desired display width in px (default: 400)
 * @returns {string} Cloudinary fetch URL, or the original URL if input is empty
 */
export function getVideoUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto,w_1000,vc_auto/${publicId}`;
}

export function optimizeThumbnail(url: string | null | undefined, width: number = 400): string {
  if (!url) return '';
  const encodedUrl = encodeURIComponent(url);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/f_auto,q_auto,w_${width}/${encodedUrl}`;
}
