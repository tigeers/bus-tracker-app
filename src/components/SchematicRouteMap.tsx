import React, { useState } from 'react';
import { BusServiceArrival, RouteStop, VehicleType } from '../types/transit';
import { SERVICE_190_ROUTE_STOPS } from '../data/singaporeTransitData';
import { Bus, MapPin, Bell, CheckCircle, Navigation, Info, ArrowRight, Gauge, DollarSign } from 'lucide-react';

interface SchematicRouteMapProps {
  selectedService: BusServiceArrival | null;
  currentStopCode: string;
  onSetAlightAlarm: (stop: RouteStop) => void;
  activeAlightAlarmStop: string | null;
}

export const SchematicRouteMap: React.FC<SchematicRouteMapProps> = ({
  selectedService,
  currentStopCode,
  onSetAlightAlarm,
  activeAlightAlarmStop,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  // Use the 190 route stops by default or dynamically adapted for the selected service
  const baseStops = SERVICE_190_ROUTE_STOPS;
  const serviceNo = selectedService?.serviceNo || '190';
  const destination = selectedService?.destinationName || 'Kampong Bahru Ter';
  const origin = selectedService?.originName || 'Choa Chu Kang Int';

  const filteredStops = baseStops.filter(
    (s) =>
      s.stopName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.stopCode.includes(filterQuery) ||
      s.roadName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Calculate Singapore distance-based fare estimate
  const currentStopIndex = baseStops.findIndex((s) => s.stopCode === currentStopCode);
  const currentStopObj = baseStops[currentStopIndex !== -1 ? currentStopIndex : 17]; // default Bugis

  const calculateFare = (targetStop: RouteStop): string => {
    const dist = Math.abs(targetStop.distanceKm - (currentStopObj?.distanceKm || 0));
    if (dist <= 3.2) return '$1.09';
    if (dist <= 6.2) return '$1.33';
    if (dist <= 10.2) return '$1.59';
    if (dist <= 15.2) return '$1.86';
    if (dist <= 20.2) return '$2.08';
    return '$2.24';
  };

  return (
    <div className="flex flex-col h-full bg-white border border-[#cbd5e1] rounded">
      {/* Route Header */}
      <div className="p-3 sm:p-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold text-[#0f172a] tracking-tight">
                Service {serviceNo}
              </span>
              <span className="metric-badge rounded bg-[#1e293b] text-white px-1.5 py-0.5">
                {selectedService?.category || 'TRUNK'}
              </span>
              <span className="metric-badge rounded bg-[#f1f5f9] text-[#334155] border border-[#cbd5e1] px-1.5 py-0.5">
                {selectedService?.operator || 'SMRT'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#475569] mt-1 font-medium">
              <span>{origin}</span>
              <ArrowRight className="w-3 h-3 text-[#94a3b8]" />
              <span className="text-[#0f172a] font-bold">{destination}</span>
            </div>
          </div>

          {/* Quick Schedule Telemetry */}
          <div className="text-right text-[11px] font-mono">
            <span className="text-[#64748b] block">Headway</span>
            <span className="font-bold text-[#0f172a]">
              {selectedService?.frequencyRange || '4-7 mins'}
            </span>
          </div>
        </div>

        {/* Live Active Buses summary */}
        <div className="mt-3 flex items-center justify-between text-xs bg-white p-2 rounded border border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3f6253] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3f6253]"></span>
            </span>
            <span className="font-semibold text-[#1e293b] text-[11px]">
              2 Active Fleet Units in Transit
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#475569]">
            <span className="bg-[#f1f5f9] px-1.5 py-0.5 rounded border border-[#cbd5e1]">
              SG5940X (34 km/h)
            </span>
            <span className="bg-[#f1f5f9] px-1.5 py-0.5 rounded border border-[#cbd5e1]">
              SMB5011L (28 km/h)
            </span>
          </div>
        </div>

        {/* Filter stops along route */}
        <div className="mt-2.5">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter stops along Service 190 route..."
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#cbd5e1] rounded text-[#0b1c30] placeholder:text-[#94a3b8] font-mono focus:outline-none focus:border-[#0f172a]"
          />
        </div>
      </div>

      {/* Schematic Diagram stops list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider mb-2 flex justify-between px-1">
          <span>Schematic Stop Sequence ({baseStops.length} stops)</span>
          <span>Fare Stages & GPS Telemetry</span>
        </div>

        <div className="relative border-l-2 border-[#cbd5e1] ml-4 sm:ml-5 pl-4 sm:pl-5 space-y-3 py-1">
          {filteredStops.map((stop) => {
            const isUserCurrentStop = stop.stopCode === currentStopCode;
            const hasBusHere = stop.currentBuses && stop.currentBuses.length > 0;
            const isAlightActive = activeAlightAlarmStop === stop.stopCode;
            const fareEst = calculateFare(stop);

            return (
              <div
                key={stop.stopCode}
                className={`relative group p-2 rounded border transition-colors ${
                  isUserCurrentStop
                    ? 'border-[#0f172a] bg-[#eff4ff] ring-1 ring-[#0f172a]'
                    : isAlightActive
                    ? 'border-[#fde68a] bg-[#fffbeb]'
                    : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#fafbff]'
                }`}
              >
                {/* Schematic node dot on the rail line */}
                <div
                  className={`absolute -left-[25px] sm:-left-[29px] top-3.5 w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                    isUserCurrentStop
                      ? 'bg-[#0f172a] border-white ring-2 ring-[#0f172a] scale-125'
                      : hasBusHere
                      ? 'bg-[#3f6253] border-white ring-2 ring-[#3f6253] animate-pulse'
                      : 'bg-white border-[#64748b]'
                  }`}
                />

                {/* If bus is approaching or at this stop, show bus icon pin */}
                {hasBusHere && (
                  <div className="mb-2 p-1.5 rounded border border-[#bbf7d0] bg-[#ecfdf5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Bus className="w-4 h-4 text-[#166534]" />
                      <span className="font-mono font-bold text-[#166534] text-[11px]">
                        {stop.currentBuses![0].plate}
                      </span>
                      <span className="metric-badge bg-white px-1 py-0.2 rounded border border-[#bbf7d0] text-[#166534]">
                        {stop.currentBuses![0].deck} · {stop.currentBuses![0].occupancy}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#3f6253] font-semibold">
                      {stop.currentBuses![0].speedKmh} km/h
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[11px] font-bold text-[#475569] bg-[#f1f5f9] px-1 rounded border border-[#e2e8f0]">
                        #{stop.seq}
                      </span>
                      <span className="font-mono text-[11px] text-[#0f172a] font-semibold">
                        {stop.stopCode}
                      </span>
                      <h4 className="font-bold text-xs text-[#0f172a] truncate">
                        {stop.stopName}
                      </h4>
                      {isUserCurrentStop && (
                        <span className="metric-badge rounded bg-[#0f172a] text-white px-1 py-0.2 text-[9px]">
                          YOU ARE HERE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#64748b] mt-0.5">
                      <span>{stop.roadName}</span>
                      <span>·</span>
                      <span className="font-mono">{stop.distanceKm.toFixed(1)} km</span>
                      <span>·</span>
                      <span className="font-mono">Stage {stop.fareStage}</span>
                    </div>

                    {stop.mrtTransfer && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[10px] text-[#64748b] font-medium">MRT:</span>
                        <span className="metric-badge rounded bg-[#091426] text-white px-1 py-0.2 text-[9px]">
                          {stop.mrtTransfer}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Fare from current stop & Alight reminder button */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-mono text-[11px] text-[#1e293b] font-bold">
                      {fareEst}
                    </span>

                    <button
                      type="button"
                      onClick={() => onSetAlightAlarm(stop)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold transition-colors ${
                        isAlightActive
                          ? 'border-[#b45309] bg-[#b45309] text-white'
                          : 'border-[#cbd5e1] bg-white text-[#475569] hover:bg-[#f1f5f9]'
                      }`}
                      title={isAlightActive ? 'Alight alert active' : 'Set alarm for this stop'}
                    >
                      <Bell className={`w-3 h-3 ${isAlightActive ? 'fill-white' : ''}`} />
                      <span>{isAlightActive ? 'Alarm Set' : 'Alight'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schematic Footer: Distance Based Fare Guide */}
      <div className="p-2.5 border-t border-[#e2e8f0] bg-[#f8fafc] text-[11px] text-[#475569] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-[#005ec4]" />
          <span>Fare Matrix: Distance-based card fare calculated via LTA Fare Review standard</span>
        </div>
        <span className="font-mono text-[10px] text-[#64748b]">Max: $2.37</span>
      </div>
    </div>
  );
};
