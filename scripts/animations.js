// ===== Animation Controller =====
(function () {
  'use strict';

  const site = window.ProfileWebsite = window.ProfileWebsite || {};

  const REVEAL_SELECTOR = [
    '.expertise-card',
    '.achievement-card',
    '.publication-card',
    '.value-card',
    '.social-link'
  ].join(', ');

  function revealElement(element, index = 0) {
    element.style.animationDelay = `${Math.min(index * 80, 400)}ms`;
    element.classList.add('is-visible');
  }

  function initializeRevealAnimations() {
    const elements = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
    if (elements.length === 0) return;

    elements.forEach((element) => element.classList.add('js-reveal'));

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => revealElement(element));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const siblings = entry.target.parentElement ? Array.from(entry.target.parentElement.children) : [];
        revealElement(entry.target, siblings.indexOf(entry.target));
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    elements.forEach((element) => observer.observe(element));
  }

  function initializeHeroAnimation() {
    const selectors = [
      '.hero-avatar',
      '.hero-title',
      '.hero-subtitle',
      '.hero-badges',
      '.hero-description',
      '.hero-buttons',
      '.scroll-indicator'
    ];

    selectors.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (!element) return;

      element.style.animationDelay = `${120 + (index * 80)}ms`;
      element.classList.add('hero-animate-in');
    });
  }

  function initializeScrollProgress() {
    if (document.querySelector('.scroll-progress')) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    };

    updateProgress();
    window.addEventListener('scroll', site.throttle(updateProgress, 100));
    window.addEventListener('resize', site.throttle(updateProgress, 150));
  }

  function init() {
    initializeHeroAnimation();
    initializeRevealAnimations();
    initializeScrollProgress();
  }

  site.animations = { init };
}());
