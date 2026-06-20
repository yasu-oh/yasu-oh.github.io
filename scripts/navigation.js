// ===== Navigation Controller =====
(function () {
  'use strict';

  const site = window.ProfileWebsite = window.ProfileWebsite || {};

  const SELECTORS = {
    navbar: '.navbar',
    navToggle: '.nav-toggle',
    navMenu: '.nav-menu',
    navLink: '.nav-link',
    section: 'section[id]'
  };

  const SCROLL_OFFSET = 20;
  const MOBILE_BREAKPOINT = 1100;

  function getNavigationHeight() {
    const navbar = document.querySelector(SELECTORS.navbar);
    return navbar ? navbar.offsetHeight : 0;
  }

  function closeMobileMenu() {
    const navToggle = document.querySelector(SELECTORS.navToggle);
    const navMenu = document.querySelector(SELECTORS.navMenu);

    if (!navToggle || !navMenu) return;

    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const navToggle = document.querySelector(SELECTORS.navToggle);
    const navMenu = document.querySelector(SELECTORS.navMenu);

    if (!navToggle || !navMenu) return;

    const isExpanded = navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isExpanded));
    navMenu.classList.toggle('active', isExpanded);
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  }

  function updateActiveNavLink(sectionId) {
    document.querySelectorAll(SELECTORS.navLink).forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
  }

  function getCurrentSection() {
    const scrollPosition = window.scrollY + getNavigationHeight() + SCROLL_OFFSET + 1;
    const sections = Array.from(document.querySelectorAll(SELECTORS.section));

    for (let index = sections.length - 1; index >= 0; index -= 1) {
      const section = sections[index];
      if (scrollPosition >= section.offsetTop) {
        return section.id;
      }
    }

    return sections.length > 0 ? sections[0].id : null;
  }

  function scrollToSection(sectionId, updateHistory = true) {
    const target = document.getElementById(sectionId);
    if (!target) return false;

    const top = target.offsetTop - getNavigationHeight() - SCROLL_OFFSET;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });

    updateActiveNavLink(sectionId);
    closeMobileMenu();

    if (updateHistory && window.history.pushState) {
      window.history.pushState(null, '', `#${sectionId}`);
    }

    return true;
  }

  function navigateByOffset(offset) {
    const sections = Array.from(document.querySelectorAll(SELECTORS.section));
    const currentSection = getCurrentSection();
    const currentIndex = sections.findIndex((section) => section.id === currentSection);
    const nextSection = sections[currentIndex + offset];

    if (nextSection) {
      scrollToSection(nextSection.id);
    }
  }

  function initializeMobileMenu() {
    const navToggle = document.querySelector(SELECTORS.navToggle);
    const navMenu = document.querySelector(SELECTORS.navMenu);

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', toggleMobileMenu);

    document.addEventListener('click', (event) => {
      if (!navMenu.classList.contains('active')) return;
      if (navToggle.contains(event.target) || navMenu.contains(event.target)) return;
      closeMobileMenu();
    });

    window.addEventListener('resize', site.throttle(() => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeMobileMenu();
      }
    }, 150));
  }

  function initializeSmoothScrolling() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      event.preventDefault();
      scrollToSection(targetId);
    });
  }

  function initializeActiveNavigation() {
    const sections = Array.from(document.querySelectorAll(SELECTORS.section));
    if (sections.length === 0) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateActiveNavLink(entry.target.id);
          }
        });
      }, {
        rootMargin: `-${getNavigationHeight() + SCROLL_OFFSET}px 0px -55% 0px`,
        threshold: 0.1
      });

      sections.forEach((section) => observer.observe(section));
      return;
    }

    window.addEventListener('scroll', site.throttle(() => {
      const currentSection = getCurrentSection();
      if (currentSection) updateActiveNavLink(currentSection);
    }, 100));
  }

  function initializeNavbarState() {
    const navbar = document.querySelector(SELECTORS.navbar);
    if (!navbar) return;

    const updateScrolledState = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    updateScrolledState();
    window.addEventListener('scroll', site.throttle(updateScrolledState, 100));
  }

  function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
        return;
      }

      if (event.ctrlKey && event.key === 'ArrowDown') {
        event.preventDefault();
        navigateByOffset(1);
      }

      if (event.ctrlKey && event.key === 'ArrowUp') {
        event.preventDefault();
        navigateByOffset(-1);
      }
    });
  }

  function init() {
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeActiveNavigation();
    initializeNavbarState();
    initializeKeyboardNavigation();
  }

  site.navigation = {
    init,
    closeMobileMenu,
    getCurrentSection,
    getNavigationHeight,
    scrollToSection,
    updateActiveNavLink
  };
}());
