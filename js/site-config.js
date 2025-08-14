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
        legalName: "Autoreparatie Op Locatie B.V.",
        tagline: "Flexibele Monteurs voor Garages",
        kvk: "12345678", // TODO: Update
        established: "2008"
    },

    // Contact informatie
    contact: {
        phone: {
            primary: "+31 (0)512 123 456",
            mobile: "+31 6 12 345 678",
            whatsapp: "31512123456"
        },
        email: {
            main: "info@autoreparatieoplocatie.nl", // TODO: Check spelling
            support: "info@autoreparatieoplocatie.nl"
        },
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
        weekdays: "08:00-17:30",
        saturday: "Op afspraak", 
        sunday: "Gesloten",
        emergency: true
    },

    // Service gebied
    service: {
        radius: "25km",
        baseCity: "Drachten",
        cities: ["Drachten", "Heerenveen", "Gorredijk", "Leeuwarden", "Ureterp", "Beetsterzwaag"]
    },

    // Social media
    social: {
        facebook: "https://www.facebook.com/AutoreparatieOpLocatieNL", // TODO: Update
        instagram: "https://www.instagram.com/autoreparatieoplocatie_nl", // TODO: Update  
        google: "https://g.page/autoreparatieoplocatie" // TODO: Update
    },

    // Website & SEO
    site: {
        domain: "autoreparatieoplocatie.nl", // TODO: Confirm
        url: "https://autoreparatieoplocatie.nl"
    },

    // Cal.com booking
    booking: {
        calLink: "fsdf233/ochtend", // TODO: Update
        namespace: "ochtend"
    },

    // Bedrijfscertificeringen
    certifications: ["RDW Erkend", "Volledig Verzekerd"],

    // Google Reviews
    reviews: {
        rating: 4.8,
        count: 127
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