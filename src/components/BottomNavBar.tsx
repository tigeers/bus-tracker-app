import React from 'react';
import { Bus, MapPin, Navigation, Train } from 'lucide-react';

export type ActiveTab = 'board' | 'stops' | 'route' | 'mrt';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  serviceCount?: number;
  hasIncidentAlert?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  serviceCount,
  hasIncidentAlert,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-4 items-center h-13 max-w-md mx-auto">
        {/* Tab 1: Live Board */}
        <button
          onClick={() => onTabChange('board')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'board' ? 'text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
          aria-label="Live Arrivals Board"
        >
          <div className="relative">
            <Bus className="w-5 h-5" />
            {serviceCount && serviceCount > 0 ? (
              <span className="absolute -top-1 -right-2 text-[9px] font-mono font-bold bg-zinc-900 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {serviceCount}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Arrivals</span>
        </button>

        {/* Tab 2: Nearby Stations */}
        <button
          onClick={() => onTabChange('stops')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'stops' ? 'text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
          aria-label="Nearby Transit Stations"
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Stations</span>
        </button>

        {/* Tab 3: Route Sequence */}
        <button
          onClick={() => onTabChange('route')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'route' ? 'text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
          aria-label="Route Diagram"
        >
          <Navigation className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Route</span>
        </button>

        {/* Tab 4: MRT Network & Incident Alerts */}
        <button
          onClick={() => onTabChange('mrt')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeTab === 'mrt' ? 'text-zinc-950 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
          aria-label="MRT Network and Alerts"
        >
          <div className="relative">
            <Train className="w-5 h-5" />
            {hasIncidentAlert && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">MRT / Alerts</span>
        </button>
      </div>
    </nav>
  );
};
