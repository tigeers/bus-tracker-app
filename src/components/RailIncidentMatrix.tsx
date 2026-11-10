import React from 'react';
import { RailLineStatus, CommuterAdvisory } from '../types/transit';
import { Train, ShieldAlert, AlertTriangle, CloudRain, Activity } from 'lucide-react';

interface RailIncidentMatrixProps {
  railLines: RailLineStatus[];
  advisories: CommuterAdvisory[];
}

export const RailIncidentMatrix: React.FC<RailIncidentMatrixProps> = ({
  railLines,
  advisories,
}) => {
  return (
    <div className="flex flex-col h-full space-y-3">
      {/* MRT Lines Status Board */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-zinc-900" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              MRT Rail Network
            </h3>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Normal Service
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {railLines.map((line) => {
            const isNormal = line.status === 'Normal';
            return (
              <div
                key={line.code}
                className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 bg-zinc-50/60"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-4 rounded text-[10px] font-mono font-bold text-white flex items-center justify-center shrink-0"
                    style={{ backgroundColor: line.accentColor }}
                  >
                    {line.code}
                  </span>
                  <span className="text-xs font-medium text-zinc-800 truncate">
                    {line.code}
                  </span>
                </div>

                <span
                  className={`text-xs font-mono font-semibold ${
                    isNormal ? 'text-zinc-600' : 'text-amber-700'
                  }`}
                >
                  {line.headway}
                </span>
              </div>
            );
          })}
        </div>

        {railLines.some((l) => l.message) && (
          <div className="mt-3 p-2.5 rounded-lg border border-amber-200 bg-amber-50/70 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span>{railLines.find((l) => l.message)?.message}</span>
          </div>
        )}
      </div>

      {/* Transit Bulletins & Advisories */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs flex-1">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-zinc-900" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Live Commuter Advisories
            </h3>
          </div>
          <span className="text-xs text-zinc-400">LTA Feed</span>
        </div>

        <div className="space-y-2.5">
          {advisories.map((adv) => (
            <div
              key={adv.id}
              className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/50 text-xs space-y-1"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900">
                  {adv.type === 'Weather' ? (
                    <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <Activity className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{adv.title}</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">{adv.timestamp}</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-[11px]">
                {adv.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
