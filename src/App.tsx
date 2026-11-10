import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_BUS_STOPS, RAIL_LINES_STATUS, COMMUTER_ADVISORIES } from './data/singaporeTransitData';
import { BusStop, BusServiceArrival, RouteStop, RailLineStatus, CommuterAdvisory } from './types/transit';
import { HeaderBar } from './components/HeaderBar';
import { ArrivalCard } from './components/ArrivalCard';
import { BusStopSelector } from './components/BusStopSelector';
import { SchematicRouteMap } from './components/SchematicRouteMap';
import { RailIncidentMatrix } from './components/RailIncidentMatrix';
import { LegendModal } from './components/LegendModal';
import { AlightNotificationModal } from './components/AlightNotificationModal';
import {
  MapPin,
  RefreshCw,
  Search,
  Filter,
  ArrowRightLeft,
  Navigation,
  Compass,
  Train,
  ShieldCheck,
  AlertCircle,
  Eye,
  Bus,
  Layers
} from 'lucide-react';

const REFRESH_INTERVAL_SECONDS = 15;

export default function App() {
  const [stops, setStops] = useState<BusStop[]>(INITIAL_BUS_STOPS);
  const [selectedStopCode, setSelectedStopCode] = useState<string>('01012');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'sea_only' | 'dd_only' | 'wab_only'>('all');
  const [direction, setDirection] = useState<1 | 2>(1);
  const [viewMode, setViewMode] = useState<'auto' | 'mobile' | 'tablet' | 'desktop'>('auto');
  const [selectedService, setSelectedService] = useState<BusServiceArrival | null>(null);

  // Auto-refresh countdown
  const [refreshCountdown, setRefreshCountdown] = useState<number>(REFRESH_INTERVAL_SECONDS);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modals & Alarms
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [isAlightModalOpen, setIsAlightModalOpen] = useState<boolean>(false);
  const [activeAlightStop, setActiveAlightStop] = useState<RouteStop | null>(null);

  // Favorites in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sg_transit_favorites');
      return saved ? JSON.parse(saved) : ['190', '147'];
    } catch {
      return ['190', '147'];
    }
  });

  const toggleFavorite = useCallback((serviceNo: string) => {
    setFavorites((prev) => {
      const next = prev.includes(serviceNo)
        ? prev.filter((s) => s !== serviceNo)
        : [...prev, serviceNo];
      try {
        localStorage.setItem('sg_transit_favorites', JSON.stringify(next));
      } catch {
        // LocalStorage fallback
      }
      return next;
    });
  }, []);

  // Current selected stop
  const currentStop = useMemo(() => {
    return stops.find((s) => s.code === selectedStopCode) || stops[0];
  }, [stops, selectedStopCode]);

  // Set default selected service if none
  useEffect(() => {
    if (!selectedService && currentStop.services.length > 0) {
      setSelectedService(currentStop.services[0]);
    }
  }, [currentStop, selectedService]);

  // Real-time second countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          triggerTelemetrySync();
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });

      // Tick arrival seconds down
      setStops((prevStops) =>
        prevStops.map((stop) => ({
          ...stop,
          services: stop.services.map((svc) => ({
            ...svc,
            nextBuses: svc.nextBuses.map((b) => {
              if (b.etaSeconds <= 5) {
                // Bus rolls over into Arr, stays or shifts
                return { ...b, etaSeconds: Math.max(0, b.etaSeconds - 1) };
              }
              return { ...b, etaSeconds: b.etaSeconds - 1 };
            }) as [typeof svc.nextBuses[0], typeof svc.nextBuses[1], typeof svc.nextBuses[2]],
          })),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Telemetry sync action
  const triggerTelemetrySync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Perturb or refresh arrival telemetry slightly for realism
      setStops((prevStops) =>
        prevStops.map((stop) => ({
          ...stop,
          services: stop.services.map((svc) => {
            const next1 = svc.nextBuses[0];
            const next2 = svc.nextBuses[1];
            const next3 = svc.nextBuses[2];
            // If first bus arrived (0s), cycle forward
            if (next1.etaSeconds <= 0) {
              return {
                ...svc,
                nextBuses: [
                  { ...next2, etaSeconds: Math.max(20, next2.etaSeconds - 15) },
                  { ...next3, etaSeconds: Math.max(120, next3.etaSeconds - 20) },
                  {
                    id: `${svc.serviceNo}-${Date.now()}`,
                    etaSeconds: 900 + Math.floor(Math.random() * 300),
                    occupancy: 'SEA',
                    vehicleType: next1.vehicleType,
                    isWab: true,
                    isLiveGps: true,
                    busPlate: 'SG' + Math.floor(1000 + Math.random() * 8999) + 'X',
                  },
                ],
              };
            }
            return svc;
          }),
        }))
      );
      setIsRefreshing(false);
      setRefreshCountdown(REFRESH_INTERVAL_SECONDS);
    }, 400);
  };

  // Filtered bus services on the active stop
  const filteredServices = useMemo(() => {
    return currentStop.services.filter((svc) => {
      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesService = svc.serviceNo.toLowerCase().includes(query);
        const matchesDest = svc.destinationName.toLowerCase().includes(query);
        if (!matchesService && !matchesDest) return false;
      }

      // Quick Filter chips
      if (activeFilter === 'favorites' && !favorites.includes(svc.serviceNo)) {
        return false;
      }
      if (activeFilter === 'sea_only' && svc.nextBuses[0].occupancy !== 'SEA') {
        return false;
      }
      if (activeFilter === 'dd_only' && svc.nextBuses[0].vehicleType !== 'DD') {
        return false;
      }
      if (activeFilter === 'wab_only' && !svc.nextBuses[0].isWab) {
        return false;
      }

      return true;
    });
  }, [currentStop, searchQuery, activeFilter, favorites]);

  const handleSetAlightAlarm = (stop: RouteStop) => {
    setActiveAlightStop(stop);
    setIsAlightModalOpen(true);
  };

  const handleCancelAlarm = () => {
    setActiveAlightStop(null);
  };

  // Device frame wrapper classes depending on viewMode
  const getContainerClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-[410px] mx-auto border-x border-[#cbd5e1] min-h-[92vh] shadow-2xl bg-[#f8f9ff] my-4 rounded-xl overflow-hidden';
      case 'tablet':
        return 'max-w-[840px] mx-auto border border-[#cbd5e1] min-h-[92vh] shadow-xl bg-[#f8f9ff] my-4 rounded-xl overflow-hidden';
      case 'desktop':
        return 'max-w-[1280px] mx-auto min-h-[92vh]';
      case 'auto':
      default:
        return 'max-w-7xl mx-auto min-h-[92vh]';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      {/* Sticky Civic Header */}
      <HeaderBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={triggerTelemetrySync}
        isRefreshing={isRefreshing}
        refreshCountdown={refreshCountdown}
        onOpenLegend={() => setIsLegendOpen(true)}
        activeAlightAlarmStop={activeAlightStop?.stopCode || null}
        onOpenAlightModal={() => setIsAlightModalOpen(true)}
      />

      {/* Main Container */}
      <main className={`flex-1 p-3 sm:p-4 ${getContainerClasses()}`}>
        {/* If Mobile view mode is active, display mobile-specific stacked view */}
        {viewMode === 'mobile' ? (
          <div className="space-y-3">
            {/* Bus Stop Selector */}
            <div className="bg-white border border-[#cbd5e1] rounded p-3 shadow-xs">
              <BusStopSelector
                stops={stops}
                selectedStop={currentStop}
                onSelectStop={(stop) => {
                  setSelectedStopCode(stop.code);
                  if (stop.services.length > 0) setSelectedService(stop.services[0]);
                }}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                favoritesCount={favorites.length}
                direction={direction}
                onDirectionToggle={() => setDirection((d) => (d === 1 ? 2 : 1))}
              />
            </div>

            {/* Active Stop Arrival Board */}
            <div className="bg-white border border-[#cbd5e1] rounded p-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#475569] bg-[#f1f5f9] px-1.5 py-0.5 rounded border border-[#cbd5e1]">
                      {currentStop.code}
                    </span>
                    <h2 className="text-sm font-bold text-[#0f172a] truncate">
                      {currentStop.name}
                    </h2>
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{currentStop.road}</p>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#0f172a] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#d5e3fc]">
                  {filteredServices.length} Lines
                </span>
              </div>

              {/* Service Cards Feed */}
              <div className="space-y-1">
                {filteredServices.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#64748b]">
                    No bus services match the active filters.
                  </div>
                ) : (
                  filteredServices.map((svc) => (
                    <ArrivalCard
                      key={svc.serviceNo}
                      service={svc}
                      isFavorite={favorites.includes(svc.serviceNo)}
                      onToggleFavorite={toggleFavorite}
                      isSelected={selectedService?.serviceNo === svc.serviceNo}
                      onSelect={(s) => setSelectedService(s)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Mobile Route Schematic Drawer / Card */}
            <div className="bg-white border border-[#cbd5e1] rounded shadow-xs overflow-hidden">
              <SchematicRouteMap
                selectedService={selectedService}
                currentStopCode={currentStop.code}
                onSetAlightAlarm={handleSetAlightAlarm}
                activeAlightAlarmStop={activeAlightStop?.stopCode || null}
              />
            </div>
          </div>
        ) : viewMode === 'tablet' ? (
          /* Tablet Split-View (Fixed 380px left list + Schematic right) */
          <div className="grid grid-cols-12 gap-3 h-[calc(100vh-80px)]">
            {/* Left 380px Transit Master Feed */}
            <div className="col-span-5 flex flex-col gap-3 overflow-hidden">
              <div className="bg-white border border-[#cbd5e1] rounded p-3 shadow-xs shrink-0">
                <BusStopSelector
                  stops={stops}
                  selectedStop={currentStop}
                  onSelectStop={(stop) => {
                    setSelectedStopCode(stop.code);
                    if (stop.services.length > 0) setSelectedService(stop.services[0]);
                  }}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  favoritesCount={favorites.length}
                  direction={direction}
                  onDirectionToggle={() => setDirection((d) => (d === 1 ? 2 : 1))}
                />
              </div>

              {/* Arrival Cards */}
              <div className="bg-white border border-[#cbd5e1] rounded p-3 shadow-xs flex-1 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 mb-2 sticky top-0 bg-white z-10">
                  <div>
                    <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wide">
                      Live Timing Board
                    </h3>
                    <p className="text-[10px] text-[#64748b] font-mono">
                      {currentStop.code} · {currentStop.name}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-[#0f172a] font-bold bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#d5e3fc]">
                    {filteredServices.length} Lines
                  </span>
                </div>

                <div className="space-y-1">
                  {filteredServices.map((svc) => (
                    <ArrivalCard
                      key={svc.serviceNo}
                      service={svc}
                      isFavorite={favorites.includes(svc.serviceNo)}
                      onToggleFavorite={toggleFavorite}
                      isSelected={selectedService?.serviceNo === svc.serviceNo}
                      onSelect={(s) => setSelectedService(s)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Dedicated Schematic Route Diagram */}
            <div className="col-span-7 h-full overflow-hidden">
              <SchematicRouteMap
                selectedService={selectedService}
                currentStopCode={currentStop.code}
                onSetAlightAlarm={handleSetAlightAlarm}
                activeAlightAlarmStop={activeAlightAlarmStopCode()}
              />
            </div>
          </div>
        ) : (
          /* Desktop Concierge / Auto Responsive (3-Column Triage on >1024px) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Column 1: Active Line & Bus Stop Selector (3 cols on lg) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="bg-white border border-[#cbd5e1] rounded p-3 sm:p-3.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#0f172a]" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                      Station Navigator
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] text-[#64748b]">GPS Radar</span>
                </div>

                <BusStopSelector
                  stops={stops}
                  selectedStop={currentStop}
                  onSelectStop={(stop) => {
                    setSelectedStopCode(stop.code);
                    if (stop.services.length > 0) setSelectedService(stop.services[0]);
                  }}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  favoritesCount={favorites.length}
                  direction={direction}
                  onDirectionToggle={() => setDirection((d) => (d === 1 ? 2 : 1))}
                />
              </div>

              {/* Station Connectivity & Overview Card */}
              <div className="bg-white border border-[#cbd5e1] rounded p-3 shadow-xs text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-1.5">
                  <span className="font-bold text-[#0f172a] uppercase tracking-wide text-[11px]">
                    Current Stop Telemetry
                  </span>
                  <span className="font-mono text-[10px] text-[#166534] font-semibold">
                    Geolocated
                  </span>
                </div>

                <div className="space-y-1 text-[#475569] text-[11px]">
                  <div className="flex justify-between">
                    <span>Stop Code:</span>
                    <span className="font-mono font-bold text-[#0f172a]">{currentStop.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Street:</span>
                    <span className="font-medium text-[#0f172a]">{currentStop.road}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coordinates:</span>
                    <span className="font-mono text-[10px]">{currentStop.lat.toFixed(4)}, {currentStop.lng.toFixed(4)}</span>
                  </div>
                  {currentStop.mrtConnections && currentStop.mrtConnections.length > 0 && (
                    <div className="pt-1.5 border-t border-[#e2e8f0] flex items-center justify-between">
                      <span className="font-semibold text-[#0f172a]">MRT Transfer:</span>
                      <div className="flex gap-1">
                        {currentStop.mrtConnections.map((m) => (
                          <span
                            key={m.code}
                            className="font-mono text-[9px] font-bold text-white px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: m.color }}
                          >
                            {m.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Live Station Arrival Board (6 cols on lg) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white border border-[#cbd5e1] rounded p-3 sm:p-3.5 shadow-xs">
                {/* Station Hero Header */}
                <div className="flex items-start justify-between border-b border-[#e2e8f0] pb-2.5 mb-2.5">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#0f172a] bg-[#eff4ff] px-2 py-0.5 rounded border border-[#d5e3fc]">
                        {currentStop.code}
                      </span>
                      <h1 className="text-base sm:text-lg font-bold text-[#0f172a] truncate tracking-tight">
                        {currentStop.name}
                      </h1>
                    </div>
                    <p className="text-xs text-[#64748b] mt-0.5 flex items-center gap-2">
                      <span>{currentStop.road}</span>
                      <span>·</span>
                      <span className="font-mono">{filteredServices.length} Services operating</span>
                    </p>
                  </div>

                  {/* Manual Refresh / Auto Counter */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-[#64748b] bg-[#f8fafc] px-2 py-1 rounded border border-[#e2e8f0]">
                      Sync {refreshCountdown}s
                    </span>
                  </div>
                </div>

                {/* Arrival Board Telemetry Column Headers */}
                <div className="hidden sm:flex items-center justify-between text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider px-2 py-1 bg-[#f8fafc] border border-[#e2e8f0] rounded mb-1.5">
                  <span>Service / Route Target</span>
                  <div className="flex items-center gap-8 pr-4">
                    <span>Next Bus</span>
                    <span>2nd Bus</span>
                    <span>3rd Bus</span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-1.5">
                  {filteredServices.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[#cbd5e1] rounded bg-[#f8fafc] p-6">
                      <Bus className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
                      <p className="text-xs font-semibold text-[#0f172a]">No bus services match filters</p>
                      <p className="text-[11px] text-[#64748b] mt-1">
                        Try resetting filters or searching another service number.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveFilter('all');
                        }}
                        className="mt-3 px-3 py-1 rounded bg-[#1e293b] text-white text-xs font-semibold hover:bg-[#0f172a]"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    filteredServices.map((svc) => (
                      <ArrivalCard
                        key={svc.serviceNo}
                        service={svc}
                        isFavorite={favorites.includes(svc.serviceNo)}
                        onToggleFavorite={toggleFavorite}
                        isSelected={selectedService?.serviceNo === svc.serviceNo}
                        onSelect={(s) => setSelectedService(s)}
                      />
                    ))
                  )}
                </div>

                {/* Civic Legend Reminder */}
                <div className="mt-3 pt-2.5 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#64748b]">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-[#3f6253]"></span> SEA
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-[#b45309]"></span> SDA
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-[#991b1b]"></span> LSD
                    </span>
                  </div>
                  <button
                    onClick={() => setIsLegendOpen(true)}
                    className="font-medium text-[#005ec4] hover:underline"
                  >
                    View Full Telemetry Standards
                  </button>
                </div>
              </div>

              {/* Responsive Route inspection view for smaller screens */}
              <div className="block xl:hidden">
                <SchematicRouteMap
                  selectedService={selectedService}
                  currentStopCode={currentStop.code}
                  onSetAlightAlarm={handleSetAlightAlarm}
                  activeAlightAlarmStop={activeAlightStop?.stopCode || null}
                />
              </div>
            </div>

            {/* Column 3: Schematic Route Progress & Incident Matrix (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-3">
              {/* Schematic Map (Visible on large screens) */}
              <div className="hidden xl:block h-[440px]">
                <SchematicRouteMap
                  selectedService={selectedService}
                  currentStopCode={currentStop.code}
                  onSetAlightAlarm={handleSetAlightAlarm}
                  activeAlightAlarmStop={activeAlightStop?.stopCode || null}
                />
              </div>

              {/* MRT Incident & Commuter Capacity Matrix */}
              <RailIncidentMatrix
                railLines={RAIL_LINES_STATUS}
                advisories={COMMUTER_ADVISORIES}
              />
            </div>
          </div>
        )}
      </main>

      {/* Telemetry Standards Modal */}
      <LegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />

      {/* Alight Alarm Notification Modal */}
      <AlightNotificationModal
        isOpen={isAlightModalOpen}
        onClose={() => setIsAlightModalOpen(false)}
        activeStop={activeAlightStop}
        onCancelAlarm={handleCancelAlarm}
      />
    </div>
  );

  function activeAlightAlarmStopCode() {
    return activeAlightStop?.stopCode || null;
  }
}
