import React, { useRef, useEffect } from 'react';

/**
 * Tab Navigation component with horizontal scroll support for mobile
 *
 * @param {Array} tabs - Array of { id: string, label: string, count?: number }
 * @param {string} activeTab - Current active tab id
 * @param {function} onChange - Callback when tab changes
 * @param {string} className - Additional classes
 */
const TabNavigation = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
}) => {
  const tabsRef = useRef(null);
  const activeTabRef = useRef(null);

  // Scroll active tab into view on mount and when active changes
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const container = tabsRef.current;
      const activeElement = activeTabRef.current;

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      // Check if active tab is out of view
      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activeTab]);

  return (
    <div className={`relative ${className}`}>
      {/* Tabs container with horizontal scroll */}
      <div
        ref={tabsRef}
        className="
          flex gap-1 overflow-x-auto scrollbar-hide
          -webkit-overflow-scrolling-touch
          pb-0.5
        "
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => onChange(tab.id)}
              className={`
                relative flex-shrink-0 px-4 py-2.5
                text-sm font-semibold whitespace-nowrap
                transition-colors duration-200
                min-h-[44px]
                ${isActive
                  ? 'text-white'
                  : 'text-[#8a93a1] hover:text-[#aab2bf]'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`
                      px-1.5 py-0.5 rounded-full text-[10px] font-bold
                      ${isActive
                        ? 'bg-[#f5791f]/20 text-[#f5791f]'
                        : 'bg-[#3a434f] text-[#8a93a1]'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </span>

              {/* Active indicator - orange underline */}
              {isActive && (
                <span
                  className="
                    absolute bottom-0 left-0 right-0 h-0.5
                    bg-[#f5791f] rounded-full
                  "
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </div>
  );
};

export default TabNavigation;
