import React from 'react';
import { BusStop } from '../types/transit';
import { Search, MapPin, X, Filter, Navigation, Compass } from 'lucide-react';

interface BusStopSelectorProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: 'all' | 'favorites' | 'sea_only' | 'dd_only' | 'wab_only';
  onFilterChange: (filter: 'all' | 'favorites' | 'sea_only' | 'dd_only' | 'wab_only') => void;
  favoritesCount: number;
  direction: 1 | 2;
  onDirectionToggle: () => void;
}

export const BusStopSelector: React.FC<BusStopSelectorProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  favoritesCount,
  direction,
  onDirectionToggle,
}) => {
  return (
    <div className="space-y-2.5">
      {/* 5-digit Stop Code / Bus Road Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Enter 5-digit stop code (01012) or road / service..."
          className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-[#cbd5e1] rounded text-[#0b1c30] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a] font-mono transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#94a3b8] hover:text-[#0f172a]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Segmented Direction Switcher & Quick Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Direction Switcher */}
        <div className="flex items-center rounded border border-[#cbd5e1] bg-white p-0.5 text-xs">
          <button
            onClick={() => direction === 2 && onDirectionToggle()}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
              direction === 1
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Dir 1 · Inbound
          </button>
          <button
            onClick={() => direction === 1 && onDirectionToggle()}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
              direction === 2
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Dir 2 · Outbound
          </button>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#0f172a] text-white border-[#0f172a]'
                : 'bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f1f5f9]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('favorites')}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
              activeFilter === 'favorites'
                ? 'bg-[#b45309] text-white border-[#b45309]'
                : 'bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f1f5f9]'
            }`}
          >
            <span>Pinned</span>
            {favoritesCount > 0 && (
              <span className="font-mono text-[10px] bg-white/20 px-1 rounded">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onFilterChange('sea_only')}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
              activeFilter === 'sea_only'
                ? 'bg-[#166534] text-white border-[#166534]'
                : 'bg-white text-[#3f6253] border-[#bbf7d0] hover:bg-[#ecfdf5]'
            }`}
          >
            Seats Avail (SEA)
          </button>
          <button
            onClick={() => onFilterChange('dd_only')}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
              activeFilter === 'dd_only'
                ? 'bg-[#1e293b] text-white border-[#1e293b]'
                : 'bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f1f5f9]'
            }`}
          >
            Double Deck
          </button>
        </div>
      </div>

      {/* Available Bus Stops Quick Selector */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-[#64748b] font-semibold uppercase tracking-wider px-0.5">
          <span>Active Transit Stops</span>
          <span className="font-mono">{stops.length} stations nearby</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 max-h-[190px] overflow-y-auto pr-0.5">
          {stops.map((stop) => {
            const isSelected = selectedStop.code === stop.code;
            return (
              <div
                key={stop.code}
                onClick={() => onSelectStop(stop)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectStop(stop)}
                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#0f172a] bg-[#eef4ff] ring-1 ring-[#0f172a]'
                    : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#fafbff]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex flex-col items-center justify-center w-11 h-9 rounded bg-[#f1f5f9] border border-[#cbd5e1] shrink-0 font-mono">
                    <span className="text-[11px] font-bold text-[#0f172a] leading-none">
                      {stop.code}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-[#0f172a] truncate">
                        {stop.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#64748b] mt-0.5">
                      <span className="truncate">{stop.road}</span>
                      {stop.distanceMeters && (
                        <span className="font-mono text-[#475569] text-[10px] bg-[#f1f5f9] px-1 rounded border border-[#e2e8f0]">
                          {stop.distanceMeters}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* MRT Badges */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {stop.mrtConnections?.map((mrt) => (
                    <span
                      key={mrt.code}
                      className="px-1 py-0.5 rounded text-[9px] font-mono font-bold text-white tracking-wide"
                      style={{ backgroundColor: mrt.color }}
                      title={mrt.name}
                    >
                      {mrt.code}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
