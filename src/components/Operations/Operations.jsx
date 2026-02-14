import React, { useState } from 'react';
import {
  ChevronLeft,
  Home,
  User,
  Clock,
  Sparkles,
  Wrench,
  Users,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Calendar,
  Plus,
  Search,
  Filter,
  X,
  Phone,
  Mail,
  Shield,
  TrendingUp
} from 'lucide-react';
import { StatCard } from '../common';

const Operations = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('hub'); // 'hub', 'housekeeping', 'maintenance', 'staff'

  // ==================== OPERATIONS HUB ====================
  if (currentView === 'hub') {
    const stats = [
      { icon: ClipboardList, label: 'Active Tasks', value: '7', gradient: 'from-orange-500 to-orange-600' },
      { icon: Users, label: 'Team Members', value: '6', gradient: 'from-orange-500 to-orange-600' },
      { icon: AlertCircle, label: 'Pending Issues', value: '3', gradient: 'from-orange-500 to-orange-600' },
      { icon: CheckCircle, label: 'Completed Today', value: '9', gradient: 'from-orange-500 to-orange-600' }
    ];

    const modules = [
      {
        id: 'housekeeping',
        title: 'Housekeeping',
        description: 'Room cleaning schedules, assignments & tracking',
        icon: Sparkles,
        gradient: 'from-blue-500 to-cyan-600',
        stats: { pending: 3, inProgress: 2, completed: 5 }
      },
      {
        id: 'maintenance',
        title: 'Maintenance',
        description: 'Repairs, work orders & preventive maintenance',
        icon: Wrench,
        gradient: 'from-orange-500 to-red-600',
        stats: { pending: 2, inProgress: 1, completed: 3 }
      },
      {
        id: 'staff',
        title: 'Staff & Roles',
        description: 'Team management, schedules & permissions',
        icon: Users,
        gradient: 'from-purple-500 to-pink-600',
        stats: { active: 6, onDuty: 4, offDuty: 2 }
      }
    ];

    // All Recent Activities (consolidated from all modules)
    const recentActivities = [
      { id: 1, type: 'Housekeeping', category: 'Cleaning', title: 'Turnover Cleaning - Nismara 2BR Villa', status: 'Pending', priority: 'High', assignedTo: 'Wayan', time: '2 hours' },
      { id: 2, type: 'Maintenance', category: 'HVAC', title: 'AC unit maintenance - Graha Uma 1BR Villa', status: 'In Progress', priority: 'High', assignedTo: 'Made', time: '11:00 AM' },
      { id: 3, type: 'Housekeeping', category: 'Cleaning', title: 'Pre-arrival Setup - Nismara 2BR Villa', status: 'In Progress', priority: 'High', assignedTo: 'Kadek', time: '1.5 hours' },
      { id: 4, type: 'Maintenance', category: 'Pool', title: 'Pool cleaning - Nismara 2BR Villa', status: 'Pending', priority: 'Medium', assignedTo: 'Ketut', time: '3:00 PM' },
      { id: 5, type: 'Housekeeping', category: 'Inspection', title: 'Quality check - Graha Uma 1BR Villa', status: 'Completed', priority: 'Medium', assignedTo: 'Komang', time: 'Done' },
      { id: 6, type: 'Staff', category: 'Management', title: 'Wayan - 3 tasks today (2 completed)', status: 'On Duty', priority: 'Medium', assignedTo: 'Housekeeping', time: '8 AM - 4 PM' },
      { id: 7, type: 'Maintenance', category: 'Garden', title: 'Garden maintenance - Nismara 1BR Monthly', status: 'Pending', priority: 'Low', assignedTo: 'Nyoman', time: 'Tomorrow' }
    ];

    const getStatusColor = (status) => {
      if (status === 'Completed' || status === 'On Duty') return 'bg-green-500';
      if (status === 'In Progress') return 'bg-blue-500';
      return 'bg-yellow-500';
    };

    const getPriorityColor = (priority) => {
      if (priority === 'High') return 'text-red-600 bg-red-50';
      if (priority === 'Medium') return 'text-yellow-600 bg-yellow-50';
      return 'text-green-600 bg-green-50';
    };

    const getTypeColor = (type) => {
      if (type === 'Housekeeping') return 'bg-blue-100 text-blue-700';
      if (type === 'Maintenance') return 'bg-orange-100 text-orange-700';
      return 'bg-purple-100 text-purple-700';
    };

    return (
      <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-72 h-72 bg-[#d85a2a]/5 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
              <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
            </button>
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">Operations Hub</h2>
              <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">Property Management</p>
            </div>
            <div className="w-12"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Module Cards - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  onClick={() => setCurrentView(module.id)}
                  className="bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border-2 border-[#d85a2a]/20 hover:border-orange-300 hover:shadow-orange-200/50 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-[#FF8C42]">{module.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium text-xs">{module.description}</p>
                  <div className="flex gap-1 flex-wrap">
                    {Object.entries(module.stats).map(([key, value]) => (
                      <span key={key} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                        {key}: <span className="text-[#FF8C42]">{value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activities Report */}
          <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d85a2a]/20 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <h3 className="text-2xl font-black text-white">Recent Activities</h3>
              <p className="text-orange-100 text-sm font-semibold">All pending and in-progress tasks across operations</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Time/ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm font-semibold text-gray-700">{activity.category}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm font-bold text-gray-900">{activity.title}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">{activity.assignedTo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-600">{activity.time}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== HOUSEKEEPING MODULE ====================
  if (currentView === 'housekeeping') {
    return <Housekeeping onBack={() => setCurrentView('hub')} />;
  }

  // ==================== MAINTENANCE MODULE ====================
  if (currentView === 'maintenance') {
    return <Maintenance onBack={() => setCurrentView('hub')} />;
  }

  // ==================== STAFF & ROLES MODULE ====================
  if (currentView === 'staff') {
    return <StaffRoles onBack={() => setCurrentView('hub')} />;
  }
};

// ==================== HOUSEKEEPING COMPONENT ====================
const Housekeeping = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);

  const tasks = [
    {
      id: 1,
      room: 'Nismara 2BR Villa',
      type: 'Turnover Cleaning',
      status: 'Pending',
      priority: 'High',
      assignedTo: 'Wayan',
      checkOutTime: '11:00 AM',
      checkInTime: '2:00 PM',
      notes: 'Guest check-out today - full cleaning and setup for next guest',
      estimatedTime: '2 hours',
      completedAt: null
    },
    {
      id: 2,
      room: 'Graha Uma 1BR Villa',
      type: 'Daily Housekeeping',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Kadek',
      checkOutTime: null,
      checkInTime: null,
      notes: 'Guest in residence - daily refresh and linen change',
      estimatedTime: '1 hour',
      completedAt: null
    },
    {
      id: 3,
      room: 'Nismara 2BR Villa',
      type: 'Pre-arrival Setup',
      status: 'Pending',
      priority: 'High',
      assignedTo: 'Kadek',
      checkOutTime: null,
      checkInTime: '2:00 PM',
      notes: 'New guest arriving - arrange welcome amenities',
      estimatedTime: '1.5 hours',
      completedAt: null
    },
    {
      id: 4,
      room: 'Nismara 1BR Villa Monthly',
      type: 'Weekly Deep Clean',
      status: 'Completed',
      priority: 'Medium',
      assignedTo: 'Wayan',
      checkOutTime: null,
      checkInTime: null,
      notes: 'Long-term guest - completed weekly deep clean',
      estimatedTime: '2 hours',
      completedAt: '10:30 AM'
    },
    {
      id: 5,
      room: 'Graha Uma 1BR Villa',
      type: 'Quality Inspection',
      status: 'Completed',
      priority: 'Medium',
      assignedTo: 'Komang',
      checkOutTime: null,
      checkInTime: null,
      notes: 'Weekly quality check completed - all good',
      estimatedTime: '30 minutes',
      completedAt: '9:45 AM'
    }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-500';
    if (status === 'In Progress') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-red-600 bg-red-50';
    if (priority === 'Medium') return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">Housekeeping</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">Room Management</p>
          </div>
          <button className="px-6 py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            + New Task
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by room or staff name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-[#d85a2a]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Room</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-orange-50 transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-5 h-5 text-[#FF8C42]" />
                        <span className="font-bold text-gray-900">{task.room}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-700">{task.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-700">{task.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-600">{task.estimatedTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedTask(null)}>
          <div className="bg-[#1f2937] rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-[#FF8C42]">Task Details</h3>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-500 mb-1">Room</p>
                <p className="text-lg font-black text-gray-900">{selectedTask.room}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Type</p>
                  <p className="text-lg font-bold text-gray-900">{selectedTask.type}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-bold ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Priority</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Assigned To</p>
                  <p className="text-lg font-bold text-gray-900">{selectedTask.assignedTo}</p>
                </div>
              </div>

              {selectedTask.checkInTime && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm font-bold text-gray-500 mb-1">Check-out Time</p>
                    <p className="text-lg font-bold text-gray-900">{selectedTask.checkOutTime}</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm font-bold text-gray-500 mb-1">Check-in Time</p>
                    <p className="text-lg font-bold text-gray-900">{selectedTask.checkInTime}</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-500 mb-1">Estimated Time</p>
                <p className="text-lg font-bold text-gray-900">{selectedTask.estimatedTime}</p>
              </div>

              {selectedTask.completedAt && (
                <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                  <p className="text-sm font-bold text-green-600 mb-1">Completed At</p>
                  <p className="text-lg font-bold text-green-700">{selectedTask.completedAt}</p>
                </div>
              )}

              <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                <p className="text-sm font-bold text-blue-600 mb-2">Notes</p>
                <p className="text-gray-700 font-medium">{selectedTask.notes}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg">
                Mark Complete
              </button>
              <button className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all">
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAINTENANCE COMPONENT ====================
const Maintenance = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const issues = [
    {
      id: 1,
      title: 'AC unit maintenance check',
      property: 'Graha Uma 1BR Villa',
      room: 'Main bedroom',
      type: 'HVAC',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Made',
      reportedBy: 'Guest',
      reportedDate: '2026-02-12 09:30 AM',
      estimatedCompletion: '2026-02-12 11:00 AM',
      description: 'Routine AC maintenance - cleaning filters and checking performance.',
      notes: 'Technician on-site, almost complete'
    },
    {
      id: 2,
      title: 'Pool cleaning and chemical balance',
      property: 'Nismara 2BR Villa',
      room: 'Pool Area',
      type: 'Pool Equipment',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Ketut',
      reportedBy: 'Property Manager',
      reportedDate: '2026-02-12 08:00 AM',
      estimatedCompletion: '2026-02-12 3:00 PM',
      description: 'Weekly pool maintenance - cleaning and pH adjustment.',
      notes: 'Scheduled for this afternoon'
    },
    {
      id: 3,
      title: 'Garden landscaping',
      property: 'Nismara 1BR Villa Monthly',
      room: 'Garden',
      type: 'Garden',
      status: 'Pending',
      priority: 'Low',
      assignedTo: 'Nyoman',
      reportedBy: 'Property Manager',
      reportedDate: '2026-02-11 2:00 PM',
      estimatedCompletion: '2026-02-13 10:00 AM',
      description: 'Trim hedges and plants, water garden.',
      notes: 'Scheduled for tomorrow morning'
    },
    {
      id: 4,
      title: 'Water heater inspection completed',
      property: 'Nismara 2BR Villa',
      room: 'Utility',
      type: 'Plumbing',
      status: 'Completed',
      priority: 'Medium',
      assignedTo: 'Made',
      reportedBy: 'Property Manager',
      reportedDate: '2026-02-11 10:00 AM',
      estimatedCompletion: '2026-02-11 12:00 PM',
      description: 'Monthly water heater check and maintenance.',
      notes: 'Completed - all systems working perfectly',
      completedDate: '2026-02-11 11:45 AM'
    }
  ];

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-500';
    if (status === 'In Progress') return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-red-600 bg-red-50';
    if (priority === 'Medium') return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getTypeColor = (type) => {
    const colors = {
      'HVAC': 'bg-blue-100 text-blue-700',
      'Plumbing': 'bg-cyan-100 text-cyan-700',
      'Electrical': 'bg-yellow-100 text-yellow-700',
      'Pool Equipment': 'bg-purple-100 text-purple-700',
      'Internet/Tech': 'bg-indigo-100 text-indigo-700',
      'Security': 'bg-red-100 text-red-700',
      'Preventive': 'bg-green-100 text-green-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">Maintenance</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">Work Orders & Repairs</p>
          </div>
          <button className="px-6 py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            + New Issue
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, property, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 hover:border-orange-300 hover:shadow-orange-200/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(issue.type)}`}>
                      {issue.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#FF8C42] mb-2">{issue.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{issue.property} - {issue.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">Assigned: {issue.assignedTo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">ETA: {issue.estimatedCompletion}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{issue.description}</p>

              <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-100">
                <p className="text-xs font-bold text-blue-600 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{issue.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedIssue(null)}>
          <div className="bg-[#1f2937] rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-[#FF8C42]">Issue Details</h3>
              <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-500 mb-1">Title</p>
                <p className="text-lg font-black text-gray-900">{selectedIssue.title}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-bold ${getStatusColor(selectedIssue.status)}`}>
                    {selectedIssue.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Priority</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(selectedIssue.priority)}`}>
                    {selectedIssue.priority}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Type</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(selectedIssue.type)}`}>
                    {selectedIssue.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Property</p>
                  <p className="text-lg font-bold text-gray-900">{selectedIssue.property}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Room/Location</p>
                  <p className="text-lg font-bold text-gray-900">{selectedIssue.room}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-500 mb-1">Description</p>
                <p className="text-gray-700 font-medium">{selectedIssue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Assigned To</p>
                  <p className="text-lg font-bold text-gray-900">{selectedIssue.assignedTo}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Reported By</p>
                  <p className="text-lg font-bold text-gray-900">{selectedIssue.reportedBy}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Reported Date</p>
                  <p className="text-lg font-bold text-gray-900">{selectedIssue.reportedDate}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Estimated Completion</p>
                  <p className="text-lg font-bold text-gray-900">{selectedIssue.estimatedCompletion}</p>
                </div>
              </div>

              {selectedIssue.completedDate && (
                <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                  <p className="text-sm font-bold text-green-600 mb-1">Completed Date</p>
                  <p className="text-lg font-bold text-green-700">{selectedIssue.completedDate}</p>
                </div>
              )}

              <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
                <p className="text-sm font-bold text-blue-600 mb-2">Technical Notes</p>
                <p className="text-gray-700 font-medium">{selectedIssue.notes}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg">
                Update Status
              </button>
              <button className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all">
                Reassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== STAFF & ROLES COMPONENT ====================
const StaffRoles = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedStaff, setSelectedStaff] = useState(null);

  const staff = [
    {
      id: 1,
      name: 'Wayan',
      role: 'Housekeeping',
      status: 'On Duty',
      phone: '+62 812-3456-7890',
      email: 'wayan@bizmate.com',
      shift: 'Full Time (8 AM - 4 PM)',
      todayTasks: 3,
      completedTasks: 2,
      rating: 4.9,
      joinedDate: '2023-05-15',
      certifications: ['Hygiene Standards', 'Guest Service Excellence']
    },
    {
      id: 2,
      name: 'Kadek',
      role: 'Housekeeping',
      status: 'On Duty',
      phone: '+62 813-4567-8901',
      email: 'kadek@bizmate.com',
      shift: 'Full Time (8 AM - 4 PM)',
      todayTasks: 2,
      completedTasks: 1,
      rating: 4.8,
      joinedDate: '2023-08-20',
      certifications: ['Hygiene Standards', 'Chemical Safety']
    },
    {
      id: 3,
      name: 'Made',
      role: 'Maintenance',
      status: 'On Duty',
      phone: '+62 815-6789-0123',
      email: 'made@bizmate.com',
      shift: 'Full Time (8 AM - 4 PM)',
      todayTasks: 1,
      completedTasks: 1,
      rating: 4.9,
      joinedDate: '2023-03-01',
      certifications: ['Licensed Technician', 'HVAC Systems', 'Safety Training']
    },
    {
      id: 4,
      name: 'Ketut',
      role: 'Maintenance',
      status: 'On Duty',
      phone: '+62 817-8901-2345',
      email: 'ketut@bizmate.com',
      shift: 'Part Time (As Needed)',
      todayTasks: 1,
      completedTasks: 0,
      rating: 4.7,
      joinedDate: '2024-01-20',
      certifications: ['Pool Maintenance', 'Garden Care']
    },
    {
      id: 5,
      name: 'Komang',
      role: 'Management',
      status: 'On Duty',
      phone: '+62 818-9012-3456',
      email: 'komang@bizmate.com',
      shift: 'Full Time (9 AM - 6 PM)',
      todayTasks: 5,
      completedTasks: 3,
      rating: 4.9,
      joinedDate: '2022-11-10',
      certifications: ['Property Management', 'Guest Relations', 'Quality Control']
    },
    {
      id: 6,
      name: 'Nyoman',
      role: 'Gardener',
      status: 'Off Duty',
      phone: '+62 819-0123-4567',
      email: 'nyoman@bizmate.com',
      shift: 'Part Time (As Needed)',
      todayTasks: 0,
      completedTasks: 1,
      rating: 4.6,
      joinedDate: '2024-02-05',
      certifications: ['Landscaping', 'Tropical Plants']
    }
  ];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || member.role === filterRole;
    const matchesStatus = filterStatus === 'All' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (status === 'On Duty') return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getRoleColor = (role) => {
    const colors = {
      'Housekeeping': 'bg-blue-100 text-blue-700',
      'Maintenance': 'bg-orange-100 text-orange-700',
      'Management': 'bg-purple-100 text-purple-700',
      'Gardener': 'bg-green-100 text-green-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-[#2a2f3a] p-4 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#d85a2a]/5 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-[#1f2937]/95 backdrop-blur-sm rounded-2xl hover:bg-[#1f2937] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            <ChevronLeft className="w-6 h-6 text-[#FF8C42]" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">Staff & Roles</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">Team Management</p>
          </div>
          <button className="px-6 py-3 bg-[#1f2937]/95 backdrop-blur-sm text-[#FF8C42] rounded-2xl font-bold hover:bg-[#1f2937] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#d85a2a]/20">
            + Add Staff
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-2xl border-2 border-[#d85a2a]/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-6 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Management">Management</option>
              <option value="Gardener">Gardener</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-700 focus:outline-none focus:border-orange-500 transition-all cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="On Duty">On Duty</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedStaff(member)}
              className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-[#d85a2a]/20 hover:border-orange-300 hover:shadow-orange-200/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-[#FF8C42] mb-2">{member.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">{member.shift}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-blue-50 rounded-xl p-2 text-center border-2 border-blue-100">
                  <p className="text-xs font-bold text-blue-600 mb-1">Today</p>
                  <p className="text-lg font-black text-blue-700">{member.todayTasks}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-2 text-center border-2 border-green-100">
                  <p className="text-xs font-bold text-green-600 mb-1">Done</p>
                  <p className="text-lg font-black text-green-700">{member.completedTasks}</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-2 text-center border-2 border-yellow-100">
                  <p className="text-xs font-bold text-yellow-600 mb-1">Rating</p>
                  <p className="text-lg font-black text-yellow-700">{member.rating}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all text-sm">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedStaff(null)}>
          <div className="bg-[#1f2937] rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-[#FF8C42]">Staff Profile</h3>
              <button onClick={() => setSelectedStaff(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                {selectedStaff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-black text-gray-900 mb-2">{selectedStaff.name}</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRoleColor(selectedStaff.role)}`}>
                    {selectedStaff.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getStatusColor(selectedStaff.status)}`}>
                    {selectedStaff.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Phone</p>
                  <p className="text-lg font-bold text-gray-900">{selectedStaff.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Email</p>
                  <p className="text-lg font-bold text-gray-900">{selectedStaff.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Shift Schedule</p>
                  <p className="text-lg font-bold text-gray-900">{selectedStaff.shift}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-500 mb-1">Join Date</p>
                  <p className="text-lg font-bold text-gray-900">{selectedStaff.joinedDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 text-center">
                  <p className="text-sm font-bold text-blue-600 mb-1">Tasks Today</p>
                  <p className="text-3xl font-black text-blue-700">{selectedStaff.todayTasks}</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200 text-center">
                  <p className="text-sm font-bold text-green-600 mb-1">Completed</p>
                  <p className="text-3xl font-black text-green-700">{selectedStaff.completedTasks}</p>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200 text-center">
                  <p className="text-sm font-bold text-yellow-600 mb-1">Rating</p>
                  <p className="text-3xl font-black text-yellow-700">{selectedStaff.rating}</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-200">
                <p className="text-sm font-bold text-purple-600 mb-3">Certifications & Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStaff.certifications.map((cert, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold border border-purple-300">
                      <Shield className="w-3 h-3 inline mr-1" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg">
                Edit Profile
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg">
                View Schedule
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all">
                Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Operations;
