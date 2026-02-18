/**
 * Helper to generate a stable random like count based on string hash.
 * Returns a number between 5000 and 95000.
 */
export const getStableLikes = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);
  return (positiveHash % 90000) + 5000;
};
