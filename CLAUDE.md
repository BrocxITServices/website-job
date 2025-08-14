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
├── *.html              # Page files (index, diensten, over-ons, contact, boeken)
├── css/                # Styling files
│   ├── custom.css      # Custom styles and overrides
│   └── animations.css  # Animation definitions
├── js/                 # JavaScript functionality
│   ├── main.js         # Core site functionality
│   ├── booking.js      # Booking system logic
│   ├── form-handler.js # Form validation and submission
│   └── utils.js        # Utility functions
└── images/            # Image assets
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

### JavaScript Organization
- main.js: Handles navigation menu toggle, smooth scrolling, and common interactions
- booking.js: Manages the booking form logic and calendar functionality
- form-handler.js: Validates and processes form submissions
- utils.js: Shared utility functions used across the site

### Performance Considerations
- Static HTML files with minimal JavaScript for fast loading
- CSS and JS files should be minified for production
- Images should be optimized and use appropriate formats (WebP where supported)
- Consider implementing lazy loading for images below the fold

### SEO and Accessibility
- Each page has unique meta descriptions and titles
- Semantic HTML structure for better SEO and screen reader compatibility
- Alt text required for all images
- ARIA labels used where appropriate

## Important Configuration Files

- `manifest.json` & `site.webmanifest`: PWA configuration
- `robots.txt`: Search engine crawling rules
- `sitemap.xml`: Site structure for search engines
- `browserconfig.xml`: Windows tile configuration for pinned sites

## Design System

### Colors
- Primary: `#1e3a8a` (Dark Blue)
- Accent: `#f97316` (Orange)
- Text: `#374151` (Dark Gray)
- Background: `#f8fafc` (Light Gray)

### Typography
- Headings: Bold, larger sizes
- Body text: Regular weight, optimized for readability
- Font stack includes system fonts for performance

## Deployment Notes

- Ensure SSL certificate is configured
- Set appropriate cache headers for static assets
- Enable GZIP compression on the web server
- Test contact forms with actual email configuration
- Submit sitemap.xml to search engines after deployment