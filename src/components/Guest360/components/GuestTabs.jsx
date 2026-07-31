import React from 'react';
import {
  Calendar,
  CreditCard,
  Wrench,
} from 'lucide-react';
import { GUEST_TABS } from '../constants';

/**
 * GuestTabs - Tab navigation for Guest360 sections
 *
 * @param {string} activeTab - Current active tab ID
 * @param {function} onTabChange - Callback when tab changes
 * @param {object} counts - Optional counts for each tab { bookings: 3, payments: 5, ... }
 */
const GuestTabs = ({ activeTab, onTabChange, counts = {} }) => {
  // Icon map for each tab
  const iconMap = {
    bookings: Calendar,
    payments: CreditCard,
    services: Wrench,
  };

  return (
    <div className="bg-[#333b47] rounded-xl border border-white/10 p-2">
      {/* Desktop: Horizontal tabs */}
      <div className="hidden md:flex items-center gap-1">
        {GUEST_TABS.map((tab) => {
          const Icon = iconMap[tab.id] || Calendar;
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                transition-all duration-200 text-sm font-medium
                ${isActive
                  ? 'bg-[#f5791f] text-white'
                  : 'text-[#8a93a1] hover:text-white hover:bg-[#3a434f]'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={`
                    text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#3a434f] text-[#aab2bf]'
                    }
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: Scrollable horizontal tabs */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 min-w-max">
          {GUEST_TABS.map((tab) => {
            const Icon = iconMap[tab.id] || Calendar;
            const isActive = activeTab === tab.id;
            const count = counts[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg
                  transition-all duration-200 text-xs font-medium whitespace-nowrap
                  ${isActive
                    ? 'bg-[#f5791f] text-white'
                    : 'text-[#8a93a1] hover:text-white hover:bg-[#3a434f]'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {count !== undefined && count > 0 && (
                  <span
                    className={`
                      text-[10px] px-1 py-0.5 rounded-full min-w-[16px] text-center
                      ${isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#3a434f] text-[#aab2bf]'
                      }
                    `}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GuestTabs;
