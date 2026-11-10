import React from 'react';
import { BusArrival, BusServiceArrival, OccupancyStatus } from '../types/transit';
import { Star, ChevronRight, Radio, Accessibility, ShieldAlert } from 'lucide-react';

interface ArrivalCardProps {
  service: BusServiceArrival;
  isFavorite: boolean;
  onToggleFavorite: (serviceNo: string) => void;
  isSelected: boolean;
  onSelect: (service: BusServiceArrival) => void;
}

// Format seconds into civic glance timing: "Arr", "1m", "4m", etc.
export const formatEta = (seconds: number): string => {
  if (seconds <= 45) return 'Arr';
  const mins = Math.round(seconds / 60);
  if (mins <= 0) return 'Arr';
  return `${mins}m`;
};

// Occupancy styling tokens from design system
const getOccupancyConfig = (status: OccupancyStatus) => {
  switch (status) {
    case 'SEA':
      return {
        label: 'Seats Avail',
        short: 'SEA',
        barColor: '#3F6253', // Muted Sage
        badgeBg: '#ECFDF5',
        badgeText: '#166534',
        badgeBorder: '#BBF7D0',
      };
    case 'SDA':
      return {
        label: 'Standing Avail',
        short: 'SDA',
        barColor: '#B45309', // Warm Ochre Amber
        badgeBg: '#FFFBEB',
        badgeText: '#854D0E',
        badgeBorder: '#FDE68A',
      };
    case 'LSD':
      return {
        label: 'Limited Standing',
        short: 'LSD',
        barColor: '#991B1B', // Muted Terracotta Brick
        badgeBg: '#FEF2F2',
        badgeText: '#991B1B',
        badgeBorder: '#FECACA',
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(service);
        }
      }}
      className={`group relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between border transition-all cursor-pointer select-none bg-white py-2 px-3 sm:px-3.5 my-1.5 rounded ${
        isSelected
          ? 'border-[#0f172a] bg-[#f8f9ff] ring-1 ring-[#0f172a]'
          : 'border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#fafbff]'
      }`}
    >
      {/* Left Slot: Service Number + Destination + Operator */}
      <div className="flex items-center gap-3 min-w-0 pr-2">
        {/* Favorite Pin Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(service.serviceNo);
          }}
          className={`h-7 w-7 rounded flex items-center justify-center transition-colors border ${
            isFavorite
              ? 'border-[#fde68a] bg-[#fffbeb] text-[#b45309]'
              : 'border-transparent text-[#94a3b8] hover:text-[#475569] hover:bg-[#f1f5f9]'
          }`}
          aria-label={isFavorite ? 'Unpin favorite' : 'Pin favorite'}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#b45309]' : ''}`} />
        </button>

        {/* Bus Service Number */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold tracking-tight text-[#0f172a] text-2xl sm:text-[28px] leading-none font-mono">
              {service.serviceNo}
            </span>

            {/* Operator tag */}
            <span className="metric-badge rounded bg-[#f1f5f9] px-1 py-0.5 text-[#334155] border border-[#e2e8f0]">
              {service.operator}
            </span>

            {service.category === 'Express' && (
              <span className="metric-badge rounded bg-[#fef2f2] px-1 py-0.5 text-[#991b1b] border border-[#fecaca]">
                EXP
              </span>
            )}
            {service.category === 'Feeder' && (
              <span className="metric-badge rounded bg-[#ecfdf5] px-1 py-0.5 text-[#166534] border border-[#bbf7d0]">
                FEEDER
              </span>
            )}
          </div>

          {/* Destination and loop metadata */}
          <div className="flex items-center gap-1.5 text-xs text-[#475569] mt-0.5 truncate max-w-[200px] xs:max-w-[240px] sm:max-w-[280px]">
            <span className="text-[#94a3b8] text-[10px] uppercase font-semibold">To</span>
            <span className="font-medium text-[#1e293b] truncate text-[11px] sm:text-xs">
              {service.destinationName}
            </span>
          </div>
        </div>
      </div>

      {/* Right Slot: Arrival Triad (Next, 2nd, 3rd) */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f1f5f9]">
        {/* Arrival 1 (Leading / Next Bus) */}
        <ArrivalSlot bus={next1} label="Next" isPrimary={true} />

        {/* Arrival 2 */}
        <ArrivalSlot bus={next2} label="2nd" isPrimary={false} />

        {/* Arrival 3 */}
        <ArrivalSlot bus={next3} label="3rd" isPrimary={false} />

        {/* Right Arrow indicator */}
        <div className="hidden md:flex items-center pl-1 text-[#94a3b8] group-hover:text-[#0f172a] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

interface ArrivalSlotProps {
  bus: BusArrival;
  label: string;
  isPrimary: boolean;
}

const ArrivalSlot: React.FC<ArrivalSlotProps> = ({ bus, label, isPrimary }) => {
  const occ = getOccupancyConfig(bus.occupancy);
  const etaFormatted = formatEta(bus.etaSeconds);
  const isArr = etaFormatted === 'Arr';

  return (
    <div className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[68px] py-1 px-1.5 rounded transition-colors ${
      isPrimary ? 'bg-[#f8fafc] border border-[#e2e8f0]' : 'bg-transparent'
    }`}>
      {/* Top row: Glance ETA + Live GPS Dot */}
      <div className="flex items-center justify-center gap-1">
        <span
          className={`metric-eta leading-none tracking-tight font-mono ${
            isArr
              ? 'text-[#991b1b] animate-pulse font-extrabold'
              : 'text-[#0f172a]'
          }`}
        >
          {etaFormatted}
        </span>
        {bus.isLiveGps && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#3f6253]"
            title="Live GPS verified telemetry"
          />
        )}
      </div>

      {/* Occupancy 3px-tall indicator bar */}
      <div className="w-full h-[3px] my-1 rounded-full bg-[#e2e8f0] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ backgroundColor: occ.barColor, width: '100%' }}
        />
      </div>

      {/* Vehicle Attributes: Uppercase badges (Deck + WAB) */}
      <div className="flex items-center gap-1 mt-0.5">
        <span
          className="metric-badge px-1 py-0.2 rounded border text-[9px] font-bold"
          style={{
            backgroundColor: '#f1f5f9',
            borderColor: '#cbd5e1',
            color: '#1e293b',
          }}
          title={bus.vehicleType === 'DD' ? 'Double Deck' : bus.vehicleType === 'BD' ? 'Bendy Bus' : 'Single Deck'}
        >
          {bus.vehicleType}
        </span>

        {bus.isWab && (
          <span
            className="metric-badge px-1 py-0.2 rounded border text-[9px] font-bold text-[#1e293b] bg-[#f1f5f9] border-[#cbd5e1]"
            title="Wheelchair Accessible Bus"
          >
            WAB
          </span>
        )}

        <span
          className="metric-badge px-1 py-0.2 rounded border text-[8px] font-bold hidden sm:inline"
          style={{
            backgroundColor: occ.badgeBg,
            borderColor: occ.badgeBorder,
            color: occ.badgeText,
          }}
        >
          {occ.short}
        </span>
      </div>
    </div>
  );
};
