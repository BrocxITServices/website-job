# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Autoreparatie Op Locatie website - A responsive automotive service company website built with HTML, CSS (Bulma framework), and vanilla JavaScript.

## Technology Stack

- **Frontend**: HTML5, CSS3 (Bulma CSS framework), Vanilla JavaScript
- **Styling**: Custom CSS with Bulma framework for responsive design
- **PWA**: Progressive Web App ready with manifest.json and site.webmanifest
- **SEO**: Optimized with sitemap.xml, robots.txt, and semantic HTML

## Project Structure

```
/
├── *.html              # Page files (index, diensten, over-ons, contact)
├── css/                # Styling files
│   ├── base.css        # Foundation styles and CSS variables
│   ├── custom.css      # Project-specific styles
│   ├── mobile.css      # Mobile-specific styles
│   └── animations.css  # Animation definitions
├── js/                 # JavaScript functionality
│   ├── site-config.js  # Centralized business configuration
│   ├── structured-data.js # Dynamic JSON-LD injection
│   ├── cal-integration.js # Cal.com booking integration
│   ├── main.js         # Legacy - cleaned up
│   └── utils.js        # Shared utility functions
└── images/            # Image assets and favicons
```

## Common Development Tasks

### Local Development
Since this is a static website, serve it locally using any web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server (if installed)
npx http-server

# Using PHP
php -S localhost:8000
```

### Testing
- Open the site in multiple browsers to test compatibility
- Use Chrome DevTools Lighthouse for performance and accessibility audits
- Test responsive design using browser developer tools device emulation

## Architecture Notes

### Page Structure
- Each HTML page follows a consistent structure with shared navigation and footer
- Navigation menu is duplicated across pages (consider extracting to JS component for maintainability)
- Forms use client-side validation with potential server-side processing via form-handler.js

### Styling Architecture
- Bulma CSS provides the responsive grid and component base
- custom.css contains project-specific overrides and custom components
- animations.css handles all animation definitions
- Mobile-first responsive design approach

### JavaScript Organization & Data Flow
- **site-config.js**: Single source of truth for all business data (contact, hours, cities, etc.)
- **structured-data.js**: Dynamically injects JSON-LD using SiteConfig data, replaces hardcoded schemas
- **cal-integration.js**: Cal.com booking widget integration using config data
- **main.js**: Legacy file, mostly cleaned up - handles basic interactions
- **utils.js**: Shared utility functions
- **Vue.js 3**: Used for reactive template binding ({{ config.company.name }}) and mobile menu state

### Performance Considerations
- Static HTML files with minimal JavaScript for fast loading
- CSS and JS files should be minified for production
- Images should be optimized and use appropriate formats (WebP where supported)
- Consider implementing lazy loading for images below the fold

### SEO Architecture & Local Business Focus
- **Business Model**: B2B monteur inhuur (mechanic staffing) for garages, NOT mobile repair
- **Service Area**: 45km radius from Drachten covering Friesland & Groningen provinces
- **Target Cities**: Drachten, Heerenveen, Gorredijk, Leeuwarden, Ureterp, Beetsterzwaag, Groningen, Leek
- **Structured Data**: Dynamic JSON-LD injection via structured-data.js using Schema.org LocalBusiness/EmploymentAgency
- **Geo Targeting**: Meta tags target both NL-FR (Friesland) and NL-GR (Groningen) regions
- **Consistent Phone**: 085 060 1132 across all pages and schemas

## Critical Configuration Files

- **js/site-config.js**: Central business configuration - UPDATE THIS FIRST for any business changes
- **js/structured-data.js**: SEO schema manager - automatically uses SiteConfig data
- **manifest.json**: PWA configuration with B2B focus and geographic targeting
- **robots.txt** & **sitemap.xml**: Search engine optimization files
- **browserconfig.xml**: Windows tile configuration

## Design System

### Colors
- Primary: `#1e3a8a` (Dark Blue) with light `#3b82f6` and dark `#1e40af` variants
- Accent: `#eab308` (Racing Yellow) with comprehensive palette including hover states
- Text: `#374151` (Dark Gray), `#6b7280` (Light), `#1f2937` (Dark)
- Background: `#f8fafc` (Light Gray)
- Semantic: Success `#10b981`, Error `#ef4444`, Warning `#f59e0b`, Info `#3b82f6`

### Typography
- Headings: Bold, larger sizes
- Body text: Regular weight, optimized for readability
- Font stack includes system fonts for performance

## Key Development Guidelines

### Configuration Management
- **ALWAYS update js/site-config.js first** for business changes (phone, cities, hours, etc.)
- **NEVER hardcode business data** in HTML - use SiteConfig and Vue.js template binding
- **Maintain 45km service radius** consistency across all content and meta tags

### SEO Best Practices  
- **Business focus**: B2B monteur inhuur for garages, avoid mobile repair messaging
- **Geographic consistency**: Include both Friesland & Groningen in titles, descriptions, meta tags
- **Phone number**: Always use 085 060 1132 - never use old numbers
- **Service area**: Include all 8 cities from SiteConfig.service.cities

### Code Quality
- **Avoid code-rot**: Remove unused functions, CSS classes, and JavaScript files
- **Component reuse**: Use Vue.js template binding for dynamic content
- **Structured data**: Let structured-data.js handle JSON-LD injection automatically

## Deployment Notes

- Ensure SSL certificate is configured
- Set appropriate cache headers for static assets  
- Enable GZIP compression on the web server
- Test Cal.com booking integration with real calendar
- Submit sitemap.xml to search engines after deployment