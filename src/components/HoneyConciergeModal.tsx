import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, Compass, Award, Heart, Eye, Flame, ShieldCheck, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/useLanguage';

interface HoneyConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HoneyConciergeModal({ isOpen, onClose }: HoneyConciergeModalProps) {
  const { language } = useLanguage();
  const isEl = language === 'el';

  const [step, setStep] = useState<number>(1);
  const [flavorChoice, setFlavorChoice] = useState<string>('thyme');
  const [sweetnessChoice, setSweetnessChoice] = useState<string>('balanced');
  const [usageChoice, setUsageChoice] = useState<string>('yogurt');
  const [formatChoice, setFormatChoice] = useState<string>('jar');

  if (!isOpen) return null;

  const resetQuiz = () => {
    setStep(1);
    setFlavorChoice('thyme');
    setSweetnessChoice('balanced');
    setUsageChoice('yogurt');
    setFormatChoice('jar');
  };

  // Determine Recommendation with 4 inputs
  const getRecommendation = () => {
    if (formatChoice === 'membership') {
      return {
        title: isEl ? 'Αναδοχή Κυψέλης Starter (2,5 kg Σοδειά)' : 'Starter Guardianship (2.5 kg Reserve)',
        subtitle: isEl ? 'Ετήσια σύνδεση με επώνυμη κυψέλη στη Μάνη · 3 εποχιακές παραδόσεις' : 'Named living colony sponsorship · 3 seasonal harvest deliveries',
        price: '€140 / yr',
        pricePerKg: '€56 / kg',
        link: '/membership',
        buttonText: isEl ? 'Υιοθετήστε την Κυψέλη σας' : 'Claim Guardianship',
        image: '/raw_honey.png',
        matchScore: '99%',
        sensoryProfile: {
          intensity: 'High (8.5/10)',
          sweetness: 'Moderate & Natural',
          texture: 'Raw Crystalline / Raw Liquid',
          aroma: 'Wild Thyme, Fir Pine & Mountain Flowers',
        },
        reason: isEl
          ? 'Επειδή θέλετε την απόλυτη σχέση με την πηγή και εκτιμάτε τη μεταβολή της φύσης ανά εποχή, η αναδοχή κυψέλης σάς προσφέρει άμεση σύνδεση με τον μελισσοκόμο Πέτρο Οικονομάκο και εξοικονόμηση πάνω από 50% σε σύγκριση με τα μεμονωμένα βάζα.'
          : 'Because you value intimate connection with the land and savor nature’s seasonal rhythms, adopting a living colony connects you directly to beekeeper Petros Oikonomakos and secures raw, unblended reserve honey at over 50% savings.',
        pairingTip: isEl
          ? 'Συνοδεύει άριστα παραδοσιακό στραγγιστό γιαούρτι, παλαιωμένη γραβιέρα και πρωινό προζυμένιο ψωμί.'
          : 'Pairs exquisitely with strained Greek sheep yogurt, aged graviera cheese, and warm morning sourdough.',
      };
    }

    if (formatChoice === 'hamper') {
      return {
        title: isEl ? 'Συλλεκτικό Σετ Γευσιγνωσίας Πελοποννήσου' : 'Peloponnese Connoisseur Tasting Hamper',
        subtitle: isEl ? '3x Μονοποικιλιακά Μέλια + Εξαιρετικό Παρθένο Ελαιόλαδο + Ξύλινη Σπάτουλα' : '3x Single-Origin Honeys + Family Extra Virgin Olive Oil + Olive Wood Dipper',
        price: '€120',
        pricePerKg: '€96 / kg',
        link: '/buy-honey',
        buttonText: isEl ? 'Αποκτήστε το Συλλεκτικό Σετ' : 'Order Luxury Box Set',
        image: '/4jars.jpg',
        matchScore: '98%',
        sensoryProfile: {
          intensity: 'Full Flight (Varied)',
          sweetness: 'Low to Rich Spectrum',
          texture: 'Trio Viscosity Flight',
          aroma: 'Cedar, Wild Thyme, Orange Blossom',
        },
        reason: isEl
          ? 'Η ιδανική γαστρονομική εμπειρία: απολαμβάνετε τα τρία πιο φημισμένα ελληνικά μέλια (Θυμάρι, Έλατο, Αγριολούλουδα) μαζί με το βραβευμένο ελαιόλαδο της οικογένειας Οικονομάκου.'
          : 'The ultimate connoisseur flight: explore all 3 premier Greek terroirs (Wild Thyme, Arcadian Fir, Wildflower) alongside the Oikonomakos family’s single-estate Extra Virgin Olive Oil.',
        pairingTip: isEl
          ? 'Ιδανικό για γκουρμέ πλατό τυριών, γαστρονομικά δώρα και επίσημα δείπνα.'
          : 'Ideal for artisanal charcuterie boards, festive dinners, and distinguished luxury gifting.',
      };
    }

    if (flavorChoice === 'fir' || sweetnessChoice === 'low') {
      return {
        title: isEl ? 'Μέλι Ελάτης Μαινάλου (Grand Cru)' : 'Black Fir Honey (Grand Cru)',
        subtitle: isEl ? 'Ορεινή Αρκαδία · Υψόμετρο 1.150μ · Δεν κρυσταλλώνει ποτέ' : 'Arcadian High Canopy · 1,150m · Never crystallizes',
        price: '€52 (500g) / €88 (1kg)',
        pricePerKg: '€104 / kg',
        link: '/buy-honey',
        buttonText: isEl ? 'Παραγγελία Μελιού Ελάτης' : 'Order Arcadian Fir',
        image: '/4jars.jpg',
        matchScore: '99%',
        sensoryProfile: {
          intensity: 'Deep & Resinous (8/10)',
          sweetness: 'Low Glucose (Gentle)',
          texture: 'Super Dense, Caramel Viscosity',
          aroma: 'Toasted Pine, Burnt Caramel, Wood Vanilla',
        },
        reason: isEl
          ? 'Η προτίμησή σας σε χαμηλότερη φυσική γλυκύτητα και καραμελένιες νότες ξύλου ταιριάζει απόλυτα με το σπάνιο μέλι ελάτης. Χάρη στη χαμηλή περιεκτικότητα σε γλυκόζη, παραμένει παχύρρευστο και δεν κρυσταλλώνει ποτέ.'
          : 'Your preference for low natural sweetness and toasty cedar/caramel notes makes Arcadian Fir your ideal match. Extremely high mineral density with very low glucose means it never crystallizes.',
        pairingTip: isEl
          ? 'Δοκιμάστε το με καρύδια, μαύρο ψωμί σίκαλης ή κατευθείαν με το κουτάλι ως καθημερινό ελιξίριο.'
          : 'Try it with toasted walnuts, dark rye sourdough, or savor unadulterated from an olive wood spoon.',
      };
    }

    if (flavorChoice === 'pine' || sweetnessChoice === 'malt') {
      return {
        title: isEl ? 'Ορεινό Πευκόμελο (Marchalina Honeydew)' : 'Highland Pine Honey (Marchalina)',
        subtitle: isEl ? 'Εύβοια · 680μ Υψόμετρο · Πλούσιο σε Ιχνοστοιχεία' : 'Evia Mountain Conifer Forest · 680m · Rich in Minerals',
        price: '€52 (500g) / €88 (1kg)',
        pricePerKg: '€104 / kg',
        link: '/buy-honey',
        buttonText: isEl ? 'Παραγγελία Πευκόμελου' : 'Order Pine Honey',
        image: '/4jars.jpg',
        matchScore: '97%',
        sensoryProfile: {
          intensity: 'Malted & Earthy (7.5/10)',
          sweetness: 'Balanced Savory-Sweet',
          texture: 'Velvety Amber Viscosity',
          aroma: 'Warm Pine Bark & Malted Grain',
        },
        reason: isEl
          ? 'Αναζητάτε ισορροπία, βαθιά γεύση βύνης και χαμηλή επιθετική γλύκα. Το πευκόμελο προσφέρει υψηλή συγκέντρωση μαγνησίου, σιδήρου και καλίου, ιδανικό για αθλητές και καθημερινή ευεξία.'
          : 'You seek malted depth and earthy balance rather than pure floral sweetness. Highland Pine is rich in natural bio-minerals, potassium, and magnesium, making it an invigorating morning tonic.',
        pairingTip: isEl
          ? 'Ταιριάζει καταπληκτικά σε ζεστό μαύρο τσάι, καπνιστά τυριά και φρυγανισμένο ψωμί με βούτυρο.'
          : 'Superb in hot black tea, paired with pecorino cheeses, or atop buttered rustic toast.',
      };
    }

    if (flavorChoice === 'flower' || sweetnessChoice === 'gentle') {
      return {
        title: isEl ? 'Αγριολούλουδα Ταϋγέτου & Βανίλια' : 'Taygetos Wildflower & Vanilla Cream',
        subtitle: isEl ? 'Πρόποδες Σπάρτης · Υψόμετρο 310μ · Πρώιμη ανοιξιάτικη ανθοφορία' : 'Spartan Foothills · 310m Elevation · Early Spring Multi-Floral',
        price: '€28 (250g) / €52 (500g)',
        pricePerKg: '€104 / kg',
        link: '/buy-honey',
        buttonText: isEl ? 'Παραγγελία Ανθόμελου' : 'Order Wildflower Jar',
        image: '/raw_honey.png',
        matchScore: '96%',
        sensoryProfile: {
          intensity: 'Delicate & Bright (6/10)',
          sweetness: 'Soft Vanilla Floral',
          texture: 'Silky Creamy Spread',
          aroma: 'Spring Petals, Lemon Blossom & Honeycomb',
        },
        reason: isEl
          ? 'Ντελικάτο, αρωματικό και απαλό. Συλλέγεται από τα πρώτα αγριολούλουδα της κοιλάδας της Σπάρτης και προσφέρει μια φωτεινή, κρεμώδη γλυκύτητα που αγκαλιάζει τον ουρανίσκο χωρίς ίχνος πικρίδας.'
          : 'Delicate, bright, and silky. Extracted during early spring across the Spartan orange and floral groves, offering gentle perfume and soothing natural energy without heavy resins.',
        pairingTip: isEl
          ? 'Εξαιρετικό σε αφεψήματα χαμομηλιού, φρέσκια ανθότυρο ή ρικότα και φρέσκα φρούτα εποχής.'
          : 'Sublime over fresh ricotta, white peaches, and soothing herbal chamomile infusions.',
      };
    }

    // Default: Thyme & Sage (The Iconic Mani Terroir)
    return {
      title: isEl ? 'Άγριο Θυμάρι & Φασκόμηλο Μάνης' : 'Mani Wild Thyme & Mountain Sage',
      subtitle: isEl ? 'Λάγια Μάνης · Ακρωτήριο Ταίναρο · 84% Θυμάρι' : 'Lagia, Cape Tenaro, Mani · 84% Wild Thyme Dominance',
      price: '€28 (250g) / €52 (500g)',
      pricePerKg: '€112 / kg',
      link: '/buy-honey',
      buttonText: isEl ? 'Παραγγελία Θυμαρίσιου' : 'Order Wild Thyme Jar',
      image: '/raw_honey.png',
      matchScore: '99%',
      sensoryProfile: {
        intensity: 'Pungent & Robust (9.5/10)',
        sweetness: 'Intense Herbal Warmth',
        texture: 'Rich Amber Honeycomb Run',
        aroma: 'Sun-baked Thyme, Crushed Sage & Coastal Salt',
      },
      reason: isEl
        ? 'Ο αδιαμφισβήτητος βασιλιάς του ελληνικού μελιού: έντονο άρωμα, κεχριμπαρένιο χρώμα και υψηλή πυκνότητα γύρης από τα βραχώδη εδάφη της Μάνης. Ανεπεξέργαστο, γεμάτο αντιοξειδωτικά και ένζυμα.'
        : 'The undisputed monarch of Greek honey: fierce herbal bouquet, copper-amber translucence, and unmatched pollen density from thyme baked by the southern sun at Europe’s tip.',
      pairingTip: isEl
        ? 'Κλασικός, απαράμιλλος συνδυασμός με παραδοσιακό στραγγιστό γιαούρτι και καρύδια ή παλαιωμένα κατσικίσια τυριά.'
        : 'The definitive Greek ritual: drizzled over thick sheep yogurt with crushed walnuts or aged graviera.',
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92dvh] flex flex-col bg-[#FFFDF7] text-[#2A1B0A] border-2 border-honey/40 rounded-[2px] shadow-[0_25px_80px_rgba(42,27,10,0.35)] p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-honey/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header & Progress Bar (Sticky Top) */}
        <div className="shrink-0 border-b border-honey/20 pb-3 sm:pb-4">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#9E6000] font-bold flex items-center gap-1.5 sm:gap-2">
              <Compass size={13} className="text-honey shrink-0" />
              <span>{isEl ? 'Προσωπικός Επιλογέας Μελιού Sommelier' : 'Honey Concierge Sommelier'}</span>
            </div>
            <button 
              onClick={onClose} 
              className="text-[#2A1B0A]/40 hover:text-[#2A1B0A] p-1.5 transition-colors rounded-full hover:bg-honey/10 -mr-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#2A1B0A] leading-tight">
              {step <= 4
                ? (isEl
                    ? `Βήμα ${step} από 4: ${
                        step === 1
                          ? 'Αρωματικό Προφίλ'
                          : step === 2
                          ? 'Γλυκύτητα & Υφή'
                          : step === 3
                          ? 'Τρόπος Απόλαυσης'
                          : 'Επιλογή Συσκευασίας'
                      }`
                    : `Step ${step} of 4: ${
                        step === 1
                          ? 'Botanical Terroir'
                          : step === 2
                          ? 'Sweetness & Viscosity'
                          : step === 3
                          ? 'Daily Ritual'
                          : 'Format & Allocation'
                      }`)
                : (isEl ? 'Το Ιδανικό σας Μέλι' : 'Your Mountain Terroir Match')}
            </h3>
            {step <= 4 && (
              <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#9E6000] ml-2 shrink-0">
                {Math.round((step / 4) * 100)}%
              </div>
            )}
          </div>

          {step <= 4 && (
            <div className="w-full h-1 bg-honey/15 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="h-full bg-honey transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* ── QUESTION 1: FLAVOR PROFILE ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 sm:py-4 space-y-4 sm:space-y-5 pr-1">
              <p className="text-xs sm:text-base text-[#2A1B0A]/85 font-serif italic">
                {isEl
                  ? 'Ποιο αρωματικό και βοτανικό προφίλ ταιριάζει περισσότερο στον ουρανίσκο σας;'
                  : 'Which botanical and aromatic terroir speaks directly to your senses?'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {[
                  {
                    id: 'thyme',
                    badge: 'Mani Coastal Cliffs',
                    title: isEl ? 'Έντονο Άγριο Θυμάρι & Βότανα' : 'Intense Wild Thyme & Herbs',
                    desc: isEl ? 'Πικάντικο, κεχριμπαρένιο, γεμάτο αρώματα της άγριας Μάνης.' : 'Pungent, amber, high pollen density, resinous herbal finish.',
                  },
                  {
                    id: 'fir',
                    badge: 'Arcadian Highlands',
                    title: isEl ? 'Καραμέλα & Βανίλια Μαύρης Ελάτης' : 'Caramel & Black Fir Vanilla',
                    desc: isEl ? 'Παχύρρευστο, χαμηλή γλυκύτητα, δεν κρυσταλλώνει ποτέ.' : 'Ultra-thick viscosity, low glucose, toasted pine finish.',
                  },
                  {
                    id: 'pine',
                    badge: 'Evia Conifers',
                    title: isEl ? 'Γήινη Βύνη & Ορεινό Πεύκο' : 'Malted Pine & Forest Minerals',
                    desc: isEl ? 'Πλούσιο σε μέταλλα, ισορροπημένο, ευγενικό με το στομάχι.' : 'Mineral-dense Marchalina honeydew with warm malted notes.',
                  },
                  {
                    id: 'flower',
                    badge: 'Spartan Valley Bloom',
                    title: isEl ? 'Απαλά Αγριολούλουδα & Ανθός' : 'Gentle Wildflower & Blossom',
                    desc: isEl ? 'Απαλή ντελικάτη γλύκα με κρεμώδεις ανθικές νότες.' : 'Delicate floral perfume with creamy vanilla sweetness.',
                  },
                ].map(opt => {
                  const isSelected = flavorChoice === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFlavorChoice(opt.id)}
                      className={`text-left p-3.5 sm:p-4 rounded-[3px] border transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'bg-honey/15 border-honey text-[#2A1B0A] shadow-md ring-1 ring-honey/40'
                          : 'bg-white/80 border-[#C8860A]/20 text-[#2A1B0A]/80 hover:border-honey hover:bg-[#FEF7E6]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] uppercase tracking-widest text-[#9E6000] font-bold mb-0.5">{opt.badge}</div>
                          <div className="font-bold text-sm text-[#2A1B0A] mb-1 font-serif leading-snug">{opt.title}</div>
                          <div className="text-xs text-[#2A1B0A]/70 leading-relaxed font-sans">{opt.desc}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected ? 'border-honey bg-honey text-[#2A1B0A]' : 'border-[#C8860A]/30 bg-white/50'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 flex justify-end pt-3 sm:pt-4 border-t border-[#C8860A]/15 mt-auto">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-3 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {isEl ? 'Επόμενο Βήμα' : 'Next Question'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── QUESTION 2: SWEETNESS & VISCOSITY ── */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 sm:py-4 space-y-4 sm:space-y-5 pr-1">
              <p className="text-xs sm:text-base text-[#2A1B0A]/85 font-serif italic">
                {isEl
                  ? 'Πώς προτιμάτε την ένταση της γλυκύτητας και την υφή του μελιού σας;'
                  : 'What sweetness intensity and honey viscosity do you naturally prefer?'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {[
                  {
                    id: 'low',
                    badge: 'Low Sugar Profile',
                    title: isEl ? 'Χαμηλή Γλυκύτητα / Παχύρρευστο' : 'Low Sweetness / Ultra Dense',
                    desc: isEl ? 'Προτιμώ γήινες, καραμελένιες νότες χωρίς υπερβολική ζάχαρη.' : 'Toasted cedar notes, heavy viscosity, low glycemic spike.',
                  },
                  {
                    id: 'balanced',
                    badge: 'Classic Pungent',
                    title: isEl ? 'Έντονο & Πικάντικο' : 'Pungent & Herbal Warmth',
                    desc: isEl ? 'Πλούσια παραδοσιακή γεύση με βοτανικό κάψιμο στο λαιμό.' : 'Bold warmth, high pollen density, deep golden glow.',
                  },
                  {
                    id: 'gentle',
                    badge: 'Soft Floral',
                    title: isEl ? 'Απαλό & Ντελικάτο' : 'Delicate, Floral & Velvety',
                    desc: isEl ? 'Ελαφριά γλύκα που δεν καλύπτει τις λεπτές γεύσεις.' : 'Smooth melting sweetness, bright and refreshing finish.',
                  },
                  {
                    id: 'malt',
                    badge: 'Earthy Mineral',
                    title: isEl ? 'Μαλτέζικο & Ισορροπημένο' : 'Malted & Savory-Sweet',
                    desc: isEl ? 'Ιδανικό για όσους δεν αγαπούν τα πολύ γλυκά μέλια.' : 'Rich tree honeydew with low fructose and herbal balance.',
                  },
                ].map(opt => {
                  const isSelected = sweetnessChoice === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSweetnessChoice(opt.id)}
                      className={`text-left p-3.5 sm:p-4 rounded-[3px] border transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'bg-honey/15 border-honey text-[#2A1B0A] shadow-md ring-1 ring-honey/40'
                          : 'bg-white/80 border-[#C8860A]/20 text-[#2A1B0A]/80 hover:border-honey hover:bg-[#FEF7E6]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] uppercase tracking-widest text-[#9E6000] font-bold mb-0.5">{opt.badge}</div>
                          <div className="font-bold text-sm text-[#2A1B0A] mb-1 font-serif leading-snug">{opt.title}</div>
                          <div className="text-xs text-[#2A1B0A]/70 leading-relaxed font-sans">{opt.desc}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected ? 'border-honey bg-honey text-[#2A1B0A]' : 'border-[#C8860A]/30 bg-white/50'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-[#C8860A]/15 mt-auto">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 border border-[#C8860A]/30 text-[#2A1B0A]/70 hover:text-[#2A1B0A] text-xs uppercase tracking-widest font-bold rounded-[3px] transition-colors"
              >
                {isEl ? 'Πίσω' : 'Back'}
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {isEl ? 'Επόμενο' : 'Next'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── QUESTION 3: USAGE & OCCASION ── */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 sm:py-4 space-y-4 sm:space-y-5 pr-1">
              <p className="text-xs sm:text-base text-[#2A1B0A]/85 font-serif italic">
                {isEl
                  ? 'Πώς απολαμβάνετε συνήθως το μέλι στην καθημερινότητά σας;'
                  : 'How do you most frequently savor honey in your daily rituals?'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {[
                  {
                    id: 'yogurt',
                    badge: 'Breakfast & Cheeses',
                    title: isEl ? 'Στραγγιστό Γιαούρτι & Προζυμένιο Ψωμί' : 'Greek Yogurt, Graviera & Sourdough',
                    desc: isEl ? 'Κλασικό ελληνικό πρωινό και πλατό παραδοσιακών τυριών.' : 'Drizzled generously over sheep yogurt, aged cheeses & nuts.',
                  },
                  {
                    id: 'spoon',
                    badge: 'Wellness Ritual',
                    title: isEl ? 'Κατευθείαν με το Ξύλινο Κουτάλι' : 'Pure Ritual Spoonful',
                    desc: isEl ? 'Καθημερινή πρωινή κουταλιά για ενέργεια και ανοσοποιητικό.' : 'Unadulterated raw enzyme wellness ritual on an empty stomach.',
                  },
                  {
                    id: 'tea',
                    badge: 'Infusions & Tonic',
                    title: isEl ? 'Βότανα Ταϋγέτου & Αφεψήματα' : 'Mountain Teas & Warm Tonic',
                    desc: isEl ? 'Ανακούφιση, ευεξία και αρωματικό ταίριασμα με τσάι.' : 'Natural soothing sweetness paired with Greek mountain herbs.',
                  },
                  {
                    id: 'gourmet',
                    badge: 'Gastronomy',
                    title: isEl ? 'Γκουρμέ Μαγειρική & Δώρα' : 'Epicurean Cooking & Gifting',
                    desc: isEl ? 'Dressings σαλάτας, ψητό κρέας, εκλεκτά κεράσματα.' : 'Vinaigrettes, roasted meats, dessert tarts, and luxury gifting.',
                  },
                ].map(opt => {
                  const isSelected = usageChoice === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setUsageChoice(opt.id)}
                      className={`text-left p-3.5 sm:p-4 rounded-[3px] border transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'bg-honey/15 border-honey text-[#2A1B0A] shadow-md ring-1 ring-honey/40'
                          : 'bg-white/80 border-[#C8860A]/20 text-[#2A1B0A]/80 hover:border-honey hover:bg-[#FEF7E6]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] uppercase tracking-widest text-[#9E6000] font-bold mb-0.5">{opt.badge}</div>
                          <div className="font-bold text-sm text-[#2A1B0A] mb-1 font-serif leading-snug">{opt.title}</div>
                          <div className="text-xs text-[#2A1B0A]/70 leading-relaxed font-sans">{opt.desc}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected ? 'border-honey bg-honey text-[#2A1B0A]' : 'border-[#C8860A]/30 bg-white/50'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-[#C8860A]/15 mt-auto">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 border border-[#C8860A]/30 text-[#2A1B0A]/70 hover:text-[#2A1B0A] text-xs uppercase tracking-widest font-bold rounded-[3px] transition-colors"
              >
                {isEl ? 'Πίσω' : 'Back'}
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {isEl ? 'Επόμενο' : 'Next'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── QUESTION 4: FORMAT & ALLOCATION ── */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 sm:py-4 space-y-4 sm:space-y-5 pr-1">
              <p className="text-xs sm:text-base text-[#2A1B0A]/85 font-serif italic">
                {isEl
                  ? 'Ποια μορφή εξυπηρετεί καλύτερα τις ανάγκες σας;'
                  : 'Which guardianship or purchase format fits your lifestyle best?'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
                {[
                  {
                    id: 'jar',
                    badge: 'Direct Jars',
                    title: isEl ? 'Μεμονωμένο Βάζο' : 'Single Glass Jar',
                    desc: isEl ? 'Δοκιμάστε μία συγκεκριμένη σοδειά (250g, 500g, 1kg).' : 'Order a standalone numbered jar to taste right away.',
                  },
                  {
                    id: 'membership',
                    badge: 'Best Value',
                    title: isEl ? 'Ετήσια Αναδοχή Κυψέλης' : 'Annual Hive Guardianship',
                    desc: isEl ? 'Σύνδεση με κυψέλη, ζωντανό ημερολόγιο, 3 εποχιακές παραδόσεις.' : 'Adopt a living colony, get IoT updates & 3 seasonal harvests.',
                  },
                  {
                    id: 'hamper',
                    badge: 'Luxury Gift Set',
                    title: isEl ? 'Σετ Δώρου με Ελαιόλαδο' : 'Tasting Trio & Olive Oil',
                    desc: isEl ? '3 ποικιλίες μελιού + έξτρα παρθένο ελαιόλαδο σε ξύλινο κουτί.' : '3x raw honeys + single-estate olive oil in wooden presentation box.',
                  },
                ].map(opt => {
                  const isSelected = formatChoice === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setFormatChoice(opt.id)}
                      className={`text-left p-3.5 sm:p-4 rounded-[3px] border transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'bg-honey/15 border-honey text-[#2A1B0A] shadow-md ring-1 ring-honey/40'
                          : 'bg-white/80 border-[#C8860A]/20 text-[#2A1B0A]/80 hover:border-honey hover:bg-[#FEF7E6]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] uppercase tracking-widest text-[#9E6000] font-bold mb-0.5">{opt.badge}</div>
                          <div className="font-bold text-sm text-[#2A1B0A] mb-1 font-serif leading-snug">{opt.title}</div>
                          <div className="text-xs text-[#2A1B0A]/70 leading-relaxed font-sans">{opt.desc}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected ? 'border-honey bg-honey text-[#2A1B0A]' : 'border-[#C8860A]/30 bg-white/50'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-[#C8860A]/15 mt-auto">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2.5 border border-[#C8860A]/30 text-[#2A1B0A]/70 hover:text-[#2A1B0A] text-xs uppercase tracking-widest font-bold rounded-[3px] transition-colors"
              >
                {isEl ? 'Πίσω' : 'Back'}
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-6 py-2.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {isEl ? 'Δείτε το Αποτέλεσμα' : 'Reveal My Match'} <Sparkles size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: RECOMMENDATION RESULT ── */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex-1 overflow-y-auto no-scrollbar py-2 sm:py-4 space-y-4 sm:space-y-5 pr-1">
              {/* Match Card */}
              <div className="bg-[#FEF7E6] border-2 border-honey/40 p-4 sm:p-7 rounded-[4px] space-y-4 relative overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 border-b border-[#C8860A]/20 pb-3 sm:pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-honey/20 border border-honey/40 rounded-full text-[#9E6000] text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">
                      <Sparkles size={11} /> {recommendation.matchScore} {isEl ? 'Συμβατότητα' : 'Palate Compatibility'}
                    </div>
                    <h4 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#2A1B0A] font-bold leading-tight">{recommendation.title}</h4>
                    <div className="text-[#9E6000] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mt-1">{recommendation.subtitle}</div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="font-serif text-xl sm:text-2xl font-bold text-[#2A1B0A]">{recommendation.price}</div>
                    <div className="text-[10px] text-[#2A1B0A]/60 font-mono">{recommendation.pricePerKg}</div>
                  </div>
                </div>

                {/* Sensory Radar Breakdown */}
                {recommendation.sensoryProfile && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 sm:p-3 bg-white/70 rounded border border-[#C8860A]/20 text-[10px] sm:text-[11px]">
                    <div>
                      <span className="text-[#9E6000] font-bold block uppercase tracking-wider text-[8px] sm:text-[9px]">
                        {isEl ? 'Ένταση' : 'Intensity'}
                      </span>
                      <span className="text-[#2A1B0A] font-medium truncate block">{recommendation.sensoryProfile.intensity}</span>
                    </div>
                    <div>
                      <span className="text-[#9E6000] font-bold block uppercase tracking-wider text-[8px] sm:text-[9px]">
                        {isEl ? 'Γλυκύτητα' : 'Sweetness'}
                      </span>
                      <span className="text-[#2A1B0A] font-medium truncate block">{recommendation.sensoryProfile.sweetness}</span>
                    </div>
                    <div>
                      <span className="text-[#9E6000] font-bold block uppercase tracking-wider text-[8px] sm:text-[9px]">
                        {isEl ? 'Υφή' : 'Texture'}
                      </span>
                      <span className="text-[#2A1B0A] font-medium truncate block">{recommendation.sensoryProfile.texture}</span>
                    </div>
                    <div>
                      <span className="text-[#9E6000] font-bold block uppercase tracking-wider text-[8px] sm:text-[9px]">
                        {isEl ? 'Αρώματα' : 'Key Notes'}
                      </span>
                      <span className="text-[#2A1B0A] font-medium truncate block" title={recommendation.sensoryProfile.aroma}>
                        {recommendation.sensoryProfile.aroma}
                      </span>
                    </div>
                  </div>
                )}

                {/* Rationale */}
                <div className="text-xs sm:text-sm text-[#2A1B0A]/85 leading-relaxed font-sans">
                  {recommendation.reason}
                </div>

                {/* Pairing Tip */}
                <div className="p-3 sm:p-3.5 bg-white/90 border-l-3 border-honey rounded-sm text-xs text-[#2A1B0A]/80 italic shadow-2xs">
                  <span className="text-[#9E6000] font-bold not-italic text-[9px] sm:text-[10px] uppercase tracking-wider block mb-0.5">
                    {isEl ? 'Πρόταση Σερβιρίσματος Sommelier:' : 'Sommelier Pairing Tip:'}
                  </span>
                  "{recommendation.pairingTip}"
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-[#C8860A]/15 mt-auto">
              <button
                onClick={resetQuiz}
                className="text-[#2A1B0A]/60 hover:text-[#2A1B0A] text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={13} /> {isEl ? 'Επανάληψη Τεστ' : 'Retake Quiz'}
              </button>

              <div className="flex gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 border border-[#C8860A]/30 text-[#2A1B0A] hover:bg-[#FEF7E6] text-xs uppercase tracking-widest font-bold rounded-[3px] transition-colors"
                >
                  {isEl ? 'Κλείσιμο' : 'Close'}
                </button>
                <Link
                  to={recommendation.link}
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 text-center"
                >
                  {recommendation.buttonText} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
