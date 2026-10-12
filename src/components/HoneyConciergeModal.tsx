import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, Compass, Award, Heart } from 'lucide-react';
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
  const [usageChoice, setUsageChoice] = useState<string>('yogurt');
  const [formatChoice, setFormatChoice] = useState<string>('jar');

  if (!isOpen) return null;

  const resetQuiz = () => {
    setStep(1);
    setFlavorChoice('thyme');
    setUsageChoice('yogurt');
    setFormatChoice('jar');
  };

  // Determine Recommendation
  const getRecommendation = () => {
    if (formatChoice === 'membership' || flavorChoice === 'all') {
      return {
        title: isEl ? 'Αναδοχή Κυψέλης Starter (2,5 kg)' : 'Starter Guardianship (2.5 kg Reserve)',
        subtitle: isEl ? 'Ετήσια σύνδεση με κυψέλη στη Μάνη · 3 εποχιακές αποστολές' : 'Living colony sponsorship · 3 seasonal harvest deliveries',
        price: '€140 / yr',
        pricePerKg: '€56 / kg',
        link: '/membership',
        buttonText: isEl ? 'Υιοθετήστε την Κυψέλη σας' : 'Claim Guardianship',
        image: '/raw_honey.png',
        matchScore: '99%',
        reason: isEl
          ? 'Επειδή εκτιμάτε την ποικιλία και θέλετε αυθεντικό, ανεπεξέργαστο μέλι καθ’ όλη τη διάρκεια της χρονιάς, η αναδοχή κυψέλης σάς προσφέρει άμεση σύνδεση με τον μελισσοκόμο Πέτρο και εξοικονόμηση πάνω από 50% σε σύγκριση με μεμονωμένα βάζα.'
          : 'Because you value seasonal diversity and authentic provenance throughout the year, adopting a living colony connects you directly to Petros and delivers premium single-origin honey at over 50% savings compared to retail jars.',
        pairingTip: isEl
          ? 'Συνοδεύει άριστα παραδοσιακό στραγγιστό γιαούρτι, παλαιωμένη γραβιέρα και πρωινές φρυγανιές.'
          : 'Pairs exquisitely with Greek sheep yogurt, aged graviera, and fresh morning sourdough.',
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
        matchScore: '97%',
        reason: isEl
          ? 'Η ιδανική γαστρονομική εμπειρία: απολαμβάνετε τα τρία πιο φημισμένα ελληνικά μέλια (Θυμάρι, Έλατο, Αγριολούλουδα) μαζί με το βραβευμένο ελαιόλαδο της οικογένειας Οικονομάκου.'
          : 'The ultimate culinary gift: savor the top three Greek terroirs (Wild Thyme, Arcadian Fir, Wildflower) alongside the Oikonomakos family’s cold-pressed Extra Virgin Olive Oil.',
        pairingTip: isEl
          ? 'Ιδανικό για πλατό τυριών, γκουρμέ μαγειρική και δώρα υψηλού κύρους.'
          : 'Ideal for charcuterie boards, gourmet pairings, and executive gifts.',
      };
    }

    if (flavorChoice === 'fir') {
      return {
        title: isEl ? 'Μέλι Ελάτης Μαινάλου (Grand Cru)' : 'Black Fir Honey (Grand Cru)',
        subtitle: isEl ? 'Ορεινή Αρκαδία · Υψόμετρο 1.150μ · Δεν κρυσταλλώνει ποτέ' : 'Arcadian High Canopy · 1,150m · Never crystallizes',
        price: '€52 (500g) / €88 (1kg)',
        pricePerKg: '€104 / kg',
        link: '/buy-honey',
        buttonText: isEl ? 'Παραγγελία Μελιού Ελάτης' : 'Order Arcadian Fir',
        image: '/4jars.jpg',
        matchScore: '98%',
        reason: isEl
          ? 'Η προτίμησή σας σε νότες καραμέλας, πεύκου και χαμηλής φυσικής γλυκύτητας ταιριάζει απόλυτα με το σπάνιο μέλι ελάτης. Έχει εξαιρετικά παχύρρευστη υφή και δεν κρυσταλλώνει ποτέ φυσικά.'
          : 'Your preference for caramel, toasted pine notes, and low natural sweetness points to rare Arcadian Fir. Exceptionally thick, rich in minerals, and naturally non-crystallizing.',
        pairingTip: isEl
          ? 'Δοκιμάστε το με καρύδια, μαύρο ψωμί σίκαλης ή κατευθείαν με το κουτάλι.'
          : 'Try it with toasted walnuts, dark rye bread, or directly from the spoon.',
      };
    }

    if (flavorChoice === 'flower') {
      return {
        title: isEl ? 'Αγριολούλουδα Ταϋγέτου & Βανίλια' : 'Taygetos Wildflower & Vanilla Cream',
        subtitle: isEl ? 'Πρόποδες Σπάρτης · Υψόμετρο 310μ · Πρώιμη ανοιξιάτικη ανθοφορία' : 'Spartan Foothills · 310m Elevation · Early Spring Multi-Floral',
        price: '€28 (250g) / €52 (500g)',
        pricePerKg: '€104 / kg',
        link: '/buy-honey',
        buttonText: isEl ? 'Παραγγελία Ανθόμελου' : 'Order Wildflower Jar',
        image: '/raw_honey.png',
        matchScore: '96%',
        reason: isEl
          ? 'Απαλό, αρωματικό και κρεμώδες. Συλλέγεται από τα πρώτα αγριολούλουδα της κοιλάδας της Σπάρτης την άνοιξη, προσφέροντας ντελικάτη γλύκα και αναζωογονητική ενέργεια.'
          : 'Delicate, floral, and creamy. Harvested from early spring blossoms across the Spartan plains, offering gentle natural sweetness and bright morning vitality.',
        pairingTip: isEl
          ? 'Εξαιρετικό σε αφεψήματα χαμομηλιού, φρέσκα λευκά τυριά και φρούτα εποχής.'
          : 'Sublime over fresh ricotta, white peaches, and herbal morning infusions.',
      };
    }

    // Default: Thyme & Sage
    return {
      title: isEl ? 'Άγριο Θυμάρι & Φασκόμηλο Μάνης' : 'Mani Wild Thyme & Mountain Sage',
      subtitle: isEl ? 'Λάγια Μάνης · Ακρωτήριο Ταίναρο · 84% Θυμάρι' : 'Lagia, Cape Tenaro, Mani · 84% Wild Thyme Dominance',
      price: '€28 (250g) / €52 (500g)',
      pricePerKg: '€112 / kg',
      link: '/buy-honey',
      buttonText: isEl ? 'Παραγγελία Θυμαρίσιου' : 'Order Wild Thyme Jar',
      image: '/raw_honey.png',
      matchScore: '99%',
      reason: isEl
          ? 'Το κορυφαίο ελληνικό μέλι: έντονο άρωμα, κεχριμπαρένιο χρώμα και υψηλή περιεκτικότητα σε γύρη από τα βραχώδη εδάφη της Μάνης. Ανεπεξέργαστο και πλούσιο σε ένζυμα.'
          : 'The undisputed king of Greek honey: intense herbal bouquet, deep amber hue, and potent bio-active enzymes drawn from coastal thyme baked by the Laconian sun.',
      pairingTip: isEl
          ? 'Κλασικός συνδυασμός με γιαούρτι, παλαιωμένα τυριά και ζεστό προζυμένιο ψωμί.'
          : 'The timeless pairing with strained Greek yogurt, aged graviera, and crusty sourdough.',
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-[#FFFDF7] text-[#2A1B0A] border-2 border-honey/40 rounded-[2px] shadow-[0_25px_80px_rgba(42,27,10,0.35)] p-6 sm:p-10 space-y-7 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-honey/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header & Progress Bar */}
        <div className="border-b border-honey/20 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold flex items-center gap-2">
              <Compass size={14} className="text-honey" />
              <span>{isEl ? 'Προσωπικός Επιλογέας Μελιού' : 'The Honey Concierge'}</span>
            </div>
            <button 
              onClick={onClose} 
              className="text-[#2A1B0A]/40 hover:text-[#2A1B0A] p-1.5 transition-colors rounded-full hover:bg-honey/10"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl sm:text-3xl text-[#2A1B0A]">
              {step <= 3
                ? (isEl ? `Βήμα ${step} από 3: ${step === 1 ? 'Αρωματικό Προφίλ' : step === 2 ? 'Τρόπος Απόλαυσης' : 'Επιλογή Συσκευασίας'}` : `Step ${step} of 3: ${step === 1 ? 'Palate Profile' : step === 2 ? 'Daily Ritual' : 'Allocation Format'}`)
                : (isEl ? 'Το Ιδανικό σας Μέλι' : 'Your Mountain Terroir Match')}
            </h3>
            {step <= 3 && (
              <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-honey">
                {Math.round((step / 3) * 100)}%
              </div>
            )}
          </div>

          {step <= 3 && (
            <div className="w-full h-1 bg-honey/15 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-honey transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* ── QUESTION 1: FLAVOR PROFILE ── */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm sm:text-base text-[#2A1B0A]/80 font-serif italic">
              {isEl
                ? 'Ποιο αρωματικό και γευστικό προφίλ ταιριάζει περισσότερο στον ουρανίσκο σας;'
                : 'Which aromatic and sensory profile best resonates with your palate?'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  id: 'thyme',
                  badge: 'Mani Thyme',
                  title: isEl ? 'Έντονο Άγριο Θυμάρι & Βότανα' : 'Intense Wild Thyme & Herbs',
                  desc: isEl ? 'Πικάντικο, κεχριμπαρένιο, γεμάτο αρώματα της άγριας Μάνης.' : 'Pungent, amber, high pollen density, resinous sharp finish.',
                },
                {
                  id: 'fir',
                  badge: 'Arcadian Fir',
                  title: isEl ? 'Καραμέλα, Πεύκο & Βανίλια Ελάτης' : 'Caramel, Pine & Fir Vanilla',
                  desc: isEl ? 'Παχύρρευστο, χαμηλή γλυκύτητα, δεν κρυσταλλώνει ποτέ.' : 'Ultra-thick viscosity, low glucose, never crystallizes.',
                },
                {
                  id: 'flower',
                  badge: 'Spring Bloom',
                  title: isEl ? 'Απαλά Αγριολούλουδα & Ανθός' : 'Gentle Wildflower & Blossom',
                  desc: isEl ? 'Απαλή ντελικάτη γλύκα με κρεμώδεις ανθικές νότες.' : 'Delicate floral perfume with creamy vanilla sweetness.',
                },
                {
                  id: 'all',
                  badge: 'Seasonal Flight',
                  title: isEl ? 'Θέλω Όλες τις Εποχιακές Σοδειές' : 'I Love Seasonal Variety',
                  desc: isEl ? 'Εξερεύνηση διαφορετικών ποικιλιών καθ’ όλη τη χρονιά.' : 'Receive all seasonal harvest extractions as the year unfolds.',
                },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFlavorChoice(opt.id)}
                  className={`text-left p-4 rounded-[3px] border transition-all ${
                    flavorChoice === opt.id
                      ? 'bg-honey/15 border-honey text-[#2A1B0A] shadow-md ring-1 ring-honey/40'
                      : 'bg-white/80 border-[#C8860A]/20 text-[#2A1B0A]/80 hover:border-honey hover:bg-[#FEF7E6]'
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-widest text-[#9E6000] font-bold mb-1">{opt.badge}</div>
                  <div className="font-bold text-sm text-[#2A1B0A] mb-1 font-serif">{opt.title}</div>
                  <div className="text-xs text-[#2A1B0A]/70 leading-relaxed font-sans">{opt.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#C8860A]/15">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center gap-2 shadow-sm transition-all"
              >
                {isEl ? 'Επόμενο' : 'Next Question'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── QUESTION 2: USAGE & OCCASION ── */}
        {step === 2 && (
          <div className="space-y-6">
            <p className="text-sm sm:text-base text-[#2A1B0A]/80 font-serif italic">
              {isEl
                ? 'Πώς απολαμβάνετε συνήθως το μέλι στην καθημερινότητά σας;'
                : 'How do you most frequently savor honey in your daily rituals?'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setUsageChoice(opt.id)}
                  className={`text-left p-4 rounded-[3px] border transition-all ${
                    usageChoice === opt.id
                      ? 'bg-honey/15 border-honey text-[#2A1B0A] shadow-md ring-1 ring-honey/40'
                      : 'bg-white/80 border-[#C8860A]/20 text-[#2A1B0A]/80 hover:border-honey hover:bg-[#FEF7E6]'
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-widest text-[#9E6000] font-bold mb-1">{opt.badge}</div>
                  <div className="font-bold text-sm text-[#2A1B0A] mb-1 font-serif">{opt.title}</div>
                  <div className="text-xs text-[#2A1B0A]/70 leading-relaxed font-sans">{opt.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#C8860A]/15">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-[#C8860A]/30 text-[#2A1B0A]/70 hover:text-[#2A1B0A] text-xs uppercase tracking-widest font-bold rounded-[3px] transition-colors"
              >
                {isEl ? 'Πίσω' : 'Back'}
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center gap-2 shadow-sm transition-all"
              >
                {isEl ? 'Επόμενο' : 'Next Question'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── QUESTION 3: FORMAT ── */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-sm sm:text-base text-[#2A1B0A]/80 font-serif italic">
              {isEl
                ? 'Ποια μορφή εξυπηρετεί καλύτερα τις ανάγκες σας;'
                : 'Which guardianship or purchase format fits your lifestyle best?'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[
                {
                  id: 'jar',
                  badge: 'Direct Jars',
                  title: isEl ? 'Μεμονωμένο Βάζο' : 'Single Glass Jar',
                  desc: isEl ? 'Δοκιμάστε μία συγκεκριμένη σοδειά (250g, 500g, 1kg).' : 'Order a standalone numbered jar to taste right away.',
                },
                {
                  id: 'membership',
                  badge: 'Hive Adoption',
                  title: isEl ? 'Ετήσια Αναδοχή Κυψέλης' : 'Annual Hive Guardianship',
                  desc: isEl ? 'Σύνδεση με κυψέλη, ζωντανό ημερολόγιο, 3 εποχιακές παραδόσεις.' : 'Adopt a living colony, get IoT updates & 3 seasonal harvests.',
                },
                {
                  id: 'hamper',
                  badge: 'Luxury Gift Hamper',
                  title: isEl ? 'Σετ Δώρου με Ελαιόλαδο' : 'Tasting Trio & Olive Oil',
                  desc: isEl ? '3 ποικιλίες μελιού + έξτρα παρθένο ελαιόλαδο σε ξύλινο κουτί.' : '3x raw honeys + single-estate olive oil in wooden presentation box.',
                },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFormatChoice(opt.id)}
                  className={`text-left p-4 rounded-[3px] border transition-all ${
                    formatChoice === opt.id
                      ? 'bg-honey/15 border-honey text-[#2A1B0A] shadow-md ring-1 ring-honey/40'
                      : 'bg-white/80 border-[#C8860A]/20 text-[#2A1B0A]/80 hover:border-honey hover:bg-[#FEF7E6]'
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-widest text-[#9E6000] font-bold mb-1">{opt.badge}</div>
                  <div className="font-bold text-sm text-[#2A1B0A] mb-1 font-serif">{opt.title}</div>
                  <div className="text-xs text-[#2A1B0A]/70 leading-relaxed font-sans">{opt.desc}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#C8860A]/15">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-[#C8860A]/30 text-[#2A1B0A]/70 hover:text-[#2A1B0A] text-xs uppercase tracking-widest font-bold rounded-[3px] transition-colors"
              >
                {isEl ? 'Πίσω' : 'Back'}
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center gap-2 shadow-sm transition-all"
              >
                {isEl ? 'Δείτε το Αποτέλεσμα' : 'Reveal My Match'} <Sparkles size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: RECOMMENDATION RESULT ── */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Match Card */}
            <div className="bg-[#FEF7E6] border-2 border-honey/40 p-6 sm:p-8 rounded-[4px] space-y-5 relative overflow-hidden shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#C8860A]/20 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-honey/20 border border-honey/40 rounded-full text-[#9E6000] text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                    <Sparkles size={12} /> {recommendation.matchScore} {isEl ? 'Συμβατότητα με τις Προτιμήσεις σας' : 'Palate Compatibility'}
                  </div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-[#2A1B0A] font-bold">{recommendation.title}</h4>
                  <div className="text-[#9E6000] text-xs font-semibold uppercase tracking-wider mt-1">{recommendation.subtitle}</div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="font-serif text-2xl font-bold text-[#2A1B0A]">{recommendation.price}</div>
                  <div className="text-[10px] text-[#2A1B0A]/60 font-mono">{recommendation.pricePerKg}</div>
                </div>
              </div>

              {/* Rationale */}
              <div className="text-sm text-[#2A1B0A]/85 leading-relaxed font-sans">
                {recommendation.reason}
              </div>

              {/* Pairing Tip */}
              <div className="p-3.5 bg-white/90 border-l-3 border-honey rounded-sm text-xs text-[#2A1B0A]/80 italic shadow-2xs">
                <span className="text-[#9E6000] font-bold not-italic text-[10px] uppercase tracking-wider block mb-0.5">
                  {isEl ? 'Πρόταση Σερβιρίσματος Sommelier:' : 'Sommelier Pairing Tip:'}
                </span>
                "{recommendation.pairingTip}"
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                onClick={resetQuiz}
                className="text-[#2A1B0A]/60 hover:text-[#2A1B0A] text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={13} /> {isEl ? 'Επανάληψη Τεστ' : 'Retake Quiz'}
              </button>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 border border-[#C8860A]/30 text-[#2A1B0A] hover:bg-[#FEF7E6] text-xs uppercase tracking-widest font-bold rounded-[3px] transition-colors"
                >
                  {isEl ? 'Κλείσιμο' : 'Close'}
                </button>
                <Link
                  to={recommendation.link}
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] flex items-center justify-center gap-2 shadow-sm transition-all"
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
