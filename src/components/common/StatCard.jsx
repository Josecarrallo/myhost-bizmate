import React from 'react';

const StatCard = ({ icon: Icon, label, value, trend, gradient }) => (
  <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-between`}>
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
      <div>
        <p className="text-xs text-white/80">{label}</p>
        <p className="text-lg sm:text-xl font-black">{value}</p>
      </div>
    </div>
    {trend && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{trend}</span>}
  </div>
);

export default StatCard;
