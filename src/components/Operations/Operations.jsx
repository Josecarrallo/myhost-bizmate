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
      { icon: ClipboardList, label: 'Active Tasks', value: '24', gradient: 'from-orange-500 to-orange-600' },
      { icon: Users, label: 'Team Members', value: '18', gradient: 'from-orange-500 to-orange-600' },
      { icon: AlertCircle, label: 'Pending Issues', value: '7', gradient: 'from-orange-500 to-orange-600' },
      { icon: CheckCircle, label: 'Completed Today', value: '31', gradient: 'from-orange-500 to-orange-600' }
    ];

    const modules = [
      {
        id: 'housekeeping',
        title: 'Housekeeping',
        description: 'Room cleaning schedules, assignments & tracking',
        icon: Sparkles,
        gradient: 'from-blue-500 to-cyan-600',
        stats: { pending: 8, inProgress: 5, completed: 12 }
      },
      {
        id: 'maintenance',
        title: 'Maintenance',
        description: 'Repairs, work orders & preventive maintenance',
        icon: Wrench,
        gradient: 'from-orange-500 to-red-600',
        stats: { pending: 4, inProgress: 3, completed: 8 }
      },
      {
        id: 'staff',
        title: 'Staff & Roles',
        description: 'Team management, schedules & permissions',
        icon: Users,
        gradient: 'from-purple-500 to-pink-600',
        stats: { active: 18, onDuty: 12, offDuty: 6 }
      }
    ];

    // All Recent Activities (consolidated from all modules)
    const recentActivities = [
      { id: 1, type: 'Housekeeping', category: 'Cleaning', title: 'Full Cleaning - Villa Sunset Paradise Room 101', status: 'Pending', priority: 'High', assignedTo: 'Maria Santos', time: '2.5 hours' },
      { id: 2, type: 'Maintenance', category: 'HVAC', title: 'AC unit not cooling properly - Room 101', status: 'In Progress', priority: 'High', assignedTo: 'John Electrician', time: '2:00 PM' },
      { id: 3, type: 'Housekeeping', category: 'Cleaning', title: 'Turnover Cleaning - Beach House Room 205', status: 'In Progress', priority: 'High', assignedTo: 'Ana Rodriguez', time: '1.5 hours' },
      { id: 4, type: 'Maintenance', category: 'Pool', title: 'Pool pump making loud noise - Pool Area', status: 'Pending', priority: 'High', assignedTo: 'Mike Pool Tech', time: '5:00 PM' },
      { id: 5, type: 'Housekeeping', category: 'Cleaning', title: 'Pre-arrival Setup - Penthouse Suite Room 501', status: 'Pending', priority: 'High', assignedTo: 'Ana Rodriguez', time: '1 hour' },
      { id: 6, type: 'Maintenance', category: 'Security', title: 'Broken door lock - Pool Villa Room 104', status: 'In Progress', priority: 'High', assignedTo: 'Security Team', time: '1:00 PM' },
      { id: 7, type: 'Staff', category: 'Management', title: 'Maria Santos - 4 tasks today (2 completed)', status: 'On Duty', priority: 'Medium', assignedTo: 'Housekeeping', time: '8 AM - 4 PM' },
      { id: 8, type: 'Maintenance', category: 'Tech', title: 'WiFi router replacement - Garden Villa Room 102', status: 'Pending', priority: 'Medium', assignedTo: 'Tech Support', time: 'Tomorrow 10 AM' },
      { id: 9, type: 'Housekeeping', category: 'Inspection', title: 'Quality control inspection - Bali Suite Room 203', status: 'In Progress', priority: 'Low', assignedTo: 'Manager on Duty', time: '30 minutes' },
      { id: 10, type: 'Staff', category: 'Management', title: 'Sarah Manager - 8 tasks today (5 completed)', status: 'On Duty', priority: 'Medium', assignedTo: 'Management', time: '9 AM - 6 PM' }
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
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute w-72 h-72 bg-orange-200/30 rounded-full blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
              <ChevronLeft className="w-6 h-6 text-orange-600" />
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
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border-2 border-white/50 hover:border-orange-300 hover:shadow-orange-200/50 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-orange-600">{module.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium text-xs">{module.description}</p>
                  <div className="flex gap-1 flex-wrap">
                    {Object.entries(module.stats).map(([key, value]) => (
                      <span key={key} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                        {key}: <span className="text-orange-600">{value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activities Report */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
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
      room: 'Villa Sunset Paradise - Room 101',
      type: 'Full Cleaning',
      status: 'Pending',
      priority: 'High',
      assignedTo: 'Maria Santos',
      checkOutTime: '11:00 AM',
      checkInTime: '3:00 PM',
      notes: 'Deep clean required - guest complained about bathroom',
      estimatedTime: '2.5 hours',
      completedAt: null
    },
    {
      id: 2,
      room: 'Beach House Deluxe - Room 205',
      type: 'Turnover Cleaning',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Ana Rodriguez',
      checkOutTime: '10:30 AM',
      checkInTime: '2:00 PM',
      notes: 'Standard turnover - guest arriving early',
      estimatedTime: '1.5 hours',
      completedAt: null
    },
    {
      id: 3,
      room: 'Ocean View Suite - Room 303',
      type: 'Daily Housekeeping',
      status: 'Completed',
      priority: 'Medium',
      assignedTo: 'Sofia Chen',
      checkOutTime: null,
      checkInTime: null,
      notes: 'Guest staying - daily refresh completed',
      estimatedTime: '45 minutes',
      completedAt: '10:45 AM'
    },
    {
      id: 4,
      room: 'Garden Villa - Room 102',
      type: 'Full Cleaning',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Maria Santos',
      checkOutTime: '12:00 PM',
      checkInTime: '4:00 PM',
      notes: 'Check all amenities and restock minibar',
      estimatedTime: '2 hours',
      completedAt: null
    },
    {
      id: 5,
      room: 'Penthouse Suite - Room 501',
      type: 'Pre-arrival Setup',
      status: 'Pending',
      priority: 'High',
      assignedTo: 'Ana Rodriguez',
      checkOutTime: null,
      checkInTime: '1:00 PM',
      notes: 'VIP guest - arrange welcome amenities',
      estimatedTime: '1 hour',
      completedAt: null
    },
    {
      id: 6,
      room: 'Pool Villa - Room 104',
      type: 'Turnover Cleaning',
      status: 'Completed',
      priority: 'High',
      assignedTo: 'Sofia Chen',
      checkOutTime: '11:00 AM',
      checkInTime: '3:00 PM',
      notes: 'Completed ahead of schedule',
      estimatedTime: '2 hours',
      completedAt: '1:20 PM'
    },
    {
      id: 7,
      room: 'Bali Suite - Room 203',
      type: 'Inspection',
      status: 'In Progress',
      priority: 'Low',
      assignedTo: 'Manager on Duty',
      checkOutTime: null,
      checkInTime: null,
      notes: 'Quality control inspection - weekly routine',
      estimatedTime: '30 minutes',
      completedAt: null
    },
    {
      id: 8,
      room: 'Tropical Paradise - Room 105',
      type: 'Deep Cleaning',
      status: 'Pending',
      priority: 'Low',
      assignedTo: 'Maria Santos',
      checkOutTime: null,
      checkInTime: null,
      notes: 'Vacant room - scheduled deep clean',
      estimatedTime: '3 hours',
      completedAt: null
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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">Housekeeping</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">Room Management</p>
          </div>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            + New Task
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-2xl border-2 border-white/50">
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
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
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
                        <Home className="w-5 h-5 text-orange-600" />
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
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-orange-600">Task Details</h3>
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
      title: 'AC unit not cooling properly',
      property: 'Villa Sunset Paradise',
      room: 'Room 101',
      type: 'HVAC',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'John Electrician',
      reportedBy: 'Guest - Sarah Johnson',
      reportedDate: '2025-12-04 09:30 AM',
      estimatedCompletion: '2025-12-04 2:00 PM',
      description: 'Guest reported AC is running but not cooling the room effectively.',
      notes: 'Technician dispatched - checking refrigerant levels'
    },
    {
      id: 2,
      title: 'Pool pump making loud noise',
      property: 'Beach House Deluxe',
      room: 'Pool Area',
      type: 'Pool Equipment',
      status: 'Pending',
      priority: 'High',
      assignedTo: 'Mike Pool Technician',
      reportedBy: 'Property Manager',
      reportedDate: '2025-12-04 08:00 AM',
      estimatedCompletion: '2025-12-04 5:00 PM',
      description: 'Pool pump is making unusual grinding noise during operation.',
      notes: 'Scheduled for afternoon inspection'
    },
    {
      id: 3,
      title: 'Leaking faucet in bathroom',
      property: 'Ocean View Suite',
      room: 'Room 303',
      type: 'Plumbing',
      status: 'Completed',
      priority: 'Medium',
      assignedTo: 'Carlos Plumber',
      reportedBy: 'Housekeeping Staff',
      reportedDate: '2025-12-03 2:00 PM',
      estimatedCompletion: '2025-12-03 4:30 PM',
      description: 'Bathroom sink faucet dripping constantly.',
      notes: 'Replaced washer - issue resolved',
      completedDate: '2025-12-03 4:15 PM'
    },
    {
      id: 4,
      title: 'WiFi router needs replacement',
      property: 'Garden Villa',
      room: 'Room 102',
      type: 'Internet/Tech',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: 'Tech Support Team',
      reportedBy: 'Guest - Michael Chen',
      reportedDate: '2025-12-04 11:00 AM',
      estimatedCompletion: '2025-12-05 10:00 AM',
      description: 'Guest experiencing frequent WiFi disconnections.',
      notes: 'New router ordered - arriving tomorrow'
    },
    {
      id: 5,
      title: 'Preventive Maintenance - Water Heater',
      property: 'Penthouse Suite',
      room: 'Room 501',
      type: 'Preventive',
      status: 'Pending',
      priority: 'Low',
      assignedTo: 'Carlos Plumber',
      reportedBy: 'Automated System',
      reportedDate: '2025-12-04 7:00 AM',
      estimatedCompletion: '2025-12-06 10:00 AM',
      description: 'Scheduled quarterly water heater maintenance and inspection.',
      notes: 'Part of quarterly maintenance schedule'
    },
    {
      id: 6,
      title: 'Broken door lock',
      property: 'Pool Villa',
      room: 'Room 104',
      type: 'Security',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Security Team',
      reportedBy: 'Front Desk',
      reportedDate: '2025-12-04 10:00 AM',
      estimatedCompletion: '2025-12-04 1:00 PM',
      description: 'Electronic door lock not responding to key cards.',
      notes: 'Technician on-site replacing lock mechanism'
    },
    {
      id: 7,
      title: 'Outdoor lighting malfunction',
      property: 'Bali Suite',
      room: 'Garden Area',
      type: 'Electrical',
      status: 'Pending',
      priority: 'Low',
      assignedTo: 'John Electrician',
      reportedBy: 'Night Security',
      reportedDate: '2025-12-03 11:00 PM',
      estimatedCompletion: '2025-12-04 6:00 PM',
      description: 'Several outdoor garden lights not turning on at night.',
      notes: 'Scheduled for daytime inspection'
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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">Maintenance</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">Work Orders & Repairs</p>
          </div>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            + New Issue
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-2xl border-2 border-white/50">
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
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 hover:border-orange-300 hover:shadow-orange-200/50 transition-all cursor-pointer"
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
                  <h3 className="text-xl font-black text-orange-600 mb-2">{issue.title}</h3>
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
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-orange-600">Issue Details</h3>
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
      name: 'Maria Santos',
      role: 'Housekeeping',
      status: 'On Duty',
      phone: '+62 812-3456-7890',
      email: 'maria.santos@bizmate.com',
      shift: 'Morning (8 AM - 4 PM)',
      todayTasks: 4,
      completedTasks: 2,
      rating: 4.8,
      joinedDate: '2023-05-15',
      certifications: ['Hygiene Standards', 'Guest Service Excellence']
    },
    {
      id: 2,
      name: 'Ana Rodriguez',
      role: 'Housekeeping',
      status: 'On Duty',
      phone: '+62 813-4567-8901',
      email: 'ana.rodriguez@bizmate.com',
      shift: 'Morning (8 AM - 4 PM)',
      todayTasks: 3,
      completedTasks: 1,
      rating: 4.9,
      joinedDate: '2023-08-20',
      certifications: ['Hygiene Standards', 'Chemical Safety']
    },
    {
      id: 3,
      name: 'Sofia Chen',
      role: 'Housekeeping',
      status: 'On Duty',
      phone: '+62 814-5678-9012',
      email: 'sofia.chen@bizmate.com',
      shift: 'Afternoon (2 PM - 10 PM)',
      todayTasks: 3,
      completedTasks: 3,
      rating: 4.7,
      joinedDate: '2023-11-10',
      certifications: ['Hygiene Standards']
    },
    {
      id: 4,
      name: 'John Electrician',
      role: 'Maintenance',
      status: 'On Duty',
      phone: '+62 815-6789-0123',
      email: 'john.electric@bizmate.com',
      shift: 'Morning (8 AM - 4 PM)',
      todayTasks: 2,
      completedTasks: 1,
      rating: 4.9,
      joinedDate: '2022-03-01',
      certifications: ['Licensed Electrician', 'HVAC Systems', 'Safety Training']
    },
    {
      id: 5,
      name: 'Carlos Plumber',
      role: 'Maintenance',
      status: 'Off Duty',
      phone: '+62 816-7890-1234',
      email: 'carlos.plumber@bizmate.com',
      shift: 'Evening (4 PM - 12 AM)',
      todayTasks: 0,
      completedTasks: 3,
      rating: 4.8,
      joinedDate: '2022-07-15',
      certifications: ['Licensed Plumber', 'Pool Systems', 'Safety Training']
    },
    {
      id: 6,
      name: 'Mike Pool Tech',
      role: 'Maintenance',
      status: 'On Duty',
      phone: '+62 817-8901-2345',
      email: 'mike.pool@bizmate.com',
      shift: 'Morning (6 AM - 2 PM)',
      todayTasks: 1,
      completedTasks: 2,
      rating: 4.6,
      joinedDate: '2023-01-20',
      certifications: ['Pool Maintenance', 'Water Chemistry']
    },
    {
      id: 7,
      name: 'Sarah Manager',
      role: 'Management',
      status: 'On Duty',
      phone: '+62 818-9012-3456',
      email: 'sarah.manager@bizmate.com',
      shift: 'Full Day (9 AM - 6 PM)',
      todayTasks: 8,
      completedTasks: 5,
      rating: 4.9,
      joinedDate: '2021-01-10',
      certifications: ['Property Management', 'Leadership', 'Guest Relations', 'Crisis Management']
    },
    {
      id: 8,
      name: 'David Reception',
      role: 'Front Desk',
      status: 'On Duty',
      phone: '+62 819-0123-4567',
      email: 'david.reception@bizmate.com',
      shift: 'Morning (7 AM - 3 PM)',
      todayTasks: 12,
      completedTasks: 8,
      rating: 4.7,
      joinedDate: '2022-09-05',
      certifications: ['Customer Service', 'PMS Systems', 'Multi-lingual']
    },
    {
      id: 9,
      name: 'Emma Concierge',
      role: 'Concierge',
      status: 'Off Duty',
      phone: '+62 820-1234-5678',
      email: 'emma.concierge@bizmate.com',
      shift: 'Afternoon (12 PM - 8 PM)',
      todayTasks: 0,
      completedTasks: 7,
      rating: 4.9,
      joinedDate: '2022-04-12',
      certifications: ['Concierge Excellence', 'Local Tourism Expert', 'Multi-lingual']
    },
    {
      id: 10,
      name: 'Robert Security',
      role: 'Security',
      status: 'On Duty',
      phone: '+62 821-2345-6789',
      email: 'robert.security@bizmate.com',
      shift: 'Night (10 PM - 6 AM)',
      todayTasks: 0,
      completedTasks: 0,
      rating: 4.8,
      joinedDate: '2021-11-20',
      certifications: ['Security License', 'First Aid', 'Emergency Response']
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
      'Front Desk': 'bg-pink-100 text-pink-700',
      'Concierge': 'bg-cyan-100 text-cyan-700',
      'Security': 'bg-red-100 text-red-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-4 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl top-20 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-300/20 rounded-full blur-3xl bottom-20 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-white/95 backdrop-blur-sm rounded-2xl hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-1">Staff & Roles</h2>
            <p className="text-xl md:text-2xl font-bold text-orange-100 drop-shadow-xl">Team Management</p>
          </div>
          <button className="px-6 py-3 bg-white/95 backdrop-blur-sm text-orange-600 rounded-2xl font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/50">
            + Add Staff
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-2xl border-2 border-white/50">
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
              <option value="Front Desk">Front Desk</option>
              <option value="Concierge">Concierge</option>
              <option value="Security">Security</option>
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
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 hover:border-orange-300 hover:shadow-orange-200/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-orange-600 mb-2">{member.name}</h3>
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
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-orange-600">Staff Profile</h3>
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
