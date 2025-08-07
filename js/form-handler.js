/**
 * AutoService Pro - Form Handler
 * Contact formulier verwerking en validatie
 */

class FormHandler {
  constructor() {
    this.forms = {};
    this.isSubmitting = false;
    this.recaptchaLoaded = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupRecaptcha();
  }

  bindEvents() {
    // Contact forms
    document.querySelectorAll('.contact-form').forEach(form => {
      form.addEventListener('submit', (e) => this.handleContactForm(e));
    });

    // Newsletter forms
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => this.handleNewsletterForm(e));
    });

    // Real-time validation
    document.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', (e) => this.validateField(e.target));
      field.addEventListener('input', (e) => this.clearFieldError(e.target));
    });
  }

  // Contact Form Handler
  async handleContactForm(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate form
    if (!this.validateContactForm(data)) {
      this.showMessage('error', 'Controleer de ingevoerde gegevens en probeer opnieuw.');
      return;
    }

    this.isSubmitting = true;
    this.showLoadingState(form, true);

    try {
      // Simulate API call (replace with actual endpoint)
      const response = await this.submitContactForm(data);
      
      if (response.success) {
        this.showMessage('success', 'Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact met u op.');
        form.reset();
        this.clearFormErrors(form);
      } else {
        throw new Error(response.message || 'Er is een fout opgetreden');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage('error', 'Er is een fout opgetreden. Probeer het later opnieuw of bel ons direct.');
    } finally {
      this.isSubmitting = false;
      this.showLoadingState(form, false);
    }
  }

  // Newsletter Form Handler
  async handleNewsletterForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;

    if (!this.validateEmail(email)) {
      this.showMessage('error', 'Voer een geldig e-mailadres in.');
      return;
    }

    this.showLoadingState(form, true);

    try {
      const response = await this.submitNewsletter(email);
      
      if (response.success) {
        this.showMessage('success', 'Bedankt voor uw aanmelding!');
        form.reset();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Newsletter submission error:', error);
      this.showMessage('error', 'Er is een fout opgetreden bij de aanmelding.');
    } finally {
      this.showLoadingState(form, false);
    }
  }

  // Form Validation
  validateContactForm(data) {
    let isValid = true;
    const errors = {};

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Naam is verplicht (minimaal 2 karakters)';
      isValid = false;
    }

    // Email validation
    if (!data.email || !this.validateEmail(data.email)) {
      errors.email = 'Geldig e-mailadres is verplicht';
      isValid = false;
    }

    // Phone validation (Dutch format)
    if (data.phone && !this.validateDutchPhone(data.phone)) {
      errors.phone = 'Voer een geldig Nederlands telefoonnummer in';
      isValid = false;
    }

    // Message validation
    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Bericht is verplicht (minimaal 10 karakters)';
      isValid = false;
    }

    // Subject validation (if present)
    if (data.subject && data.subject.trim().length < 3) {
      errors.subject = 'Onderwerp moet minimaal 3 karakters bevatten';
      isValid = false;
    }

    // Display errors
    this.displayFormErrors(errors);

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'name':
        if (value.length < 2) {
          errorMessage = 'Naam moet minimaal 2 karakters bevatten';
          isValid = false;
        }
        break;

      case 'email':
        if (!this.validateEmail(value)) {
          errorMessage = 'Voer een geldig e-mailadres in';
          isValid = false;
        }
        break;

      case 'phone':
        if (value && !this.validateDutchPhone(value)) {
          errorMessage = 'Voer een geldig Nederlands telefoonnummer in';
          isValid = false;
        }
        break;

      case 'message':
        if (value.length < 10) {
          errorMessage = 'Bericht moet minimaal 10 karakters bevatten';
          isValid = false;
        }
        break;
    }

    this.displayFieldError(field, errorMessage);
    return isValid;
  }

  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Dutch phone number validation
  validateDutchPhone(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Dutch mobile: starts with 06, landline: various patterns
    const mobileRegex = /^(31|0)6[0-9]{8}$/;
    const landlineRegex = /^(31|0)[1-9][0-9]{7,8}$/;
    
    return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
  }

  // Error Display Functions
  displayFormErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
      const field = document.querySelector(`[name="${fieldName}"]`);
      if (field) {
        this.displayFieldError(field, errors[fieldName]);
      }
    });
  }

  displayFieldError(field, message) {
    // Remove existing error
    this.clearFieldError(field);

    if (message) {
      field.classList.add('is-danger');
      
      // Create error element
      const errorElement = document.createElement('p');
      errorElement.className = 'help is-danger';
      errorElement.textContent = message;
      
      // Insert after field
      field.parentNode.appendChild(errorElement);
    }
  }

  clearFieldError(field) {
    field.classList.remove('is-danger');
    const errorElement = field.parentNode.querySelector('.help.is-danger');
    if (errorElement) {
      errorElement.remove();
    }
  }

  clearFormErrors(form) {
    form.querySelectorAll('.is-danger').forEach(el => {
      el.classList.remove('is-danger');
    });
    form.querySelectorAll('.help.is-danger').forEach(el => {
      el.remove();
    });
  }

  // API Submission Functions
  async submitContactForm(data) {
    // Mock API response - replace with actual endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        const success = Math.random() > 0.1; // 90% success rate
        resolve({
          success: success,
          message: success ? 'Message sent successfully' : 'Server error occurred'
        });
      }, 1500);
    });
  }

  async submitNewsletter(email) {
    // Mock API response - replace with actual endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Newsletter subscription successful'
        });
      }, 1000);
    });
  }

  // UI Helper Functions
  showLoadingState(form, isLoading) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      if (isLoading) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      } else {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    }
  }

  showMessage(type, message) {
    // Remove existing messages
    document.querySelectorAll('.form-message').forEach(el => el.remove());

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `notification is-${type === 'success' ? 'success' : 'danger'} form-message`;
    messageEl.innerHTML = `
      <button class="delete"></button>
      ${message}
    `;

    // Insert at top of page
    document.body.insertBefore(messageEl, document.body.firstChild);

    // Handle close button
    messageEl.querySelector('.delete').addEventListener('click', () => {
      messageEl.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 5000);

    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // reCAPTCHA Setup
  setupRecaptcha() {
    // This would load reCAPTCHA if needed
    // For now, it's just a placeholder
    if (window.grecaptcha) {
      this.recaptchaLoaded = true;
    }
  }

  // Get reCAPTCHA token
  async getRecaptchaToken() {
    if (!this.recaptchaLoaded || !window.grecaptcha) {
      return null;
    }

    try {
      const token = await grecaptcha.execute('YOUR_SITE_KEY', { action: 'contact_form' });
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return null;
    }
  }
}

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FormHandler();
});