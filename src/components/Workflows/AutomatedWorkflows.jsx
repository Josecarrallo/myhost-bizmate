import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { workflowColors } from '../../lib/workflowsConfig';

const AutomatedWorkflows = ({ workflows, workflowSettings, onToggle }) => {
  const [toggling, setToggling] = useState(null);

  const handleToggle = async (workflowKey, currentState) => {
    setToggling(workflowKey);
    if (onToggle) {
      await onToggle(workflowKey, !currentState);
    }
    setToggling(null);
  };

  const getWorkflowState = (workflowKey) => {
    const setting = workflowSettings?.find(s => s.workflow_key === workflowKey);
    return setting?.is_active ?? false;
  };

  return (
    <div className="space-y-3">
      {workflows.map((workflow) => {
        const IconComponent = Icons[workflow.icon] || Icons.Zap;
        const colorClasses = workflowColors[workflow.color] || workflowColors.blue;
        const isActive = getWorkflowState(workflow.key);
        const isToggling = toggling === workflow.key;

        return (
          <div
            key={workflow.key}
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
                    <h3 className="text-white font-semibold">{workflow.name}</h3>
                    {workflow.comingSoon && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">{workflow.description}</p>
                </div>
              </div>

              {/* Right: Toggle Switch */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {isActive && !workflow.comingSoon && (
                  <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </span>
                )}

                {!workflow.comingSoon && (
                  <button
                    onClick={() => handleToggle(workflow.key, isActive)}
                    disabled={isToggling}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1f2e] ${
                      isActive
                        ? 'bg-green-500 focus:ring-green-500'
                        : 'bg-gray-600 focus:ring-gray-500'
                    } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AutomatedWorkflows;
