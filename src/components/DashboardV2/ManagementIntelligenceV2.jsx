import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * Management Intelligence V2 - Business Analytics Dashboard
 * Part of the V2 Design System
 */
const ManagementIntelligenceV2 = ({ onNavigate }) => {
  // Mock data
  const kpis = [
    { label: 'Total Revenue', value: '$45,230', change: '+12.5%', up: true, icon: DollarSign },
    { label: 'Occupancy Rate', value: '78%', change: '+5.2%', up: true, icon: Calendar },
    { label: 'Avg. Daily Rate', value: '$185', change: '+8.1%', up: true, icon: TrendingUp },
    { label: 'Total Guests', value: '156', change: '-2.3%', up: false, icon: Users },
  ];

  return (
    <div className="flex-1 bg-[#F7F5F0] overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-[#E7E3DA] px-8 py-6">
        <h1 className="text-2xl font-bold text-[#172033]">Management Intelligence</h1>
        <p className="text-[#667085] mt-1">Business analytics and performance insights</p>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#E7E3DA] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#F7F5F0] rounded-xl">
                    <Icon className="w-5 h-5 text-[#B98A3D]" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    kpi.up ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {kpi.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#172033]">{kpi.value}</p>
                <p className="text-sm text-[#667085] mt-1">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E7E3DA] p-6">
            <h3 className="text-lg font-semibold text-[#172033] mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-center justify-center bg-[#F7F5F0] rounded-xl">
              <div className="text-center text-[#667085]">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chart coming in Phase 2</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E7E3DA] p-6">
            <h3 className="text-lg font-semibold text-[#172033] mb-4">Occupancy by Property</h3>
            <div className="h-64 flex items-center justify-center bg-[#F7F5F0] rounded-xl">
              <div className="text-center text-[#667085]">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chart coming in Phase 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => onNavigate('ai-home')}
          className="px-4 py-2 bg-gradient-to-r from-[#B98A3D] to-[#D7B46A] text-white rounded-xl font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ManagementIntelligenceV2;
