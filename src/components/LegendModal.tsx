import React from 'react';
import { X, Info, Bus, Accessibility } from 'lucide-react';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegendModal: React.FC<LegendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-xs">
      <div 
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-zinc-900" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">
              Commuter Transit Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Passenger Crowding */}
          <div>
            <h4 className="font-semibold text-zinc-900 mb-2">
              Seating & Crowding Indicators
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                  <div>
                    <p className="font-semibold text-zinc-900">Seats Available</p>
                    <p className="text-[11px] text-zinc-500">Plenty of seats on lower & upper decks</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  <div>
                    <p className="font-semibold text-zinc-900">Standing Room Only</p>
                    <p className="text-[11px] text-zinc-500">Seats filled, comfortable standing space</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/70">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0"></span>
                  <div>
                    <p className="font-semibold text-zinc-900">Limited Standing / Full</p>
                    <p className="text-[11px] text-zinc-500">Tight standing, bus nearing capacity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Types */}
          <div>
            <h4 className="font-semibold text-zinc-900 mb-2">
              Bus Deck Configurations
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50">
                <span className="font-mono font-bold text-zinc-900 text-xs">DD</span>
                <p className="font-medium text-zinc-700 text-[11px] mt-0.5">Double Deck</p>
                <p className="text-[10px] text-zinc-400">120+ seats</p>
              </div>

              <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50">
                <span className="font-mono font-bold text-zinc-900 text-xs">SD</span>
                <p className="font-medium text-zinc-700 text-[11px] mt-0.5">Single Deck</p>
                <p className="text-[10px] text-zinc-400">75 seats</p>
              </div>

              <div className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50">
                <span className="font-mono font-bold text-zinc-900 text-xs">BD</span>
                <p className="font-medium text-zinc-700 text-[11px] mt-0.5">Bendy Bus</p>
                <p className="text-[10px] text-zinc-400">Articulated 18m</p>
              </div>
            </div>
          </div>

          {/* Accessibility & Alight reminders */}
          <div className="p-3 rounded-lg border border-zinc-100 bg-zinc-50 text-[11px] text-zinc-600 space-y-1.5">
            <p>
              <strong className="text-zinc-900">WAB:</strong> Wheelchair Accessible Bus equipped with ramp and dedicated bays.
            </p>
            <p>
              <strong className="text-zinc-900">Alight Reminder:</strong> Tap any bus to see its route, then tap "Alight" on your target stop to receive an audio chime and prompt before arrival.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
