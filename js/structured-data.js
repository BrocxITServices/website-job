/**
 * Structured Data Manager for Autoreparatie Op Locatie
 * Centralized JSON-LD injection for all pages using SiteConfig data
 */

class StructuredDataManager {
    constructor() {
        // Wait for SiteConfig to be available
        if (typeof SiteConfig === 'undefined') {
            console.warn('SiteConfig not available, waiting...');
            // Try again in 100ms
            setTimeout(() => {
                if (typeof SiteConfig !== 'undefined') {
                    this.initWithConfig();
                } else {
                    console.error('SiteConfig still not available after delay');
                }
            }, 100);
            return;
        }
        this.initWithConfig();
    }

    initWithConfig() {
        // Use SiteConfig data instead of hardcoded values
        this.config = SiteConfig;
        this.baseUrl = this.config.site.url;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.injectStructuredData());
        } else {
            this.injectStructuredData();
        }
    }

    injectStructuredData() {
        const currentPage = this.getCurrentPageType();
        const schemas = this.getPageSchemas(currentPage);
        
        schemas.forEach(schema => this.insertSchema(schema));
    }

    getCurrentPageType() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename === 'index.html' || filename === '' || filename === '/') {
            return 'home';
        } else if (filename === 'diensten.html') {
            return 'services';
        } else if (filename === 'over-ons.html') {
            return 'about';
        } else if (filename === 'contact.html') {
            return 'contact';
        }
        return 'home';
    }

    getPageSchemas(pageType) {
        const schemas = [this.getOrganizationSchema()];
        
        switch (pageType) {
            case 'home':
                schemas.push(this.getFAQSchema());
                schemas.push(this.getEmploymentAgencySchema());
                break;
            case 'services':
                schemas.push(this.getServiceSchema());
                break;
            case 'about':
                schemas.push(this.getAboutPageSchema());
                break;
            case 'contact':
                schemas.push(this.getContactPageSchema());
                break;
        }
        
        return schemas;
    }

    getOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "ProfessionalService", "EmploymentAgency"],
            "@id": `${this.baseUrl}/`,
            "name": this.config.company.name,
            "legalName": this.config.company.legalName,
            "description": "Flexibele monteur inhuur voor garages in Friesland. Direct beschikbare ervaren monteurs voor personeelstekorten, ziekte vervanging en piekperiode ondersteuning.",
            "url": this.baseUrl,
            "logo": `${this.baseUrl}/images/autoreparatie-op-locatie-logo.png`,
            "image": [
                `${this.baseUrl}/images/autoreparatie-op-locatie-werkplaats.jpg`,
                `${this.baseUrl}/images/garage-ondersteuning-friesland.jpg`,
                `${this.baseUrl}/images/monteur-inhuur-drachten.jpg`
            ],
            "foundingDate": this.config.company.established,
            "slogan": this.config.company.tagline,
            "telephone": this.config.contact.phone.primary.href,
            "email": this.config.contact.email,
            "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bank Transfer"],
            "currenciesAccepted": "EUR",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": this.config.contact.address.street,
                "addressLocality": this.config.contact.address.city,
                "addressRegion": this.config.contact.address.region,
                "postalCode": this.config.contact.address.postalCode,
                "addressCountry": "NL"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": this.config.contact.coordinates.lat,
                "longitude": this.config.contact.coordinates.lng
            },
            "areaServed": this.config.service.cities.map(city => ({
                "@type": "City",
                "name": city,
                "containedInPlace": {
                    "@type": "State",
                    "name": this.config.contact.address.region,
                    "containedInPlace": {
                        "@type": "Country",
                        "name": "Nederland"
                    }
                }
            })),
            "openingHours": [
                `Mo-Fr ${this.config.hours.weekdays}`,
                `Sa ${this.config.hours.saturday}`,
                `Su ${this.config.hours.sunday}`
            ],
            "openingHoursSpecification": this.getOpeningHoursSpecification(),
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Monteur Inhuur Services",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Tijdelijke Monteur Inhuur",
                            "description": "Ervaren monteurs direct beschikbaar voor garages bij personeelstekort, ziekte of vakantie vervanging",
                            "serviceType": "Professional Staffing"
                        },
                        "availability": "InStock",
                        "areaServed": this.config.service.cities
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Piekperiode Ondersteuning",
                            "description": "Extra monteur capaciteit tijdens drukte, APK seizoen of speciale acties",
                            "serviceType": "Peak Support"
                        },
                        "availability": "InStock",
                        "areaServed": this.config.service.cities
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Specialistische Kennis",
                            "description": "Expert monteurs voor complexe diagnoses en specialistische ondersteuning",
                            "serviceType": "Technical Expertise"
                        },
                        "availability": "InStock",
                        "areaServed": this.config.service.cities
                    }
                ]
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": this.config.reviews.rating.toString(),
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": this.config.reviews.count.toString()
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": this.config.contact.phone.primary.href,
                "contactType": "customer service",
                "availableLanguage": ["Dutch"],
                "areaServed": "NL-FR-GR",
                "hoursAvailable": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": this.config.hours.weekdays.split(' - ')[0],
                    "closes": this.config.hours.weekdays.split(' - ')[1]
                }
            },
            "sameAs": [
                this.config.social.google,
                this.config.social.facebook,
                this.config.social.instagram
            ],
            "knowsAbout": [
                "Monteur inhuur Friesland",
                "Garage ondersteuning",
                "Tijdelijke monteurs",
                "Personeel tekort garage",
                "Vakantie vervanging monteur",
                "Piekperiode hulp",
                "Flexibele arbeidskrachten",
                "Garage personeel",
                "Monteur detachering",
                "Automotive recruitment"
            ],
            "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": this.config.contact.coordinates.lat,
                    "longitude": this.config.contact.coordinates.lng
                },
                "geoRadius": this.config.service.radius.replace('km', '000')
            }
        };
    }

    getOpeningHoursSpecification() {
        const specs = [{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": this.config.hours.weekdays.split(' - ')[0],
            "closes": this.config.hours.weekdays.split(' - ')[1]
        }];

        // Alleen toevoegen als het niet "Op afspraak" is
        if (this.config.hours.saturday !== "Op afspraak" && this.config.hours.saturday !== "Gesloten") {
            specs.push({
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": this.config.hours.saturday.split(' - ')[0],
                "closes": this.config.hours.saturday.split(' - ')[1]
            });
        }

        // Alleen toevoegen als zondag niet gesloten is
        if (this.config.hours.sunday !== "Gesloten") {
            specs.push({
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Sunday",
                "opens": this.config.hours.sunday.split(' - ')[0],
                "closes": this.config.hours.sunday.split(' - ')[1]
            });
        }

        return specs;
    }

    getEmploymentAgencySchema() {
        return {
            "@context": "https://schema.org",
            "@type": "EmploymentAgency",
            "@id": `${this.baseUrl}/#employment-agency`,
            "name": `${this.config.company.name} - Monteur Inhuur`,
            "description": `Gespecialiseerd uitzendbureau voor monteurs en garage personeel in ${this.config.contact.address.region}`,
            "url": `${this.baseUrl}/diensten.html`,
            "parentOrganization": {
                "@id": `${this.baseUrl}/`
            },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Monteur Detachering Services",
                "itemListElement": [
                    {
                        "@type": "JobPosting",
                        "title": "Ervaren Automonteur",
                        "description": "Tijdelijke monteur voor garage ondersteuning",
                        "employmentType": "TEMPORARY",
                        "hiringOrganization": {
                            "@id": `${this.baseUrl}/#organization`
                        },
                        "jobLocation": {
                            "@type": "Place",
                            "address": {
                                "@type": "PostalAddress",
                                "addressRegion": this.config.contact.address.region,
                                "addressCountry": "NL"
                            }
                        },
                        "qualifications": "15+ jaar ervaring, RDW certificering, eigen gereedschap",
                        "skills": ["Diagnose", "Reparatie", "Onderhoud", "APK keuring", "Elektronica"]
                    }
                ]
            }
        };
    }

    getFAQSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Hoe snel kunnen jullie een monteur leveren?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Wij kunnen spoedig een ervaren monteur aan uw garage leveren. Bij spoedsituaties zoals ziekte is dezelfde dag mogelijk. Onze flexibele monteurs zijn snel inzetbaar in ${this.config.service.cities.slice(0, 3).join(', ')} en omgeving.`
                    }
                },
                {
                    "@type": "Question",
                    "name": "Wat kost monteur inhuur per uur?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Onze monteur inhuur tarief start vanaf €65 per uur. Dit is inclusief eigen gereedschap en ervaring. Geen extra kosten voor transport binnen ${this.config.service.radius} van ${this.config.service.baseCity}.`
                    }
                },
                {
                    "@type": "Question",
                    "name": "In welke plaatsen bieden jullie monteur inhuur?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Wij leveren monteurs aan garages in heel ${this.config.contact.address.region}: ${this.config.service.cities.join(', ')} en alle omliggende gemeenten binnen ${this.config.service.radius}.`
                    }
                },
                {
                    "@type": "Question",
                    "name": "Zijn jullie monteurs verzekerd?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Ja, alle monteurs zijn volledig verzekerd voor aansprakelijkheid en schade. Wij hebben alle benodigde certificeringen: ${this.config.certifications.join(' en ')} voor professionele garage ondersteuning.`
                    }
                }
            ]
        };
    }

    getServiceSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${this.baseUrl}/diensten.html#monteur-inhuur`,
            "name": "Monteur Inhuur voor Garages",
            "description": `Professionele monteur inhuur service voor garages in ${this.config.contact.address.region}. Direct beschikbare ervaren monteurs voor alle situaties.`,
            "serviceType": "Employment Placement Service",
            "category": "Professional Staffing",
            "provider": {
                "@id": `${this.baseUrl}/`
            },
            "areaServed": {
                "@type": "State",
                "name": this.config.contact.address.region,
                "containedInPlace": {
                    "@type": "Country",
                    "name": "Nederland"
                }
            },
            "audience": {
                "@type": "BusinessAudience",
                "audienceType": "Garage Owners"
            },
            "offers": {
                "@type": "Offer",
                "description": "Monteur inhuur vanaf €65 per uur",
                "availability": "InStock",
                "availableDeliveryMethod": "OnSitePickup"
            }
        };
    }

    getAboutPageSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "mainEntity": {
                "@id": `${this.baseUrl}/`
            },
            "description": `Over ${this.config.company.name} - Specialist in monteur inhuur voor garages sinds ${this.config.company.established}`
        };
    }

    getContactPageSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
                "@id": `${this.baseUrl}/`
            },
            "description": "Contact informatie voor monteur inhuur en garage ondersteuning"
        };
    }

    insertSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    }
}

// Initialize structured data manager when script loads
new StructuredDataManager();