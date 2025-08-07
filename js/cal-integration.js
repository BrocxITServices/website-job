/**
 * AutoService Pro - Cal.com Integration Module
 * Easy-to-use Cal.com booking integration with click handlers
 * Based on Cal.com embed example
 */

class CalComIntegration {
  constructor(options = {}) {
    this.namespace = options.namespace || 'ochtend';
    this.calLink = options.calLink || 'fsdf233/ochtend';
    this.config = {
      layout: 'month_view',
      hideEventTypeDetails: false,
      ...options.config
    };
    
    this.initialized = false;
    this.init();
  }

  /**
   * Initialize Cal.com embed script exactly as in the example
   */
  init() {
    if (this.initialized) return;
    
    // Load Cal.com embed script with exact implementation from example
    this.loadCalScript();
    
    // Bind click handlers
    this.bindClickHandlers();
    
    this.initialized = true;
    console.log('Cal.com integration initialized with namespace:', this.namespace);
  }

  /**
   * Load Cal.com embed script using exact code from example
   */
  loadCalScript() {
    // Exact Cal.com embed code from example
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

    // Initialize Cal with namespace from example
    Cal("init", this.namespace, {origin:"https://app.cal.com"});
    
    // Configure UI settings
    Cal.ns[this.namespace]("ui", this.config);
  }

  /**
   * Bind click handlers to elements with Cal.com attributes
   */
  bindClickHandlers() {
    // Look for elements with data-cal-trigger attribute
    document.addEventListener('click', (event) => {
      const element = event.target.closest('[data-cal-trigger]');
      if (element) {
        event.preventDefault();
        this.openBooking(element);
      }
    });
  }

  /**
   * Open Cal.com booking modal by setting correct attributes
   */
  openBooking(element) {
    console.log('Opening Cal.com booking for element:', element);
    
    // Check if we're in local development (localhost or file://)
    const isLocalDev = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.protocol === 'file:' ||
                      window.location.hostname === '';
    
    if (isLocalDev) {
      console.warn('Fake opening cal popup - local development mode');
      return;
    }
    
    // Get cal link from element or use default
    const calLink = element.dataset.calLink || this.calLink;
    const calNamespace = element.dataset.calNamespace || this.namespace;
    
    // Get custom config if provided
    let customConfig = {};
    if (element.dataset.calConfig) {
      try {
        customConfig = JSON.parse(element.dataset.calConfig);
      } catch (e) {
        console.warn('Invalid Cal config JSON:', element.dataset.calConfig);
      }
    }

    // Set the required attributes as per Cal.com example
    element.setAttribute('data-cal-link', calLink);
    element.setAttribute('data-cal-namespace', calNamespace);
    
    // Merge and set config - ensure not fullscreen on desktop
    const finalConfig = {
      ...this.config, 
      ...customConfig,
      // Prevent fullscreen on desktop devices
      layout: customConfig.layout || this.config.layout || 'month_view'
    };
    
    // Detect if desktop (screen width > 768px) and ensure popup mode
    if (window.innerWidth > 768) {
      finalConfig.layout = finalConfig.layout === 'mobile' ? 'month_view' : finalConfig.layout;
    }
    
    element.setAttribute('data-cal-config', JSON.stringify(finalConfig));

    console.log('Cal.com attributes set:', {
      calLink,
      calNamespace,
      finalConfig
    });

    // Cal.com should automatically handle clicks on elements with these attributes
    // If it doesn't work, we might need to manually trigger the click event
    if (window.Cal && window.Cal.ns && window.Cal.ns[calNamespace]) {
      // Try to programmatically open the booking
      try {
        const clickEvent = new Event('click', { bubbles: true });
        element.dispatchEvent(clickEvent);
      } catch (e) {
        console.warn('Could not programmatically trigger Cal.com:', e);
      }
    }
  }

  /**
   * Manually trigger booking (for programmatic use)
   */
  triggerBooking(options = {}) {
    // Check if we're in local development
    const isLocalDev = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.protocol === 'file:' ||
                      window.location.hostname === '';
    
    if (isLocalDev) {
      console.warn('Fake opening cal popup - local development mode');
      return;
    }
    
    const calLink = options.calLink || this.calLink;
    const calNamespace = options.namespace || this.namespace;
    
    // Create a temporary element with the correct attributes
    const tempElement = document.createElement('div');
    tempElement.setAttribute('data-cal-link', calLink);
    tempElement.setAttribute('data-cal-namespace', calNamespace);
    
    let config = options.config || this.config;
    
    // Ensure not fullscreen on desktop
    if (window.innerWidth > 768) {
      config = {
        ...config,
        layout: config.layout === 'mobile' ? 'month_view' : config.layout
      };
    }
    
    tempElement.setAttribute('data-cal-config', JSON.stringify(config));
    
    // Add to document temporarily
    document.body.appendChild(tempElement);
    
    // Trigger click
    const clickEvent = new Event('click', { bubbles: true });
    tempElement.dispatchEvent(clickEvent);
    
    // Remove from document
    setTimeout(() => {
      if (tempElement.parentNode) {
        document.body.removeChild(tempElement);
      }
    }, 100);
  }

  /**
   * Update default configuration
   */
  updateConfig(newConfig) {
    this.config = {...this.config, ...newConfig};
    if (this.initialized && window.Cal && window.Cal.ns && window.Cal.ns[this.namespace]) {
      Cal.ns[this.namespace]("ui", this.config);
    }
  }

  /**
   * Check if Cal.com is properly loaded and ready
   */
  isReady() {
    return this.initialized && window.Cal && window.Cal.ns && window.Cal.ns[this.namespace];
  }
}

// Auto-initialize with default settings when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize with settings from the example
  window.autoServiceCal = new CalComIntegration({
    namespace: 'ochtend',
    calLink: 'fsdf233/ochtend',
    config: {
      layout: 'month_view',
      hideEventTypeDetails: false
    }
  });
  
  console.log('Cal.com integration ready');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalComIntegration;
}