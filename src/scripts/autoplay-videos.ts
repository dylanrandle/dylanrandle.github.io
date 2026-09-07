const VIDEO_SELECTOR = 'video';
const AUTOPLAY_VIDEO_SELECTOR = 'video[data-autoplay-video]';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const initializeAutoplayVideos = () => {
  const videos = [
    ...document.querySelectorAll<HTMLVideoElement>(VIDEO_SELECTOR),
  ];
  if (videos.length === 0) return;

  for (const video of videos) {
    const revealLoadedFrame = () => video.removeAttribute('poster');

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      revealLoadedFrame();
    } else {
      video.addEventListener('loadeddata', revealLoadedFrame, { once: true });
    }
  }

  const autoplayVideos = videos.filter((video) =>
    video.matches(AUTOPLAY_VIDEO_SELECTOR),
  );
  if (autoplayVideos.length === 0) return;

  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const visibleVideos = new Set<HTMLVideoElement>();

  const updatePlayback = () => {
    for (const video of autoplayVideos) {
      if (reducedMotion.matches || !visibleVideos.has(video)) {
        video.pause();
      } else {
        void video.play().catch(() => {
          // The first decoded frame remains visible if autoplay is declined.
        });
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) visibleVideos.add(video);
        else visibleVideos.delete(video);
      }
      updatePlayback();
    },
    { threshold: 0.25 },
  );

  autoplayVideos.forEach((video) => observer.observe(video));
  reducedMotion.addEventListener('change', updatePlayback);
};
