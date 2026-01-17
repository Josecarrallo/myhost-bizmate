/**
 * Workflows Service
 * Handles all API calls for Workflows & Automations module
 */

import { supabase } from '../lib/supabase';
import { mockStats, mockRecentActivity, mockWorkflowSettings, PROPERTY_ID } from './workflowsMocks';

const workflowsService = {
  /**
   * Get workflow settings for a property
   * Returns active/inactive state and execution counts
   */
  async getWorkflowSettings(propertyId = PROPERTY_ID) {
    try {
      const { data, error } = await supabase
        .from('workflow_settings')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching workflow settings:', error);
        // Fallback to mock data
        return { success: true, data: mockWorkflowSettings };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error in getWorkflowSettings:', error);
      return { success: false, error: error.message, data: mockWorkflowSettings };
    }
  },

  /**
   * Toggle workflow ON/OFF
   * Updates is_active in database
   */
  async toggleWorkflow(propertyId = PROPERTY_ID, workflowKey, isActive) {
    try {
      // Check if setting exists
      const { data: existing } = await supabase
        .from('workflow_settings')
        .select('id')
        .eq('property_id', propertyId)
        .eq('workflow_key', workflowKey)
        .single();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('workflow_settings')
          .update({
            is_active: isActive,
            updated_at: new Date().toISOString()
          })
          .eq('property_id', propertyId)
          .eq('workflow_key', workflowKey)
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          message: `Workflow ${isActive ? 'activated' : 'paused'} successfully`,
          data
        };
      } else {
        // Create new
        const { data, error } = await supabase
          .from('workflow_settings')
          .insert({
            property_id: propertyId,
            workflow_key: workflowKey,
            is_active: isActive,
            execution_count: 0
          })
          .select()
          .single();

        if (error) throw error;

        return {
          success: true,
          message: `Workflow ${isActive ? 'activated' : 'paused'} successfully`,
          data
        };
      }
    } catch (error) {
      console.error('Error toggling workflow:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get recent workflow executions
   * Returns last N executions with details
   */
  async getRecentActivity(propertyId = PROPERTY_ID, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('property_id', propertyId)
        .order('executed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activity:', error);
        // Fallback to mock data
        return { success: true, data: mockRecentActivity.slice(0, limit) };
      }

      // Transform data to match expected format
      const transformedData = (data || []).map(item => ({
        id: item.id,
        workflow: item.workflow_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        workflow_key: item.workflow_key,
        status: item.status,
        time: getRelativeTime(new Date(item.executed_at)),
        timestamp: item.executed_at,
        details: item.output_data?.message || item.error_message || 'Execution completed',
        icon: getIconForWorkflow(item.workflow_key)
      }));

      return { success: true, data: transformedData };
    } catch (error) {
      console.error('Error in getRecentActivity:', error);
      return { success: false, error: error.message, data: mockRecentActivity.slice(0, limit) };
    }
  },

  /**
   * Get workflow statistics
   * Calculates active workflows, executions, success rate
   */
  async getStats(propertyId = PROPERTY_ID) {
    try {
      // Get active workflows count
      const { data: settings, error: settingsError } = await supabase
        .from('workflow_settings')
        .select('*')
        .eq('property_id', propertyId)
        .eq('is_active', true);

      if (settingsError) throw settingsError;

      // Get total executions count
      const { count: totalExecutions, error: countError } = await supabase
        .from('workflow_executions')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId);

      if (countError) throw countError;

      // Get success rate
      const { count: successCount, error: successError } = await supabase
        .from('workflow_executions')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId)
        .eq('status', 'success');

      if (successError) throw successError;

      const successRate = totalExecutions > 0
        ? Math.round((successCount / totalExecutions) * 100)
        : 0;

      // Calculate time saved (mock for now - 5 min per execution)
      const hoursSaved = Math.round((totalExecutions * 5) / 60);

      return {
        success: true,
        data: {
          activeWorkflows: settings?.length || 0,
          totalExecutions: totalExecutions || 0,
          timeSaved: `${hoursSaved}h`,
          successRate
        }
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      // Fallback to mock data
      return { success: true, data: mockStats };
    }
  },

  /**
   * Execute a quick action (manual workflow trigger)
   * Phase 2: Will call n8n webhooks
   */
  async executeQuickAction(workflowKey, inputData = {}) {
    try {
      // Phase 2: Call n8n webhook
      // const response = await fetch(`https://n8n-production-bb2d.up.railway.app/webhook/${webhookPath}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ property_id: PROPERTY_ID, ...inputData })
      // });

      // For now, just log to database
      const { data, error } = await supabase
        .from('workflow_executions')
        .insert({
          property_id: PROPERTY_ID,
          workflow_key: workflowKey,
          status: 'success',
          trigger_type: 'manual',
          input_data: inputData,
          output_data: { message: 'Execution simulated (Phase 2)' }
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Quick action executed successfully',
        data
      };
    } catch (error) {
      console.error('Error executing quick action:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Helper: Get relative time
function getRelativeTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
}

// Helper: Get icon for workflow
function getIconForWorkflow(workflowKey) {
  const iconMap = {
    whatsapp_concierge: 'MessageSquare',
    voice_receptionist: 'Phone',
    booking_confirmation: 'CheckCircle',
    daily_recommendations: 'Sparkles',
    sync_availability: 'RefreshCw',
    send_welcome_email: 'Mail',
    generate_occupancy_report: 'BarChart3',
    send_promo_campaign: 'Megaphone'
  };
  return iconMap[workflowKey] || 'Zap';
}

export default workflowsService;
