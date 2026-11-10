import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Bus, X, ArrowRight, CornerDownLeft, Star } from 'lucide-react';
import { BusStop, BusServiceArrival } from '../types/transit';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onSelectService?: (service: BusServiceArrival) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stops,
  onSelectStop,
  onSelectService,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  // Matched bus stops
  const matchedStops = stops.filter(
    (s) =>
      s.code.includes(normalizedQuery) ||
      s.name.toLowerCase().includes(normalizedQuery) ||
      s.road.toLowerCase().includes(normalizedQuery)
  );

  // Matched bus services across stops
  const matchedServices: { service: BusServiceArrival; stop: BusStop }[] = [];
  stops.forEach((stop) => {
    stop.services.forEach((svc) => {
      if (
        normalizedQuery &&
        (svc.serviceNo.toLowerCase().includes(normalizedQuery) ||
          svc.destinationName.toLowerCase().includes(normalizedQuery))
      ) {
        if (!matchedServices.some((m) => m.service.serviceNo === svc.serviceNo)) {
          matchedServices.push({ service: svc, stop });
        }
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-2xl text-zinc-900 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 5-digit stop code (e.g. 01012), road, or bus service..."
            className="w-full text-sm bg-transparent placeholder:text-zinc-400 text-zinc-900 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 rounded border border-zinc-200">
              ESC
            </kbd>
          )}
        </div>

        {/* Quick Hub Suggestions if query is empty */}
        {!query && (
          <div className="p-3 border-b border-zinc-100 bg-zinc-50/60">
            <span className="text-[11px] font-medium text-zinc-500 block mb-2">
              Popular Singapore Transit Hubs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {stops.map((stop) => (
                <button
                  key={stop.code}
                  onClick={() => {
                    onSelectStop(stop);
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs rounded-md bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="font-mono text-[10px] text-zinc-400 font-semibold">{stop.code}</span>
                  <span>{stop.name.split('/')[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {/* Matched Stops */}
          {matchedStops.length > 0 && (
            <div>
              <span className="text-[11px] font-medium text-zinc-400 px-2.5 py-1 block">
                Bus Stops ({matchedStops.length})
              </span>
              {matchedStops.map((stop) => (
                <div
                  key={stop.code}
                  onClick={() => {
                    onSelectStop(stop);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0 font-mono text-xs font-semibold">
                      {stop.code}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 truncate">
                        {stop.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {stop.road} · {stop.services.length} services
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-zinc-400 group-hover:text-zinc-700">
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Matched Services */}
          {matchedServices.length > 0 && (
            <div className="pt-2 border-t border-zinc-100">
              <span className="text-[11px] font-medium text-zinc-400 px-2.5 py-1 block">
                Bus Services ({matchedServices.length})
              </span>
              {matchedServices.map(({ service, stop }) => (
                <div
                  key={service.serviceNo}
                  onClick={() => {
                    onSelectStop(stop);
                    if (onSelectService) onSelectService(service);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {service.serviceNo}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 truncate">
                        To {service.destinationName}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate">
                        Via {stop.name} ({stop.code})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                    <span>{service.operator}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {query && matchedStops.length === 0 && matchedServices.length === 0 && (
            <div className="py-8 text-center text-xs text-zinc-400">
              No bus stops or services found for "{query}".
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Search 5-digit bus stop code or service number</span>
          <span className="hidden sm:inline">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
