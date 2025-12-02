/**
 * Enhanced Video Autoplay for iOS/iPhone
 * Handles iOS Safari's strict autoplay policies
 */

(function() {
  'use strict';

  function initVideoAutoplay() {
    const video = document.querySelector('.bg-video');
    if (!video) return;

    // Ensure video attributes are set correctly for iOS
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x-webkit-airplay', 'allow');
    video.defaultMuted = true;
    video.volume = 0;

    // Function to attempt video play
    function attemptPlay() {
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video autoplay started successfully');
          })
          .catch(error => {
            console.log('Autoplay prevented, will retry on user interaction:', error);
            // Add click listener to play on first user interaction
            enablePlayOnInteraction();
          });
      }
    }

    // Enable play on any user interaction
    function enablePlayOnInteraction() {
      const events = ['touchstart', 'touchend', 'click', 'scroll'];
      
      function playOnInteraction() {
        video.play().then(() => {
          console.log('Video started after user interaction');
          // Remove all event listeners after successful play
          events.forEach(event => {
            document.removeEventListener(event, playOnInteraction);
          });
        }).catch(err => {
          console.log('Play attempt failed:', err);
        });
      }

      // Add listeners for user interaction
      events.forEach(event => {
        document.addEventListener(event, playOnInteraction, { once: true, passive: true });
      });
    }

    // Handle visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden && video.paused) {
        attemptPlay();
      }
    });

    // Handle page show event (for back/forward cache)
    window.addEventListener('pageshow', function(event) {
      if (event.persisted && video.paused) {
        attemptPlay();
      }
    });

    // Initial play attempt
    if (video.readyState >= 2) {
      // Video is ready
      attemptPlay();
    } else {
      // Wait for video to be ready
      video.addEventListener('loadeddata', attemptPlay, { once: true });
      video.addEventListener('canplay', attemptPlay, { once: true });
    }

    // Fallback: try to play after a short delay
    setTimeout(attemptPlay, 100);
    setTimeout(attemptPlay, 500);
    setTimeout(attemptPlay, 1000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoAutoplay);
  } else {
    initVideoAutoplay();
  }

  // Also try on window load
  window.addEventListener('load', initVideoAutoplay);
})();
