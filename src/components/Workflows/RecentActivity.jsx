import React from 'react';
import * as Icons from 'lucide-react';

const RecentActivity = ({ activity, onViewAll }) => {
  return (
    <div className="bg-[#252b3b] rounded-xl border border-white/10">
      <div className="divide-y divide-white/5">
        {activity && activity.length > 0 ? (
          activity.map((item, index) => {
            const IconComponent = Icons[item.icon] || Icons.Zap;
            const isSuccess = item.status === 'success';
            const isError = item.status === 'error';

            return (
              <div
                key={item.id || index}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    isSuccess
                      ? 'bg-green-500/10'
                      : isError
                      ? 'bg-red-500/10'
                      : 'bg-blue-500/10'
                  }`}>
                    {isSuccess ? (
                      <Icons.CheckCircle className="w-4 h-4 text-green-400" />
                    ) : isError ? (
                      <Icons.XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Icons.Clock className="w-4 h-4 text-blue-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white font-medium text-sm">{item.workflow}</p>
                      <span className="text-white/40 text-xs flex-shrink-0">{item.time}</span>
                    </div>
                    <p className="text-white/60 text-xs">{item.details}</p>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                    isSuccess
                      ? 'bg-green-500/20 text-green-300'
                      : isError
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <Icons.Activity className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No recent activity</p>
          </div>
        )}
      </div>

      {/* View All Button */}
      {activity && activity.length > 0 && (
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onViewAll}
            className="w-full text-center text-[#d85a2a] hover:text-[#c14d1f] text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            View All Activity
            <Icons.ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
