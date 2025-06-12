// ===== Main JavaScript File =====

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeNavigation();
  initializeScrollEffects();
  initializeAnimations();
  initializeContactForm();

  console.log('Profile website initialized successfully');
});

// ===== Utility Functions =====

// Throttle function for performance optimization
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Get element offset from top of document
function getOffset(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset
  };
}

// ===== Smooth Scrolling =====
function initializeScrollEffects() {
  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = getOffset(targetElement).top;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update active navigation link
        updateActiveNavLink(targetId);

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // Scroll indicator in hero section
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// Update active navigation link based on scroll position
function updateActiveNavLink(targetId) {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === targetId) {
      link.classList.add('active');
    }
  });
}

// ===== Scroll Spy =====
function initializeScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const scrollSpyThrottled = throttle(() => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = getOffset(section).top;
      const sectionHeight = section.offsetHeight;

      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, 100);

  window.addEventListener('scroll', scrollSpyThrottled);
}

// ===== Contact Form Handling =====
function initializeContactForm() {
  // Handle email link clicks
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Track email click event (for analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact', {
          'event_category': 'engagement',
          'event_label': 'email_click'
        });
      }
    });
  });

  // Handle social link clicks
  const socialLinks = document.querySelectorAll('.social-link');

  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const platform = this.classList[1]; // Get platform class name

      // Track social link click event (for analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'social_click', {
          'event_category': 'engagement',
          'event_label': platform
        });
      }
    });
  });
}

// ===== Performance Monitoring =====
function initializePerformanceMonitoring() {
  // Monitor page load performance
  window.addEventListener('load', function() {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

      console.log(`Page load time: ${loadTime}ms`);

      // Track performance metrics (for analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          'name': 'load',
          'value': Math.round(loadTime)
        });
      }
    }
  });
}

// ===== Error Handling =====
function initializeErrorHandling() {
  window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);

    // Track errors (for analytics)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        'description': e.error.toString(),
        'fatal': false
      });
    }
  });
}

// ===== Accessibility Enhancements =====
function initializeAccessibility() {
  // Add keyboard navigation support
  document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
      closeMobileMenu();
    }

    // Enter key activates buttons
    if (e.key === 'Enter' && e.target.classList.contains('nav-toggle')) {
      e.target.click();
    }
  });

  // Add focus indicators for keyboard navigation
  const focusableElements = document.querySelectorAll('a, button, [tabindex]');

  focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
      this.style.outline = '2px solid var(--primary-color)';
      this.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', function() {
      this.style.outline = '';
      this.style.outlineOffset = '';
    });
  });
}

// ===== Close Mobile Menu =====
function closeMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  const navToggle = document.querySelector('.nav-toggle');

  if (navMenu && navToggle) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
  }
}

// ===== Initialize All Features =====
function initializeAllFeatures() {
  initializeScrollSpy();
  initializePerformanceMonitoring();
  initializeErrorHandling();
  initializeAccessibility();
}

// Initialize additional features after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAllFeatures);

// ===== Export functions for use in other files =====
window.ProfileWebsite = {
  throttle,
  debounce,
  isInViewport,
  getOffset,
  updateActiveNavLink,
  closeMobileMenu
};
