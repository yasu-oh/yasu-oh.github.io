// ===== Animation Controller =====

// Intersection Observer for scroll animations
let animationObserver;

// Initialize animations
function initializeAnimations() {
  setupIntersectionObserver();
  setupScrollAnimations();
  setupHoverAnimations();
  setupLoadAnimations();

  console.log('Animations initialized');
}

// ===== Intersection Observer Setup =====
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateElement(entry.target);
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  const animatableElements = document.querySelectorAll(
    '.animate-on-scroll, .fade-in-section, .stagger-animation, ' +
    '.expertise-card, .achievement-card, .publication-card, .value-card'
  );

  animatableElements.forEach(element => {
    animationObserver.observe(element);
  });
}

// ===== Element Animation =====
function animateElement(element) {
  // Add animation class based on element type
  if (element.classList.contains('animate-on-scroll')) {
    element.classList.add('animate');
  }

  if (element.classList.contains('fade-in-section')) {
    element.classList.add('is-visible');
  }

  if (element.classList.contains('stagger-animation')) {
    element.classList.add('animate');
  }

  // Animate cards with staggered delay
  if (element.classList.contains('expertise-card') ||
    element.classList.contains('achievement-card') ||
    element.classList.contains('publication-card')) {

    const cards = element.parentElement.children;
    const index = Array.from(cards).indexOf(element);

    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  }

  // Animate value cards
  if (element.classList.contains('value-card')) {
    const cards = element.parentElement.children;
    const index = Array.from(cards).indexOf(element);

    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) scale(1)';
    }, index * 200);
  }
}

// ===== Scroll Animations =====
function setupScrollAnimations() {
  // Parallax effect for hero background
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', ProfileWebsite.throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    }, 10));
  }

  // Navbar background change on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', ProfileWebsite.throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 10));
  }

  // Progress indicator (optional)
  createProgressIndicator();
}

// ===== Progress Indicator =====
function createProgressIndicator() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    z-index: 9999;
    transition: width 0.1s ease;
  `;

  document.body.appendChild(progressBar);

  window.addEventListener('scroll', ProfileWebsite.throttle(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = scrollPercent + '%';
  }, 10));
}

// ===== Hover Animations =====
function setupHoverAnimations() {
  // Add hover effects to cards
  const cards = document.querySelectorAll(
    '.expertise-card, .achievement-card, .publication-card, .value-card, .social-link'
  );

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      this.style.transition = 'all 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Button hover effects
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = 'var(--shadow-large)';
    });

    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

// ===== Load Animations =====
function setupLoadAnimations() {
  // Hero section entrance animation
  const heroElements = [
    '.hero-avatar',
    '.hero-title',
    '.hero-subtitle',
    '.hero-badges',
    '.hero-description',
    '.hero-buttons',
    '.scroll-indicator'
  ];

  heroElements.forEach((selector, index) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';

      setTimeout(() => {
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 200 + (index * 100));
    }
  });

  // Navigation entrance animation
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      navbar.style.transition = 'transform 0.6s ease';
      navbar.style.transform = 'translateY(0)';
    }, 100);
  }
}

// ===== Typing Animation =====
function createTypingAnimation(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';

  function typeWriter() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();
}

// ===== Counter Animation =====
function animateCounter(element, start, end, duration = 2000) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.floor(current);

    if (current >= end) {
      element.textContent = end;
      clearInterval(timer);
    }
  }, 16);
}

// ===== Particle Animation (Optional) =====
function createParticleAnimation(container) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';

  container.appendChild(canvas);

  function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ===== Animation Utilities =====
function fadeIn(element, duration = 300) {
  element.style.opacity = '0';
  element.style.display = 'block';

  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    element.style.opacity = Math.min(progress / duration, 1);

    if (progress < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function fadeOut(element, duration = 300) {
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    element.style.opacity = Math.max(1 - (progress / duration), 0);

    if (progress < duration) {
      requestAnimationFrame(step);
    } else {
      element.style.display = 'none';
    }
  }

  requestAnimationFrame(step);
}

function slideDown(element, duration = 300) {
  element.style.height = '0';
  element.style.overflow = 'hidden';
  element.style.display = 'block';

  const targetHeight = element.scrollHeight;
  let start = null;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    element.style.height = Math.min((progress / duration) * targetHeight, targetHeight) + 'px';

    if (progress < duration) {
      requestAnimationFrame(step);
    } else {
      element.style.height = '';
      element.style.overflow = '';
    }
  }

  requestAnimationFrame(step);
}

// ===== Export Animation Functions =====
window.ProfileWebsite.animations = {
  createTypingAnimation,
  animateCounter,
  createParticleAnimation,
  fadeIn,
  fadeOut,
  slideDown
};
