import React, { useState } from 'react';
import { RouteStop } from '../types/transit';
import { Bell, BellOff, Volume2, Check, X, Navigation } from 'lucide-react';

interface AlightNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStop: RouteStop | null;
  onCancelAlarm: () => void;
}

export const AlightNotificationModal: React.FC<AlightNotificationModalProps> = ({
  isOpen,
  onClose,
  activeStop,
  onCancelAlarm,
}) => {
  const [hasPlayedChime, setHasPlayedChime] = useState(false);

  if (!isOpen || !activeStop) return null;

  // Synthesize civic arrival chime using Web Audio API
  const playCivicChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [587.33, 659.25, 880]; // D5, E5, A5 chime
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.15 + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.15);
        osc.stop(audioCtx.currentTime + idx * 0.15 + 0.5);
      });
      setHasPlayedChime(true);
      setTimeout(() => setHasPlayedChime(false), 2000);
    } catch {
      // AudioContext fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div 
        className="w-full max-w-md rounded-lg border border-[#cbd5e1] bg-white p-5 shadow-xl text-[#0b1c30]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center text-[#b45309]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wide">
                Active Alight Reminder
              </h3>
              <p className="text-[10px] text-[#64748b] font-mono">
                TELEMETRY GEOFENCE ACTIVE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded border border-[#cbd5e1] flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded border border-[#cbd5e1] bg-[#f8fafc]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#475569] bg-[#e2e8f0] px-1.5 py-0.5 rounded">
                Stop #{activeStop.stopCode}
              </span>
              <h4 className="font-bold text-sm text-[#0f172a]">
                {activeStop.stopName}
              </h4>
            </div>
            <p className="text-xs text-[#64748b] mt-1">
              Along {activeStop.roadName} · Stop sequence #{activeStop.seq}
            </p>
          </div>

          <div className="p-3 rounded border border-[#bbf7d0] bg-[#ecfdf5] text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-[#166534] font-semibold">
              <Check className="w-4 h-4" />
              <span>Geofence Alert Set for 2 Stops Ahead</span>
            </div>
            <p className="text-[11px] text-[#3f6253]">
              Your browser will sound the civic chime and vibrate when your bus approaches this stop.
            </p>
          </div>

          <button
            onClick={playCivicChime}
            className="w-full flex items-center justify-center gap-2 py-2 rounded border border-[#cbd5e1] bg-white text-xs font-semibold text-[#1e293b] hover:bg-[#f1f5f9] transition-colors"
          >
            <Volume2 className="w-4 h-4 text-[#005ec4]" />
            <span>{hasPlayedChime ? 'Chime Sounded!' : 'Test Civic Alight Chime'}</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[#e2e8f0] flex justify-between gap-2">
          <button
            onClick={() => {
              onCancelAlarm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#fecaca] bg-[#fef2f2] text-xs font-semibold text-[#991b1b] hover:bg-[#fee2e2]"
          >
            <BellOff className="w-3.5 h-3.5" />
            <span>Cancel Alert</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#1e293b] text-white text-xs font-semibold hover:bg-[#0f172a]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
