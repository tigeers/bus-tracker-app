import React, { useEffect, useState } from 'react';
import { RefreshCw, Radio, HelpCircle, Smartphone, Tablet, Monitor, Bell, Layers } from 'lucide-react';

interface HeaderBarProps {
  viewMode: 'auto' | 'mobile' | 'tablet' | 'desktop';
  onViewModeChange: (mode: 'auto' | 'mobile' | 'tablet' | 'desktop') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  refreshCountdown: number;
  onOpenLegend: () => void;
  activeAlightAlarmStop: string | null;
  onOpenAlightModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing,
  refreshCountdown,
  onOpenLegend,
  activeAlightAlarmStop,
  onOpenAlightModal,
}) => {
  const [sgtTime, setSgtTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format to Singapore Time (UTC+8)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Singapore',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setSgtTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#cbd5e1] bg-white px-3 sm:px-4 py-2.5 shadow-[0_2px_4px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* Left: Branding & Civic Identifier */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#091426] text-white font-mono font-bold text-xs tracking-wider shadow-xs">
              SG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-[#0f172a] text-sm sm:text-base leading-none">
                  TRANSIT NEXT
                </span>
                <span className="metric-badge rounded bg-[#eff4ff] px-1 py-0.5 text-[#005ec4] border border-[#d5e3fc]">
                  CIVIC v2.4
                </span>
              </div>
              <p className="text-[10px] text-[#64748b] font-mono leading-tight hidden xs:block">
                LTA DATASTREAM · TABULAR TELEMETRY
              </p>
            </div>
          </div>

          {/* SGT Real-time Clock */}
          <div className="hidden md:flex items-center gap-1.5 border-l border-[#e2e8f0] pl-3">
            <span className="text-[11px] font-mono font-medium text-[#475569]">SGT</span>
            <span className="text-xs font-mono font-bold text-[#0f172a] bg-[#f8fafc] px-2 py-0.5 rounded border border-[#e2e8f0]">
              {sgtTime || '00:00:00'}
            </span>
          </div>
        </div>

        {/* Center: Live GPS Status Pulse */}
        <div className="hidden lg:flex items-center gap-2 rounded border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3f6253] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3f6253]"></span>
          </span>
          <span className="text-[11px] font-semibold text-[#1e293b] tracking-tight">
            LIVE GPS FEED SYNCED
          </span>
          <span className="text-[10px] font-mono text-[#64748b] bg-white px-1.5 py-0.2 rounded border border-[#cbd5e1]">
            {refreshCountdown}s
          </span>
        </div>

        {/* Right: Alight alert indicator, View Mode Switcher, Refresh button, Help */}
        <div className="flex items-center gap-2">
          {activeAlightAlarmStop && (
            <button
              onClick={onOpenAlightModal}
              className="flex items-center gap-1.5 rounded border border-[#fde68a] bg-[#fffbeb] px-2.5 py-1 text-xs font-semibold text-[#854d0e] hover:bg-[#fef3c7] transition-colors animate-pulse"
              title="Active Alight Alert"
            >
              <Bell className="w-3.5 h-3.5 text-[#b45309]" />
              <span className="hidden sm:inline">Alight Alert</span>
              <span className="font-mono text-[11px] font-bold">Stop #{activeAlightAlarmStop}</span>
            </button>
          )}

          {/* Responsive Layout Switcher */}
          <div className="hidden sm:flex items-center rounded border border-[#cbd5e1] bg-[#f1f5f9] p-0.5 text-xs">
            <button
              onClick={() => onViewModeChange('auto')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                viewMode === 'auto'
                  ? 'bg-white text-[#0f172a] font-bold shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
              title="Responsive View"
            >
              Auto
            </button>
            <button
              onClick={() => onViewModeChange('mobile')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'mobile'
                  ? 'bg-white text-[#0f172a] font-bold shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
              title="Mobile Handheld (390px)"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden md:inline">Mobile</span>
            </button>
            <button
              onClick={() => onViewModeChange('tablet')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'tablet'
                  ? 'bg-white text-[#0f172a] font-bold shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
              title="Tablet Split View (768px)"
            >
              <Tablet className="w-3 h-3" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => onViewModeChange('desktop')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'desktop'
                  ? 'bg-white text-[#0f172a] font-bold shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
              title="Desktop Concierge (1200px)"
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden md:inline">Desktop</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded border border-[#cbd5e1] bg-white text-xs font-semibold text-[#1e293b] hover:bg-[#f1f5f9] active:bg-[#e2e8f0] transition-colors disabled:opacity-50"
            title="Force refresh live telemetry"
            aria-label="Refresh transit arrivals"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#005ec4]' : ''}`} />
            <span className="font-mono text-[11px] hidden xs:inline">{refreshCountdown}s</span>
          </button>

          {/* Telemetry Standards Help Button */}
          <button
            onClick={onOpenLegend}
            className="h-8 w-8 rounded border border-[#cbd5e1] bg-white flex items-center justify-center text-[#475569] hover:bg-[#f1f5f9] transition-colors"
            title="Telemetry legend & standards"
            aria-label="Open telemetry legend"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
