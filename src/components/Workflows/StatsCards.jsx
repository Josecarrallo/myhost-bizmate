import React from 'react';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const { activeWorkflows = 0, totalExecutions = 0, timeSaved = "0h", successRate = 0 } = stats || {};

  const cards = [
    {
      title: "Active Workflows",
      value: activeWorkflows,
      icon: Zap,
      color: "green",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      borderColor: "border-green-500/20"
    },
    {
      title: "Total Executions",
      value: totalExecutions,
      icon: Activity,
      color: "blue",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Time Saved",
      value: timeSaved,
      icon: Clock,
      color: "orange",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
      borderColor: "border-orange-500/20"
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "emerald",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500",
      borderColor: "border-emerald-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-[#252b3b] rounded-xl p-5 border ${card.borderColor} hover:border-${card.color}-500/40 transition-all`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.textColor}`} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-white/60 text-sm mb-1">{card.title}</p>
            <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
