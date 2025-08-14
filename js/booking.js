/**
 * Autoreparatie Op Locatie - Booking System
 * Afspraak systeem logica en form wizard
 */

class BookingSystem {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.bookingData = {};
    this.availableSlots = [];
    this.selectedSlot = null;
    this.isLoading = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.generateTimeSlots();
    this.loadAvailableSlots();
  }

  bindEvents() {
    // Form wizard navigation
    document.querySelectorAll('.step-next').forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });

    document.querySelectorAll('.step-prev').forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });

    // Service selection
    document.querySelectorAll('.service-option').forEach(option => {
      option.addEventListener('click', (e) => this.selectService(e));
    });

    // Date picker
    const datePicker = document.getElementById('booking-date');
    if (datePicker) {
      datePicker.addEventListener('change', (e) => this.onDateChange(e));
    }

    // Time slot selection
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('time-slot')) {
        this.selectTimeSlot(e.target);
      }
    });

    // Final booking submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => this.submitBooking(e));
    }

    // Vehicle type selection
    document.querySelectorAll('input[name="vehicle-type"]').forEach(radio => {
      radio.addEventListener('change', (e) => this.onVehicleTypeChange(e));
    });
  }

  // Form Wizard Navigation
  nextStep() {
    if (!this.validateCurrentStep()) {
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.hideStep(this.currentStep);
      this.currentStep++;
      this.showStep(this.currentStep);
      this.updateProgressBar();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.hideStep(this.currentStep);
      this.currentStep--;
      this.showStep(this.currentStep);
      this.updateProgressBar();
    }
  }

  showStep(stepNumber) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
      step.classList.add('is-active');
      step.style.display = 'block';
    }

    // Update step indicator
    document.querySelectorAll('.step-item').forEach((item, index) => {
      if (index + 1 <= stepNumber) {
        item.classList.add('is-completed');
      } else {
        item.classList.remove('is-completed');
      }
      
      if (index + 1 === stepNumber) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });

    // Scroll to top of form
    const formContainer = document.querySelector('.booking-wizard');
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  hideStep(stepNumber) {
    const step = document.querySelector(`[data-step="${stepNumber}"]`);
    if (step) {
      step.classList.remove('is-active');
      step.style.display = 'none';
    }
  }

  updateProgressBar() {
    const progress = (this.currentStep / this.totalSteps) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }

  // Step Validation
  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        return this.validateServiceStep();
      case 2:
        return this.validateVehicleStep();
      case 3:
        return this.validateDateTimeStep();
      case 4:
        return this.validateContactStep();
      default:
        return true;
    }
  }

  validateServiceStep() {
    const selectedService = document.querySelector('.service-option.is-selected');
    if (!selectedService) {
      this.showStepError('Selecteer een dienst om door te gaan.');
      return false;
    }
    this.bookingData.service = selectedService.dataset.service;
    this.bookingData.servicePrice = selectedService.dataset.price;
    return true;
  }

  validateVehicleStep() {
    const vehicleType = document.querySelector('input[name="vehicle-type"]:checked');
    const licensePlate = document.getElementById('license-plate')?.value;
    const vehicleBrand = document.getElementById('vehicle-brand')?.value;
    const vehicleModel = document.getElementById('vehicle-model')?.value;

    if (!vehicleType) {
      this.showStepError('Selecteer het voertuigtype.');
      return false;
    }

    if (!licensePlate || licensePlate.trim().length < 4) {
      this.showStepError('Voer een geldig kenteken in.');
      return false;
    }

    this.bookingData.vehicleType = vehicleType.value;
    this.bookingData.licensePlate = licensePlate.toUpperCase();
    this.bookingData.vehicleBrand = vehicleBrand;
    this.bookingData.vehicleModel = vehicleModel;
    
    return true;
  }

  validateDateTimeStep() {
    const selectedDate = document.getElementById('booking-date')?.value;
    
    if (!selectedDate) {
      this.showStepError('Selecteer een datum.');
      return false;
    }

    if (!this.selectedSlot) {
      this.showStepError('Selecteer een tijdslot.');
      return false;
    }

    this.bookingData.date = selectedDate;
    this.bookingData.time = this.selectedSlot.time;
    this.bookingData.slot = this.selectedSlot;

    return true;
  }

  validateContactStep() {
    const name = document.getElementById('customer-name')?.value;
    const email = document.getElementById('customer-email')?.value;
    const phone = document.getElementById('customer-phone')?.value;

    if (!name || name.trim().length < 2) {
      this.showStepError('Voer uw naam in.');
      return false;
    }

    if (!email || !this.validateEmail(email)) {
      this.showStepError('Voer een geldig e-mailadres in.');
      return false;
    }

    if (!phone || !this.validateDutchPhone(phone)) {
      this.showStepError('Voer een geldig telefoonnummer in.');
      return false;
    }

    this.bookingData.customerName = name;
    this.bookingData.customerEmail = email;
    this.bookingData.customerPhone = phone;
    this.bookingData.notes = document.getElementById('booking-notes')?.value || '';

    return true;
  }

  // Service Selection
  selectService(e) {
    const option = e.currentTarget;
    
    // Remove previous selection
    document.querySelectorAll('.service-option').forEach(opt => {
      opt.classList.remove('is-selected');
    });

    // Select current option
    option.classList.add('is-selected');

    // Update pricing display if needed
    this.updatePricingDisplay(option.dataset.price);
  }

  updatePricingDisplay(price) {
    const priceDisplay = document.querySelector('.price-display');
    if (priceDisplay) {
      priceDisplay.textContent = `€${price}`;
    }
  }

  // Vehicle Type Selection
  onVehicleTypeChange(e) {
    const vehicleType = e.target.value;
    // Show/hide additional fields based on vehicle type
    this.updateVehicleFields(vehicleType);
  }

  updateVehicleFields(vehicleType) {
    const additionalFields = document.querySelector('.additional-vehicle-fields');
    if (additionalFields) {
      // Show different fields based on vehicle type
      additionalFields.style.display = vehicleType ? 'block' : 'none';
    }
  }

  // Date and Time Selection
  onDateChange(e) {
    const selectedDate = e.target.value;
    if (selectedDate) {
      this.loadTimeSlotsForDate(selectedDate);
    }
  }

  generateTimeSlots() {
    // Generate time slots from 8:00 to 17:00, every 30 minutes
    const slots = [];
    for (let hour = 8; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }

  async loadTimeSlotsForDate(date) {
    this.showTimeSlotLoading(true);
    
    try {
      // Mock API call to get available slots
      const availableSlots = await this.fetchAvailableSlots(date);
      this.renderTimeSlots(availableSlots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      this.showTimeSlotError();
    } finally {
      this.showTimeSlotLoading(false);
    }
  }

  async fetchAvailableSlots(date) {
    // Mock API response
    return new Promise((resolve) => {
      setTimeout(() => {
        const allSlots = this.generateTimeSlots();
        // Randomly remove some slots to simulate bookings
        const availableSlots = allSlots.filter(() => Math.random() > 0.3);
        resolve(availableSlots.map(time => ({
          time,
          available: true,
          date
        })));
      }, 1000);
    });
  }

  renderTimeSlots(slots) {
    const container = document.querySelector('.time-slots-container');
    if (!container) return;

    container.innerHTML = '';

    if (slots.length === 0) {
      container.innerHTML = '<p class="has-text-centered">Geen beschikbare tijdslots voor deze datum.</p>';
      return;
    }

    slots.forEach(slot => {
      const slotElement = document.createElement('button');
      slotElement.className = 'button time-slot';
      slotElement.textContent = slot.time;
      slotElement.dataset.time = slot.time;
      slotElement.dataset.date = slot.date;
      slotElement.type = 'button';
      
      if (!slot.available) {
        slotElement.disabled = true;
        slotElement.classList.add('is-disabled');
      }

      container.appendChild(slotElement);
    });
  }

  selectTimeSlot(slotElement) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
      slot.classList.remove('is-selected', 'is-primary');
    });

    // Select current slot
    slotElement.classList.add('is-selected', 'is-primary');
    
    this.selectedSlot = {
      time: slotElement.dataset.time,
      date: slotElement.dataset.date
    };
  }

  showTimeSlotLoading(isLoading) {
    const container = document.querySelector('.time-slots-container');
    if (!container) return;

    if (isLoading) {
      container.innerHTML = '<div class="has-text-centered"><span class="loader"></span> Tijdslots laden...</div>';
    }
  }

  showTimeSlotError() {
    const container = document.querySelector('.time-slots-container');
    if (container) {
      container.innerHTML = '<p class="has-text-danger has-text-centered">Fout bij het laden van tijdslots. Probeer opnieuw.</p>';
    }
  }

  // Booking Submission
  async submitBooking(e) {
    e.preventDefault();
    
    if (this.isLoading) return;

    if (!this.validateCurrentStep()) {
      return;
    }

    this.isLoading = true;
    this.showSubmissionLoading(true);

    try {
      const response = await this.sendBookingRequest(this.bookingData);
      
      if (response.success) {
        this.showBookingSuccess(response.bookingId);
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      this.showBookingError();
    } finally {
      this.isLoading = false;
      this.showSubmissionLoading(false);
    }
  }

  async sendBookingRequest(bookingData) {
    // Mock API request
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate success/failure
        const success = Math.random() > 0.1; // 90% success rate
        resolve({
          success,
          bookingId: success ? 'AS' + Date.now() : null,
          message: success ? 'Booking confirmed' : 'Booking failed'
        });
      }, 2000);
    });
  }

  showBookingSuccess(bookingId) {
    const successMessage = `
      <div class="notification is-success">
        <h3 class="title is-4">Afspraak Bevestigd!</h3>
        <p>Uw afspraak is succesvol geboekt.</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Service:</strong> ${this.bookingData.service}</p>
        <p><strong>Datum:</strong> ${this.formatDate(this.bookingData.date)}</p>
        <p><strong>Tijd:</strong> ${this.bookingData.time}</p>
        <p>U ontvangt een bevestigingsmail op ${this.bookingData.customerEmail}</p>
      </div>
    `;

    const container = document.querySelector('.booking-wizard');
    if (container) {
      container.innerHTML = successMessage;
    }
  }

  showBookingError() {
    this.showStepError('Er is een fout opgetreden bij het boeken. Probeer opnieuw of neem contact met ons op.');
  }

  showSubmissionLoading(isLoading) {
    const submitBtn = document.querySelector('.booking-submit');
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

  // Helper Functions
  showStepError(message) {
    // Remove existing errors
    document.querySelectorAll('.step-error').forEach(el => el.remove());

    const errorElement = document.createElement('div');
    errorElement.className = 'notification is-danger step-error';
    errorElement.innerHTML = `
      <button class="delete"></button>
      ${message}
    `;

    const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"]`);
    if (currentStepEl) {
      currentStepEl.insertBefore(errorElement, currentStepEl.firstChild);
    }

    // Handle close button
    errorElement.querySelector('.delete').addEventListener('click', () => {
      errorElement.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateDutchPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const mobileRegex = /^(31|0)6[0-9]{8}$/;
    const landlineRegex = /^(31|0)[1-9][0-9]{7,8}$/;
    return mobileRegex.test(cleaned) || landlineRegex.test(cleaned);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async loadAvailableSlots() {
    // Initialize with current date
    const today = new Date();
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      // Set minimum date to today
      dateInput.min = today.toISOString().split('T')[0];
      
      // Set default date to today
      dateInput.value = today.toISOString().split('T')[0];
      
      // Load slots for today
      this.loadTimeSlotsForDate(dateInput.value);
    }
  }
}

// Initialize booking system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on booking page
  if (document.querySelector('.booking-wizard')) {
    new BookingSystem();
  }
});