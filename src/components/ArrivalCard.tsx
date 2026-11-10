import React from 'react';
import { BusArrival, BusServiceArrival, OccupancyStatus } from '../types/transit';
import { Star, ChevronRight, Accessibility } from 'lucide-react';

interface ArrivalCardProps {
  service: BusServiceArrival;
  isFavorite: boolean;
  onToggleFavorite: (serviceNo: string) => void;
  isSelected: boolean;
  onSelect: (service: BusServiceArrival) => void;
}

export const formatEta = (seconds: number): string => {
  if (seconds <= 45) return 'Arr';
  const mins = Math.round(seconds / 60);
  if (mins <= 0) return 'Arr';
  return `${mins}m`;
};

// Subtle semantic indicators (modern, minimalist, restrained)
const getOccupancyIndicator = (status: OccupancyStatus) => {
  switch (status) {
    case 'SEA':
      return {
        dotClass: 'bg-emerald-600',
        textLabel: 'Seats',
        barClass: 'bg-emerald-600',
      };
    case 'SDA':
      return {
        dotClass: 'bg-amber-500',
        textLabel: 'Standing',
        barClass: 'bg-amber-500',
      };
    case 'LSD':
      return {
        dotClass: 'bg-rose-600',
        textLabel: 'Full',
        barClass: 'bg-rose-600',
      };
  }
};

export const ArrivalCard: React.FC<ArrivalCardProps> = ({
  service,
  isFavorite,
  onToggleFavorite,
  isSelected,
  onSelect,
}) => {
  const [next1, next2, next3] = service.nextBuses;

  return (
    <div
      onClick={() => onSelect(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(service)}
      className={`group relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between border transition-all cursor-pointer select-none px-4 py-3 rounded-lg min-h-[56px] ${
        isSelected
          ? 'border-zinc-900 bg-zinc-50/80 ring-1 ring-zinc-900 shadow-xs'
          : 'border-zinc-200/90 bg-white hover:border-zinc-300 hover:bg-zinc-50/50 shadow-2xs'
      }`}
    >
      {/* Left Slot: Bus Service Number + Route Destination */}
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* Star Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(service.serviceNo);
          }}
          className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${
            isFavorite
              ? 'text-amber-600 bg-amber-50/80'
              : 'text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100'
          }`}
          aria-label={isFavorite ? 'Unpin favorite' : 'Pin favorite'}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
        </button>

        {/* Bus Service Number */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-950 font-mono leading-none">
              {service.serviceNo}
            </span>

            {/* Unboxed clean metadata (zero-pill discipline) */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>{service.operator}</span>
              {service.category !== 'Trunk' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-zinc-600">{service.category}</span>
                </>
              )}
            </div>
          </div>

          {/* Destination */}
          <div className="text-xs text-zinc-500 mt-1 truncate">
            <span className="text-zinc-400">To </span>
            <span className="font-medium text-zinc-800">{service.destinationName}</span>
          </div>
        </div>
      </div>

      {/* Right Slot: Minimalist Arrival Triad */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 mt-3 sm:mt-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
        <ArrivalColumn bus={next1} label="Next" isPrimary={true} />
        <ArrivalColumn bus={next2} label="2nd" isPrimary={false} />
        <ArrivalColumn bus={next3} label="3rd" isPrimary={false} />

        <div className="hidden sm:flex items-center pl-1 text-zinc-300 group-hover:text-zinc-600 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

interface ArrivalColumnProps {
  bus: BusArrival;
  label: string;
  isPrimary: boolean;
}

const ArrivalColumn: React.FC<ArrivalColumnProps> = ({ bus, label, isPrimary }) => {
  const occ = getOccupancyIndicator(bus.occupancy);
  const etaText = formatEta(bus.etaSeconds);
  const isNow = etaText === 'Arr';

  return (
    <div className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-md transition-colors ${
      isPrimary ? 'bg-zinc-100/70 border border-zinc-200/50' : 'bg-transparent'
    }`}>
      {/* ETA Minute */}
      <div className="flex items-center gap-1">
        <span
          className={`font-mono font-bold leading-none tracking-tight font-tnum ${
            isPrimary ? 'text-lg text-zinc-950' : 'text-base text-zinc-600'
          } ${isNow ? 'text-rose-600 font-extrabold animate-pulse' : ''}`}
        >
          {etaText}
        </span>
      </div>

      {/* Subtle 2px minimal occupancy line */}
      <div className="w-8 h-[2.5px] rounded-full bg-zinc-200 my-1 overflow-hidden">
        <div className={`h-full rounded-full ${occ.barClass}`} style={{ width: '100%' }} />
      </div>

      {/* Deck & Accessibility text */}
      <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
        <span>{bus.vehicleType}</span>
        {bus.isWab && <span title="Wheelchair accessible">· W</span>}
      </div>
    </div>
  );
};
