/**
 * Utility functions for time management and formatting within the video player.
 */

/**
 * Formats a given time in seconds into a human-readable string.
 * Supports MM:SS and HH:MM:SS formats based on the duration.
 * 
 * @param {number} seconds - The total time in seconds.
 * @returns {string} The formatted time string (e.g., "05:20" or "01:10:05").
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "00:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formatUnit = (unit: number) => unit.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${formatUnit(mins)}:${formatUnit(secs)}`;
  }
  return `${formatUnit(mins)}:${formatUnit(secs)}`;
};

/**
 * Formats a date into a relative time string (e.g., "2 hours ago").
 * 
 * @param {Date | string | number} date - The date to format.
 * @returns {string} The relative time string.
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

/**
 * Converts a duration string like "1:30" or "1:05:20" into total seconds.
 * 
 * @param {string} timeString - The time string to parse.
 * @returns {number} The total number of seconds.
 */
export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  if (parts.some(isNaN)) return 0;

  if (parts.length === 3) {
    const [hrs, mins, secs] = parts;
    return hrs * 3600 + mins * 60 + secs;
  }
  if (parts.length === 2) {
    const [mins, secs] = parts;
    return mins * 60 + secs;
  }
  return parts[0] || 0;
};
