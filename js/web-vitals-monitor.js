// Web Vitals Monitoring voor B2B Monteur Inhuur
(function() {
  // Laad Web Vitals library
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `
    import {getCLS, getFID, getLCP} from 'https://unpkg.com/web-vitals@3/dist/web-vitals.js?module';
    
    function sendToAnalytics(metric) {
      // Log naar console voor debugging
      console.log('[Web Vitals]', metric.name, ':', Math.round(metric.value));
      
      // Stuur naar Google Analytics als aanwezig
      if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
          metric_name: metric.name,
          metric_value: Math.round(metric.value),
          metric_delta: metric.delta,
          page_path: window.location.pathname
        });
      }
    }
    
    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getLCP(sendToAnalytics);
  `;
  document.head.appendChild(script);
})();