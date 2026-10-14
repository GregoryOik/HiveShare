import React from 'react';
import { X, Printer, Download, Award, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  guardianName: string;
  tierName: string;
  hiveId?: string;
  seasonYear?: string | number;
  issueDate?: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  guardianName,
  tierName,
  hiveId = '04',
  seasonYear = new Date().getFullYear(),
  issueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
}: CertificateModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-4xl bg-[#140E08] border border-honey/30 rounded-[2px] shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-honey/15 pb-4 print:hidden">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold flex items-center gap-1.5">
              <Award size={12} /> Official HiveShare Document
            </div>
            <h3 className="font-display text-2xl text-white">Adoption & Stewardship Certificate</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-honey text-[#0C0804] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[2px] flex items-center gap-2 shadow-md transition-all"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── PRINTABLE CERTIFICATE CANVAS ── */}
        <div
          id="printable-certificate"
          className="relative bg-[#FFFDF7] text-[#1A1208] border-[12px] border-[#C8860A] p-8 md:p-14 shadow-2xl rounded-sm overflow-hidden font-serif selection:bg-[#C8860A]/20"
        >
          {/* Ornate Corner Accents */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#C8860A]/40" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#C8860A]/40" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#C8860A]/40" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#C8860A]/40" />

          {/* Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] pointer-events-none">
            <Award size={340} strokeWidth={1} color="#C8860A" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Header */}
            <div className="text-[10px] md:text-[11px] uppercase tracking-[0.45em] text-[#C8860A] font-sans font-bold mb-3">
              Petros Oikonomakos Nomadic Apiaries · Established Laconia, Greece
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1A1208] mb-2 font-normal italic tracking-tight">
              Certificate of Guardianship
            </h1>
            <div className="w-20 h-[1.5px] bg-[#C8860A] my-4" />

            {/* Declaration */}
            <p className="font-serif italic text-base md:text-lg text-[#2A1B0A]/80 max-w-xl mx-auto mb-4">
              This official parchment affirms that
            </p>

            {/* Recipient / Guardian Name */}
            <div className="font-display text-3xl md:text-5xl text-[#1A1208] font-bold border-b border-[#C8860A]/40 px-8 pb-2 mb-4 min-w-[280px]">
              {guardianName || 'Honored Guardian'}
            </div>

            <p className="font-serif text-sm md:text-base text-[#2A1B0A]/80 max-w-2xl mx-auto leading-relaxed mb-6">
              is recognized as an official patron and protector of living honey bee colonies in the Taygetos mountain ranges and Mani peninsula, ensuring the continuation of ethical, unheated, and single-origin apiculture.
            </p>

            {/* Colony Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl border-t border-b border-[#C8860A]/20 py-4 my-4 font-sans text-left">
              <div>
                <div className="text-[8px] uppercase tracking-widest text-[#1A1208]/40 font-bold">Colony Location</div>
                <div className="text-xs font-bold text-[#1A1208] mt-0.5">Lagia, Mani</div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-widest text-[#1A1208]/40 font-bold">Allocated Colony</div>
                <div className="text-xs font-semibold text-[#C8860A] mt-0.5">Hive #{hiveId}</div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-widest text-[#1A1208]/40 font-bold">Guardianship Tier</div>
                <div className="text-xs font-bold text-[#1A1208] mt-0.5 uppercase">{tierName}</div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-widest text-[#1A1208]/40 font-bold">Harvest Vintage</div>
                <div className="text-xs font-bold text-[#1A1208] mt-0.5">{seasonYear} Season</div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-3 items-end w-full max-w-2xl pt-6 mt-2 font-sans">
              {/* Left: Issue Date */}
              <div className="text-left text-xs">
                <div className="text-[9px] uppercase tracking-wider text-[#1A1208]/40">Date of Consecration</div>
                <div className="font-bold text-[#1A1208] mt-1">{issueDate}</div>
              </div>

              {/* Center: Wax Seal Emblem */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-[#C8860A] bg-[#C8860A]/10 flex flex-col items-center justify-center p-1 shadow-inner">
                  <Award size={24} className="text-[#C8860A]" />
                  <span className="text-[7px] uppercase tracking-widest font-bold text-[#C8860A] mt-0.5">MANI APIS</span>
                </div>
              </div>

              {/* Right: Master Beekeeper Signature */}
              <div className="text-right">
                <div className="font-display italic text-2xl text-[#1A1208] leading-none mb-1">
                  Petros Oikonomakos
                </div>
                <div className="w-32 h-[1px] bg-[#1A1208]/30 ml-auto mb-1" />
                <div className="text-[8px] uppercase tracking-widest text-[#1A1208]/50 font-bold">
                  Master Apiarist · Sparta, Laconia
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles injected for pristine printing */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-certificate, #printable-certificate * {
              visibility: visible !important;
            }
            #printable-certificate {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              border: 10px solid #C8860A !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 40px !important;
              background-color: #FFFDF7 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        ` }} />
      </div>
    </div>
  );
}
