/**
 * AutoService Pro - Utility Functions
 * Helper functies, formatting en storage handlers
 */

// Utility object containing all helper functions
const AutoServiceUtils = {

  // Date Formatting Functions
  dateUtils: {
    /**
     * Format date to Dutch locale
     * @param {Date|string} date - Date to format
     * @param {string} format - Format type: 'short', 'long', 'full'
     * @returns {string} Formatted date string
     */
    formatDate(date, format = 'long') {
      const d = typeof date === 'string' ? new Date(date) : date;
      
      const options = {
        short: { day: 'numeric', month: 'numeric', year: 'numeric' },
        long: { day: 'numeric', month: 'long', year: 'numeric' },
        full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
      };

      return d.toLocaleDateString('nl-NL', options[format] || options.long);
    },

    /**
     * Format time to Dutch locale
     * @param {Date|string} time - Time to format
     * @returns {string} Formatted time string
     */
    formatTime(time) {
      const t = typeof time === 'string' ? new Date(time) : time;
      return t.toLocaleTimeString('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },

    /**
     * Get relative time (e.g., "2 dagen geleden")
     * @param {Date|string} date - Date to compare
     * @returns {string} Relative time string
     */
    getRelativeTime(date) {
      const d = typeof date === 'string' ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now - d) / 1000);

      const intervals = {
        jaar: 31536000,
        maand: 2592000,
        week: 604800,
        dag: 86400,
        uur: 3600,
        minuut: 60
      };

      for (const [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
          return `${interval} ${unit}${interval > 1 ? (unit === 'maand' ? 'en' : 'en') : ''} geleden`;
        }
      }

      return 'zojuist';
    },

    /**
     * Check if date is in business hours
     * @param {Date} date - Date to check
     * @returns {boolean} True if in business hours
     */
    isBusinessHours(date = new Date()) {
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      const hour = date.getHours();
      
      // Monday to Friday, 8 AM to 6 PM
      return day >= 1 && day <= 5 && hour >= 8 && hour < 18;
    },

    /**
     * Get next business day
     * @param {Date} startDate - Starting date
     * @returns {Date} Next business day
     */
    getNextBusinessDay(startDate = new Date()) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + 1);
      
      while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
      }
      
      return date;
    }
  },

  // Phone Number Formatting
  phoneUtils: {
    /**
     * Format Dutch phone number
     * @param {string} phone - Phone number to format
     * @returns {string} Formatted phone number
     */
    formatDutchPhone(phone) {
      // Remove all non-digits
      const cleaned = phone.replace(/\D/g, '');
      
      // Handle different formats
      if (cleaned.startsWith('31')) {
        // International format
        if (cleaned.length === 11 && cleaned[2] === '6') {
          // Mobile: +31 6 1234 5678
          return `+31 6 ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
        } else if (cleaned.length >= 10) {
          // Landline: +31 20 123 4567
          return `+31 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
        }
      } else if (cleaned.startsWith('06')) {
        // Mobile: 06 1234 5678
        return `06 ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
      } else if (cleaned.startsWith('0') && cleaned.length >= 9) {
        // Landline: 020 123 4567
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      }
      
      return phone; // Return original if no format matches
    },

    /**
     * Validate Dutch phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid
     */
    isValidDutchPhone(phone) {
      const cleaned = phone.replace(/\D/g, '');
      const mobileRegex = /^(31|0)6[0-9]{8}$/;
      const landlineRegex = /^(31|0)[1-9][0-9]{7,8}$/;
      return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
    },

    /**
     * Get phone type (mobile/landline)
     * @param {string} phone - Phone number to check
     * @returns {string} 'mobile', 'landline', or 'unknown'
     */
    getPhoneType(phone) {
      const cleaned = phone.replace(/\D/g, '');
      
      if (/^(31|0)6[0-9]{8}$/.test(cleaned)) {
        return 'mobile';
      } else if (/^(31|0)[1-9][0-9]{7,8}$/.test(cleaned)) {
        return 'landline';
      }
      
      return 'unknown';
    }
  },

  // Local Storage Handlers
  storage: {
    /**
     * Set item in localStorage with expiration
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @param {number} hoursToExpire - Hours until expiration (default: 24)
     */
    setWithExpiry(key, value, hoursToExpire = 24) {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + (hoursToExpire * 60 * 60 * 1000)
      };
      localStorage.setItem(`autoservice_${key}`, JSON.stringify(item));
    },

    /**
     * Get item from localStorage with expiration check
     * @param {string} key - Storage key
     * @returns {any} Stored value or null if expired/not found
     */
    getWithExpiry(key) {
      const itemStr = localStorage.getItem(`autoservice_${key}`);
      
      if (!itemStr) {
        return null;
      }

      try {
        const item = JSON.parse(itemStr);
        const now = new Date();
        
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(`autoservice_${key}`);
          return null;
        }
        
        return item.value;
      } catch (error) {
        console.error('Error parsing stored item:', error);
        localStorage.removeItem(`autoservice_${key}`);
        return null;
      }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
      localStorage.removeItem(`autoservice_${key}`);
    },

    /**
     * Clear all AutoService data from localStorage
     */
    clearAll() {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('autoservice_')) {
          localStorage.removeItem(key);
        }
      });
    },

    /**
     * Save form data temporarily
     * @param {string} formId - Form identifier
     * @param {object} data - Form data
     */
    saveFormData(formId, data) {
      this.setWithExpiry(`form_${formId}`, data, 1); // 1 hour expiry
    },

    /**
     * Get saved form data
     * @param {string} formId - Form identifier
     * @returns {object|null} Form data or null
     */
    getFormData(formId) {
      return this.getWithExpiry(`form_${formId}`);
    }
  },

  // Analytics and Tracking
  analytics: {
    /**
     * Track page view
     * @param {string} pageName - Page name
     * @param {object} additionalData - Additional tracking data
     */
    trackPageView(pageName, additionalData = {}) {
      const data = {
        page: pageName,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        ...additionalData
      };

      // Send to analytics service (replace with actual implementation)
      this.sendAnalyticsEvent('page_view', data);
    },

    /**
     * Track user interaction
     * @param {string} action - Action name
     * @param {string} category - Event category
     * @param {string} label - Event label
     * @param {number} value - Event value
     */
    trackEvent(action, category = 'interaction', label = '', value = 0) {
      const data = {
        action,
        category,
        label,
        value,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      };

      this.sendAnalyticsEvent('user_interaction', data);
    },

    /**
     * Track form submission
     * @param {string} formName - Form name
     * @param {boolean} success - Whether submission was successful
     * @param {object} additionalData - Additional data
     */
    trackFormSubmission(formName, success, additionalData = {}) {
      const data = {
        form: formName,
        success,
        timestamp: new Date().toISOString(),
        ...additionalData
      };

      this.sendAnalyticsEvent('form_submission', data);
    },

    /**
     * Send analytics event
     * @param {string} eventType - Event type
     * @param {object} data - Event data
     */
    sendAnalyticsEvent(eventType, data) {
      // Check if user has consented to analytics
      const consent = localStorage.getItem('autoservice-cookie-consent');
      if (consent !== 'accepted') {
        return;
      }

      // Send to Google Analytics (replace with actual implementation)
      if (typeof gtag !== 'undefined') {
        gtag('event', eventType, data);
      }

      // Send to custom analytics endpoint
      if (this.isAnalyticsEnabled()) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ eventType, data })
        }).catch(error => {
          console.error('Analytics error:', error);
        });
      }

      // Store locally for debugging
      if (window.location.hostname === 'localhost') {
        console.log('Analytics Event:', eventType, data);
      }
    },

    /**
     * Check if analytics is enabled
     * @returns {boolean} True if enabled
     */
    isAnalyticsEnabled() {
      return localStorage.getItem('autoservice-cookie-consent') === 'accepted';
    }
  },

  // Validation Utilities
  validation: {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    /**
     * Validate Dutch postal code
     * @param {string} postalCode - Postal code to validate
     * @returns {boolean} True if valid
     */
    isValidDutchPostalCode(postalCode) {
      const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
      const regex = /^[1-9][0-9]{3}[A-Z]{2}$/;
      return regex.test(cleaned);
    },

    /**
     * Validate license plate (Dutch)
     * @param {string} licensePlate - License plate to validate
     * @returns {boolean} True if valid
     */
    isValidDutchLicensePlate(licensePlate) {
      const cleaned = licensePlate.replace(/[\s-]/g, '').toUpperCase();
      
      // Dutch license plate patterns
      const patterns = [
        /^[A-Z]{2}[0-9]{2}[A-Z]{2}$/, // XX-99-XX
        /^[0-9]{2}[A-Z]{2}[0-9]{2}$/, // 99-XX-99
        /^[0-9]{2}[A-Z]{3}[0-9]$/,    // 99-XXX-9
        /^[A-Z]{2}[0-9]{3}[A-Z]$/,    // XX-999-X
        /^[A-Z]{3}[0-9]{2}[A-Z]$/,    // XXX-99-X
        /^[0-9][A-Z]{3}[0-9]{2}$/     // 9-XXX-99
      ];

      return patterns.some(pattern => pattern.test(cleaned));
    },

    /**
     * Sanitize HTML input
     * @param {string} input - Input to sanitize
     * @returns {string} Sanitized input
     */
    sanitizeHtml(input) {
      const div = document.createElement('div');
      div.textContent = input;
      return div.innerHTML;
    }
  },

  // Performance Utilities
  performance: {
    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
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
    },

    /**
     * Measure performance of a function
     * @param {Function} func - Function to measure
     * @param {string} label - Label for measurement
     * @returns {any} Function result
     */
    measure(func, label = 'Performance') {
      const start = performance.now();
      const result = func();
      const end = performance.now();
      console.log(`${label}: ${end - start} milliseconds`);
      return result;
    }
  },

  // DOM Utilities
  dom: {
    /**
     * Wait for element to exist
     * @param {string} selector - CSS selector
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<Element>} Promise resolving to element
     */
    waitForElement(selector, timeout = 5000) {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        const observer = new MutationObserver(() => {
          const element = document.querySelector(selector);
          if (element) {
            observer.disconnect();
            resolve(element);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
      });
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} True if in viewport
     */
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    /**
     * Scroll element into view smoothly
     * @param {Element|string} element - Element or selector
     * @param {object} options - Scroll options
     */
    smoothScrollTo(element, options = {}) {
      const el = typeof element === 'string' ? document.querySelector(element) : element;
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          ...options
        });
      }
    }
  },

  // Error Handling
  error: {
    /**
     * Log error with context
     * @param {Error} error - Error object
     * @param {object} context - Additional context
     */
    logError(error, context = {}) {
      const errorData = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context
      };

      console.error('AutoService Error:', errorData);

      // Send to error reporting service
      if (this.isErrorReportingEnabled()) {
        this.sendErrorReport(errorData);
      }
    },

    /**
     * Send error report to service
     * @param {object} errorData - Error data
     */
    sendErrorReport(errorData) {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      }).catch(() => {
        // Silently fail error reporting
      });
    },

    /**
     * Check if error reporting is enabled
     * @returns {boolean} True if enabled
     */
    isErrorReportingEnabled() {
      return localStorage.getItem('autoservice-cookie-consent') === 'accepted';
    }
  }
};

// Make utilities globally available
window.AutoServiceUtils = AutoServiceUtils;

// Initialize utilities when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Track page view
  AutoServiceUtils.analytics.trackPageView(document.title);
  
  // Set up global error handler
  window.addEventListener('error', (event) => {
    AutoServiceUtils.error.logError(event.error, {
      type: 'global_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Set up unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    AutoServiceUtils.error.logError(new Error(event.reason), {
      type: 'unhandled_promise_rejection'
    });
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutoServiceUtils;
}