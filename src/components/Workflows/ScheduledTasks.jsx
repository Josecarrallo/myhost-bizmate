import React from 'react';
import * as Icons from 'lucide-react';
import { workflowColors } from '../../lib/workflowsConfig';

const ScheduledTasks = ({ tasks }) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const IconComponent = Icons[task.icon] || Icons.Calendar;
        const colorClasses = workflowColors[task.color] || workflowColors.indigo;

        return (
          <div
            key={task.key}
            className="bg-[#252b3b] rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Icon + Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-2.5 rounded-lg ${colorClasses.split(' ')[0]} flex-shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${colorClasses.split(' ')[1]}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{task.name}</h3>
                    {task.comingSoon && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-2">{task.description}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Icons.Clock className="w-4 h-4 text-white/40" />
                      <span className="text-white/60">{task.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icons.Calendar className="w-4 h-4 text-white/40" />
                      <span className="text-white/60">Next: {task.nextRun}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScheduledTasks;
