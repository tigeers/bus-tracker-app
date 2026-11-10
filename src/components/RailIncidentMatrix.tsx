import React from 'react';
import { RailLineStatus, CommuterAdvisory } from '../types/transit';
import { AlertTriangle, CheckCircle2, ShieldAlert, Train, Activity, CloudRain, Clock, ExternalLink } from 'lucide-react';

interface RailIncidentMatrixProps {
  railLines: RailLineStatus[];
  advisories: CommuterAdvisory[];
  onDismissAdvisory?: (id: string) => void;
}

export const RailIncidentMatrix: React.FC<RailIncidentMatrixProps> = ({
  railLines,
  advisories,
}) => {
  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Rapid Incident & Crowding Status Bar */}
      <div className="rounded border border-[#cbd5e1] bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Train className="w-4 h-4 text-[#0f172a]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
              MRT Rail Network Status
            </h3>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[#166534] bg-[#ecfdf5] border border-[#bbf7d0] px-1.5 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#166534] animate-pulse"></span>
            ALL LINES OPERATIONAL
          </span>
        </div>

        {/* Rail lines grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {railLines.map((line) => {
            const isNormal = line.status === 'Normal';
            return (
              <div
                key={line.code}
                className="flex items-center justify-between p-1.5 rounded border border-[#e2e8f0] bg-[#f8fafc]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-5 h-4 rounded text-[9px] font-mono font-bold text-white flex items-center justify-center shrink-0"
                    style={{ backgroundColor: line.accentColor }}
                  >
                    {line.code}
                  </span>
                  <span className="text-[11px] font-semibold text-[#1e293b] truncate max-w-[80px]">
                    {line.code}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold ${
                      isNormal ? 'text-[#166534]' : 'text-[#b45309]'
                    }`}
                  >
                    {isNormal ? line.headway : 'Delay'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Maintenance notice if any */}
        {railLines.some((l) => l.message) && (
          <div className="mt-2 p-1.5 rounded border border-[#fde68a] bg-[#fffbeb] text-[10px] text-[#854d0e] flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#b45309] shrink-0 mt-0.5" />
            <span>
              {railLines.find((l) => l.message)?.message}
            </span>
          </div>
        )}
      </div>

      {/* Real-time Operator Advisories */}
      <div className="rounded border border-[#cbd5e1] bg-white p-3 shadow-xs flex-1">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#0f172a]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
              Commuter Telemetry Advisories
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#64748b]">LTA Feed</span>
        </div>

        <div className="space-y-2">
          {advisories.map((adv) => {
            const isMedium = adv.urgency === 'medium';
            return (
              <div
                key={adv.id}
                className={`p-2 rounded border text-xs ${
                  isMedium
                    ? 'border-[#fde68a] bg-[#fffbeb]'
                    : 'border-[#e2e8f0] bg-[#f8fafc]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    {adv.type === 'Weather' ? (
                      <CloudRain className="w-3.5 h-3.5 text-[#005ec4]" />
                    ) : adv.type === 'Crowd' ? (
                      <Activity className="w-3.5 h-3.5 text-[#b45309]" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#b45309]" />
                    )}
                    <span className="font-bold text-[#0f172a] text-[11px]">
                      {adv.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#64748b] shrink-0">
                    {adv.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-[#475569] leading-relaxed">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Capacity & Peak Hour Indicator */}
      <div className="rounded border border-[#cbd5e1] bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#64748b]" />
            <span className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
              Network Crowd Index
            </span>
          </div>
          <span className="metric-badge rounded bg-[#ecfdf5] text-[#166534] border border-[#bbf7d0] px-1.5 py-0.5">
            MODERATE FLOW
          </span>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-[#64748b] font-mono">
            <span>CBD Transit Load</span>
            <span className="font-bold text-[#0f172a]">58% Capacity</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#f1f5f9] overflow-hidden border border-[#e2e8f0]">
            <div
              className="h-full bg-linear-to-r from-[#3f6253] via-[#b45309] to-[#991b1b] rounded-full"
              style={{ width: '58%' }}
            />
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#64748b]">
          <span>Peak headways active: 07:00-09:30 & 17:30-20:00</span>
        </div>
      </div>
    </div>
  );
};
