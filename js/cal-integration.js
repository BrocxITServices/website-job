/**
 * Autoreparatie Op Locatie - Cal.com Integration Module
 * Professional implementation following Cal.com official documentation
 * https://cal.com/docs/developing/guides/embeds/embed-events
 * 
 * <!-- Cal element-click embed code begins -->
<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "monteur", {origin:"https://app.cal.com"});

  
  // Important: Please add the following attributes to the element that should trigger the calendar to open upon clicking.
  // `data-cal-link="autoreparatieoplocatie/monteur"`
  // data-cal-namespace="monteur"
  // `data-cal-config='{"layout":"month_view"}'`

  Cal.ns.monteur("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
  </script>
  <!-- Cal element-click embed code ends -->
 */

class CalComIntegration {
  constructor(options = {}) {
    this.namespace = options.namespace || 'default';
    this.calLink = options.calLink || 'autoreparatieoplocatie/monteur';
    this.config = {
      layout: 'month_view',
      hideEventTypeDetails: false,
      ...options.config
    };
    
    this.initialized = false;
    this.calReady = false;
    this.init();
  }

  /**
   * Initialize Cal.com embed following official documentation
   */
  init() {
    if (this.initialized) return;
    
    // Load Cal.com embed script using official implementation
    this.loadCalScript();
    
    // Set up event listeners
    this.setupEventListeners();
    
    this.initialized = true;
    console.log('Cal.com integration initialized');
  }

  /**
   * Load Cal.com embed script using official code from documentation
   */
  loadCalScript() {
    // Official Cal.com embed loader - DO NOT MODIFY
    (function (C, A, L) { 
      let p = function (a, ar) { a.q.push(ar); }; 
      let d = C.document; 
      C.Cal = C.Cal || function () { 
        let cal = C.Cal; 
        let ar = arguments; 
        if (!cal.loaded) { 
          cal.ns = {}; 
          cal.q = cal.q || []; 
          d.head.appendChild(d.createElement("script")).src = A; 
          cal.loaded = true; 
        } 
        if (ar[0] === L) { 
          const api = function () { p(api, arguments); }; 
          const namespace = ar[1]; 
          api.q = api.q || []; 
          if(typeof namespace === "string"){
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar); 
          return;
        } 
        p(cal, ar); 
      }; 
    })(window, "https://app.cal.com/embed/embed.js", "init");

    // Initialize Cal.com with namespace - ONLY ONCE
    Cal("init", this.namespace, {origin:"https://app.cal.com"});
    
    // Preload the calendar for better performance
    Cal("preload", { calLink: this.calLink });
    
    // Configure UI settings
    Cal.ns[this.namespace]("ui", this.config);
  }

  /**
   * Set up Cal.com event listeners and prepare for interactions
   */
  setupEventListeners() {
    // Wait for Cal.com to be ready
    Cal("on", {
      action: "linkReady",
      callback: (e) => {
        console.log('Cal.com is ready');
        this.calReady = true;
        this.enhanceButtons();
      }
    });

    // Handle successful bookings
    Cal("on", {
      action: "bookingSuccessful", 
      callback: (e) => {
        console.log('Booking successful:', e.detail);
        this.onBookingSuccess(e.detail);
      }
    });

    // Handle booking failures
    Cal("on", {
      action: "linkFailed",
      callback: (e) => {
        console.error('Booking failed:', e.detail);
        this.onBookingError(e.detail);
      }
    });

    // Handle booking cancellations
    Cal("on", {
      action: "linkClosed",
      callback: (e) => {
        console.log('Booking modal closed');
        this.onBookingClosed();
      }
    });
  }

  /**
   * Enhance buttons with proper Cal.com attributes
   * This method sets up buttons correctly for Cal.com to handle automatically
   */
  enhanceButtons() {
    const buttons = document.querySelectorAll('[data-cal-trigger]');
    
    buttons.forEach(button => {
      // Get configuration from button data attributes
      const calLink = button.dataset.calLink || this.calLink;
      const calNamespace = button.dataset.calNamespace || this.namespace;
      
      // Parse custom config if provided
      let customConfig = {};
      if (button.dataset.calConfig) {
        try {
          customConfig = JSON.parse(button.dataset.calConfig);
        } catch (e) {
          console.warn('Invalid Cal config JSON:', button.dataset.calConfig);
        }
      }

      // Merge configurations
      const finalConfig = {
        ...this.config,
        ...customConfig
      };

      // Ensure proper layout for desktop
      if (window.innerWidth > 768) {
        finalConfig.layout = finalConfig.layout === 'mobile' ? 'month_view' : finalConfig.layout;
      }

      // Set the correct attributes for Cal.com to handle automatically
      button.setAttribute('data-cal-link', calLink);
      button.setAttribute('data-cal-namespace', calNamespace);
      button.setAttribute('data-cal-config', JSON.stringify(finalConfig));

      console.log('Enhanced button with Cal.com attributes:', {
        element: button,
        calLink,
        calNamespace,
        finalConfig
      });
    });
  }

  /**
   * Programmatically trigger a booking (alternative to button clicks)
   * Uses the correct Cal.com API method
   */
  triggerBooking(options = {}) {
    if (!this.calReady) {
      console.warn('Cal.com not ready yet, please wait...');
      return;
    }

    const calLink = options.calLink || this.calLink;
    const config = {
      ...this.config,
      ...options.config
    };

    // Ensure proper layout for desktop
    if (window.innerWidth > 768) {
      config.layout = config.layout === 'mobile' ? 'month_view' : config.layout;
    }

    try {
      // Use the correct Cal.com API to open booking
      Cal.ns[this.namespace]("ui", config);
      Cal.ns[this.namespace]("floatingButton", { calLink });
    } catch (error) {
      console.error('Failed to trigger Cal.com booking:', error);
      
      // Fallback: redirect to Cal.com directly
      this.fallbackToDirectLink(calLink);
    }
  }

  /**
   * Fallback method for when embed fails (e.g., due to blocked cookies)
   */
  fallbackToDirectLink(calLink) {
    const url = `https://cal.com/${calLink}`;
    console.log('Falling back to direct Cal.com link:', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Detect if third-party cookies/embeds are blocked
   */
  async detectEmbedSupport() {
    return new Promise((resolve) => {
      if (!window.Cal) {
        resolve(false);
        return;
      }

      const timeout = setTimeout(() => {
        resolve(false);
      }, 3000);

      // Test if Cal.com can initialize properly
      try {
        Cal("on", {
          action: "linkReady",
          callback: () => {
            clearTimeout(timeout);
            resolve(true);
          }
        });
      } catch (error) {
        clearTimeout(timeout);
        resolve(false);
      }
    });
  }

  /**
   * Event handlers for booking lifecycle
   */
  onBookingSuccess(details) {
    // Show success message or redirect
    console.log('Booking confirmed:', details);
    
    // Optional: Show success notification
    if (typeof window.showSuccessMessage === 'function') {
      window.showSuccessMessage('Afspraak succesvol ingepland!');
    }
  }

  onBookingError(error) {
    console.error('Booking error:', error);
    
    // Optional: Show error message
    if (typeof window.showErrorMessage === 'function') {
      window.showErrorMessage('Er is een fout opgetreden. Probeer het opnieuw of neem contact op.');
    }
  }

  onBookingClosed() {
    // Handle modal close
    console.log('User closed booking modal');
  }

  /**
   * Check if Cal.com is properly loaded and ready
   */
  isReady() {
    return this.calReady && window.Cal && window.Cal.ns && window.Cal.ns[this.namespace];
  }

  /**
   * Update configuration dynamically
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isReady()) {
      Cal.ns[this.namespace]("ui", this.config);
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Cal.com integration with production-ready settings
  window.autoServiceCal = new CalComIntegration({
    namespace: 'monteur',
    calLink: 'autoreparatieoplocatie/monteur',
    config: {
      layout: 'month_view',
      hideEventTypeDetails: false,
      styles: {
        branding: {
          brandColor: "#1e3a8a"
        }
      }
    }
  });
  
  console.log('Cal.com integration ready for production');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalComIntegration;
}