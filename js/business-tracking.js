// Business specifieke tracking voor B2B Monteur Inhuur
document.addEventListener('DOMContentLoaded', function() {
  
  // Track telefoon clicks
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log('Phone click:', '085-060-1132');
      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_click', {
          'phone_number': '085-060-1132',
          'page': window.location.pathname
        });
      }
    });
  });
  
  // Track Cal.com booking button clicks
  const calButtons = document.querySelectorAll('[data-cal-link]');
  calButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('Booking attempt via Cal.com');
      if (typeof gtag !== 'undefined') {
        gtag('event', 'booking_attempt', {
          'booking_type': 'cal_com',
          'page': window.location.pathname
        });
      }
    });
  });
  
  // Track contact form focus (intent to contact)
  const contactForms = document.querySelectorAll('form');
  contactForms.forEach(form => {
    let tracked = false;
    form.addEventListener('focusin', function() {
      if (!tracked) {
        console.log('Contact form interaction');
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_interaction', {
            'form_type': 'contact',
            'page': window.location.pathname
          });
        }
        tracked = true;
      }
    });
  });
});