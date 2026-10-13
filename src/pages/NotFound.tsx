import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';

export default function NotFound() {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#2A1B0A] flex items-center justify-center p-6 relative">
      <div className="max-w-lg w-full text-center space-y-10">
        <div className="space-y-4">
          <div className="font-serif text-8xl font-light text-honey/80 tracking-tight select-none">
            404
          </div>
          <div className="w-12 h-[1px] bg-honey/40 mx-auto" />
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2A1B0A] font-normal tracking-wide">
            {isEl ? 'Η Κυψέλη αυτή δεν Βρέθηκε' : 'Colony Not Found'}
          </h1>
          <p className="text-[#2A1B0A]/70 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-sans font-light">
            {isEl
              ? 'Η διαδρομή που αναζητάτε δεν αντιστοιχεί σε κάποιο από τα μελισσοκομεία μας στη Λακωνία. Επιστρέψτε στην αρχική σελίδα για να περιηγηθείτε στις ενεργές σοδειές.'
              : 'The destination you requested has no active hive in our Laconian apiaries. Please return to explore our current single-origin harvests.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-[11px] uppercase tracking-[0.2em] font-medium rounded-[2px] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={13} /> {isEl ? 'Αρχική Σελίδα' : 'Return Home'}
          </Link>
          <Link
            to="/buy-honey"
            className="w-full sm:w-auto px-8 py-3.5 border border-[#C8860A]/30 text-[#2A1B0A] hover:border-honey hover:bg-[#FEF7E6] text-[11px] uppercase tracking-[0.2em] font-medium rounded-[2px] transition-all flex items-center justify-center gap-2"
          >
            <Compass size={13} className="text-honey" /> {isEl ? 'Συλλογή Μελιών' : 'Explore Jars'}
          </Link>
        </div>

        <div className="pt-8 text-[11px] text-[#2A1B0A]/40 font-serif italic border-t border-honey/15">
          {isEl
            ? '«Ακολουθούμε τον φυσικό κύκλο ανθοφορίας της φύσης.» — Οικογένεια Οικονομάκου'
            : '“Attuned to the unhurried rhythms of Greek flora.” — Oikonomakos Apiaries'}
        </div>
      </div>
    </div>
  );
}
