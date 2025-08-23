# AI Implementation Guide - PageSpeed Verbeteringen
## Autoreparatie Op Locatie - B2B Monteur Inhuur Website

Dit document bevat exacte instructies voor een AI om de goedgekeurde PageSpeed verbeteringen uit te voeren.

---

## ✅ TAAK 1: Voeg lazy loading toe aan afbeeldingen

**BESTANDEN**: `index.html`, `diensten.html`, `over-ons.html`, `contact.html`

**ACTIE**: Zoek alle `<img>` tags en voeg `loading="lazy"` toe, BEHALVE bij:
- Logo afbeeldingen
- Above-the-fold hero afbeeldingen (eerste grote afbeelding op pagina)

**VOORBEELD AANPASSING**:
```html
<!-- VOOR -->
<img src="images/service-monteur.jpg" alt="Monteur service">

<!-- NA -->
<img src="images/service-monteur.jpg" alt="Monteur service" loading="lazy">
```

---

## ✅ TAAK 2: Implementeer font-display swap

**BESTAND**: `css/base.css` of `css/custom.css`

**ACTIE**: Zoek alle `@font-face` declaraties en voeg `font-display: swap;` toe

**VOORBEELD AANPASSING**:
```css
/* VOOR */
@font-face {
  font-family: 'CustomFont';
  src: url('../fonts/font.woff2') format('woff2');
}

/* NA */
@font-face {
  font-family: 'CustomFont';
  src: url('../fonts/font.woff2') format('woff2');
  font-display: swap;
}
```

---

## ✅ TAAK 3: Voeg preconnect hints toe

**BESTANDEN**: `index.html`, `diensten.html`, `over-ons.html`, `contact.html`

**ACTIE**: Voeg deze regels toe in de `<head>` sectie, NA de viewport meta tag:

```html
<!-- Voeg deze exact toe -->
<link rel="preconnect" href="https://app.cal.com">
<link rel="dns-prefetch" href="https://app.cal.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
```

---

## ✅ TAAK 4: Defer non-kritieke JavaScript

**BESTANDEN**: `index.html`, `diensten.html`, `over-ons.html`, `contact.html`

**ACTIE**: 
1. LAAT `site-config.js` en `structured-data.js` ONGEWIJZIGD (geen defer/async)
2. Voeg `defer` attribuut toe aan `main.js` en `cal-integration.js`

**VOORBEELD AANPASSING**:
```html
<!-- VOOR -->
<script src="js/site-config.js"></script>
<script src="js/structured-data.js"></script>
<script src="js/main.js"></script>
<script src="js/cal-integration.js"></script>

<!-- NA -->
<script src="js/site-config.js"></script>
<script src="js/structured-data.js"></script>
<script defer src="js/main.js"></script>
<script defer src="js/cal-integration.js"></script>
```

---

## ✅ TAAK 5: Optimaliseer afbeelding alt teksten voor SEO

**BESTANDEN**: `index.html`, `diensten.html`, `over-ons.html`, `contact.html`

**ACTIE**: Update alt teksten met lokale keywords waar relevant

**VOORBEELDEN**:
```html
<!-- VOOR -->
<img src="images/monteur.jpg" alt="Monteur">

<!-- NA -->
<img src="images/monteur.jpg" alt="Ervaren monteur voor garage inhuur Friesland en Groningen">

<!-- VOOR -->
<img src="images/service.jpg" alt="Service">

<!-- NA -->
<img src="images/service.jpg" alt="Flexibele monteur inhuurservice voor garages Drachten">
```

---

## ✅ TAAK 6: Minify CSS bestanden

**BESTANDEN**: `css/base.css`, `css/custom.css`, `css/mobile.css`, `css/animations.css`

**ACTIE**: Creëer geminifieerde versies van ELKE CSS file APART (niet combineren!)

**STAPPEN**:
1. Kopieer inhoud van elk CSS bestand
2. Verwijder alle comments (/* ... */)
3. Verwijder onnodige whitespace en newlines
4. Sla op als nieuwe file met .min.css extensie

**OUTPUT**:
- `css/base.min.css`
- `css/custom.min.css`
- `css/mobile.min.css`
- `css/animations.min.css`

**HTML AANPASSING**:
```html
<!-- VOOR -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/custom.css">

<!-- NA -->
<link rel="stylesheet" href="css/base.min.css">
<link rel="stylesheet" href="css/custom.min.css">
```

---

## ✅ TAAK 7: Voeg Web Vitals monitoring toe

**BESTAND**: Maak nieuw bestand `js/web-vitals-monitor.js`

**INHOUD**:
```javascript
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
```

**HTML AANPASSING**: Voeg toe aan alle HTML pagina's voor de closing `</body>` tag:
```html
<script defer src="js/web-vitals-monitor.js"></script>
```

---

## ✅ TAAK 8: Implementeer basis Service Worker (alleen assets)

**BESTAND**: Maak nieuw bestand `sw.js` in de root directory

**INHOUD**:
```javascript
// Service Worker voor Autoreparatie Op Locatie
// Versie: 1.0.0
// Cache alleen statische assets, GEEN HTML

const CACHE_NAME = 'aol-assets-v1';
const assetsToCache = [
  '/css/base.min.css',
  '/css/custom.min.css',
  '/css/mobile.min.css',
  '/css/animations.min.css',
  '/images/logo.png',
  '/images/logo.webp'
];

// Installatie - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching assets');
        return cache.addAll(assetsToCache);
      })
      .catch(err => console.error('[ServiceWorker] Cache failed:', err))
  );
});

// Activatie - verwijder oude caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Fetch - serveer gecachte assets waar mogelijk
self.addEventListener('fetch', event => {
  // Cache alleen CSS, JS en afbeeldingen
  if (event.request.url.includes('.css') || 
      event.request.url.includes('.js') || 
      event.request.url.includes('/images/')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version of ga naar netwerk
          return response || fetch(event.request);
        })
    );
  }
  // HTML altijd vers van server halen
});
```

**HTML AANPASSING**: Voeg toe aan alle HTML pagina's in de `<head>`:
```html
<script>
  // Registreer Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('ServiceWorker registered'))
        .catch(err => console.error('ServiceWorker registration failed:', err));
    });
  }
</script>
```

---

## ✅ TAAK 9: Voeg business tracking toe

**BESTAND**: Voeg toe aan `js/main.js` OF maak nieuw bestand `js/business-tracking.js`

**INHOUD**:
```javascript
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
```

---

## ⚠️ NIET UITVOEREN - SEO RISICO'S

**DEZE TAKEN OVERSLAAN:**
1. ❌ NIET alle CSS bestanden combineren tot één bestand
2. ❌ NIET site-config.js of structured-data.js defer/async maken
3. ❌ NIET HTML pagina's cachen in Service Worker
4. ❌ NIET complexe build pipeline met npm implementeren
5. ❌ NIET DOM structuur drastisch wijzigen
6. ❌ NIET alle JavaScript bestanden combineren

---

## 📋 IMPLEMENTATIE VOLGORDE

Voer taken uit in deze exacte volgorde:

1. **TAAK 1**: Lazy loading toevoegen (5 minuten)
2. **TAAK 2**: Font-display swap (5 minuten)
3. **TAAK 3**: Preconnect hints (5 minuten)
4. **TAAK 4**: JavaScript defer (5 minuten)
5. **TAAK 5**: Alt teksten optimaliseren (10 minuten)
6. **TAAK 6**: CSS minification (15 minuten)
7. **TAAK 7**: Web Vitals monitoring (10 minuten)
8. **TAAK 8**: Service Worker basis (10 minuten)
9. **TAAK 9**: Business tracking (10 minuten)

**TOTALE TIJD**: ±75 minuten

---

## 🔍 VERIFICATIE NA IMPLEMENTATIE

Controleer na elke taak:
1. Website laadt nog steeds correct
2. Alle functionaliteit werkt (Cal.com booking, formulieren)
3. Structured data blijft zichtbaar in broncode
4. Mobile responsive layout blijft intact
5. Geen JavaScript errors in console

---

## 📞 BELANGRIJKE WAARSCHUWING

**TELEFOON NUMMER**: Gebruik ALTIJD `085 060 1132` of `085-060-1132`
**NOOIT** oude nummers gebruiken!

**SERVICE GEBIED**: Altijd vermelden "Friesland en Groningen" of "45km vanaf Drachten"

**BUSINESS MODEL**: Dit is B2B monteur inhuur voor GARAGES, niet mobiele reparatie!

---

*Dit document is specifiek geschreven voor AI implementatie. Volg de instructies exact op.*