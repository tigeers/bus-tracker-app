import React, { useState, useEffect } from 'react';
import { X, Info, Sparkles, ArrowRight } from 'lucide-react';

interface FirstTimeUserBannerProps {
  onLearnMore?: () => void;
}

export const FirstTimeUserBanner: React.FC<FirstTimeUserBannerProps> = ({ onLearnMore }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('sg_transit_first_time_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('sg_transit_first_time_dismissed', 'true');
    } catch {
      // LocalStorage fallback
    }
  };

  if (!isVisible) return null;

  return (
    <div className="relative mb-3 rounded-lg border border-zinc-200 bg-white p-3.5 shadow-xs transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-800 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">
                Welcome to SG Transit
              </span>
              <span className="text-[11px] text-zinc-500">
                Quick Guide for First-Time Commuters
              </span>
            </div>
            <p className="text-zinc-600 mt-1 leading-relaxed">
              Real-time bus arrival countdowns, live vehicle tracking, and seat availability.
              Tap any bus service card to view its complete route sequence, live bus positions, and set an alight reminder.
            </p>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Seats available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Standing only
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> Full
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
          aria-label="Dismiss guide"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
