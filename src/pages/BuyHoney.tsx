import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Star, Truck,
  ChevronRight, Check, X, Loader2, AlertTriangle, Lock,
  MapPin, ShieldCheck, TrendingDown, ShoppingBag, Plus, Minus,
  PackageCheck, Info, Sparkles, Gift, Utensils, Compass, Award,
  Thermometer, Droplets, Mountain, Globe, Menu
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { useLanguage } from '../lib/useLanguage';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, doc } from 'firebase/firestore';
import { sendEmail, emailTemplates } from '../lib/email';
import HoneyConciergeModal from '../components/HoneyConciergeModal';
import Footer from '../components/Footer';

// ─── Stripe Price IDs (memberships) ──────────────────────────────────────────
const STARTER_PRICE_ID = 'price_1TDaerEhPXKoQqYJKuvCxiBR'; // Starter
const PREMIUM_PRICE_ID = 'price_1TDafLEhPXKoQqYJa9nt3rEy'; // Premium
const OIL_PRICE_ID     = 'price_1TDanWEhPXKoQqYJY2gq1Fj0'; // Olive oil add-on

// ─── Individual jar SKUs (Luxury single-batch provenance pricing) ─────────────
interface JarOption {
  size: string;
  weightKg: number;
  price: number;
  priceKg: number;
}

interface JarItem {
  id: string;
  variety: string;
  varietyEl: string;
  origin: string;
  originEl: string;
  season: string;
  seasonEl: string;
  elevation: string;
  elevationEl: string;
  botanicalDominance: string;
  botanicalDominanceEl: string;
  moisture: string;
  moistureEl: string;
  batchRun: string;
  batchRunEl: string;
  image: string;
  character: string;
  characterEl: string;
  pairing: { dish: string; note: string };
  pairingEl: { dish: string; note: string };
  options: JarOption[];
}

const JARS: JarItem[] = [
  {
    id: 'thyme-sage',
    variety: 'Thyme & Mountain Sage',
    varietyEl: 'Άγριο Θυμάρι & Φασκόμηλο',
    origin: 'Lagia, Cape Tenaro, Mani',
    originEl: 'Λάγια, Ακρωτήριο Ταίναρο, Μάνη',
    season: 'Jun – Jul 2026',
    seasonEl: 'Ιούν – Ιούλ 2026',
    elevation: '420m Limestone Slope',
    elevationEl: '420μ Ασβεστολιθική Πλαγιά',
    botanicalDominance: '84% Wild Thyme · 16% Sage',
    botanicalDominanceEl: '84% Άγριο Θυμάρι · 16% Φασκόμηλο',
    moisture: '15.1% (Dense Maturation)',
    moistureEl: '15.1% (Πλήρης Ωρίμανση)',
    batchRun: 'Numbered Batch of 420 Jars',
    batchRunEl: 'Αριθμημένη Παρτίδα 420 Βάζων',
    image: '/raw_honey.png',
    character: 'Intensely herbal, pungent, high pollen density. Extracted from the sun-baked, wind-scoured cliffs of deep Mani.',
    characterEl: 'Έντονα βοτανικό, πικάντικο, με υψηλή πυκνότητα γύρης. Συλλέγεται από τα ανεμοδαρμένα, ηλιόλουστα βράχια της Μέσα Μάνης.',
    pairing: {
      dish: 'Aged Greek Graviera & Sourdough',
      note: 'The resinous sharpness cuts through hard sheep milk cheeses and complements wild thyme teas.',
    },
    pairingEl: {
      dish: 'Παλαιωμένη Γραβιέρα & Προζυμένιο Ψωμί',
      note: 'Η ρητινώδης ένταση ισορροπεί με τα σκληρά πρόβεια τυριά και συνοδεύει ιδανικά αφεψήματα θυμαριού.',
    },
    options: [
      { size: '250g', weightKg: 0.25, price: 28, priceKg: 112 },
      { size: '500g', weightKg: 0.5, price: 52, priceKg: 104 },
    ],
  },
  {
    id: 'wildflower-vanilla',
    variety: 'Taygetos Wildflower & Vanilla',
    varietyEl: 'Αγριολούλουδα Ταϋγέτου & Βανίλια',
    origin: 'Sparta / Kato Asteri Foothills',
    originEl: 'Πρόποδες Σπάρτης / Κάτω Αστέρι',
    season: 'Feb – Mar 2026',
    seasonEl: 'Φεβ – Μάρ 2026',
    elevation: '310m Mountain Valley',
    elevationEl: '310μ Ορεινή Κοιλάδα',
    botanicalDominance: 'Multi-Floral Spring Bloom',
    botanicalDominanceEl: 'Πολυανθική Ανοιξιάτικη Άνθιση',
    moisture: '15.8% (Velvet Cream)',
    moistureEl: '15.8% (Βελούδινη Υφή)',
    batchRun: 'Numbered Batch of 380 Jars',
    batchRunEl: 'Αριθμημένη Παρτίδα 380 Βάζων',
    image: '/raw_honey.png',
    character: 'Delicate floral perfume with creamy vanilla sweetness. Sourced during the early spring bloom of the Spartan plain.',
    characterEl: 'Ντελικάτο ανθικό άρωμα με κρεμώδη γλυκύτητα βανίλιας. Προέρχεται από την πρώιμη ανθοφορία του λακωνικού κάμπου.',
    pairing: {
      dish: 'Fresh Goat Curd & Ripe Figs',
      note: 'Melts smoothly over soft lactic cheeses, fresh fruit tarts, and morning chamomile infusions.',
    },
    pairingEl: {
      dish: 'Φρέσκο Κατσικίσιο Τυρί & Σύκα',
      note: 'Απλώνεται απαλά πάνω σε φρέσκα λευκά τυριά, τάρτες φρούτων και πρωινό χαμομήλι.',
    },
    options: [
      { size: '250g', weightKg: 0.25, price: 28, priceKg: 112 },
      { size: '500g', weightKg: 0.5, price: 52, priceKg: 104 },
    ],
  },
  {
    id: 'fir-forest',
    variety: 'Black Fir Honey (Grand Cru)',
    varietyEl: 'Μέλι Ελάτης Μαινάλου (Grand Cru)',
    origin: 'Karyes, Arcadia Highland',
    originEl: 'Καρυές, Ορεινή Αρκαδία',
    season: 'Jul – Aug 2026',
    seasonEl: 'Ιούλ – Αύγ 2026',
    elevation: '1,150m Conifer Canopy',
    elevationEl: '1.150μ Ελατοδάσος Μαινάλου',
    botanicalDominance: '100% Greek Fir Honeydew',
    botanicalDominanceEl: '100% Ελληνικό Μελίτωμα Ελάτης',
    moisture: '14.6% (Exceptionally Thick)',
    moistureEl: '14.6% (Εξαιρετικά Παχύρρευστο)',
    batchRun: 'Limited Harvest of 290 Jars',
    batchRunEl: 'Περιορισμένη Σοδειά 290 Βάζων',
    image: '/4jars.jpg',
    character: 'Rich dark amber with burnt caramel and cedar resin notes. Low glucose means it never crystallizes. A rare Greek treasure.',
    characterEl: 'Σκούρο κεχριμπαρένιο με νότες καμένης καραμέλας και κέδρου. Χαμηλή γλυκόζη — δεν κρυσταλλώνει ποτέ φυσικά. Σπάνιος ελληνικός θησαυρός.',
    pairing: {
      dish: 'Strained Sheep’s Yogurt & Walnuts',
      note: 'The iconic Peloponnese breakfast. Also pairs majestically with dark rye bread and seared duck breast.',
    },
    pairingEl: {
      dish: 'Στραγγιστό Πρόβειο Γιαούρτι & Καρύδια',
      note: 'Το εμβληματικό πρωινό της Πελοποννήσου. Συνδυάζεται εξαιρετικά με μαύρο ψωμί σίκαλης.',
    },
    options: [
      { size: '500g', weightKg: 0.5, price: 52, priceKg: 104 },
      { size: '1 kg', weightKg: 1.0, price: 88, priceKg: 88 },
    ],
  },
  {
    id: 'pine-mountain',
    variety: 'Highland Pine Honey',
    varietyEl: 'Ορεινό Πευκόμελο',
    origin: 'Evia Conifer Forest',
    originEl: 'Πευκοδάση Βόρειας Εύβοιας',
    season: 'Aug – Oct 2026',
    seasonEl: 'Αύγ – Οκτ 2026',
    elevation: '680m Coastal Pine Forest',
    elevationEl: '680μ Παράκτιο Πευκοδάσος',
    botanicalDominance: 'Pure Marchalina Honeydew',
    botanicalDominanceEl: 'Αγνό Μελίτωμα Marchalina hellenica',
    moisture: '15.4% (Rich Mineral Body)',
    moistureEl: '15.4% (Πλούσιο σε Ιχνοστοιχεία)',
    batchRun: 'Numbered Batch of 450 Jars',
    batchRunEl: 'Αριθμημένη Παρτίδα 450 Βάζων',
    image: '/4jars.jpg',
    character: 'Deep malt complexity, balanced sweetness, packed with bio-available trace minerals and active natural enzymes.',
    characterEl: 'Βαθιά γεύση βύνης, ισορροπημένη γλυκύτητα, πλούσιο σε βιοδιαθέσιμα ιχνοστοιχεία και ενεργά φυσικά ένζυμα.',
    pairing: {
      dish: 'Salted Butter Toast & Pecorino',
      note: 'Slightly savory mineral notes make it ideal for charcuterie boards, smoked ham, and black tea.',
    },
    pairingEl: {
      dish: 'Φρυγανισμένο Ψωμί με Βούτυρο & Πεκορίνο',
      note: 'Ελαφρώς γήινες νότες που ταιριάζουν άψογα σε πλατό αλλαντικών, καπνιστά τυριά και μαύρο τσάι.',
    },
    options: [
      { size: '500g', weightKg: 0.5, price: 52, priceKg: 104 },
      { size: '1 kg', weightKg: 1.0, price: 88, priceKg: 88 },
    ],
  },
  {
    id: 'connoisseur-hamper',
    variety: 'Peloponnese Connoisseur Tasting Hamper',
    varietyEl: 'Συλλεκτική Κασέτα Γευσιγνωσίας Πελοποννήσου',
    origin: 'Laconia, Arcadia & Mani Family Estates',
    originEl: 'Λακωνία, Αρκαδία & Κτήματα Μάνης',
    season: 'Annual Reserve 2026',
    seasonEl: 'Ετήσιο Απόθεμα 2026',
    elevation: '310m – 1,150m Nomadic Range',
    elevationEl: '310μ – 1.150μ Νομαδικό Εύρος',
    botanicalDominance: 'Trio of Single-Origin Honeys + Family Extra Virgin Olive Oil',
    botanicalDominanceEl: 'Τρίδυμο Μονοποικιλιακών Μελιών + Εξαιρετικό Παρθένο Ελαιόλαδο',
    moisture: 'Artisanal Grand Cru Selection',
    moistureEl: 'Χειροποίητη Επιλογή Grand Cru',
    batchRun: 'Limited Allocation of 75 Keepsake Wooden Boxes',
    batchRunEl: 'Περιορισμένη Διάθεση 75 Ξύλινων Κουτιών',
    image: '/4jars.jpg',
    character: 'The ultimate culinary gift from Petros Oikonomakos: 3x 250g raw single-varietal honeys (Wild Thyme, Arcadian Fir, Taygetos Wildflower) paired with 500ml Single-Estate Cold-Pressed Extra Virgin Olive Oil from the Oikonomakos family grove and a hand-carved olive wood honey dipper.',
    characterEl: 'Το κορυφαίο γαστρονομικό δώρο από τον Πέτρο Οικονομάκο: 3x 250g αγνά μονοποικιλιακά μέλια (Άγριο Θυμάρι, Έλατο Μαινάλου, Αγριολούλουδα Ταϋγέτου), μαζί με 500ml Εξαιρετικό Παρθένο Ελαιόλαδο ψυχρής έκθλιψης από τους οικογενειακούς ελαιώνες και χειροποίητη σπάτουλα από ξύλο ελιάς.',
    pairing: {
      dish: 'Complete Greek Gastronomy Board',
      note: 'The premier luxury gift for food connoisseurs, weddings, and executive patrons.',
    },
    pairingEl: {
      dish: 'Ολοκληρωμένη Ελληνική Γαστρονομική Εμπειρία',
      note: 'Το ιδανικό δώρο υψηλού κύρους για λάτρεις της γαστρονομίας, επετείους και εταιρικούς συνεργάτες.',
    },
    options: [
      { size: 'Luxury Gift Hamper Box', weightKg: 1.25, price: 120, priceKg: 96 },
    ],
  },
];

// ─── Membership Plans ─────────────────────────────────────────────────────────
const MEMBERSHIPS = [
  {
    id: 'starter',
    priceId: STARTER_PRICE_ID,
    name: 'Starter Guardianship',
    subtitle: '2.5 kg Raw Honey · 3 Seasonal Harvest Deliveries',
    price: 140,
    perKg: 56,
    retailJarValue: 260, // 2.5kg @ ~€104/kg
    highlight: false,
    perks: [
      'Welcome jar (250g) shipped within 2 weeks of adoption',
      '2 full seasonal harvest deliveries (~800g and ~1.45kg)',
      'Live Apiary Journal: live hive weight, temperature & climate',
      'Free EU shipping on all 3 deliveries included',
      'Eurofins laboratory certificate of 100% purity & zero residues',
      'Standard guardian apiary certificate',
    ],
  },
  {
    id: 'premium',
    priceId: PREMIUM_PRICE_ID,
    name: 'Premium Patron',
    subtitle: '5 kg Raw Honey · Dedicated Named Hive · Private Visit',
    price: 340,
    perKg: 68,
    retailJarValue: 520, // 5kg @ ~€104/kg
    highlight: true,
    perks: [
      'Welcome stone crock (1 kg) shipped immediately',
      '3 full seasonal harvests (~1.3kg each) delivered to your door',
      'Your name personally printed on every jar label & wooden hive plaque',
      'Framable Certificate of Hive Adoption on parchment',
      'Wax-sealed handwritten harvest letter from Petros with each batch',
      'OPEN INVITATION: Private apiary tasting & tour in Mani, Greece',
      'Priority express shipping & access to ultra-rare private reserve batches',
    ],
  },
];

// ─── Minimal Luxury Heritage Header ──────────────────────────────────────────
function ProvenanceBar() {
  const { language } = useLanguage();
  const isEl = language === 'el';
  return (
    <div className="w-full bg-[#1A1208] text-pale-honey/80 border-b border-honey/15 py-2 px-6 flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em]">
      <span>{isEl ? 'Οικογενειακά Μελισσοκομεία Οικονομάκου' : 'Oikonomakos Family Apiaries'}</span>
      <span className="text-honey/30">·</span>
      <span>{isEl ? '100% Αγνό · Ανεπεξέργαστο · Αφιλτράριστο' : '100% Raw · Unfiltered · Single-Estate'}</span>
      <span className="text-honey/30 hidden sm:inline">·</span>
      <span className="hidden sm:inline">{isEl ? 'Μάνη & Σπάρτη, Λακωνία' : 'Mani & Sparta, Laconia'}</span>
    </div>
  );
}

// ─── Interactive Live Jar Label Preview ───────────────────────────────────────
function InteractiveJarLabelPreview() {
  const { language } = useLanguage();
  const isEl = language === 'el';
  const [guardianName, setGuardianName] = useState(isEl ? 'Κωνσταντίνος Παπαδόπουλος' : 'Elena Müller');
  const [hiveNumber] = useState('247');

  return (
    <div className="border border-honey/30 bg-hive-panel rounded-[2px] p-4 sm:p-8 md:p-12 relative overflow-hidden shadow-sm my-10 sm:my-16">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-10">
        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex items-center gap-2 text-honey">
            <Sparkles size={16} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black">
              {isEl ? 'Προσωποποιημένη Προέλευση' : 'Personalized Provenance'}
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#2A1B0A] leading-tight">
            {isEl ? 'Δείτε το όνομά σας στη συλλεκτική σοδειά του Πέτρου.' : "See your name on Petros' reserve harvest."}
          </h3>
          <p className="text-xs text-[#2A1B0A]/70 leading-relaxed font-light">
            {isEl
              ? 'Ως Επίτιμος Προστάτης (€340/έτος), η κυψέλη σας στη Λάγια φέρει ξύλινη επιγραφή με το όνομά σας, και κάθε εποχιακό βάζο τυπώνεται με τα επίσημα στοιχεία αναδοχής σας.'
              : 'As a Premium Patron (€340/yr), your physical hive in Lagia is tagged with your name, and every seasonal jar delivered to your kitchen is custom-printed with your official guardianship details.'}
          </p>

          <div className="pt-2">
            <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold mb-1.5">
              {isEl ? 'Πληκτρολογήστε το όνομά σας ή του παραλήπτη δώρου:' : 'Type your name or gift recipient:'}
            </label>
            <input
              type="text"
              value={guardianName}
              onChange={e => setGuardianName(e.target.value)}
              placeholder={isEl ? 'π.χ. Δημήτριος Βασιλείου' : 'e.g. Dr. Thomas Vance'}
              maxLength={36}
              className="w-full bg-white/80 border border-honey/40 px-4 py-3 text-base sm:text-sm text-[#2A1B0A] rounded-[2px] focus:outline-none focus:border-honey font-medium"
            />
          </div>
        </div>

        {/* Real-time Jar Label Render */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-[340px] bg-[#FFFDF9] border-[3px] border-[#C8860A] p-4 sm:p-6 shadow-xl rounded-[2px] text-center relative overflow-hidden">
            <div className="absolute inset-1 border border-[#C8860A]/30 pointer-events-none" />
            <div className="text-[8px] uppercase tracking-[0.35em] text-[#C8860A] font-bold mb-1">
              {isEl ? 'Μελισσοκομεία Πέτρου Οικονομάκου · Από το 1996' : 'Petros Oikonomakos Apiaries · Est. 1996'}
            </div>
            <div className="w-10 h-[1px] bg-[#C8860A]/40 mx-auto my-2" />
            <div className="text-[9px] uppercase tracking-[0.25em] text-[#2A1B0A]/60 font-serif italic mb-1">
              {isEl ? 'Χερσόνησος Μάνης · Λακωνία, Ελλάδα' : 'Mani Peninsula · Laconia, Greece'}
            </div>
            <div className="font-display text-2xl text-[#1A1208] my-2 leading-tight">
              {isEl ? 'Συλλεκτικό Αγνό Μέλι' : 'Reserve Raw Honey'}
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#C8860A] font-bold my-1">
              {isEl ? `Κυψέλη Αποικίας #${hiveNumber}` : `Hive Colony #${hiveNumber}`}
            </div>

            <div className="my-3 py-2 border-y border-[#C8860A]/20 bg-[#C8860A]/5">
              <div className="text-[8px] uppercase tracking-widest text-[#2A1B0A]/50">
                {isEl ? 'Επίσημος Ανάδοχος' : 'Dedicated Guardian'}
              </div>
              <div className="font-display text-lg text-[#1A1208] italic font-semibold truncate px-2">
                {guardianName.trim() || (isEl ? 'Το Όνομά Σας Εδώ' : 'Your Name Here')}
              </div>
            </div>

            <div className="flex justify-between text-[7px] uppercase tracking-widest text-[#2A1B0A]/60 pt-1 font-sans font-medium">
              <span>{isEl ? 'Ανεπεξέργαστο' : 'Unheated · Raw'}</span>
              <span>{isEl ? 'Έλεγχος Eurofins' : 'Eurofins Certified'}</span>
              <span>100% Greek</span>
            </div>

            <div className="mt-2 pt-1.5 border-t border-[#C8860A]/20 text-[8px] uppercase tracking-wider text-[#C8860A] font-bold flex items-center justify-center gap-1">
              <span>{isEl ? 'Έλεγχος Παρτίδας:' : 'QR Verified Batch:'}</span>
              <Link to="/verify" className="underline hover:text-[#1A1208] font-mono">
                hiveshare.gr/verify
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Individual Jar Card ──────────────────────────────────────────────────────
function JarCard({
  jar,
  onBuy,
}: {
  jar: JarItem;
  onBuy: (jar: JarItem, option: JarOption) => void;
}) {
  const { language } = useLanguage();
  const isEl = language === 'el';
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showPairing, setShowPairing] = useState(false);
  const activeOption = jar.options[selectedIdx];

  const displayVariety = isEl ? jar.varietyEl : jar.variety;
  const displayOrigin = isEl ? jar.originEl : jar.origin;
  const displaySeason = isEl ? jar.seasonEl : jar.season;
  const displayElevation = isEl ? jar.elevationEl : jar.elevation;
  const displayBotanical = isEl ? jar.botanicalDominanceEl : jar.botanicalDominance;
  const displayMoisture = isEl ? jar.moistureEl : jar.moisture;
  const displayCharacter = isEl ? jar.characterEl : jar.character;
  const displayPairing = isEl ? jar.pairingEl : jar.pairing;

  return (
    <div className="group relative border border-honey/20 bg-hive-panel/60 hover:border-honey/40 transition-all duration-500 rounded-[2px] overflow-hidden flex flex-col shadow-sm">
      <div className="relative w-full h-48 overflow-hidden bg-hive-dark/5">
        <img
          src={jar.image}
          alt={displayVariety}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hive-panel via-transparent to-transparent opacity-90" />
        <div className="absolute bottom-3 left-4 text-[8px] uppercase tracking-widest text-honey font-bold">
          {displaySeason}
        </div>
        <div className="absolute top-3 right-3 bg-[#1A1208]/85 backdrop-blur-sm border border-honey/30 text-pale-honey px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm">
          €{activeOption.priceKg}/kg
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 gap-3.5">
        <div>
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-honey/80 font-bold mb-1">
            <MapPin size={10} /> {displayOrigin}
          </div>
          <h3 className="font-display text-2xl text-[#2A1B0A] leading-tight">{displayVariety}</h3>
        </div>

        {/* Vintage Grand Cru Specs */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-white/50 border border-honey/15 rounded-sm text-[9px]">
          <div>
            <span className="text-[#2A1B0A]/40 block uppercase tracking-wider font-bold">
              {isEl ? 'Υψόμετρο' : 'Elevation'}
            </span>
            <span className="text-[#2A1B0A] font-medium">{displayElevation}</span>
          </div>
          <div>
            <span className="text-[#2A1B0A]/40 block uppercase tracking-wider font-bold">
              {isEl ? 'Υγρασία' : 'Moisture'}
            </span>
            <span className="text-[#2A1B0A] font-medium">{displayMoisture.split(' ')[0]}</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-honey/10">
            <span className="text-[#2A1B0A]/40 block uppercase tracking-wider font-bold">
              {isEl ? 'Βοτανική Αναλογία' : 'Botanical Ratio'}
            </span>
            <span className="text-[#2A1B0A] font-medium truncate block">{displayBotanical}</span>
          </div>
        </div>

        <p className="text-xs text-[#2A1B0A]/70 leading-relaxed font-normal">
          {displayCharacter}
        </p>

        {/* Culinary Pairing & Spoon Ritual Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPairing(!showPairing)}
              className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-honey hover:text-[#2A1B0A] transition-colors"
            >
              <Utensils size={10} /> {showPairing ? (isEl ? 'Απόκρυψη' : 'Hide') : (isEl ? 'Γαστρονομία & Συνδυασμός' : 'Culinary Pairing Guide')}
            </button>
            <span className="text-[9px] text-[#2A1B0A]/40 font-mono italic">
              {isEl ? '100% Ανεπεξέργαστο' : '100% Raw Bioactive'}
            </span>
          </div>
          {showPairing && (
            <div className="mt-2 p-3 bg-hive-bg border border-honey/20 rounded-sm text-xs space-y-1.5 animate-in fade-in duration-200">
              <div className="font-bold text-[#2A1B0A]">{displayPairing.dish}</div>
              <p className="text-[11px] text-[#2A1B0A]/70 leading-normal font-light">{displayPairing.note}</p>
              <div className="text-[10px] text-honey font-serif italic pt-1 border-t border-honey/15">
                {isEl ? 'Σερβίρετε κατά προτίμηση με ξύλινο ή κεραμικό κουτάλι για προστασία των φυσικών ενζύμων.' : 'Best served with an olive wood or horn spoon to preserve living bio-enzymes.'}
              </div>
            </div>
          )}
        </div>

        {/* Size Selector */}
        <div className="flex items-center gap-2 pt-2 border-t border-honey/10 mt-auto">
          <span className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/40 font-bold">
            {isEl ? 'Μέγεθος:' : 'Size:'}
          </span>
          <div className="flex gap-2 flex-1">
            {jar.options.map((opt, i) => (
              <button
                key={opt.size}
                type="button"
                onClick={() => setSelectedIdx(i)}
                className={`flex-1 py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all border ${
                  selectedIdx === i
                    ? 'bg-honey text-[#2A1B0A] border-honey shadow-sm'
                    : 'bg-white/40 text-[#2A1B0A]/70 border-honey/20 hover:border-honey/40'
                }`}
              >
                {opt.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Buy Action */}
        <div className="flex items-end justify-between pt-2 border-t border-honey/10">
          <div>
            <div className="font-display text-3xl text-honey leading-none">€{activeOption.price}</div>
            <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/50 font-bold mt-1">
              {activeOption.size} · €{activeOption.priceKg}/kg
            </div>
          </div>
          <button
            type="button"
            onClick={() => onBuy(jar, activeOption)}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold bg-[#2A1B0A] text-pale-honey hover:bg-honey hover:text-[#2A1B0A] px-4 py-2.5 transition-all duration-300 rounded-[2px] shadow-sm active:scale-95"
          >
            <ShoppingBag size={12} /> {isEl ? 'Αγορά Βάζου' : 'Buy Jar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Direct Jar Checkout Modal ────────────────────────────────────────────────
interface SelectedJarPurchase {
  jar: JarItem;
  option: JarOption;
  quantity: number;
}

function JarCheckoutModal({
  item,
  onClose,
  onSwitchToMembership,
}: {
  item: SelectedJarPurchase;
  onClose: () => void;
  onSwitchToMembership: (planId: string) => void;
}) {
  const { language } = useLanguage();
  const isEl = language === 'el';
  const [quantity, setQuantity] = useState(item.quantity);
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Germany');
  const [phone, setPhone] = useState('');

  const totalWeightKg = (item.option.weightKg * quantity);
  const subtotal = item.option.price * quantity;
  const shipping = subtotal >= 90 ? 0 : 8;
  const grandTotal = subtotal + shipping;

  const itemVariety = isEl ? item.jar.varietyEl : item.jar.variety;
  const itemOrigin = isEl ? item.jar.originEl : item.jar.origin;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !address || !city) return;

    setIsSubmitting(true);
    const ref = `HS-JAR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderRef(ref);

    try {
      await addDoc(collection(db, 'jar_orders'), {
        orderRef: ref,
        variety: item.jar.variety,
        size: item.option.size,
        weightKg: totalWeightKg,
        pricePerKg: item.option.priceKg,
        quantity,
        subtotal,
        shipping,
        grandTotal,
        isGift,
        giftNote,
        customer: { fullName, email, address, city, postalCode, country, phone },
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      const fullAddress = `${address}, ${city}, ${postalCode}, ${country}`;
      const itemsDesc = `${quantity}x ${item.jar.variety} (${item.option.size})`;

      // 1. Automatic Order Confirmation Email to Customer
      sendEmail(emailTemplates.jarOrderConfirmation(
        ref,
        fullName,
        email,
        itemsDesc,
        grandTotal,
        fullAddress
      )).catch(console.error);

      // 2. Automatic Order Alert to Gregory
      sendEmail(emailTemplates.adminNewJarOrderAlert(
        ref,
        fullName,
        email,
        itemsDesc,
        grandTotal,
        fullAddress
      )).catch(console.error);

      setIsSuccess(true);
    } catch (err) {
      console.error('Order save error:', err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 bg-hive-bg border border-honey/30 rounded-[2px] shadow-[0_0_80px_rgba(200,134,10,0.18)] w-full max-w-xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="sticky top-0 bg-hive-bg/95 backdrop-blur-md border-b border-honey/10 px-4 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between z-20">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold">
              {isEl ? 'Απευθείας Αγορά Μελιού' : 'Direct Honey Purchase'}
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-[#2A1B0A]">
              {isEl ? 'Παραγγελία Μονοποικιλιακής Σοδειάς' : 'Single Batch Harvest Order'}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#2A1B0A]/40 hover:text-[#2A1B0A] transition-colors p-1.5" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 sm:p-8 md:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-honey/10 border border-honey/40 flex items-center justify-center mx-auto text-honey">
              <PackageCheck size={32} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold mb-1">
                {isEl ? 'Η Παραγγελία Καταχωρήθηκε' : 'Order Registered'}
              </div>
              <h4 className="font-display text-2xl sm:text-3xl text-[#2A1B0A]">
                {isEl ? `Σας ευχαριστούμε, ${fullName || 'Ανάδοχε'}` : `Thank you, ${fullName || 'Guardian'}`}
              </h4>
              <p className="text-xs font-mono text-[#2A1B0A]/50 mt-1">
                {isEl ? `Κωδικός Παραγγελίας: ${orderRef}` : `Reference ID: ${orderRef}`}
              </p>
            </div>
            <p className="text-sm text-[#2A1B0A]/75 leading-relaxed max-w-md mx-auto">
              {isEl
                ? `Η παραγγελία σας για ${quantity}x ${itemVariety} (${item.option.size}) καταχωρήθηκε από την ομάδα του Πέτρου στη Λακωνία. Κάθε βάζο τυλίγεται προσεκτικά και αποστέλλεται εντός 3–5 εργάσιμων ημερών.`
                : `Your order for ${quantity}x ${item.jar.variety} (${item.option.size}) has been received by Petros' team in Laconia. Each jar is individually wrapped and shipped within 3–5 business days.`}
            </p>
            <div className="p-4 bg-hive-panel border border-honey/20 rounded-[2px] text-xs text-[#2A1B0A]/80 text-left space-y-1 max-w-md mx-auto">
              <div className="flex justify-between">
                <span>{isEl ? 'Σύνολο:' : 'Grand Total:'}</span>
                <strong className="text-honey">€{grandTotal}.00</strong>
              </div>
              <div className="flex justify-between">
                <span>{isEl ? 'Προορισμός:' : 'Destination:'}</span>
                <span>{city}, {country}</span>
              </div>
              <div className="flex justify-between">
                <span>{isEl ? 'Προέλευση:' : 'Provenance:'}</span>
                <span>{itemOrigin}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-honey text-[#2A1B0A] px-8 py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-honey/90 transition-all rounded-[2px]"
            >
              {isEl ? 'Ολοκλήρωση' : 'Done'}
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            {/* Selected Item Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-hive-panel/80 border border-honey/20 rounded-[2px]">
              <div className="flex items-center gap-3.5">
                <img src={item.jar.image} alt={item.jar.variety} className="w-12 sm:w-14 h-12 sm:h-14 object-cover rounded-[2px] border border-honey/20 shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-display text-base sm:text-lg text-[#2A1B0A] leading-snug truncate">{item.jar.variety}</h4>
                  <div className="text-[10px] uppercase tracking-wider text-[#2A1B0A]/60 font-bold">
                    {item.option.size} · <span className="text-honey">€{item.option.priceKg}/kg</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-honey/15">
                <div className="flex items-center border border-honey/30 rounded-[2px] bg-white/60">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1.5 text-[#2A1B0A]/60 hover:text-honey"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-2.5 text-xs font-bold text-[#2A1B0A]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1.5 text-[#2A1B0A]/60 hover:text-honey"
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <div className="font-display text-xl sm:text-2xl text-honey min-w-[60px] text-right font-semibold">
                  €{subtotal}
                </div>
              </div>
            </div>

            {/* ── THE HIGH-CONVERTING HIVESHARE VALUE ANCHOR ── */}
            <div className="p-4 sm:p-5 bg-[#1A1208] text-cream border border-honey/40 rounded-[2px] space-y-3 relative overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 text-honey text-[10px] uppercase tracking-widest font-bold">
                Consider HiveShare Guardianship
              </div>
              <p className="text-xs text-cream/80 leading-relaxed font-light">
                You are paying <strong className="text-pale-honey">€{item.option.priceKg}/kg</strong> for individual honey ({totalWeightKg}kg for €{subtotal}).
                For <strong className="text-pale-honey">€140/year</strong>, HiveShare Starter gives you <strong className="text-pale-honey">2.5 kg of honey (€56/kg)</strong> — plus your own hive telemetry, apiary journal, and free EU shipping across 3 deliveries!
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 items-center justify-between border-t border-honey/20">
                <span className="text-[10px] uppercase tracking-wider text-honey font-bold">
                  Get 2.5 kg for €140 (~€56/kg)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToMembership('starter');
                  }}
                  className="w-full sm:w-auto bg-honey text-[#2A1B0A] hover:bg-honey/90 px-4 py-2 text-[10px] uppercase tracking-widest font-black rounded-[2px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  Upgrade to Starter HiveShare <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Direct Order Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-4 pt-1">
              <div className="flex items-center justify-between border-b border-honey/10 pb-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#2A1B0A]/60 font-bold">
                  Shipping Destination
                </span>
                <button
                  type="button"
                  onClick={() => setIsGift(!isGift)}
                  className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-honey hover:text-[#2A1B0A]"
                >
                  <Gift size={12} /> {isGift ? '✓ Gift Mode Active' : '+ Send as Gift'}
                </button>
              </div>

              {isGift && (
                <div className="p-3 bg-honey/10 border border-honey/30 rounded-[2px] space-y-2 animate-in fade-in duration-200">
                  <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A] font-bold">
                    Gift Dedication Note (printed on parchment by Petros):
                  </label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={e => setGiftNote(e.target.value)}
                    placeholder="Wishing you health and golden mornings from the Mani mountains. Love, Marcus"
                    className="w-full bg-white/90 border border-honey/30 p-2.5 text-base sm:text-xs rounded-[2px] text-[#2A1B0A] focus:outline-none focus:border-honey"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold mb-1">
                    {isGift ? 'Recipient Full Name *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Elena Müller"
                    className="w-full bg-white/70 border border-honey/30 px-3.5 py-2.5 text-base sm:text-xs rounded-[2px] text-[#2A1B0A] focus:outline-none focus:border-honey"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="elena@example.de"
                    className="w-full bg-white/70 border border-honey/30 px-3.5 py-2.5 text-base sm:text-xs rounded-[2px] text-[#2A1B0A] focus:outline-none focus:border-honey"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Kastanienallee 14"
                  className="w-full bg-white/70 border border-honey/30 px-3.5 py-2.5 text-base sm:text-xs rounded-[2px] text-[#2A1B0A] focus:outline-none focus:border-honey"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="10119"
                    className="w-full bg-white/70 border border-honey/30 px-3.5 py-2.5 text-base sm:text-xs rounded-[2px] text-[#2A1B0A] focus:outline-none focus:border-honey"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Berlin"
                    className="w-full bg-white/70 border border-honey/30 px-3.5 py-2.5 text-base sm:text-xs rounded-[2px] text-[#2A1B0A] focus:outline-none focus:border-honey"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold mb-1">Country *</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full bg-white/70 border border-honey/30 px-2 py-2.5 text-base sm:text-xs rounded-[2px] text-[#2A1B0A] focus:outline-none focus:border-honey"
                  >
                    <option value="Germany">Germany</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Austria">Austria</option>
                    <option value="Belgium">Belgium</option>
                    <option value="France">France</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Greece">Greece</option>
                    <option value="Other EU">Other EU</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold mb-1">Phone (for courier delivery notifications)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+49 170 1234567"
                  className="w-full bg-white/70 border border-honey/30 px-3.5 py-2.5 text-base sm:text-xs rounded-[2px] text-[#2A1B0A] focus:outline-none focus:border-honey"
                />
              </div>

              {/* Cost Summary */}
              <div className="pt-4 border-t border-honey/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#2A1B0A]/70">
                  <span>Honey ({quantity} jar{quantity > 1 ? 's' : ''} · {totalWeightKg} kg):</span>
                  <span>€{subtotal}.00</span>
                </div>
                <div className="flex justify-between text-[#2A1B0A]/70">
                  <span>Shipping direct from Mani apiaries:</span>
                  <span>{shipping === 0 ? <strong className="text-honey">FREE (over €90)</strong> : `€${shipping}.00`}</span>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-honey/20">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/50 font-bold">Total Order Value:</span>
                    <div className="text-[10px] text-honey font-bold mt-0.5">Includes Greek VAT & protective packaging</div>
                  </div>
                  <div className="font-display text-4xl text-[#2A1B0A]">€{grandTotal}.00</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#2A1B0A] text-pale-honey hover:bg-honey hover:text-[#2A1B0A] text-xs uppercase tracking-[0.2em] font-bold rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Registering Order…</>
                ) : (
                  <>Complete Jar Purchase — €{grandTotal}.00 <ArrowRight size={14} /></>
                )}
              </button>

              <div className="text-center text-[9px] uppercase tracking-widest text-[#2A1B0A]/40 font-bold flex items-center justify-center gap-4">
                <span>Direct Beekeeper Batch</span>
                <span>·</span>
                <span>Protected Glass Shipments</span>
                <span>·</span>
                <span>Eurofins Certified</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Value Comparison Section ─────────────────────────────────────────────────
function ValueComparisonSection() {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <div className="my-10 sm:my-20 border border-honey/30 bg-hive-panel rounded-[2px] p-4 sm:p-8 md:p-14 relative overflow-hidden shadow-sm">
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 sm:gap-12">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-honey">
            <TrendingDown size={18} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black">
              {isEl ? 'Γιατί η Αναδοχή Κυψέλης Αξίζει Περισσότερο' : 'Why HiveShare Guardianship Pays For Itself'}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl text-[#2A1B0A] leading-[1.1] font-light">
            {isEl ? (
              <>Τα μεμονωμένα βάζα φτάνουν τα <span className="italic text-honey font-normal">112€/kg</span>.<br className="hidden sm:inline" /> Οι ανάδοχοι πληρώνουν μόλις <span className="italic text-honey font-normal">56€/kg</span>.</>
            ) : (
              <>Individual jars cost up to <span className="italic text-honey font-normal">€112/kg</span>.<br className="hidden sm:inline" /> Guardians pay as little as <span className="italic text-honey font-normal">€56/kg</span>.</>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[#2A1B0A]/75 leading-relaxed max-w-lg font-light">
            {isEl
              ? 'Υιοθετώντας μια ενεργή κυψέλη απευθείας, παρακάμπτετε εισαγωγείς και μεσάζοντες. Λαμβάνετε υπερδιπλάσια ποσότητα μελιού για τα χρήματά σας, συσκευασμένη κατευθείαν από το μελισσοκομείο στη Λακωνία.'
              : 'By sponsoring an active beehive directly, you bypass multi-tier luxury importers and supermarket distribution margins. You receive more than double the honey for your spend, packaged straight from the extractor cellars in Laconia.'}
          </p>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md">
            <div className="p-3.5 sm:p-4 bg-white/60 border border-honey/20 rounded-[2px]">
              <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/50 font-bold mb-1">
                {isEl ? 'Μεμονωμένα Βάζα' : 'Individual Single Jars'}
              </div>
              <div className="font-display text-xl sm:text-2xl text-[#2A1B0A]">€88 – €112</div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/50">
                {isEl ? 'Ανά κιλό (λιανική)' : 'Per kilogram retail'}
              </div>
            </div>
            <div className="p-3.5 sm:p-4 bg-honey/15 border border-honey/40 rounded-[2px]">
              <div className="text-[9px] uppercase tracking-widest text-honey font-bold mb-1">
                {isEl ? 'Αναδοχή HiveShare' : 'HiveShare Guardianship'}
              </div>
              <div className="font-display text-xl sm:text-2xl text-honey font-bold">€56 – €68</div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-honey font-bold">
                {isEl ? 'Ανά κιλό (Έκπτωση έως 50%)' : 'Per kilogram (Save up to 50%)'}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="w-full lg:w-[440px] flex-shrink-0">
          <div className="border border-honey/25 rounded-[2px] overflow-hidden text-xs bg-hive-bg shadow-md">
            <div className="bg-[#1A1208] text-pale-honey/80 px-3.5 sm:px-6 py-2.5 sm:py-3.5 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-bold flex justify-between">
              <span>{isEl ? 'Κατηγορία Προέλευσης' : 'Provenance Tier'}</span>
              <span>{isEl ? 'Τελική Τιμή Μελιού' : 'Effective Honey Rate'}</span>
            </div>
            {(isEl ? [
              { mode: 'Άγριο Θυμάρι (Βάζο 250g)', rate: '€112 / kg', isMember: false },
              { mode: 'Αγριολούλουδα (Βάζο 500g)', rate: '€104 / kg', isMember: false },
              { mode: 'Μέλι Ελάτης (Βάζο 1 kg)', rate: '€88 / kg', isMember: false },
              { mode: 'Ορεινό Πευκόμελο (Βάζο 1 kg)', rate: '€88 / kg', isMember: false },
              { mode: 'Βασική Αναδοχή (2,5 kg)', rate: '56€ / kg (45% Έκπτωση)', isMember: true },
              { mode: 'Επίτιμος Προστάτης (5,0 kg)', rate: '68€ / kg (Επώνυμη)', isMember: true },
            ] : [
              { mode: 'Thyme & Sage (250g Jar)', rate: '€112 / kg', isMember: false },
              { mode: 'Wildflower & Vanilla (500g Jar)', rate: '€104 / kg', isMember: false },
              { mode: 'Black Fir Honey (1 kg Jar)', rate: '€88 / kg', isMember: false },
              { mode: 'Pine Mountain Honey (1 kg Jar)', rate: '€88 / kg', isMember: false },
              { mode: 'Starter Guardianship (2.5 kg)', rate: '€56 / kg (45% OFF)', isMember: true },
              { mode: 'Premium Patron (5.0 kg)', rate: '€68 / kg (Named)', isMember: true },
            ]).map((row, i) => (
              <div
                key={i}
                className={`flex justify-between items-center px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-honey/10 last:border-0 ${
                  row.isMember ? 'bg-honey/10 font-bold' : 'hover:bg-hive-panel/50'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                  {row.isMember && <span className="text-honey shrink-0">★</span>}
                  <span className={`truncate text-xs ${row.isMember ? 'text-[#2A1B0A]' : 'text-[#2A1B0A]/70'}`}>{row.mode}</span>
                </div>
                <span className={`font-mono shrink-0 ${row.isMember ? 'text-honey text-xs sm:text-sm font-bold' : 'text-[#2A1B0A]/50 text-xs'}`}>
                  {row.rate}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2.5 sm:mt-3 text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/40 font-bold text-center">
            {isEl
              ? 'Η αναδοχή περιλαμβάνει 3 εποχιακές παραδόσεις · ζωντανή τηλεμετρία IoT · πιστοποιητικά συγκομιδής'
              : 'Guardianships include 3 seasonal deliveries · live IoT telemetry · harvest certificates'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Membership Card ──────────────────────────────────────────────────────────
function MembershipCard({
  plan,
  onSelect,
}: {
  plan: typeof MEMBERSHIPS[0];
  onSelect: (id: string) => void;
}) {
  const { language } = useLanguage();
  const isEl = language === 'el';
  const displayPrice = plan.price;

  const planName = isEl ? (plan.id === 'starter' ? 'Βασική Αναδοχή' : 'Επίτιμος Προστάτης') : plan.name;
  const planSub = isEl
    ? (plan.id === 'starter' ? '2,5 kg Αγνό Μέλι · 3 Εποχιακές Παραδόσεις Σοδειάς' : '5,0 kg Αγνό Μέλι · Αποκλειστική Επώνυμη Κυψέλη · Ιδιωτική Επίσκεψη')
    : plan.subtitle;

  const planPerks = isEl ? (
    plan.id === 'starter' ? [
      'Βάζο καλωσορίσματος (250g) αποστέλλεται εντός 2 εβδομάδων',
      '2 πλήρεις εποχιακές παραδόσεις σοδειάς (~800g και ~1,45kg)',
      'Ζωντανό Ημερολόγιο Κυψέλης: βάρος, θερμοκρασία & κλίμα',
      'Δωρεάν αποστολή σε όλη την Ε.Ε. και στις 3 παραδόσεις',
      'Πιστοποιητικό εργαστηρίου Eurofins για 100% αγνότητα & μηδενικά κατάλοιπα',
      'Επίσημο πιστοποιητικό αναδόχου μελισσοκομείου',
    ] : [
      'Πήλινο δοχείο υποδοχής (1 kg) αποστέλλεται άμεσα',
      '3 πλήρεις εποχιακές συγκομιδές (~1,3kg έκαστη) στην πόρτα σας',
      'Το όνομά σας τυπωμένο σε κάθε ετικέτα βάζου & ξύλινη πλακέτα κυψέλης',
      'Επίσημο Πιστοποιητικό Αναδοχής σε περγαμηνή για κορνίζα',
      'Βουλοκερωμένη χειρόγραφη επιστολή συγκομιδής από τον Πέτρο σε κάθε παρτίδα',
      'ΑΝΟΙΧΤΗ ΠΡΟΣΚΛΗΣΗ: Ιδιωτική γευσιγνωσία & ξενάγηση στο μελισσοκομείο στη Μάνη',
      'Προτεραιότητα αποστολής & πρόσβαση σε σπάνιες συλλεκτικές σοδειές',
    ]
  ) : plan.perks;

  return (
    <div className={`relative flex flex-col rounded-[2px] border transition-all duration-500 ${
      plan.highlight
        ? 'border-honey shadow-[0_20px_60px_rgba(200,134,10,0.15)] bg-hive-bg scale-[1.02] z-10'
        : 'border-honey/20 bg-hive-panel/60 hover:border-honey/40'
    }`}>
      {plan.highlight && (
        <div className="absolute top-0 right-0 bg-honey text-[#2A1B0A] text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
          {isEl ? 'Επίτιμο Επίπεδο · Επώνυμη Κυψέλη' : 'Patron Tier · Named Hive'}
        </div>
      )}

      <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex flex-col flex-1 gap-4 sm:gap-5">
        <div>
          <div className="text-[9px] uppercase tracking-widest font-bold text-[#2A1B0A]/50 mb-1">{planSub}</div>
          <h3 className="font-display text-2xl sm:text-3xl text-[#2A1B0A]">{planName}</h3>
        </div>

        <div className="flex items-end gap-3">
          <div className="font-display text-5xl sm:text-6xl text-honey leading-none">€{displayPrice}</div>
          <div className="flex flex-col mb-1">
            <span className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/40 font-bold">
              {isEl ? '/έτος' : '/year'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-honey bg-honey/10 border border-honey/20 px-2.5 py-1 rounded-[2px]">
            <TrendingDown size={11} /> {isEl ? `Τελική τιμή: €${plan.perKg}/kg` : `Effective rate: €${plan.perKg}/kg`}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/40 font-bold">
            {isEl ? `(Αντίστοιχη αξία βάζων: ~€${plan.retailJarValue})` : `(Equivalent jar value: ~€${plan.retailJarValue})`}
          </div>
        </div>

        {plan.highlight && (
          <div className="p-3 bg-honey/10 border border-honey/30 rounded-[2px] text-xs text-[#2A1B0A] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-honey">
              <Compass size={12} /> {isEl ? 'Ανοιχτή Πρόσκληση στη Μάνη' : 'Open Invitation to Mani, Greece'}
            </div>
            <p className="text-[11px] text-[#2A1B0A]/70 leading-normal">
              {isEl
                ? 'Επισκεφθείτε τον Πέτρο στη Λάγια όποτε ταξιδέψετε στην Ελλάδα για ιδιωτική ξενάγηση και δοκιμή μελιών.'
                : 'Visit Petros in Lagia anytime you travel to Greece for a private apiary tasting and hive tour.'}
            </p>
          </div>
        )}

        <ul className="space-y-3 pt-2">
          {planPerks.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#2A1B0A]/80">
              <span className="text-honey mt-0.5 shrink-0">—</span>
              {f}
            </li>
          ))}
        </ul>

        <button
          id={`membership-${plan.id}`}
          onClick={() => onSelect(plan.id)}
          className={`mt-auto w-full py-4 rounded-[2px] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 group flex items-center justify-center gap-3 active:scale-[0.98] ${
            plan.highlight
              ? 'bg-honey text-[#2A1B0A] hover:bg-honey/90 shadow-[0_0_20px_rgba(200,134,10,0.25)]'
              : 'border border-honey/40 text-[#2A1B0A] hover:bg-honey hover:border-honey'
          }`}
        >
          {plan.highlight ? (
            <>{isEl ? `Υιοθεσία (Επίτιμος Προστάτης) — €${displayPrice}` : `Adopt Hive (Premium Patron) — €${displayPrice}`} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" /></>
          ) : (
            <>{isEl ? `Υιοθεσία (Βασική) — €${displayPrice}` : `Adopt Hive (Starter) — €${displayPrice}`} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest text-[#2A1B0A]/30 font-bold">
          <ShieldCheck size={10} /> {isEl ? 'Άμεση Πληρωμή μέσω Stripe · Δωρεάν Αποστολή στην Ε.Ε.' : 'Instant Stripe Checkout · Free EU Shipping'}
        </div>
      </div>
    </div>
  );
}

// ─── Membership Stripe Checkout Modal ─────────────────────────────────────────
function MembershipCheckoutModal({
  planId,
  onClose,
}: {
  planId: string;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const plan = MEMBERSHIPS.find(p => p.id === planId)!;
  const displayPrice = plan.price;
  const priceId = plan.id === 'premium' ? PREMIUM_PRICE_ID : STARTER_PRICE_ID;

  const [hasOil, setHasOil] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const total = displayPrice + (hasOil ? 18 : 0);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/buy-honey' } });
      return;
    }
    setIsRedirecting(true);
    setErrorStatus(null);
    try {
      const line_items = [{ price: priceId, quantity: 1 }];
      if (hasOil) line_items.push({ price: OIL_PRICE_ID, quantity: 1 });
      const docRef = await addDoc(collection(db, 'customers', user.uid, 'checkout_sessions'), {
        line_items,
        success_url: `${window.location.origin}/success?tier=${plan.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/buy-honey`,
        allow_promotion_codes: true,
        metadata: { tier: plan.id, source: 'buy-honey-page' },
      });
      const timeout = setTimeout(() => {
        setIsRedirecting(false);
        setErrorStatus('The payment service took too long to respond. Please try again.');
      }, 15000);
      onSnapshot(doc(db, 'customers', user.uid, 'checkout_sessions', docRef.id), (snap) => {
        const data = snap.data();
        if (data?.url) { clearTimeout(timeout); window.location.assign(data.url); }
        else if (data?.error) {
          clearTimeout(timeout);
          setIsRedirecting(false);
          setErrorStatus(data.error.message || 'Error from Stripe.');
        }
      });
    } catch (err: any) {
      setIsRedirecting(false);
      setErrorStatus(err.message || 'Failed to initiate checkout.');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />
      <div className="relative z-10 bg-hive-bg border border-honey/30 rounded-[2px] shadow-[0_0_80px_rgba(200,134,10,0.15)] w-full max-w-lg animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-honey/10">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold mb-1">Annual HiveShare Membership</div>
            <h3 className="font-display text-2xl text-[#2A1B0A]">{plan.name} · €{displayPrice}/yr</h3>
          </div>
          <button onClick={onClose} className="text-[#2A1B0A]/30 hover:text-[#2A1B0A] transition-colors"><X size={20} /></button>
        </div>
        <div className="px-8 py-6 space-y-5">
          <div className="flex justify-between items-center py-3 border-b border-honey/10">
            <div>
              <div className="text-sm font-medium text-[#2A1B0A]">{plan.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40">{plan.subtitle}</div>
            </div>
            <div className="font-display text-2xl text-honey">€{displayPrice}</div>
          </div>
          <button
            onClick={() => setHasOil(v => !v)}
            className={`w-full flex items-center justify-between p-4 rounded-[2px] border transition-all duration-300 ${hasOil ? 'bg-honey/5 border-honey/30' : 'bg-white/5 border-white/10 hover:border-honey/20'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${hasOil ? 'bg-honey border-honey text-[#2A1B0A]' : 'border-[#2A1B0A]/20'}`}><Check size={11} /></div>
              <div className="text-left">
                <div className="text-sm text-[#2A1B0A] font-medium">+ Laconian Olive Oil 500ml</div>
                <div className="text-[9px] uppercase tracking-widest text-honey/60 font-bold">Single-estate cold-pressed · + €18</div>
              </div>
            </div>
          </button>
          <div className="flex items-center justify-between text-xs text-honey font-bold">
            <span className="flex items-center gap-2"><Truck size={12} /> Free EU Shipping on all 3 seasonal harvests</span>
            <span>€0.00</span>
          </div>
          <div className="flex justify-between items-end border-t border-honey/10 pt-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#2A1B0A]/40 font-bold">Order Total</div>
            <div className="font-display text-5xl text-[#2A1B0A]">€{total}</div>
          </div>
          {errorStatus && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[2px] text-red-600 text-xs flex gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {errorStatus}
            </div>
          )}
          <button
            id="checkout-confirm-btn"
            onClick={handleCheckout}
            disabled={isRedirecting}
            className={`w-full py-5 rounded-[2px] text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
              isRedirecting ? 'bg-white/5 text-[#2A1B0A]/20 cursor-not-allowed' : 'bg-honey text-[#2A1B0A] hover:bg-honey/90 shadow-[0_0_20px_rgba(200,134,10,0.25)] active:scale-[0.98]'
            }`}
          >
            {isRedirecting ? (
              <><Loader2 size={16} className="animate-spin" /> Preparing Stripe Checkout…</>
            ) : user ? (
              <>Complete Adoption · €{total} <ArrowRight size={16} /></>
            ) : (
              <>Sign In to Checkout · €{total} <ArrowRight size={16} /></>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest text-[#2A1B0A]/30 font-bold">
            <Lock size={10} /> Powered by Stripe · 256-bit TLS Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BuyHoney() {
  const { user } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const isEl = language === 'el';

  // Modals state
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedJarPurchase, setSelectedJarPurchase] = useState<SelectedJarPurchase | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenJarPurchase = (jar: JarItem, option: JarOption) => {
    setSelectedJarPurchase({ jar, option, quantity: 1 });
  };

  return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A] font-body selection:bg-honey selection:text-[#2A1B0A]">

      {/* Provenance Header Bar */}
      <ProvenanceBar />

      {/* Nav */}
      <header className="border-b border-honey/10 bg-hive-bg/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-wide">
            Hive<span className="text-honey">Share</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-honey/30 bg-[#FFFDF5] text-[11px] font-medium tracking-wider uppercase hover:border-honey text-[#2A1B0A] transition-all"
              title="Εναλλαγή Γλώσσας / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-honey" />
              <span>{language === 'el' ? 'ΕΛ' : 'EN'}</span>
            </button>

            {/* Honey Concierge Quiz Button */}
            <button
              onClick={() => setIsConciergeOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-honey hover:text-[#2A1B0A] transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              {isEl ? 'Τεστ Γεύσης' : 'Palate Quiz'}
            </button>

            {user ? (
              <Link to="/dashboard" className="hidden sm:inline-block text-[10px] uppercase tracking-widest font-bold text-[#2A1B0A]/60 hover:text-honey transition-colors">
                {isEl ? 'Το Μελισσοκομείο μου' : 'My Apiary'}
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:inline-block text-[10px] uppercase tracking-widest font-bold text-[#2A1B0A]/60 hover:text-honey transition-colors">
                {isEl ? 'Σύνδεση' : 'Log In'}
              </Link>
            )}
            <Link to="/" className="hidden sm:inline-block text-[10px] uppercase tracking-widest font-bold border border-honey/30 px-4 py-2 hover:bg-honey hover:text-[#2A1B0A] transition-colors rounded-[2px]">
              {isEl ? 'Σχετικά' : 'About'}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-[#2A1B0A] hover:text-honey transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-hive-bg/98 border-b border-honey/20 px-6 py-6 space-y-4 animate-in slide-in-from-top-3 duration-200">
            <button
              onClick={() => { setMobileMenuOpen(false); setIsConciergeOpen(true); }}
              className="w-full py-2.5 px-4 bg-honey/15 border border-honey/30 rounded-sm text-xs font-bold uppercase tracking-wider text-[#2A1B0A] flex items-center justify-center gap-2"
            >
              <Sparkles size={13} className="text-honey" /> {isEl ? 'Τεστ Γεύσης (Palate Quiz)' : 'Palate Quiz'}
            </button>
            <div className="flex flex-col space-y-3 pt-2 text-xs uppercase tracking-widest font-bold text-[#2A1B0A]/80">
              <a href="#jars" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey py-1">
                {isEl ? 'Μεμονωμένα Βάζα' : 'Single Batch Jars'}
              </a>
              <a href="#memberships" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey py-1">
                {isEl ? 'Επίπεδα Αναδοχής' : 'Guardianship Tiers'}
              </a>
              {user ? (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey py-1 text-honey">
                  {isEl ? 'Το Μελισσοκομείο μου' : 'My Apiary Portal'}
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey py-1">
                  {isEl ? 'Σύνδεση Λογαριασμού' : 'Log In'}
                </Link>
              )}
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey py-1">
                {isEl ? 'Αρχική Σελίδα' : 'Home / About'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative py-12 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="h-[1px] w-8 sm:w-10 bg-honey/40" />
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.4em] font-bold text-honey">
              {isEl ? 'Μελισσοκομεία Λακωνίας & Μάνης · Από το 1996' : 'Laconia & Mani Apiaries · Est. 1996'}
            </div>
            <div className="h-[1px] w-8 sm:w-10 bg-honey/40" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-light leading-[1.08] text-[#2A1B0A] mb-4 sm:mb-6">
            {isEl ? 'Αγνό Ελληνικό Ανεπεξέργαστο Μέλι.' : 'Artisanal Raw Greek Honey.'}<br className="hidden sm:inline" />
            {' '}<span className="italic text-honey drop-shadow-[0_0_20px_rgba(200,134,10,0.4)]">
              {isEl ? 'Αγοράστε Απευθείας ή Υιοθετήστε Κυψέλη.' : 'Buy Direct or Sponsor a Hive.'}
            </span>
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-[#2A1B0A]/70 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light">
            {isEl
              ? 'Αγοράστε σπάνια, αριθμημένα βάζα μίας σοδειάς, ή υιοθετήστε μια ενεργή κυψέλη για να λαμβάνετε τη σοδειά του Πέτρου σε προνομιακή τιμή (έως και 50% οικονομικότερα ανά κιλό). Αγνό, ανεπεξέργαστο, αφιλτράριστο.'
              : "Purchase rare, numbered single-batch jars directly, or adopt an active beehive to receive Petros' seasonal harvest at guardian rates (saving up to 50% per kilogram). Pure, unheated, unfiltered."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <button
              onClick={() => setIsConciergeOpen(true)}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-honey/15 border border-honey/40 text-[#2A1B0A] hover:bg-honey hover:text-[#2A1B0A] font-medium text-xs tracking-wider uppercase transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-honey" />
              <span>{isEl ? 'Βρείτε το Μέλι σας (Τεστ 30")' : 'Find Your Honey Match (30s Quiz)'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center space-x-4 sm:space-x-8">
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl mb-1 text-[#2A1B0A]">30+</div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold">
                {isEl ? 'Χρόνια Μελισσοκομίας' : 'Years beekeeping'}
              </div>
            </div>
            <div className="w-[1px] h-8 sm:h-10 bg-[#2A1B0A]/10" />
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl mb-1 text-honey">€56/kg</div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-honey font-bold">
                {isEl ? 'Τιμή HiveShare' : 'HiveShare Rate'}
              </div>
            </div>
            <div className="w-[1px] h-8 sm:h-10 bg-[#2A1B0A]/10" />
            <div className="text-center">
              <div className="font-display text-2xl sm:text-3xl mb-1 text-[#2A1B0A]">100%</div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold">
                {isEl ? 'Ανεπεξέργαστο & Αγνό' : 'Unheated & Raw'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Individual Jars Section (Buy Honey Immediately) ── */}
      <section id="jars" className="px-4 sm:px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-honey/15">
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-honey mb-1">
                {isEl ? 'Συλλεκτικά Βάζα Μονής Σοδειάς' : 'Single Batch Jars'}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#2A1B0A]">
                {isEl ? 'Αγορά Μεμονωμένων Βάζων' : 'Purchase Individual Jars'}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/50 font-bold">
                {isEl ? 'Τιμή Μεμονωμένου Βάζου' : 'Single Harvest Rate'}
              </div>
              <div className="font-display text-base sm:text-lg text-[#2A1B0A]">€88 – €112 / kg</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {JARS.map(jar => (
              <JarCard key={jar.id} jar={jar} onBuy={handleOpenJarPurchase} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Name on Jar Label Preview ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <InteractiveJarLabelPreview />
      </div>

      {/* ── Value Comparison: Why HiveShare Pays For Itself ── */}
      <section className="px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <ValueComparisonSection />
        </div>
      </section>

      {/* ── HiveShare Memberships Section ── */}
      <section id="memberships" className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-honey/15">
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-honey mb-1">
                {isEl ? 'Υιοθετήστε μια Ενεργή Κυψέλη' : 'Adopt an Active Beehive'}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#2A1B0A]">
                {isEl ? 'Επίπεδα Αναδοχής HiveShare' : 'HiveShare Guardianship Tiers'}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-honey font-bold">
                {isEl ? 'Τιμή Αναδόχου' : 'Guardian Rate'}
              </div>
              <div className="font-display text-base sm:text-lg text-honey">
                {isEl ? 'Από 56€ / kg' : 'From €56 / kg'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {MEMBERSHIPS.map(plan => (
              <MembershipCard key={plan.id} plan={plan} onSelect={setSelectedPlanId} />
            ))}
          </div>
        </div>
      </section>

      {/* Petros Story */}
      <section className="py-24 px-6 border-t border-honey/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -inset-4 border border-honey/15 rounded-[2px] -z-10 translate-x-2 translate-y-2" />
            <img
              src="/beekeeper.png"
              alt="Petros Oikonomakos — master beekeeper, Mani, Laconia"
              className="w-full aspect-[4/5] object-cover rounded-[2px] shadow-2xl sepia-[0.08] contrast-[1.05]"
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-8 h-[1px] bg-honey mb-8" />
            <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold mb-4">
              {isEl ? 'Αυθεντική Κληρονομιά Μάνης' : 'Authentic Mani Heritage'}
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#2A1B0A] mb-8 leading-tight">
              {isEl ? (
                <>Ο Πέτρος δεν τρυγά πρόωρα.<br /><span className="italic">Ποτέ δεν το έκανε.</span></>
              ) : (
                <>Petros doesn't harvest early.<br /><span className="italic">He never has.</span></>
              )}
            </h2>
            <p className="text-sm text-[#2A1B0A]/75 leading-relaxed mb-8">
              {isEl
                ? 'Το εμπορικό μέλι του εμπορίου παστεριώνεται και αναμιγνύεται από ανώνυμους διεθνείς εμπόρους. Ό,τι φτάνει στα ράφια των σούπερ μάρκετ έχει χάσει τα ένζυμα και τα διακριτικά του αρώματα.'
                : 'Commercial honey is pasteurized and blended from anonymous global brokers. What reaches grocery shelves has lost its enzymes and subtle botanical aromatics.'}
            </p>
            <p className="text-sm text-[#2A1B0A]/75 leading-relaxed mb-10">
              {isEl
                ? 'Ο Πέτρος εξάγει το μέλι εν ψυχρώ μόνο στην πλήρη ωρίμανσή του, δεν θερμαίνει ποτέ πάνω από τη φυσική θερμοκρασία της κυψέλης και το συσκευάζει απευθείας σε γυαλί. Είτε αγοράσετε ένα βάζο είτε υιοθετήσετε μια κυψέλη, αυτή είναι η πιο αγνή έκφραση της ελληνικής φύσης.'
                : 'Petros extracts raw, only at peak maturity, never heats above hive temperature, and packs straight into glass. Whether you buy a single jar or adopt a hive, this is the purest expression of Greek nature.'}
            </p>
            <div className="space-y-3">
              {(isEl ? [
                'Εξαγωγή μόνο στη φυσική θερμοκρασία της κυψέλης',
                'Μηδενικά πρόσθετα · Χωρίς ποτέ εισαγόμενες προσμίξεις',
                'Πιστοποίηση Eurofins: 100% αγνότητα & απαλλαγμένο φυτοφαρμάκων',
                'Αποστολή απευθείας από τη Λακωνία',
              ] : [
                'Extracted at natural hive temperature only',
                'Zero additives · Never blended with imports',
                'Eurofins-certified: 100% purity & pesticide free',
                'Shipped directly from Laconia, Greece',
              ]).map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#2A1B0A]/80">
                  <div className="w-5 h-5 rounded-full border border-honey/40 bg-honey/10 flex items-center justify-center shrink-0">
                    <Check size={10} className="text-honey" />
                  </div>
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <div className="py-24 px-6 bg-hive-panel/40 border-t border-honey/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="h-[1px] w-12 bg-honey/30" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-honey">
              {isEl ? 'Από τους Αναδόχους μας' : 'From Our Guardians'}
            </p>
            <div className="h-[1px] w-12 bg-honey/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(isEl ? [
              {
                name: 'Laura V.',
                location: 'Άμστερνταμ',
                text: '«Αρχικά παρήγγειλα ένα βάζο θυμαρίσιου μελιού 250g για δοκιμή. Μόλις το δοκίμασα, αναβάθμισα άμεσα στην ετήσια υιοθεσία κυψέλης. Η ποιότητα βρίσκεται σε εντελώς διαφορετικό επίπεδο από τα μέλια του εμπορίου.»',
                stars: 5,
              },
              {
                name: 'Marco F.',
                location: 'Μόναχο',
                text: '«Το να βλέπουμε το βάρος της κυψέλης μας να ανεβαίνει στην πλατφόρμα περιμένοντας τη θερινή συγκομιδή μας συνδέει αληθινά με τη Μάνη. Η οικογένειά μου το λατρεύει.»',
                stars: 5,
              },
              {
                name: 'Sophie B.',
                location: 'Βρυξέλλες',
                text: '«Έκανα δώρο την Premium κυψέλη στον πατέρα μου. Συγκινήθηκε όταν έφτασε το πρώτο βάζο με το χειρόγραφο γράμμα του Πέτρου. Αξίζει κάθε λεπτό.»',
                stars: 5,
              },
            ] : [
              {
                name: 'Laura V.',
                location: 'Amsterdam',
                text: '"I initially ordered a 250g jar of Thyme honey to test it. The minute I tasted it, I upgraded to the annual hive adoption. The quality is in a totally different universe from store honey."',
                stars: 5,
              },
              {
                name: 'Marco F.',
                location: 'Munich',
                text: '"Watching our hive weight climb on the dashboard while waiting for the summer harvest delivery makes you feel truly connected to Mani. My family loves it."',
                stars: 5,
              },
              {
                name: 'Sophie B.',
                location: 'Brussels',
                text: '"Gifted the Premium hive to my father. He cried when the welcome jar arrived with Petros\' handwritten letter. Absolutely worth every single cent."',
                stars: 5,
              },
            ]).map((r, i) => (
              <div key={i} className="bg-hive-bg border border-honey/15 p-8 rounded-[2px] flex flex-col gap-4 hover:border-honey/30 transition-colors">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} size={12} className="text-honey fill-honey" />
                  ))}
                </div>
                <p className="text-sm text-[#2A1B0A]/80 leading-relaxed font-light italic">{r.text}</p>
                <div className="mt-auto">
                  <div className="text-xs font-bold text-[#2A1B0A]">{r.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-honey/60 font-bold flex items-center gap-1">
                    <MapPin size={9} /> {r.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <section className="py-24 sm:py-28 px-6 relative overflow-hidden border-t border-honey/10">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-5xl md:text-6xl font-light text-[#2A1B0A] mb-6">
            {isEl ? 'Γευτείτε τα Ελληνικά Βουνά.' : 'Taste the Greek mountains.'}
          </h2>
          <p className="text-[#2A1B0A]/70 text-base mb-10 max-w-xl mx-auto font-light leading-relaxed">
            {isEl
              ? 'Δεσμεύστε το μέλι σας για την επερχόμενη εποχιακή εξαγωγή. Υιοθετήστε μια κυψέλη για ολόκληρη την ετήσια σοδειά ή παραγγείλτε ένα μεμονωμένο βάζο σήμερα.'
              : 'Reserve your honey for the upcoming seasonal extraction. Adopt a hive for the full annual harvest or order an individual jar today.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setSelectedPlanId('starter')}
              className="bg-honey text-[#2A1B0A] px-10 py-5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-honey/90 transition-colors rounded-[2px] shadow-sm flex items-center gap-3 active:scale-[0.98]"
            >
              {isEl ? 'Υιοθεσία Κυψέλης — από 140€' : 'Adopt a Hive — from €140'} <ArrowRight size={14} />
            </button>
            <a
              href="#jars"
              className="text-[10px] uppercase tracking-widest font-bold text-[#2A1B0A]/70 hover:text-honey transition-colors py-5 flex items-center gap-2 border border-honey/20 px-6 rounded-[2px] hover:border-honey/40"
            >
              {isEl ? 'Μεμονωμένα Βάζα' : 'Browse Individual Jars'} <ChevronRight size={12} />
            </a>
          </div>
          <div className="mt-8 text-[10px] uppercase tracking-widest text-[#2A1B0A]/30 font-bold flex items-center justify-center gap-4">
            <span>{isEl ? 'Δωρεάν Αποστολή στην Ε.Ε.' : 'Free EU Shipping on Memberships'}</span>
            <span className="text-honey">·</span>
            <span>{isEl ? '30ετής Οικογενειακή Παράδοση' : 'Direct Beekeeper Heritage'}</span>
            <span className="text-honey">·</span>
            <span>{isEl ? 'Εργαστηριακός Έλεγχος Αγνότητας' : 'Lab-Tested Authenticity'}</span>
          </div>
        </div>
      </section>

      <Footer />

      {/* Direct Jar Checkout Modal */}
      {selectedJarPurchase && (
        <JarCheckoutModal
          item={selectedJarPurchase}
          onClose={() => setSelectedJarPurchase(null)}
          onSwitchToMembership={(planId) => {
            setSelectedJarPurchase(null);
            setSelectedPlanId(planId);
          }}
        />
      )}

      {/* Membership Stripe Checkout Modal */}
      {selectedPlanId && (
        <MembershipCheckoutModal
          planId={selectedPlanId}
          onClose={() => setSelectedPlanId(null)}
        />
      )}

      {/* Honey Concierge Interactive Sensory Quiz Modal */}
      <HoneyConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />
    </div>
  );
}
