import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  MapPin,
  Thermometer,
  Sparkles,
  ArrowRight,
  Droplets,
  Layers,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';

interface MigrationStation {
  id: string;
  seasonName: { en: string; el: string };
  months: { en: string; el: string };
  region: { en: string; el: string };
  elevationMeters: number;
  nectarFlora: { en: string; el: string };
  status: { en: string; el: string };
  statusType: 'active' | 'upcoming' | 'completed';
  fieldNote: { en: string; el: string };
  flavorProfile: { en: string; el: string };
  moistureExpected: string;
  image: string;
}

const STATIONS: MigrationStation[] = [
  {
    id: 'citrus',
    seasonName: { en: 'Early Spring Citrus Bloom', el: 'Πρώιμη Ανοιξιάτικη Ανθοφορία' },
    months: { en: 'March – April', el: 'Μάρτιος – Απρίλιος' },
    region: { en: 'Eurotas Valley, Laconia', el: 'Κοιλάδα Ευρώτα, Λακωνία' },
    elevationMeters: 140,
    nectarFlora: { en: 'Orange Blossom, Lemon Verbena & Wild Lavender', el: 'Ανθός Πορτοκαλιάς, Λουίζα & Άγρια Λεβάντα' },
    status: { en: 'Harvest Completed (Bottled)', el: 'Ολοκληρώθηκε (Εμφιαλωμένο)' },
    statusType: 'completed',
    fieldNote: {
      en: 'The Eurotas river valley fills with intense citrus perfume. Petros places hives amidst organic groves to kickstart colony brood vitality after winter.',
      el: 'Η κοιλάδα του Ευρώτα μοσχοβολά ανθούς εσπεριδοειδών. Ο Πέτρος τοποθετεί τις κυψέλες σε βιολογικούς πορτοκαλεώνες για ενδυνάμωση των σμηνών μετά τον χειμώνα.'
    },
    flavorProfile: { en: 'Bright floral bouquet with delicate candied citrus peel notes', el: 'Φωτεινό ανθικό μπουκέτο με απαλές νότες εσπεριδοειδών' },
    moistureExpected: '16.0% – 16.4%',
    image: '/mani_landscape.png'
  },
  {
    id: 'sage',
    seasonName: { en: 'Late Spring Mountain Sage', el: 'Ορεινό Φασκόμηλο Ταϋγέτου' },
    months: { en: 'May – June', el: 'Μάιος – Ιούνιος' },
    region: { en: 'Taygetos Foothills, Mystras', el: 'Πλαγιές Ταϋγέτου, Μυστράς' },
    elevationMeters: 550,
    nectarFlora: { en: 'Wild Mountain Sage (Salvia) & Rock Rose', el: 'Άγριο Φασκόμηλο, Λαδανιά & Αγριολούλουδα' },
    status: { en: 'Seasonal Extraction', el: 'Εποχιακή Εξαγωγή' },
    statusType: 'completed',
    fieldNote: {
      en: 'Hives are transported by truck up the mountain slopes as valley heat rises. High enzyme and antioxidant accumulation begins.',
      el: 'Οι κυψέλες μεταφέρονται με φορτηγό στις πλαγιές καθώς ανεβαίνει η θερμοκρασία στον κάμπο. Έναρξη υψηλής συσσώρευσης ενζύμων και αντιοξειδωτικών.'
    },
    flavorProfile: { en: 'Herbal, aromatic, light golden color with mild herbal bite', el: 'Βοτανικό, αρωματικό, ανοιχτόχρωμο με ήπιο βοτανικό τελείωμα' },
    moistureExpected: '15.6% – 15.9%',
    image: '/mani_landscape.png'
  },
  {
    id: 'thyme',
    seasonName: { en: 'Peak Summer Wild Thyme', el: 'Άγριο Θυμάρι Ακρωτηρίου Ταινάρου' },
    months: { en: 'June – July', el: 'Ιούνιος – Ιούλιος' },
    region: { en: 'Lagia & Cape Tenaro, Deep Mani', el: 'Λάγια & Ακρωτήριο Ταίναρο, Μέσα Μάνη' },
    elevationMeters: 620,
    nectarFlora: { en: '100% Wild Coastal Thyme (Thymus capitatus)', el: '100% Άγριο Παράκτιο Θυμάρι (Thymus capitatus)' },
    status: { en: 'Current Prime Extraction', el: 'Κύρια Σοδειά σε Εξέλιξη' },
    statusType: 'active',
    fieldNote: {
      en: 'The crown jewel of Greek honey. The relentless sun and dry Aegean winds stress the coastal thyme shrubs, producing the most concentrated, dense nectar in the Mediterranean.',
      el: 'Το στέμμα του ελληνικού μελιού. Ο ήλιος και οι άνεμοι του Αιγαίου συμπυκνώνουν το νέκταρ του θυμαριού στα βράχια της Μάνης, δημιουργώντας απαράμιλλη πυκνότητα.'
    },
    flavorProfile: { en: 'Intensely pungent, amber resinous body with lingering thyme finish', el: 'Έντονο κεχριμπαρένιο σώμα, ρητινώδη αρώματα και διαρκής επίγευση' },
    moistureExpected: '14.8% – 15.4% (Dense raw grade)',
    image: '/mani_landscape.png'
  },
  {
    id: 'fir',
    seasonName: { en: 'High Alpine Fir Honeydew', el: 'Έλατο Μαινάλου (Βανίλια Ελάτης)' },
    months: { en: 'July – August', el: 'Ιούλιος – Αύγουστος' },
    region: { en: 'Mount Mainalo Biosphere, Arcadia', el: 'Ελατοδάση Μαινάλου, Αρκαδία' },
    elevationMeters: 1180,
    nectarFlora: { en: 'Abies cephalonica (Greek Black Fir Honeydew)', el: 'Ελληνική Κεφαλληνιακή Ελάτη (Μελιτώματα)' },
    status: { en: 'Limited Mountain Vintage', el: 'Περιορισμένη Ορεινή Εσοδεία' },
    statusType: 'active',
    fieldNote: {
      en: 'Petros moves the colonies deep into protected fir reserves above 1,100 meters. Cool alpine nights and zero pesticide exposure preserve ultra-rare honeydew.',
      el: 'Ο Πέτρος ανεβάζει τα μελίσσια στα προστατευόμενα ελατοδάση πάνω από τα 1.100 μέτρα. Δροσερές ορεινές νύχτες και μηδενικά φυτοφάρμακα.'
    },
    flavorProfile: { en: 'Toasted caramel, butterscotch, low natural sweetness, never crystallizes', el: 'Καραμέλα, ψητό πεύκο, χαμηλή γλυκύτητα, δεν κρυσταλλώνει ποτέ' },
    moistureExpected: '14.2% – 14.8% (Rare thick body)',
    image: '/mani_landscape.png'
  },
  {
    id: 'heather',
    seasonName: { en: 'Autumn Heather & Pine', el: 'Φθινοπωρινό Ρείκι & Πεύκο' },
    months: { en: 'September – October', el: 'Σεπτέμβριος – Οκτώβριος' },
    region: { en: 'Parnonas Slopes & Evia Conifers', el: 'Πλαγιές Πάρνωνα & Πευκοδάση' },
    elevationMeters: 680,
    nectarFlora: { en: 'Autumn Heather (Erica manipuliflora / Reiki) & Pine', el: 'Φθινοπωρινό Ρείκι (Erica) & Πευκόμελο' },
    status: { en: 'Upcoming Autumn Station', el: 'Επερχόμενη Φθινοπωρινή Μεταφορά' },
    statusType: 'upcoming',
    fieldNote: {
      en: 'The rich dark autumn extraction that fortifies the bees with bio-flavonoids before wintering. Petros leaves generous honey frames for the bees to feed on through the cold months.',
      el: 'Η σκούρα φθινοπωρινή σοδειά που θωρακίζει τις μέλισσες με βιοφλαβονοειδή. Ο Πέτρος αφήνει άφθονο μέλι στις κυψέλες για την άνετη διαχείμασή τους.'
    },
    flavorProfile: { en: 'Deep mineral warmth, malty, herbal caramel with earthy undertones', el: 'Βαθιά μεταλλική γεύση, βύνη, καραμέλα και γήινα αρώματα' },
    moistureExpected: '15.5% – 16.2%',
    image: '/mani_landscape.png'
  }
];

export default function NomadicFloweringCalendar() {
  const { language } = useLanguage();
  const isEl = language === 'el';
  const [selectedStationId, setSelectedStationId] = useState<string>('thyme');

  const currentStation = STATIONS.find(s => s.id === selectedStationId) || STATIONS[2];

  return (
    <section id="nomadic-calendar" className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 bg-[#0E0905] border-t border-honey/15 text-[#E5DCD0]">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-honey/10 border border-honey/30 rounded-full text-honey text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold">
            <Compass size={12} /> {isEl ? 'Ο Νομαδικός Κύκλος των Μελισσιών' : 'The Nomadic Apiary Route'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            {isEl ? 'Ακολουθώντας τις Ανθοφορίες της Πελοποννήσου' : 'Chasing the Peloponnese Blooms'}
          </h2>
          <p className="text-white/60 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            {isEl
              ? 'Οι μέλισσές μας δεν μένουν ποτέ στάσιμες. Ο Πέτρος Οικονομάκος μετακινεί τις κυψέλες ακολουθώντας τον αρχαίο κύκλο της ελληνικής φύσης: από τους παραθαλάσσιους πορτοκαλεώνες στις βραχονησίδες της Μάνης και τα αλπικά δάση ελάτης στα 1.200 μέτρα.'
              : 'Our colonies never remain stationary. Petros moves the hives following the ancient Greek rhythm: from sea-level citrus valleys to wind-swept limestone cliffs and 1,200m alpine fir canopies.'}
          </p>
        </div>

        {/* 5-Step Timeline Tabs (Swipeable on mobile, grid on desktop) */}
        <div className="flex overflow-x-auto no-scrollbar gap-2.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 border-b border-honey/15 sm:pb-6">
          {STATIONS.map((station, index) => {
            const isSelected = station.id === selectedStationId;
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStationId(station.id)}
                className={`text-left p-3.5 sm:p-4 rounded-[2px] border transition-all relative overflow-hidden min-w-[190px] shrink-0 sm:min-w-0 ${
                  isSelected
                    ? 'bg-[#1C140C] border-honey text-white shadow-xl ring-1 ring-honey/40'
                    : 'bg-black/40 border-honey/15 text-white/60 hover:border-honey/40 hover:text-white'
                }`}
              >
                {/* Active Indicator Top Line */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-honey" />
                )}

                <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-mono text-honey mb-1">
                  <span>0{index + 1} · {station.months[language]}</span>
                  {station.statusType === 'active' && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>

                <div className="font-bold text-xs sm:text-sm text-white line-clamp-1 mb-1 font-serif">
                  {station.seasonName[language]}
                </div>

                <div className="text-[10px] text-white/50 flex items-center gap-1 font-mono">
                  <MapPin size={10} className="text-honey/60 shrink-0" />
                  <span className="truncate">{station.elevationMeters}m a.s.l.</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── SELECTED STATION DETAIL CARD ── */}
        <div className="bg-[#140E08] border border-honey/25 p-5 sm:p-8 md:p-12 rounded-[2px] shadow-2xl space-y-6 sm:space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 border-b border-honey/15 pb-5 sm:pb-8">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-honey text-[10px] sm:text-xs uppercase tracking-widest font-mono mb-2">
                <Calendar size={12} className="shrink-0" />
                <span>{currentStation.months[language]}</span>
                <span>·</span>
                <MapPin size={12} className="shrink-0" />
                <span>{currentStation.region[language]} ({currentStation.elevationMeters}m)</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-white leading-tight">
                {currentStation.seasonName[language]}
              </h3>
            </div>

            {/* Station Status Badge */}
            <div className="flex items-center gap-3">
              <div className={`px-3.5 py-1.5 sm:px-4 sm:py-2 border rounded-sm text-[10px] sm:text-xs uppercase tracking-widest font-mono font-bold flex items-center gap-2 ${
                currentStation.statusType === 'active'
                  ? 'bg-green-500/10 border-green-500/40 text-green-400'
                  : currentStation.statusType === 'completed'
                  ? 'bg-honey/10 border-honey/30 text-honey'
                  : 'bg-white/5 border-white/20 text-white/60'
              }`}>
                {currentStation.statusType === 'active' && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                )}
                <span>{currentStation.status[language]}</span>
              </div>
            </div>
          </div>

          {/* 3-Column Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-xs leading-relaxed">
            {/* Box 1: Botanical Source */}
            <div className="p-4 sm:p-6 bg-black/50 border border-honey/15 rounded-[2px] space-y-2.5">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-honey font-bold flex items-center gap-1.5">
                <Sparkles size={12} /> {isEl ? 'Χλωρίδα & Νέκταρ' : 'Botanical Bloom'}
              </div>
              <div className="text-white font-semibold text-xs sm:text-sm font-serif">
                {currentStation.nectarFlora[language]}
              </div>
              <p className="text-white/60 text-[11px] sm:text-xs font-light">
                {currentStation.flavorProfile[language]}
              </p>
            </div>

            {/* Box 2: Laboratory Expectation */}
            <div className="p-4 sm:p-6 bg-black/50 border border-honey/15 rounded-[2px] space-y-2.5">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-honey font-bold flex items-center gap-1.5">
                <Droplets size={12} /> {isEl ? 'Ποιοτικά Χαρακτηριστικά' : 'Raw Quality Specs'}
              </div>
              <div>
                <div className="text-white/40 uppercase tracking-wider text-[8px] sm:text-[9px]">{isEl ? 'Υγρασία Εξαγωγής' : 'Expected Moisture'}</div>
                <div className="text-green-400 font-mono font-bold text-xs sm:text-sm mt-0.5">{currentStation.moistureExpected}</div>
              </div>
              <div>
                <div className="text-white/40 uppercase tracking-wider text-[8px] sm:text-[9px]">{isEl ? 'Επεξεργασία' : 'Extraction Method'}</div>
                <div className="text-white font-medium text-[11px] sm:text-xs mt-0.5">{isEl ? 'Εν ψυχρώ · Αφιλτράριστο' : 'Cold-Spun · Unheated'}</div>
              </div>
            </div>

            {/* Box 3: Beekeeper Field Note */}
            <div className="p-4 sm:p-6 bg-[#1A1208] border border-honey/30 rounded-[2px] space-y-2.5">
              <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-honey font-bold flex items-center gap-1.5">
                <Activity size={12} /> {isEl ? 'Σημείωμα Μελισσοκόμου' : 'Petros’ Field Dispatch'}
              </div>
              <p className="font-serif italic text-white/90 text-xs sm:text-sm leading-relaxed">
                "{currentStation.fieldNote[language]}"
              </p>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 font-mono pt-1">
                Petros Oikonomakos · Laconia Station
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
