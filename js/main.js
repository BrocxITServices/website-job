/**
 * Autoreparatie Op Locatie - Main JavaScript
 * Vue.js app initialisatie en algemene functionaliteiten
 */

// Vue.js App Initialisatie
const { createApp } = Vue;

const AutoServiceApp = createApp({
  data() {
    return {
      // Mobile menu toggle
      mobileMenuOpen: false,
      
      // Back to top button
      showBackToTop: false,
      
      // Cookie consent
      showCookieConsent: false,
      
      // WhatsApp widget
      whatsappVisible: true,
      
      // Loading states
      isLoading: false
    }
  },
  mounted() {
    this.initializeApp();
  },
  methods: {
    // Initialize all app functionality
    initializeApp() {
      this.setupScrollListeners();
      this.setupSmoothScrolling();
      this.initializeScrollReveal();
      this.checkCookieConsent();
      this.initializeWhatsAppWidget();
    },

    // Mobile menu toggle
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      document.body.classList.toggle('menu-open', this.mobileMenuOpen);
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
      document.body.classList.remove('menu-open');
    },

    // Scroll event handlers
    setupScrollListeners() {
      window.addEventListener('scroll', this.throttle(() => {
        this.handleScroll();
      }, 100));
    },

    handleScroll() {
      const scrollY = window.scrollY;
      
      // Back to top button visibility
      this.showBackToTop = scrollY > 300;
      
      // Navbar background on scroll
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        navbar.classList.toggle('scrolled', scrollY > 50);
      }
    },

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    },

    // Back to top functionality
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },

    // Scroll Reveal Animations
    initializeScrollReveal() {
      if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
          origin: 'bottom',
          distance: '20px',
          duration: 800,
          delay: 200,
          opacity: 0,
          easing: 'ease-out',
          reset: false
        });

        // Animate different elements
        sr.reveal('.hero-content', { delay: 300 });
        sr.reveal('.service-card', { interval: 200 });
        sr.reveal('.feature-card', { interval: 150 });
        sr.reveal('.testimonial-card', { interval: 250 });
        sr.reveal('.contact-form', { delay: 400 });
        sr.reveal('.stats-item', { interval: 100 });
      }
    },

    // Cookie Consent
    checkCookieConsent() {
      const consent = localStorage.getItem('autoservice-cookie-consent');
      if (!consent) {
        this.showCookieConsent = true;
      }
    },

    acceptCookies() {
      localStorage.setItem('autoservice-cookie-consent', 'accepted');
      this.showCookieConsent = false;
      this.initializeAnalytics();
    },

    declineCookies() {
      localStorage.setItem('autoservice-cookie-consent', 'declined');
      this.showCookieConsent = false;
    },

    // WhatsApp Widget
    initializeWhatsAppWidget() {
      // Show after 3 seconds
      setTimeout(() => {
        this.whatsappVisible = true;
      }, 3000);
    },

    openWhatsApp() {
      // Use primary phone from SiteConfig since WhatsApp number is still TODO
      const phoneNumber = SiteConfig.contact.phone.primary.href.replace(/\D/g, '');
      const message = encodeURIComponent('Hallo! Ik heb een vraag over jullie autoservice diensten.');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    },

    // Analytics initialization
    initializeAnalytics() {
      // Google Analytics or other tracking code would go here
      console.log('Analytics initialized');
    },

    // Utility function - throttle
    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      }
    }
  }
});

// Mount the Vue app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  AutoServiceApp.mount('#app');
});

// Additional global functionality that doesn't need Vue
document.addEventListener('DOMContentLoaded', () => {
  
  // Loading screen
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    });
  }

  // Lazy loading images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // External links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
});