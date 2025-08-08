/**
 * Gecentraliseerde Contactgegevens Configuratie
 * ============================================
 * 
 * BELANGRIJK: Update deze waarden voordat de site live gaat!
 * Alle contactgegevens op de hele website komen uit dit bestand.
 * 
 * @author Autoreparatie Op Locatie
 * @version 1.0.0
 */

const ContactConfig = {
    // Bedrijfsinformatie
    company: {
        name: "Autoreparatie Op Locatie",
        legalName: "Autoreparatie Op Locatie B.V.",
        tagline: "Flexibele Monteurs voor Garages",
        kvk: "12345678", // TODO: Update met echte KvK nummer
        btw: "NL001234567B01", // TODO: Update met echt BTW nummer
        established: "2008"
    },

    // Telefoonnummers
    phone: {
        primary: {
            formatted: "+31 (0)512 123 456", // Voor display
            raw: "+31512123456", // Voor tel: links
            local: "0512-123-456" // Lokaal formaat
        },
        mobile: {
            formatted: "+31 6 12 345 678",
            raw: "+31612345678",
            local: "06-12 345 678"
        },
        emergency: {
            formatted: "+31 6 12 345 678", // 24/7 noodlijn
            raw: "+31612345678",
            local: "06-12 345 678"
        },
        whatsapp: {
            number: "31512123456", // Zonder + voor WhatsApp API
            defaultMessage: "Hallo Autoreparatie Op Locatie, ik heb een vraag over monteur inhuur voor mijn garage..."
        }
    },

    // Email adressen
    email: {
        primary: "info@autoreparatieoploatie.nl", // TODO: Check spelling - mogelijk info@autoreparatieoploocatie.nl?
        secondary: "info@arol-mobiel.nl",
        support: "support@autoreparatieoplocatie.nl",
        sales: "verkoop@autoreparatieoplocatie.nl"
    },

    // Fysiek adres
    address: {
        street: "Noorderbuurt 45",
        postalCode: "9203 AB",
        city: "Drachten",
        province: "Friesland",
        country: "Nederland",
        countryCode: "NL",
        // GPS Coordinaten
        coordinates: {
            latitude: 53.1133,
            longitude: 6.0980
        },
        // Google Maps link
        mapsUrl: "https://www.google.com/maps/place/Noorderbuurt+45,+9203+AB+Drachten",
        // Service gebied
        serviceArea: "25km rondom Drachten",
        serviceCities: [
            "Drachten",
            "Heerenveen", 
            "Gorredijk",
            "Leeuwarden",
            "Ureterp",
            "Beetsterzwaag"
        ]
    },

    // Openingstijden
    openingHours: {
        regular: {
            monday: { open: "08:00", close: "17:30", closed: false },
            tuesday: { open: "08:00", close: "17:30", closed: false },
            wednesday: { open: "08:00", close: "17:30", closed: false },
            thursday: { open: "08:00", close: "17:30", closed: false },
            friday: { open: "08:00", close: "17:30", closed: false },
            saturday: { open: "09:00", close: "16:00", closed: false, note: "Op afspraak" },
            sunday: { open: null, close: null, closed: true }
        },
        holidays: {
            closed: true,
            note: "Op feestdagen gesloten, noodservice wel beschikbaar"
        },
        emergency: {
            available: true,
            text: "24/7 bereikbaar voor noodgevallen",
            phone: "+31612345678"
        }
    },

    // Social Media Links
    social: {
        facebook: "https://www.facebook.com/AutoreparatieOpLocatieNL", // TODO: Update met echte Facebook pagina
        instagram: "https://www.instagram.com/autoreparatieoplocatie_nl", // TODO: Update met echt Instagram account
        linkedin: "https://www.linkedin.com/company/autoreparatieoplocatie", // TODO: Toevoegen indien beschikbaar
        google: "https://g.page/autoreparatieoplocatie", // TODO: Update met echte Google Business link
        youtube: "", // TODO: Toevoegen indien beschikbaar
        whatsapp: {
            url: "https://wa.me/31512123456",
            groupUrl: "" // Indien er een WhatsApp groep is
        }
    },

    // Website URLs
    website: {
        domain: "autoreparatieoplocatie.nl", // TODO: Bevestig domein
        url: "https://autoreparatieoplocatie.nl",
        email: "info@autoreparatieoplocatie.nl"
    },

    // Cal.com Booking configuratie
    booking: {
        calLink: "fsdf233/ochtend", // TODO: Update met echte Cal.com link
        namespace: "ochtend",
        defaultConfig: {
            layout: "month_view",
            hideEventTypeDetails: false
        }
    },

    // Certificeringen & Erkenningen
    certifications: {
        rdw: "RDW Erkend", // TODO: Voeg erkenningsnummer toe
        insurance: "Volledig Verzekerd",
        iso: "ISO 9001 Gecertificeerd" // TODO: Bevestig certificering
    },

    // Ratings & Reviews
    ratings: {
        google: {
            score: 4.8,
            reviews: 127,
            url: "https://www.google.com/maps/place/AutoService+Pro" // TODO: Update met echte review link
        }
    },

    // Nood & Pechhulp
    emergency: {
        available: true,
        responseTime: "30 minuten",
        phone: "+31612345678",
        areas: ["Drachten", "Heerenveen", "Gorredijk", "Leeuwarden", "Ureterp", "Beetsterzwaag"],
        text: "24/7 Pechhulp in heel Friesland"
    },

    // Helper functies voor formatting
    helpers: {
        getFormattedAddress() {
            return `${ContactConfig.address.street}, ${ContactConfig.address.postalCode} ${ContactConfig.address.city}`;
        },
        getOpeningHoursText(day) {
            const hours = ContactConfig.openingHours.regular[day.toLowerCase()];
            if (hours.closed) return "Gesloten";
            if (hours.note) return hours.note;
            return `${hours.open} - ${hours.close}`;
        },
        getWhatsAppUrl(message = null) {
            const msg = message || ContactConfig.phone.whatsapp.defaultMessage;
            return `https://wa.me/${ContactConfig.phone.whatsapp.number}?text=${encodeURIComponent(msg)}`;
        },
        getTelUrl(phoneType = 'primary') {
            return `tel:${ContactConfig.phone[phoneType].raw}`;
        },
        getMailtoUrl(emailType = 'primary', subject = '') {
            const email = ContactConfig.email[emailType];
            return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
        }
    }
};

// Maak beschikbaar voor gebruik in browser
if (typeof window !== 'undefined') {
    window.ContactConfig = ContactConfig;
}

// Export voor module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactConfig;
}