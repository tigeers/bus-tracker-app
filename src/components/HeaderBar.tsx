import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, HelpCircle, Server, Bell, ArrowRightLeft } from 'lucide-react';
import { ActiveTab } from './BottomNavBar';

interface HeaderBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  refreshCountdown: number;
  onOpenLegend: () => void;
  onOpenDatamallApi: () => void;
  activeAlightAlarmStop: string | null;
  onOpenAlightModal: () => void;
  currentStopName: string;
  currentStopCode: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onRefresh,
  isRefreshing,
  refreshCountdown,
  onOpenLegend,
  onOpenDatamallApi,
  activeAlightAlarmStop,
  onOpenAlightModal,
  currentStopName,
  currentStopCode,
}) => {
  const [sgtTime, setSgtTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
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
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md px-4 py-2.5 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Zone 1: Clean Minimalist Wordmark & Quick Stop Anchor */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-zinc-900 whitespace-nowrap">
              SG Transit
            </span>
          </div>

          {/* Quick Active Station Indicator (clickable to trigger search/switch) */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200/60 text-xs text-zinc-700 transition-colors"
            title="Click to search or switch bus stop"
          >
            <span className="font-mono text-[10px] text-zinc-500 font-semibold">{currentStopCode}</span>
            <span className="font-medium truncate max-w-[140px] md:max-w-[180px]">{currentStopName.split('/')[0].trim()}</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => onTabChange('board')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'board'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            Live Board
          </button>

          <button
            onClick={() => onTabChange('stops')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'stops'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            Nearby Stops
          </button>

          <button
            onClick={() => onTabChange('route')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'route'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            Route Progression
          </button>

          <button
            onClick={() => onTabChange('mrt')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'mrt'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            MRT & Alerts
          </button>
        </nav>

        {/* Zone 3: Actions (Search trigger, Alight Alarm, Refresh, API & Guide) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 h-8 px-2.5 rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            title="Search bus stops or routes (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-xs">Search...</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono text-zinc-400 bg-white rounded border border-zinc-200">
              ⌘K
            </kbd>
          </button>

          {/* Active Alight Alert Badge */}
          {activeAlightAlarmStop && (
            <button
              onClick={onOpenAlightModal}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-amber-300 bg-amber-50 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span className="hidden sm:inline">Stop #{activeAlightAlarmStop}</span>
            </button>
          )}

          {/* Minimalist Live Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors disabled:opacity-50"
            title="Refresh bus telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="font-mono text-[11px] text-zinc-600">{refreshCountdown}s</span>
          </button>

          {/* LTA API Settings */}
          <button
            onClick={onOpenDatamallApi}
            className="flex items-center gap-1 h-8 px-2 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-600 transition-colors"
            title="LTA Datamall Connection Settings"
            aria-label="LTA Datamall API"
          >
            <Server className="w-3.5 h-3.5 text-zinc-600" />
            <span className="hidden xl:inline text-[11px]">API</span>
          </button>

          {/* Usability & Legend Help */}
          <button
            onClick={onOpenLegend}
            className="w-8 h-8 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors"
            title="Transit Telemetry Guide"
            aria-label="Help and telemetry guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
