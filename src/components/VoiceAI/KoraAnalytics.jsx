import React, { useState } from 'react';
import { ArrowLeft, Phone, TrendingUp, TrendingDown, Clock, Users, BarChart3, PieChart as PieChartIcon, Calendar, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KoraAnalytics = ({ onBack }) => {
  const [timeRange, setTimeRange] = useState('7days');

  // Demo data for charts
  const callVolumeData = [
    { date: 'Jan 5', calls: 12, completed: 10, missed: 2 },
    { date: 'Jan 6', calls: 15, completed: 13, missed: 2 },
    { date: 'Jan 7', calls: 18, completed: 16, missed: 2 },
    { date: 'Jan 8', calls: 14, completed: 11, missed: 3 },
    { date: 'Jan 9', calls: 20, completed: 18, missed: 2 },
    { date: 'Jan 10', calls: 17, completed: 15, missed: 2 },
    { date: 'Jan 11', calls: 22, completed: 20, missed: 2 }
  ];

  const intentDistribution = [
    { name: 'Booking Inquiry', value: 35, color: '#8b5cf6' },
    { name: 'General Info', value: 25, color: '#3b82f6' },
    { name: 'Booking Confirm', value: 20, color: '#10b981' },
    { name: 'Complaint', value: 12, color: '#ef4444' },
    { name: 'Other', value: 8, color: '#6b7280' }
  ];

  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' },
    { name: 'Neutral', value: 25, color: '#3b82f6' },
    { name: 'Negative', value: 10, color: '#ef4444' }
  ];

  const peakHoursData = [
    { hour: '8am', calls: 3 },
    { hour: '9am', calls: 5 },
    { hour: '10am', calls: 8 },
    { hour: '11am', calls: 12 },
    { hour: '12pm', calls: 15 },
    { hour: '1pm', calls: 10 },
    { hour: '2pm', calls: 8 },
    { hour: '3pm', calls: 12 },
    { hour: '4pm', calls: 14 },
    { hour: '5pm', calls: 16 },
    { hour: '6pm', calls: 18 },
    { hour: '7pm', calls: 14 },
    { hour: '8pm', calls: 10 },
    { hour: '9pm', calls: 6 }
  ];

  const avgDurationData = [
    { date: 'Jan 5', duration: 180 },
    { date: 'Jan 6', duration: 195 },
    { date: 'Jan 7', duration: 210 },
    { date: 'Jan 8', duration: 185 },
    { date: 'Jan 9', duration: 220 },
    { date: 'Jan 10', duration: 205 },
    { date: 'Jan 11', duration: 215 }
  ];

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // KPI Stats
  const stats = {
    totalCalls: 118,
    totalCallsChange: +12.5,
    completedCalls: 103,
    completionRate: 87.3,
    avgDuration: 203,
    avgDurationChange: +8.2,
    missedCalls: 15,
    missedRate: 12.7,
    followUpsCreated: 42,
    followUpRate: 35.6
  };

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] p-6 relative overflow-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">📞 KORA.AI Analytics</h1>
            <p className="text-white/60 mt-1">Voice concierge performance insights</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/30"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Phone className="w-5 h-5 text-blue-300" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+{stats.totalCallsChange}%</span>
            </div>
          </div>
          <p className="text-white/60 text-sm mb-1">Total Calls</p>
          <p className="text-3xl font-bold text-white">{stats.totalCalls}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <BarChart3 className="w-5 h-5 text-green-300" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Good</span>
            </div>
          </div>
          <p className="text-white/60 text-sm mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-white">{stats.completionRate}%</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Clock className="w-5 h-5 text-purple-300" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+{stats.avgDurationChange}%</span>
            </div>
          </div>
          <p className="text-white/60 text-sm mb-1">Avg Duration</p>
          <p className="text-3xl font-bold text-white">{formatDuration(stats.avgDuration)}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Users className="w-5 h-5 text-orange-300" />
            </div>
            <div className="flex items-center gap-1 text-blue-400 text-sm">
              <span>{stats.followUpRate}%</span>
            </div>
          </div>
          <p className="text-white/60 text-sm mb-1">Follow-ups Created</p>
          <p className="text-3xl font-bold text-white">{stats.followUpsCreated}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Call Volume Trend */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Call Volume Trend</h2>
            <Calendar className="w-5 h-5 text-white/40" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={callVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#ffffff60" style={{ fontSize: '12px' }} />
              <YAxis stroke="#ffffff60" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#ffffff80' }} />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="missed" fill="#ef4444" name="Missed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Call Duration */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Avg Call Duration</h2>
            <Clock className="w-5 h-5 text-white/40" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={avgDurationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#ffffff60" style={{ fontSize: '12px' }} />
              <YAxis stroke="#ffffff60" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`${formatDuration(value)}`, 'Duration']}
              />
              <Line type="monotone" dataKey="duration" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Call Intent Distribution */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Call Intents</h2>
            <PieChartIcon className="w-5 h-5 text-white/40" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={intentDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {intentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Sentiment</h2>
            <PieChartIcon className="w-5 h-5 text-white/40" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-sm">Missed Calls</span>
                <span className="text-white font-semibold">{stats.missedCalls}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${stats.missedRate}%` }}
                />
              </div>
              <span className="text-white/40 text-xs">{stats.missedRate}% miss rate</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-sm">Completed Calls</span>
                <span className="text-white font-semibold">{stats.completedCalls}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <span className="text-white/40 text-xs">{stats.completionRate}% completion</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-sm">Follow-up Rate</span>
                <span className="text-white font-semibold">{stats.followUpRate}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${stats.followUpRate}%` }}
                />
              </div>
              <span className="text-white/40 text-xs">{stats.followUpsCreated} follow-ups created</span>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-white/60 text-sm mb-2">AI Performance</p>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Call Hours */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Peak Call Hours</h2>
          <Clock className="w-5 h-5 text-white/40" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHoursData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="hour" stroke="#ffffff60" style={{ fontSize: '12px' }} />
            <YAxis stroke="#ffffff60" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="calls" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-white/60 text-sm text-center mt-4">
          Peak hours: 6pm-7pm (18 calls) • Lowest: 8am-9am (3 calls)
        </p>
      </div>
    </div>
  );
};

export default KoraAnalytics;
