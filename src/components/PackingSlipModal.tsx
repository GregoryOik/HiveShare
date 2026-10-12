import React from 'react';
import { X, Printer, Package, Truck, CheckCircle, MapPin } from 'lucide-react';

export interface PackingSlipData {
  orderRef: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  city?: string;
  postalCode?: string;
  country?: string;
  items: {
    description: string;
    quantity: number;
    size?: string;
    customLabel?: string;
  }[];
  trackingNumber?: string;
  carrier?: string;
  totalAmount?: number;
  notes?: string;
}

interface PackingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PackingSlipData | null;
}

export default function PackingSlipModal({ isOpen, onClose, data }: PackingSlipModalProps) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const fullDestination = [
    data.shippingAddress,
    data.city,
    data.postalCode,
    data.country || 'Greece'
  ].filter(Boolean).join(', ');

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl bg-[#140E08] border border-honey/30 rounded-[2px] shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Controls Header (Hidden during print) */}
        <div className="flex items-center justify-between border-b border-honey/15 pb-4 print:hidden">
          <div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold flex items-center gap-1.5">
              <Truck size={12} /> Courier Dispatch & Fulfillment
            </div>
            <h3 className="font-display text-2xl text-white">Packing Slip & Courier Label</h3>
            <div className="text-white/50 text-xs font-mono">{data.orderRef}</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-honey text-[#0C0804] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[2px] flex items-center gap-2 shadow-md transition-all"
            >
              <Printer size={14} /> Print Slip
            </button>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── PRINTABLE SLIP CANVAS (Black & White high contrast for thermal/standard printers) ── */}
        <div
          id="printable-packing-slip"
          className="bg-white text-black p-8 md:p-10 font-sans border border-black/20 shadow-md text-xs leading-relaxed"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-black">HiveShare</h1>
              <p className="text-[10px] uppercase tracking-widest text-black/70 font-bold mt-0.5">
                Petros Oikonomakos Nomadic Apiaries
              </p>
              <p className="text-[10px] text-black/60 mt-1">
                Sparta Extraction Facility · Laconia, Peloponnese, Greece<br />
                info@oikonomakos.gr · www.oikonomakos.gr
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider font-bold bg-black text-white px-3 py-1 inline-block">
                PACKING SLIP
              </div>
              <div className="text-sm font-mono font-bold mt-2">REF: {data.orderRef}</div>
              <div className="text-[10px] text-black/60">Date: {data.orderDate}</div>
              {data.carrier && (
                <div className="text-[10px] text-black/70 font-semibold mt-1">Carrier: {data.carrier}</div>
              )}
            </div>
          </div>

          {/* Delivery & Shipper Addresses */}
          <div className="grid grid-cols-2 gap-8 mb-6 pb-6 border-b border-black/15">
            <div>
              <div className="text-[9px] uppercase tracking-widest font-bold text-black/60 mb-1">
                Ship To (Customer):
              </div>
              <div className="font-bold text-sm text-black">{data.customerName}</div>
              <div className="text-xs text-black/80 mt-1 whitespace-pre-line">{fullDestination}</div>
              {data.customerPhone && (
                <div className="text-[11px] font-mono mt-1 text-black/70">Tel: {data.customerPhone}</div>
              )}
              <div className="text-[11px] font-mono text-black/60">{data.customerEmail}</div>
            </div>

            <div className="border-l border-black/15 pl-6">
              <div className="text-[9px] uppercase tracking-widest font-bold text-black/60 mb-1">
                Tracking & Courier Coordinates:
              </div>
              <div className="font-mono text-xs font-bold text-black">
                {data.trackingNumber ? `TRACK: ${data.trackingNumber}` : 'Standard Insured European Dispatch'}
              </div>
              <div className="mt-3 p-2 bg-gray-100 border border-gray-300 rounded font-mono text-[10px] text-center tracking-widest">
                ||||| | |||||||| |||| | |||||| |||||||
                <div className="text-[8px] mt-0.5">{data.trackingNumber || data.orderRef}</div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black text-[9px] uppercase tracking-wider text-black/70">
                  <th className="py-2 font-bold">Qty</th>
                  <th className="py-2 font-bold">Item Description & Varietal</th>
                  <th className="py-2 font-bold">Format / Size</th>
                  <th className="py-2 text-right font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 text-xs">
                {data.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-mono font-bold">{item.quantity}x</td>
                    <td className="py-3">
                      <div className="font-semibold text-black">{item.description}</div>
                      {item.customLabel && (
                        <div className="text-[11px] italic text-black/70">
                          Custom Jar Inscription: "{item.customLabel}"
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-mono text-black/70">{item.size || 'Standard'}</td>
                    <td className="py-3 text-right font-bold text-[10px] text-green-700">✓ PACKED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Beekeeper Note */}
          <div className="pt-4 border-t-2 border-black flex justify-between items-end">
            <div className="max-w-md">
              <p className="font-serif italic text-xs text-black/80">
                "Thank you for supporting our nomadic apiaries in the Mani mountains. Petros extracts and bottles every jar cold without filtration to preserve living enzymes and raw aromatic vitality."
              </p>
              <p className="text-[9px] uppercase tracking-wider font-bold text-black/50 mt-1">
                Hand-packed with protective corrugated glass packaging in Laconia, Greece.
              </p>
            </div>
            {data.totalAmount !== undefined && (
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-widest text-black/50 font-bold">Order Value</div>
                <div className="text-xl font-mono font-bold text-black">€{data.totalAmount}.00</div>
              </div>
            )}
          </div>
        </div>

        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-packing-slip, #printable-packing-slip * {
              visibility: visible !important;
            }
            #printable-packing-slip {
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              border: none !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 25px !important;
              background-color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        ` }} />
      </div>
    </div>
  );
}
