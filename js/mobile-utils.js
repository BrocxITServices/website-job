/*
 * Mobile Utilities for Auto Reparatie Op Locatie
 * Enhances mobile user experience
 */

// Mobile detection and utilities
class MobileUtils {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }
    
    init() {
        if (this.isMobile) {
            this.setupMobileOptimizations();
            this.setupTouchGestures();
            this.setupMobileNavigation();
            this.optimizeFormInputs();
        }
        
        // Setup viewport meta tag optimization
        this.setupViewport();
        
        // Setup phone number formatting
        this.setupPhoneNumberFormatting();
        
        // Setup WhatsApp integration
        this.setupWhatsAppIntegration();
    }
    
    setupMobileOptimizations() {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Prevent zoom on form inputs (iOS)
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });
        
        // Optimize touch targets
        const touchTargets = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .navbar-item');
        touchTargets.forEach(target => {
            const computedStyle = window.getComputedStyle(target);
            if (parseInt(computedStyle.minHeight) < 44) {
                target.style.minHeight = '44px';
            }
            if (parseInt(computedStyle.minWidth) < 44) {
                target.style.minWidth = '44px';
            }
        });
    }
    
    setupTouchGestures() {
        // Simple swipe detection for mobile menu
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].screenY;
            this.handleGesture();
        });
        
        // Prevent double-tap zoom on buttons
        const buttons = document.querySelectorAll('button, .button, a[href^="tel:"], a[href^="mailto:"]');
        buttons.forEach(button => {
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.click();
            });
        });
    }
    
    handleGesture() {
        // You can add swipe gestures here if needed
        // For now, we keep it simple
    }
    
    setupMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        const navbarBurger = document.querySelector('.navbar-burger');
        const navbarMenu = document.querySelector('.navbar-menu');
        
        if (navbarBurger && navbarMenu) {
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && navbarMenu.classList.contains('is-active')) {
                    navbarMenu.classList.remove('is-active');
                    navbarBurger.classList.remove('is-active');
                }
            });
            
            // Close mobile menu when clicking on a link
            const navbarItems = document.querySelectorAll('.navbar-item');
            navbarItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (this.isMobile) {
                        navbarMenu.classList.remove('is-active');
                        navbarBurger.classList.remove('is-active');
                    }
                });
            });
        }
    }
    
    optimizeFormInputs() {
        // Add appropriate input types and attributes for mobile
        const phoneInputs = document.querySelectorAll('input[type="tel"], input[placeholder*="telefoon"], input[placeholder*="phone"]');
        phoneInputs.forEach(input => {
            input.setAttribute('inputmode', 'tel');
            input.setAttribute('autocomplete', 'tel');
        });
        
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.setAttribute('inputmode', 'email');
            input.setAttribute('autocomplete', 'email');
        });
        
        // Optimize textarea resize
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            if (this.isMobile) {
                textarea.style.resize = 'vertical';
            }
        });
    }
    
    setupViewport() {
        // Ensure proper viewport settings
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    }
    
    setupPhoneNumberFormatting() {
        // Make all phone numbers clickable
        const phonePatterns = [
            /(\+31\s*\(0\)\s*\d{3}\s*\d{3}\s*\d{3})/g,
            /(\d{2,3}[-\s]?\d{3}[-\s]?\d{3,4})/g,
            /(06[-\s]?\d{2}[-\s]?\d{3}[-\s]?\d{3})/g
        ];
        
        const textNodes = this.getTextNodes(document.body);
        textNodes.forEach(node => {
            let text = node.textContent;
            let hasPhoneNumber = false;
            
            phonePatterns.forEach(pattern => {
                if (pattern.test(text)) {
                    hasPhoneNumber = true;
                    text = text.replace(pattern, (match) => {
                        const cleanPhone = match.replace(/[-\s\(\)]/g, '');
                        return `<a href="tel:${cleanPhone}" class="phone-link">${match}</a>`;
                    });
                }
            });
            
            if (hasPhoneNumber && node.parentNode) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = text;
                node.parentNode.replaceChild(wrapper, node);
            }
        });
    }
    
    getTextNodes(node) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let textNode;
        while (textNode = walker.nextNode()) {
            // Skip script and style elements
            if (!textNode.parentNode.closest('script, style, a[href^="tel:"]')) {
                textNodes.push(textNode);
            }
        }
        return textNodes;
    }
    
    setupWhatsAppIntegration() {
        // Create WhatsApp quick action for mobile
        if (this.isMobile) {
            const whatsappButtons = document.querySelectorAll('.whatsapp-btn, a[href*="wa.me"]');
            whatsappButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Add click tracking or additional functionality here
                    console.log('WhatsApp contact initiated from mobile device');
                });
            });
        }
    }
    
    // Utility function to check if touch is supported
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    // Function to detect if device is in landscape mode
    isLandscape() {
        return window.innerWidth > window.innerHeight;
    }
    
    // Function to get device pixel ratio
    getPixelRatio() {
        return window.devicePixelRatio || 1;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileUtils();
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileUtils;
}