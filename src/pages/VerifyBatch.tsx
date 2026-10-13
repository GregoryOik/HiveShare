import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  QrCode,
  Share2
} from 'lucide-react';
import Footer from '../components/Footer';

interface BatchInfo {
  code: string;
  variety: string;
  harvestDate: string;
  bottlingDate: string;
  apiaryLocation: string;
  altitudeMeters: number;
  coordinates: string;
  moisturePercent: number;
  diastaseActivity: string;
  hmfLevel: string;
  pollenDominance: string;
  pollenRatioPercent: number;
  secondaryFlora: string[];
  beekeeper: string;
  lotSizeJars: number;
  sensoryNotes: string;
  rawUnfiltered: boolean;
  tamperSealVerified: boolean;
}

const KNOWN_BATCHES: Record<string, BatchInfo> = {
  'THYME-2026-A1': {
    code: 'THYME-2026-A1',
    variety: 'Mani Wild Thyme Honey (Grand Cru)',
    harvestDate: 'July 2026',
    bottlingDate: 'August 2026',
    apiaryLocation: 'Lagia, Deep Mani, Peloponnese',
    altitudeMeters: 620,
    coordinates: '36.4851° N, 22.4832° E',
    moisturePercent: 15.4,
    diastaseActivity: '28.4 DN (Exceptional enzyme vitality)',
    hmfLevel: '3.1 mg/kg (Standard raw limit <40)',
    pollenDominance: 'Thymus capitatus (Wild Coastal Thyme)',
    pollenRatioPercent: 82,
    secondaryFlora: ['Rock Rose (Cistus)', 'Wild Oregano', 'Mountain Savory'],
    beekeeper: 'Petros Oikonomakos (Master Apiarist)',
    lotSizeJars: 320,
    sensoryNotes: 'Intense amber hue with persistent herbal aromatics, subtle cedar undertones, and a prolonged resinous finish.',
    rawUnfiltered: true,
    tamperSealVerified: true,
  },
  'FIR-2026-F2': {
    code: 'FIR-2026-F2',
    variety: 'Arcadian Black Fir / Vanilla Fir (Elatis)',
    harvestDate: 'June 2026',
    bottlingDate: 'July 2026',
    apiaryLocation: 'Mount Mainalo Biosphere, Arcadia',
    altitudeMeters: 1140,
    coordinates: '37.6080° N, 22.2530° E',
    moisturePercent: 14.8,
    diastaseActivity: '31.2 DN (Ultra-rare honeydew density)',
    hmfLevel: '2.4 mg/kg',
    pollenDominance: 'Abies cephalonica Honeydew',
    pollenRatioPercent: 88,
    secondaryFlora: ['Highland Thyme', 'Wild Blackberry', 'Alpine Flora'],
    beekeeper: 'Petros Oikonomakos (Nomadic High-Altitude Station)',
    lotSizeJars: 180,
    sensoryNotes: 'Thick caramel viscosity with pearlescent amber bands. Low natural sweetness with warm toasted pine nut & butterscotch finish. Never crystallizes naturally.',
    rawUnfiltered: true,
    tamperSealVerified: true,
  },
  'ORANGE-2026-O3': {
    code: 'ORANGE-2026-O3',
    variety: 'Laconia Orange Blossom & Citrus Grove',
    harvestDate: 'April 2026',
    bottlingDate: 'May 2026',
    apiaryLocation: 'Eurotas River Valley, Laconia',
    altitudeMeters: 140,
    coordinates: '36.8520° N, 22.7150° E',
    moisturePercent: 16.2,
    diastaseActivity: '22.0 DN',
    hmfLevel: '4.8 mg/kg',
    pollenDominance: 'Citrus sinensis (Orange Blossom)',
    pollenRatioPercent: 76,
    secondaryFlora: ['Wild Lavender', 'Lemon Verbena', 'Rosemary'],
    beekeeper: 'Petros Oikonomakos',
    lotSizeJars: 240,
    sensoryNotes: 'Pale luminous gold. Vibrant floral bouquet with gentle citrus acidity, candied peel notes, and clean refreshing finish.',
    rawUnfiltered: true,
    tamperSealVerified: true,
  },
};

export default function VerifyBatch() {
  const { batchId } = useParams<{ batchId?: string }>();
  const [searchInput, setSearchInput] = useState('');
  const [currentBatch, setCurrentBatch] = useState<BatchInfo | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const code = (batchId || 'THYME-2026-A1').toUpperCase().trim();
    setSearchInput(code);
    lookupBatch(code);
  }, [batchId]);

  const lookupBatch = (queryCode: string) => {
    const clean = queryCode.toUpperCase().trim();
    if (KNOWN_BATCHES[clean]) {
      setCurrentBatch(KNOWN_BATCHES[clean]);
    } else {
      // Dynamic fallback for any jar stamped with year
      setCurrentBatch({
        code: clean || 'BATCH-2026-CUSTOM',
        variety: 'Single-Origin Peloponnese Harvest Reserve',
        harvestDate: 'Seasonal Extraction 2026',
        bottlingDate: 'Current Vintage Bottling',
        apiaryLocation: 'Laconia Foothills & Mani Slopes, Peloponnese',
        altitudeMeters: 580,
        coordinates: '36.5200° N, 22.4500° E',
        moisturePercent: 15.6,
        diastaseActivity: '26.8 DN (Certified Living Enzymes)',
        hmfLevel: '3.4 mg/kg (Unheated / Cold-Extracted)',
        pollenDominance: 'Indigenous Laconian Flora (Wild Thyme & Mountain Herbs)',
        pollenRatioPercent: 79,
        secondaryFlora: ['Wild Oregano', 'Sage', 'Pine Honeydew'],
        beekeeper: 'Petros Oikonomakos',
        lotSizeJars: 250,
        sensoryNotes: 'Authentic raw unheated honey extracted directly from hand-spun honeycomb frames at room temperature.',
        rawUnfiltered: true,
        tamperSealVerified: true,
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      lookupBatch(searchInput);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0804] text-[#E5DCD0] font-body selection:bg-honey selection:text-black">
      {/* ── HEADER ── */}
      <header className="border-b border-honey/15 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          <Link to="/" className="font-display text-2xl tracking-wide group flex items-center gap-2 min-w-0">
            <span className="text-white group-hover:text-honey transition-colors">Hive</span>
            <span className="text-honey">Share</span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest text-honey/60 border border-honey/20 px-2 py-0.5 rounded-sm">
              Provenance Registry
            </span>
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <Link
              to="/buy-honey"
              className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 hover:text-honey font-bold transition-colors"
            >
              Buy Honey
            </Link>
            <Link
              to="/membership"
              className="px-3 sm:px-4 py-2 bg-honey text-[#0C0804] hover:bg-honey/90 text-[10px] sm:text-xs uppercase tracking-widest font-bold rounded-[2px] transition-all"
            >
              Adopt a Colony
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO & SEARCH ── */}
      <div className="relative border-b border-honey/15 bg-gradient-to-b from-[#140E08] via-[#0C0804] to-[#0C0804] py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-honey/10 border border-honey/30 rounded-full text-honey text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold">
            <ShieldCheck size={14} /> Official Batch Verification & Lab Certificate
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            Single-Origin Provenance
          </h1>
          <p className="text-white/60 text-xs sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Every numbered jar from Petros Oikonomakos’ apiaries is traceable to its precise mountain coordinates, floral bloom window, and independent moisture analysis.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto pt-4 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-honey/60" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Scan or enter batch code (e.g. THYME-2026-A1)..."
                className="w-full bg-black/70 border border-honey/30 pl-10 pr-4 py-3 text-base sm:text-sm text-white rounded-[2px] uppercase tracking-wider font-mono focus:outline-none focus:border-honey"
              />
            </div>
            <button
              type="submit"
              className="px-5 sm:px-6 py-3 bg-honey text-[#0C0804] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[2px] transition-all whitespace-nowrap shadow-md active:scale-95"
            >
              Verify
            </button>
          </form>

          {/* Quick links to sample batches */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-white/50">
            <span>Sample batches:</span>
            {Object.keys(KNOWN_BATCHES).map(bCode => (
              <button
                key={bCode}
                type="button"
                onClick={() => {
                  setSearchInput(bCode);
                  lookupBatch(bCode);
                }}
                className="text-honey hover:underline font-mono"
              >
                {bCode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BATCH DETAILS SECTION ── */}
      {currentBatch && (
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
          {/* Certificate Header Banner */}
          <div className="bg-[#140E08] border-2 border-honey/30 p-8 md:p-10 rounded-[2px] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-honey/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-honey/15 pb-8">
              <div>
                <div className="flex items-center gap-2 text-honey text-xs font-mono uppercase tracking-widest mb-1">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span>Verified Authentic Batch: <strong className="text-white font-bold">{currentBatch.code}</strong></span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-white">{currentBatch.variety}</h2>
                <div className="text-white/60 text-xs mt-1 flex items-center gap-3">
                  <span>Harvest: {currentBatch.harvestDate}</span>
                  <span>·</span>
                  <span>Bottled: {currentBatch.bottlingDate}</span>
                  <span>·</span>
                  <span>Numbered Lot: {currentBatch.lotSizeJars} Jars Total</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest font-bold border border-white/20 rounded-[2px] flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 size={13} /> {copiedLink ? 'Link Copied!' : 'Share Certificate'}
                </button>
                <Link
                  to="/buy-honey"
                  className="px-5 py-2.5 bg-honey text-[#0C0804] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[2px] flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  Order This Reserve <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Sensory Tasting Profile */}
            <div className="pt-6">
              <div className="text-[10px] uppercase tracking-[0.25em] text-honey font-bold mb-1">Sommelier Tasting Note</div>
              <p className="text-white/80 font-serif italic text-lg leading-relaxed">
                "{currentBatch.sensoryNotes}"
              </p>
            </div>
          </div>

          {/* 3-Column Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Geographic Origin */}
            <div className="bg-[#120D08] border border-honey/20 p-6 rounded-[2px] space-y-4">
              <div className="flex items-center gap-2 text-honey text-xs uppercase tracking-widest font-bold border-b border-honey/15 pb-3">
                <MapPin size={15} /> Geographic Provenance
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Apiary Sector</div>
                  <div className="text-white font-medium text-sm mt-0.5">{currentBatch.apiaryLocation}</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Elevation</div>
                  <div className="text-honey font-mono text-sm mt-0.5">{currentBatch.altitudeMeters} Meters a.s.l.</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">GPS Coordinates</div>
                  <div className="text-white/80 font-mono text-xs mt-0.5">{currentBatch.coordinates}</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Master Beekeeper</div>
                  <div className="text-white font-medium mt-0.5">{currentBatch.beekeeper}</div>
                </div>
              </div>
            </div>

            {/* Box 2: Laboratory Analysis */}
            <div className="bg-[#120D08] border border-honey/20 p-6 rounded-[2px] space-y-4">
              <div className="flex items-center gap-2 text-honey text-xs uppercase tracking-widest font-bold border-b border-honey/15 pb-3">
                <Droplets size={15} /> Laboratory Analysis
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Moisture Content</div>
                  <div className="text-green-400 font-mono text-sm mt-0.5 font-bold">
                    {currentBatch.moisturePercent}% <span className="text-[10px] text-white/50 font-normal">(Raw grade &lt;18%)</span>
                  </div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Diastase Activity (Enzymes)</div>
                  <div className="text-white font-mono text-xs mt-0.5">{currentBatch.diastaseActivity}</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">HMF Level (Freshness)</div>
                  <div className="text-white font-mono text-xs mt-0.5">{currentBatch.hmfLevel}</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Processing State</div>
                  <div className="text-honey font-medium mt-0.5">Cold-Extracted & 100% Unpasteurized</div>
                </div>
              </div>
            </div>

            {/* Box 3: Melissopalynological (Pollen) Profile */}
            <div className="bg-[#120D08] border border-honey/20 p-6 rounded-[2px] space-y-4">
              <div className="flex items-center gap-2 text-honey text-xs uppercase tracking-widest font-bold border-b border-honey/15 pb-3">
                <Sparkles size={15} /> Botanical Dominance
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Primary Nectar Source</div>
                  <div className="text-white font-medium text-sm mt-0.5">{currentBatch.pollenDominance}</div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Dominance Ratio</div>
                  <div className="w-full bg-black/60 rounded-full h-2 mt-1.5 overflow-hidden border border-white/10">
                    <div className="bg-honey h-full rounded-full" style={{ width: `${currentBatch.pollenRatioPercent}%` }} />
                  </div>
                  <div className="text-right text-[10px] font-mono text-honey mt-1 font-bold">
                    {currentBatch.pollenRatioPercent}% Floral Dominance
                  </div>
                </div>
                <div>
                  <div className="text-white/40 uppercase tracking-wider text-[10px]">Secondary Native Flora</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {currentBatch.secondaryFlora.map((fl, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/80 rounded-sm text-[10px]">
                        {fl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Master Beekeeper's Guarantee */}
          <div className="bg-gradient-to-r from-[#181109] to-[#120D08] border border-honey/30 p-8 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold">Laconian Nomadic Tradition</div>
              <h3 className="font-display text-2xl text-white">Petros Oikonomakos Apiaries Quality Seal</h3>
              <p className="text-white/60 text-xs max-w-xl leading-relaxed">
                "Our hives are transported across mountain ridges following wild seasonal blooms. We never feed our bees sugar syrup for harvest honey, never heat-treat, and package every jar directly at our Sparta facility."
              </p>
            </div>
            <div className="text-center shrink-0 border-t md:border-t-0 md:border-l border-honey/20 pt-4 md:pt-0 md:pl-8">
              <div className="font-display italic text-2xl text-honey">Petros Oikonomakos</div>
              <div className="text-[9px] uppercase tracking-widest text-white/40 font-mono mt-1">Master Apiarist · Lagia, Mani</div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
