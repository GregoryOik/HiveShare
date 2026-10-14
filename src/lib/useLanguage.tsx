import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'el';

interface Translations {
  [key: string]: {
    en: string;
    el: string;
  };
}

export const translations: Translations = {
  // Navigation
  navHome: { en: 'Home', el: 'Αρχική' },
  navBuyHoney: { en: 'Buy Honey', el: 'Αγορά Μελιού' },
  navAdopt: { en: 'Adopt a Hive', el: 'Υιοθετήστε Κυψέλη' },
  navVerify: { en: 'Verify Batch', el: 'Έλεγχος Παρτίδας' },
  navCalendar: { en: 'Nomadic Calendar', el: 'Νομαδικό Ημερολόγιο' },
  navConcierge: { en: 'Honey Concierge', el: 'Επιλογέας Μελιού' },
  navDashboard: { en: 'Dashboard', el: 'Πίνακας Ελέγχου' },
  navAdmin: { en: 'Central Station', el: 'Διαχείριση' },
  navSignIn: { en: 'Sign In', el: 'Σύνδεση' },
  navSignOut: { en: 'Sign Out', el: 'Αποσύνδεση' },

  // Hero & Tagline
  heroBadge: { en: 'Nomadic Apiculture · Laconia & Mani, Greece', el: 'Νομαδική Μελισσοκομία · Λακωνία & Μάνη, Ελλάδα' },
  heroTitle1: { en: 'Connect to a Living', el: 'Συνδεθείτε με μια Ζωντανή' },
  heroTitle2: { en: 'Colony in Mani', el: 'Κυψέλη στη Μάνη' },
  heroSubtitle: {
    en: 'Guard an authentic colony of Greek bees on the limestone cliffs of the Peloponnese. Receive your single-origin, raw, unheated harvest in numbered glass jars.',
    el: 'Γίνετε ανάδοχος μιας αυθεντικής ελληνικής κυψέλης στα ασβεστολιθικά βράχια της Πελοποννήσου. Λάβετε το αγνό, ανεπεξέργαστο μέλι σας σε αριθμημένα γυάλινα βάζα.'
  },
  ctaAdopt: { en: 'Adopt Your Colony', el: 'Υιοθετήστε την Κυψέλη σας' },
  ctaBuyDirect: { en: 'Order Single Jars', el: 'Αγοράστε Μεμονωμένα Βάζα' },
  ctaFindMatch: { en: 'Take Palate Quiz', el: 'Τεστ Γευστικής Προτίμησης' },

  // Value props
  unheatedRaw: { en: '100% Raw & Unheated', el: '100% Αγνό & Ανεπεξέργαστο' },
  singleOrigin: { en: 'Single-Origin Traceable', el: 'Μονοποικιλιακό & Ιχνηλάσιμο' },
  nomadicTradition: { en: '30+ Years Heritage', el: '30+ Χρόνια Παράδοση' },
  numberedBottles: { en: 'Numbered Vintage Jars', el: 'Αριθμημένα Συλλεκτικά Βάζα' },

  // Pricing / Tiers
  starterTitle: { en: 'Starter Guardianship', el: 'Βασική Αναδοχή' },
  starterSub: { en: '2.5 kg Raw Honey · 3 Deliveries', el: '2,5 kg Αγνό Μέλι · 3 Εποχιακές Αποστολές' },
  premiumTitle: { en: 'Premium Patron', el: 'Επίτιμος Προστάτης' },
  premiumSub: { en: '5.0 kg Raw Honey · Dedicated Colony', el: '5,0 kg Αγνό Μέλι · Επώνυμη Κυψέλη' },
  corporateTitle: { en: 'Corporate Sanctum', el: 'Εταιρική Αναδοχή' },
  corporateSub: { en: '25 kg Reserve · Custom Gold Seals', el: '25 kg Συλλεκτικό Απόθεμα · Χρυσή Σφραγίδα' },
  perYear: { en: '/year', el: '/έτος' },
  selectPlan: { en: 'Claim Guardianship', el: 'Επιλογή Αναδοχής' },

  // Buy Honey page
  buyHoneyBadge: { en: 'Direct Reserve Bottling · Limited Allocations', el: 'Απευθείας Εμφιάλωση · Περιορισμένες Παρτίδες' },
  buyHoneyTitle: { en: 'Single-Origin Greek Honey', el: 'Μονοποικιλιακό Ελληνικό Μέλι' },
  buyHoneySubtitle: {
    en: 'Cold-extracted at room temperature by Petros Oikonomakos in Sparta. Zero syrup feeding, zero ultra-filtration, zero heating.',
    el: 'Εξαγωγή εν ψυχρώ από τον Πέτρο Οικονομάκο στη Σπάρτη. Χωρίς σιρόπια, χωρίς παστερίωση, χωρίς υπερφιλτράρισμα.'
  },
  orderNow: { en: 'Order Jar', el: 'Παραγγελία' },
  viewSpecs: { en: 'Grand Cru Specs', el: 'Χαρακτηριστικά Grand Cru' },

  // Concierge
  conciergeBadge: { en: 'The Honey Concierge', el: 'Προσωπικός Επιλογέας Μελιού' },
  conciergeTitle: { en: 'Discover Your Mountain Match', el: 'Ανακαλύψτε το Ιδανικό σας Μέλι' },
  conciergeSubtitle: {
    en: 'Answer 3 sensory questions to uncover the Greek nectar crafted for your palate.',
    el: 'Απαντήστε σε 3 απλές ερωτήσεις γεύσης για να βρείτε το ιδανικό ελληνικό μέλι για εσάς.'
  },

  // Calendar
  calendarBadge: { en: 'Nomadic Nectar Cycle', el: 'Νομαδικός Κύκλος Ανθοφορίας' },
  calendarTitle: { en: 'Follow Petros & His Hives', el: 'Ακολουθήστε τον Πέτρο στις Βουνοπλαγιές' },
  calendarSubtitle: {
    en: 'From sea-level orange blossoms to 1,200m alpine fir forests: the ancient rhythm of nomadic apiculture.',
    el: 'Από τους ανθούς πορτοκαλιάς στα 140μ έως τα ελατοδάση στα 1.200μ: ο αρχαίος ρυθμός της νομαδικής μελισσοκομίας.'
  },

  // Footer
  footerRights: { en: '© 2026 HiveShare · Sparta & Mani, Peloponnese, Greece', el: '© 2026 HiveShare · Σπάρτη & Μάνη, Πελοπόννησος, Ελλάδα' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('hs_language');
    if (saved === 'el' || saved === 'en') return saved;
    // Auto-detect Greek browser
    if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('el')) {
      return 'el';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hs_language', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'el' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string, fallback?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
