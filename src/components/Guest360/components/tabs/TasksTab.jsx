import React from 'react';
import {
  Wrench,
  CheckCircle,
  Clock,
  User,
  XCircle,
  Calendar,
  Home,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { EmptyState } from '../shared';
import { formatDate, TASK_STATUS } from '../../constants';

/**
 * TasksTab - Lista de maintenance & housekeeping tasks del huésped
 *
 * Campos de tasks:
 * - type (maintenance, housekeeping, cleaning, etc.)
 * - title (nombre descriptivo)
 * - status (open, assigned, in_progress, completed, cancelled)
 * - priority (low, medium, high, urgent)
 * - due_date (fecha límite)
 * - assignee (persona asignada)
 * - description (detalles)
 */
const TasksTab = ({ tasks = [], bookings = [] }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-[#333b47] rounded-2xl border border-white/10 p-5">
        <EmptyState
          icon={Wrench}
          title="No Tasks"
          description="No maintenance or housekeeping tasks found for this guest's bookings"
        />
      </div>
    );
  }

  // Status config
  const statusConfig = {
    open: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Open' },
    assigned: { icon: User, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Assigned' },
    in_progress: { icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'In Progress' },
    completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Cancelled' },
  };

  // Priority config
  const priorityConfig = {
    urgent: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Urgent' },
    high: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'High' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Medium' },
    low: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Low' },
  };

  // Task type config
  const taskTypeConfig = {
    maintenance: { icon: Wrench, emoji: '🔧', label: 'Maintenance' },
    housekeeping: { icon: Sparkles, emoji: '✨', label: 'Housekeeping' },
    cleaning: { icon: Sparkles, emoji: '🧹', label: 'Cleaning' },
    turnover: { icon: Sparkles, emoji: '🔄', label: 'Turnover' },
    inspection: { icon: CheckCircle, emoji: '🔍', label: 'Inspection' },
    repair: { icon: Wrench, emoji: '🔨', label: 'Repair' },
    setup: { icon: Home, emoji: '🏠', label: 'Setup' },
    other: { icon: Wrench, emoji: '📋', label: 'Task' },
  };

  // Get booking info helper
  const getBookingInfo = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return null;
    return {
      villaName: booking.villas?.name || 'Villa',
      code: booking.confirmation_code || booking.reservation_id?.split('@')[0]?.slice(-12),
    };
  };

  // Group by status
  const openTasks = tasks.filter(t => t.status === 'open');
  const assignedTasks = tasks.filter(t => t.status === 'assigned');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const cancelledTasks = tasks.filter(t => t.status === 'cancelled');

  // Active tasks (not completed/cancelled)
  const activeTasks = tasks.filter(t => !['completed', 'cancelled'].includes(t.status));

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-3 text-center">
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{activeTasks.length}</p>
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider">Active</p>
        </div>
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{completedTasks.length}</p>
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider">Completed</p>
        </div>
        <div className="bg-[#333b47] rounded-xl border border-white/10 p-3 text-center">
          <p className="text-2xl font-bold text-gray-400">{cancelledTasks.length}</p>
          <p className="text-xs text-[#8a93a1] uppercase tracking-wider">Cancelled</p>
        </div>
      </div>

      {/* Tasks list */}
      <div className="bg-[#333b47] rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">
            All Tasks ({tasks.length})
          </h3>
        </div>

        <div className="divide-y divide-white/5">
          {[...tasks]
            .sort((a, b) => {
              // Sort: active first, then by due_date or created_at
              const aActive = !['completed', 'cancelled'].includes(a.status);
              const bActive = !['completed', 'cancelled'].includes(b.status);
              if (aActive !== bActive) return bActive ? 1 : -1;
              return new Date(b.due_date || b.created_at) - new Date(a.due_date || a.created_at);
            })
            .map((task) => {
              const status = statusConfig[task.status] || statusConfig.open;
              const StatusIcon = status.icon;
              const priority = priorityConfig[task.priority] || priorityConfig.medium;
              const taskType = taskTypeConfig[task.type] || taskTypeConfig.other;
              const bookingInfo = getBookingInfo(task.booking_id);

              // Check if overdue
              const isOverdue = task.due_date &&
                new Date(task.due_date) < new Date() &&
                !['completed', 'cancelled'].includes(task.status);

              return (
                <div key={task.id} className="px-5 py-4 hover:bg-[#3a434f]/30 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div className={`p-2 rounded-lg ${isOverdue ? 'bg-red-500/20' : status.bg} flex-shrink-0`}>
                      {isOverdue ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-medium">
                          <span className="mr-1.5">{taskType.emoji}</span>
                          {task.title || taskType.label}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isOverdue ? 'bg-red-500/20 text-red-400' : `${status.bg} ${status.color}`}`}>
                          {isOverdue ? 'OVERDUE' : status.label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>
                          {priority.label}
                        </span>
                      </div>

                      {/* Task details row */}
                      <div className="flex items-center gap-3 mt-2 text-sm text-[#aab2bf] flex-wrap">
                        {/* Due date */}
                        {task.due_date && (
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
                            <Calendar className="w-3.5 h-3.5 text-[#6d7683]" />
                            {formatDate(task.due_date)}
                          </span>
                        )}

                        {/* Assignee */}
                        {task.assignee && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#6d7683]" />
                            {task.assignee}
                          </span>
                        )}

                        {/* Villa */}
                        {bookingInfo && (
                          <span className="flex items-center gap-1">
                            <Home className="w-3.5 h-3.5 text-[#f5791f]" />
                            {bookingInfo.villaName}
                          </span>
                        )}
                      </div>

                      {/* Description / notes */}
                      {task.description && (
                        <p className="text-[#8a93a1] text-sm mt-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Task type badge */}
                      {task.type && (
                        <p className="text-[#6d7683] text-xs mt-1">
                          Type: {taskType.label}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TasksTab;
