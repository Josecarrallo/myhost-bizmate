import React from 'react';

const StatCard = ({ icon: Icon, label, value, trend, gradient }) => (
  <div className={`p-6 rounded-3xl bg-gradient-to-br ${gradient} text-white`}>
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
        <Icon className="w-6 h-6" strokeWidth={2.5} />
      </div>
      {trend && <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">{trend}</span>}
    </div>
    <p className="text-white/80 text-sm mb-1">{label}</p>
    <p className="text-3xl font-black">{value}</p>
  </div>
);

export default StatCard;
