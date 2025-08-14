/**
 * Site Configuratie - Autoreparatie Op Locatie
 * ===========================================
 * 
 * Gecentraliseerde configuratie voor de hele website.
 * Update deze waarden voordat de site live gaat!
 * 
 * @version 1.0.0
 */

const SiteConfig = {
    // Bedrijfsinformatie
    company: {
        name: "Autoreparatie Op Locatie",
        legalName: "Autoreparatie Op Locatie V.O.F.",
        tagline: "Flexibele Monteurs voor Garages",
        kvk: "97965952",
        established: "2024"
    },

    // Contact informatie
    contact: {
        phone: {
            primary: {
                text: "085 060 1132",
                href: "+31850601132"
            },
            whatsapp: "todo" // TODO: Krijg nog een whatsapp nummer van Job
        },
        email: "info@autoreparatieoplocatie.nl",
        address: {
            street: "Noorderbuurt 45",
            postalCode: "9203 AB",
            city: "Drachten",
            region: "Friesland"
        },
        coordinates: {
            lat: 53.1133,
            lng: 6.0980
        }
    },

    // Openingstijden (standaard Ma-Vr 08:00-17:30, Za 09:00-16:00)
    hours: {
        weekdays: "08:00 - 18:00",
        saturday: "Op afspraak", 
        sunday: "Gesloten"
    },

    // Service gebied
    service: {
        radius: "45km", // TODO: update juiste cities, die voldoen aan de km radius
        baseCity: "Drachten",
        cities: ["Drachten", "Heerenveen", "Gorredijk", "Leeuwarden", "Ureterp", "Beetsterzwaag", "Groningen", "Leek"]
    },

    // Social media
    social: {
        facebook: "https://www.facebook.com/AutoreparatieOpLocatieNL", // TODO: 
        instagram: "https://www.instagram.com/autoreparatieoplocatie_nl", // TODO:   
        google: "https://g.page/autoreparatieoplocatie" // TODO: 
    },

    // Website & SEO
    site: {
        domain: "autoreparatieoplocatie.nl",
        url: "https://autoreparatieoplocatie.nl"
    },

    // Cal.com booking
    booking: {
        calLink: "autoreparatieoplocatie/monteur",
        namespace: "monteur"
    },

    // Bedrijfscertificeringen
    certifications: ["RDW Erkend", "Volledig Verzekerd"],

    // Google Reviews
    reviews: {
        rating: 4.8,
        count: 127
    },

    // Utility functions
    getCurrentYear() {
        return new Date().getFullYear();
    }
};

// Browser beschikbaarheid
if (typeof window !== 'undefined') {
    window.SiteConfig = SiteConfig;
    // Legacy support
    window.ContactConfig = SiteConfig;
}

// Module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteConfig;
}