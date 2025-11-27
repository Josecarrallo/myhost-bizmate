import React from 'react';
import { Play, Pause, Settings } from 'lucide-react';

const WorkflowCard = ({ name, trigger, actions, status, lastRun, runsToday, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-indigo-200 transition-all hover:shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
          <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg mb-1">{name}</h4>
          <p className="text-sm text-gray-600">{trigger}</p>
        </div>
      </div>
      <button className={`p-3 rounded-xl transition-colors ${status === 'active' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
        {status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </div>

    <div className="space-y-2 mb-4">
      {actions.map((action, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
            {idx + 1}
          </div>
          <span className="text-sm text-gray-700">{action}</span>
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Last Run</p>
          <p className="text-sm font-bold text-gray-900">{lastRun}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Runs Today</p>
          <p className="text-sm font-bold text-indigo-600">{runsToday}</p>
        </div>
      </div>
      <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default WorkflowCard;
