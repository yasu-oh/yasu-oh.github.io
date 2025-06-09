// ===== Navigation Controller =====

// Initialize navigation functionality
function initializeNavigation() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupActiveNavigation();

    console.log('Navigation initialized');
}

// ===== Mobile Menu =====
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Toggle aria-expanded for accessibility
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);

        // Prevent body scroll when menu is open
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ===== Smooth Scrolling =====
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without triggering scroll
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

// ===== Active Navigation =====
function setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    // Create intersection observer for active navigation
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveNavLink(sectionId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Fallback scroll-based active navigation
    const scrollHandler = ProfileWebsite.throttle(() => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            updateActiveNavLink(current);
        }
    }, 100);

    window.addEventListener('scroll', scrollHandler);
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// ===== Navigation Utilities =====

// Get current section based on scroll position
function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop;

        if (scrollPosition >= sectionTop) {
            return section.getAttribute('id');
        }
    }

    return null;
}

// Scroll to specific section
function scrollToSection(sectionId, offset = 0) {
    const targetElement = document.querySelector(`#${sectionId}`);

    if (targetElement) {
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - headerHeight - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        return true;
    }

    return false;
}

// Check if navigation is mobile
function isMobileNavigation() {
    return window.innerWidth <= 768;
}

// Get navigation height
function getNavigationHeight() {
    const navbar = document.querySelector('.navbar');
    return navbar ? navbar.offsetHeight : 0;
}

// ===== Keyboard Navigation =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');

            if (navToggle && navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }

        // Arrow keys for section navigation
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            navigateToNextSection();
        }

        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            navigateToPreviousSection();
        }
    });
}

// Navigate to next section
function navigateToNextSection() {
    const sections = document.querySelectorAll('section[id]');
    const currentSection = getCurrentSection();

    if (!currentSection || sections.length === 0) return;

    const currentIndex = Array.from(sections).findIndex(
        section => section.getAttribute('id') === currentSection
    );

    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        scrollToSection(nextSection.getAttribute('id'));
    }
}

// Navigate to previous section
function navigateToPreviousSection() {
    const sections = document.querySelectorAll('section[id]');
    const currentSection = getCurrentSection();

    if (!currentSection || sections.length === 0) return;

    const currentIndex = Array.from(sections).findIndex(
        section => section.getAttribute('id') === currentSection
    );

    if (currentIndex > 0) {
        const previousSection = sections[currentIndex - 1];
        scrollToSection(previousSection.getAttribute('id'));
    }
}

// ===== Navigation State Management =====
class NavigationState {
    constructor() {
        this.currentSection = null;
        this.isMenuOpen = false;
        this.scrollPosition = 0;
    }

    updateCurrentSection(sectionId) {
        this.currentSection = sectionId;
        this.notifyStateChange();
    }

    updateMenuState(isOpen) {
        this.isMenuOpen = isOpen;
        this.notifyStateChange();
    }

    updateScrollPosition(position) {
        this.scrollPosition = position;
        this.notifyStateChange();
    }

    notifyStateChange() {
        // Dispatch custom event for state changes
        const event = new CustomEvent('navigationStateChange', {
            detail: {
                currentSection: this.currentSection,
                isMenuOpen: this.isMenuOpen,
                scrollPosition: this.scrollPosition
            }
        });

        document.dispatchEvent(event);
    }
}

// Create global navigation state
const navigationState = new NavigationState();

// ===== Initialize Keyboard Navigation =====
document.addEventListener('DOMContentLoaded', function() {
    setupKeyboardNavigation();
});

// ===== Export Navigation Functions =====
window.ProfileWebsite.navigation = {
    scrollToSection,
    getCurrentSection,
    isMobileNavigation,
    getNavigationHeight,
    navigateToNextSection,
    navigateToPreviousSection,
    navigationState
};
