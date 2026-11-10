import React from 'react';
import { BusStop } from '../types/transit';
import { Search, MapPin, X, ArrowUpDown } from 'lucide-react';

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
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter stop by code (01012), road, or service..."
          className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Direction & Filter Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Direction Switcher */}
        <button
          onClick={onDirectionToggle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors"
          title="Toggle inbound / outbound direction"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
          <span>{direction === 1 ? 'Direction 1 · Inbound' : 'Direction 2 · Outbound'}</span>
        </button>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              activeFilter === 'all'
                ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('favorites')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              activeFilter === 'favorites'
                ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Pinned {favoritesCount > 0 ? `(${favoritesCount})` : ''}
          </button>
          <button
            onClick={() => onFilterChange('sea_only')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              activeFilter === 'sea_only'
                ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Seats Only
          </button>
          <button
            onClick={() => onFilterChange('dd_only')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              activeFilter === 'dd_only'
                ? 'bg-white text-zinc-900 font-semibold shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Double Deck
          </button>
        </div>
      </div>

      {/* Nearby Stations List */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium px-1">
          <span>Transit Stations ({stops.length})</span>
          <span className="text-[11px]">Tap to view arrivals</span>
        </div>

        <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5">
          {stops.map((stop) => {
            const isSelected = selectedStop.code === stop.code;
            return (
              <div
                key={stop.code}
                onClick={() => onSelectStop(stop)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectStop(stop)}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 shadow-2xs'
                    : 'border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    {stop.code}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 truncate">
                      {stop.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {stop.road} · {stop.distanceMeters}m away
                    </p>
                  </div>
                </div>

                {/* MRT Transfers */}
                {stop.mrtConnections && stop.mrtConnections.length > 0 && (
                  <div className="flex gap-1 shrink-0 ml-2">
                    {stop.mrtConnections.map((m) => (
                      <span
                        key={m.code}
                        className="font-mono text-[9px] font-bold text-white px-1.5 py-0.2 rounded"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.code}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
