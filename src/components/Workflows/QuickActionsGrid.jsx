import React from 'react';
import * as Icons from 'lucide-react';
import { workflowColors } from '../../lib/workflowsConfig';

const QuickActionsGrid = ({ actions, onExecute }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action) => {
        const IconComponent = Icons[action.icon] || Icons.Zap;
        const colorClasses = workflowColors[action.color] || workflowColors.blue;

        return (
          <div
            key={action.key}
            className={`bg-[#252b3b] rounded-xl p-5 border ${colorClasses.split(' ')[2]} hover:border-opacity-40 transition-all flex flex-col`}
          >
            <div className={`p-2.5 rounded-lg ${colorClasses.split(' ')[0]} w-fit mb-3`}>
              <IconComponent className={`w-5 h-5 ${colorClasses.split(' ')[1]}`} />
            </div>

            <h3 className="text-white font-semibold text-lg mb-2">{action.name}</h3>
            <p className="text-white/60 text-sm mb-4 flex-grow">{action.description}</p>

            <button
              onClick={() => onExecute && onExecute(action)}
              className={`w-full ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity border ${colorClasses.split(' ')[2]} flex items-center justify-center gap-2`}
            >
              Run <Icons.ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default QuickActionsGrid;
