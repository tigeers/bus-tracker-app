import React from 'react';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle, Bus, Accessibility } from 'lucide-react';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegendModal: React.FC<LegendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg rounded-lg border border-[#cbd5e1] bg-white p-6 shadow-xl text-[#0b1c30]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#1e293b]" />
            <h3 className="text-base font-bold text-[#0f172a] tracking-tight uppercase">
              Singapore Transit Telemetry Standards
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded border border-[#cbd5e1] bg-white flex items-center justify-center text-[#475569] hover:bg-[#f1f5f9] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Occupancy Levels */}
          <div>
            <h4 className="font-semibold text-[#0f172a] mb-2 uppercase tracking-wide">
              Passenger Crowding (LTA Standard)
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded border border-[#bbf7d0] bg-[#ecfdf5]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f6253]"></span>
                  <span className="font-bold text-[#166534]">SEA · Seats Available</span>
                </div>
                <span className="text-[#3f6253] font-mono">Ample seating across all decks</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded border border-[#fde68a] bg-[#fffbeb]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span>
                  <span className="font-bold text-[#854d0e]">SDA · Standing Available</span>
                </div>
                <span className="text-[#b45309] font-mono">Seats taken, comfortable standing</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded border border-[#fecaca] bg-[#fef2f2]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#991b1b]"></span>
                  <span className="font-bold text-[#991b1b]">LSD · Limited Standing</span>
                </div>
                <span className="text-[#991b1b] font-mono">High crowding, tight standing</span>
              </div>
            </div>
          </div>

          {/* Vehicle Types */}
          <div>
            <h4 className="font-semibold text-[#0f172a] mb-2 uppercase tracking-wide">
              Vehicle Deck Configuration
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded border border-[#cbd5e1] bg-[#f1f5f9] text-center">
                <span className="metric-badge inline-block bg-[#1e293b] text-white px-1.5 py-0.5 rounded">DD</span>
                <p className="mt-1 font-semibold text-[#1e293b]">Double Deck</p>
                <p className="text-[10px] text-[#64748b]">High capacity 120+ pax</p>
              </div>

              <div className="p-2 rounded border border-[#cbd5e1] bg-[#f1f5f9] text-center">
                <span className="metric-badge inline-block bg-[#475569] text-white px-1.5 py-0.5 rounded">SD</span>
                <p className="mt-1 font-semibold text-[#1e293b]">Single Deck</p>
                <p className="text-[10px] text-[#64748b]">Standard 70-80 pax</p>
              </div>

              <div className="p-2 rounded border border-[#cbd5e1] bg-[#f1f5f9] text-center">
                <span className="metric-badge inline-block bg-[#091426] text-white px-1.5 py-0.5 rounded">BD</span>
                <p className="mt-1 font-semibold text-[#1e293b]">Bendy Bus</p>
                <p className="text-[10px] text-[#64748b]">Articulated 18m chassis</p>
              </div>
            </div>
          </div>

          {/* Accessibility & GPS */}
          <div>
            <h4 className="font-semibold text-[#0f172a] mb-2 uppercase tracking-wide">
              Accessibility & Telemetry
            </h4>
            <div className="space-y-1.5 border border-[#e2e8f0] p-2.5 rounded bg-[#f8fafc]">
              <div className="flex items-center gap-2">
                <span className="metric-badge bg-[#cbd5e1] text-[#0f172a] px-1.5 py-0.5 rounded">WAB</span>
                <span className="text-[#334155]">Wheelchair Accessible Bus (Electronic ramp & designated bay)</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-[#e2e8f0]">
                <span className="w-2 h-2 rounded-full bg-[#3f6253]"></span>
                <span className="text-[#334155]">Green Pulse: Live GPS synchronized via onboard Commuter Telemetry Unit</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#e2e8f0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#1e293b] text-white text-xs font-semibold hover:bg-[#0f172a] transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
