import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import StatsCards from './StatsCards';
import QuickActionsGrid from './QuickActionsGrid';
import AutomatedWorkflows from './AutomatedWorkflows';
import ScheduledTasks from './ScheduledTasks';
import RecentActivity from './RecentActivity';
import { automatedWorkflows, quickActions, scheduledTasks } from '../../lib/workflowsConfig';
import workflowsService from '../../services/workflowsService';

const Workflows = ({ onBack, onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [workflowSettings, setWorkflowSettings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load stats
    const statsResult = await workflowsService.getStats();
    if (statsResult.success) {
      setStats(statsResult.data);
    }

    // Load workflow settings
    const settingsResult = await workflowsService.getWorkflowSettings();
    if (settingsResult.success) {
      setWorkflowSettings(settingsResult.data);
    }

    // Load recent activity
    const activityResult = await workflowsService.getRecentActivity();
    if (activityResult.success) {
      setRecentActivity(activityResult.data);
    }

    setLoading(false);
  };

  const handleToggleWorkflow = async (workflowKey, isActive) => {
    const result = await workflowsService.toggleWorkflow(undefined, workflowKey, isActive);

    if (result.success) {
      // Update local state
      setWorkflowSettings(prev => {
        const existing = prev.find(s => s.workflow_key === workflowKey);
        if (existing) {
          return prev.map(s =>
            s.workflow_key === workflowKey ? { ...s, is_active: isActive } : s
          );
        } else {
          return [...prev, { workflow_key: workflowKey, is_active: isActive }];
        }
      });

      // Show success message
      setMessage({
        type: 'success',
        text: result.message
      });

      // Reload stats
      const statsResult = await workflowsService.getStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } else {
      setMessage({
        type: 'error',
        text: result.error || 'Failed to update workflow'
      });
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExecuteQuickAction = (action) => {
    // WhatsApp AI Agent -> Navigate to Workflow Tester
    if (action.key === 'whatsapp_ai_agent') {
      onNavigate && onNavigate('workflow-tester');
      return;
    }

    // All other actions do nothing (Phase 2)
    // No message shown
  };

  const handleViewAllActivity = () => {
    // Phase 2: Navigate to full activity history
    setMessage({
      type: 'info',
      text: 'Full activity history - Coming in Phase 2'
    });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center">
        <div className="text-white/60">Loading workflows...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-[#1a1f2e] overflow-auto">
      {/* Header */}
      <div className="bg-[#252b3b] border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
              <div>
                <h1 className="text-white text-2xl font-bold">Workflows & Automations</h1>
                <p className="text-white/60 text-sm">Manage your hotel's automated processes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : message.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Quick Actions */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            ⚡ Quick Actions
          </h2>
          <QuickActionsGrid actions={quickActions} onExecute={handleExecuteQuickAction} />
        </div>

        {/* Automated Workflows */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            🤖 Automated Workflows
          </h2>
          <AutomatedWorkflows
            workflows={automatedWorkflows}
            workflowSettings={workflowSettings}
            onToggle={handleToggleWorkflow}
          />
        </div>

        {/* Scheduled Tasks */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            📅 Scheduled Tasks
          </h2>
          <ScheduledTasks tasks={scheduledTasks} />
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
            📜 Recent Activity
          </h2>
          <RecentActivity activity={recentActivity} onViewAll={handleViewAllActivity} />
        </div>
      </div>
    </div>
  );
};

export default Workflows;
