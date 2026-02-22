import Hls from 'hls.js';
import { useEffect, type RefObject } from 'react';

export const useHlsPlayer = (
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string | undefined
) => {
  useEffect(() => {
    if (!src || !videoRef.current) return;

    const video = videoRef.current;

    // Safari supports HLS natively
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    // Chrome / Firefox use hls.js
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, [src, videoRef]);
};
