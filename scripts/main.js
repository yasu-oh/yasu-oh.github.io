// ===== Profile Website Bootstrap =====
(function () {
  'use strict';

  const site = window.ProfileWebsite = window.ProfileWebsite || {};

  site.throttle = function throttle(callback, wait) {
    let lastRun = 0;
    let timeoutId = null;

    return function throttledCallback(...args) {
      const now = Date.now();
      const remaining = wait - (now - lastRun);

      window.clearTimeout(timeoutId);

      if (remaining <= 0) {
        lastRun = now;
        callback.apply(this, args);
        return;
      }

      timeoutId = window.setTimeout(() => {
        lastRun = Date.now();
        callback.apply(this, args);
      }, remaining);
    };
  };

  site.trackEvent = function trackEvent(eventName, parameters) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }
  };

  function initializeSocialTracking() {
    document.querySelectorAll('.social-link').forEach((link) => {
      link.addEventListener('click', () => {
        site.trackEvent('social_click', {
          event_category: 'engagement',
          event_label: link.dataset.platform || 'unknown'
        });
      });
    });
  }

  function resetHorizontalScroll() {
    window.scrollTo(0, window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0);
  }

  function initialize() {
    resetHorizontalScroll();

    if (site.navigation && typeof site.navigation.init === 'function') {
      site.navigation.init();
    }

    if (site.animations && typeof site.animations.init === 'function') {
      site.animations.init();
    }

    initializeSocialTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
