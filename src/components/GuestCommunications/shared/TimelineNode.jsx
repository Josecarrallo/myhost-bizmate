import React from 'react';
import { MessageSquare, Mail, Edit2 } from 'lucide-react';

/**
 * TimelineNode
 * Individual node in the Guest Journey timeline
 */
const TimelineNode = ({
  rule,
  isFirst = false,
  isLast = false,
  onToggle,
  onEdit
}) => {
  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'whatsapp':
        return 'text-green-400 bg-green-500/20';
      case 'email':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStageName = (stage) => {
    const names = {
      booking: 'Booking',
      seven_days_before: '7 Days Before',
      forty_eight_hours_before: '48 Hours Before',
      check_in_day: 'Check-In Day',
      during_stay: 'During Stay',
      check_out: 'Check-Out',
      three_days_after: '3 Days After',
      thirty_days_after: '30 Days After'
    };
    return names[stage] || stage;
  };

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-white/10" />
      )}

      {/* Timeline dot */}
      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
        rule.enabled ? 'bg-[#d85a2a]' : 'bg-white/10'
      } flex-shrink-0`}>
        <div className={`w-3 h-3 rounded-full ${
          rule.enabled ? 'bg-white' : 'bg-white/40'
        }`} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className={`bg-[#252b3b] rounded-xl p-4 border ${
          rule.enabled ? 'border-[#d85a2a]/30' : 'border-white/10'
        }`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-medium">{getStageName(rule.stage)}</h4>
                {/* Channel badges */}
                <div className="flex gap-1">
                  {rule.channels.map((channel, idx) => (
                    <div
                      key={idx}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${getChannelColor(channel)}`}
                    >
                      {getChannelIcon(channel)}
                      <span className="capitalize">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-white/60 text-sm">{rule.description}</p>
              {rule.template_name && (
                <p className="text-white/40 text-xs mt-1">Template: {rule.template_name}</p>
              )}
            </div>

            {/* Toggle switch */}
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={() => onToggle(rule.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d85a2a]"></div>
            </label>
          </div>

          {/* Edit button (optional) */}
          {onEdit && (
            <button
              onClick={() => onEdit(rule.id)}
              className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              Edit template
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineNode;
