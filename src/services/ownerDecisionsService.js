/**
 * Owner Decisions Service
 * Handles all CRUD operations for the Owner Control System (OCS)
 *
 * @see C:\myhost-bizmate\Cluade AI and Code Update 19032026\debug_claudecode.pdf
 * @see C:\myhost-bizmate\Cluade AI and Code Update 19032026\MYHOST_OCS_Handoff_v2_Mar2026.pdf
 *
 * VERIFIED: 18 pending decisions exist in Supabase for tenant Izumi
 * RLS is disabled on all OCS tables
 */

import { supabase } from '../lib/supabase';

// Credentials from debug_claudecode.pdf
const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

// Decision Router API endpoint
const OCS_ROUTER_ENDPOINT = 'https://n8n-production-bb2d.up.railway.app/webhook/autopilot/decision-action';

/**
 * Get owner decisions with optional filters
 * EXACT QUERY from debug_claudecode.pdf section 3
 *
 * @param {string} tenantId - The owner's tenant ID (Izumi: c24393db-d318-4d75-8bbf-0fa240b9c1db)
 * @param {object} filters - Optional filters { status, priority, decision_type, generated_by_agent }
 * @returns {Promise<Array>} Array of owner decisions
 */
export const getOwnerDecisions = async (tenantId, filters = {}) => {
  try {
    console.log('🔄 getOwnerDecisions called with tenantId:', tenantId, 'filters:', filters);

    let query = supabase
      .from('owner_decisions')
      .select('*')
      .eq('tenant_id', tenantId);

    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.decision_type) {
      query = query.eq('decision_type', filters.decision_type);
    }
    if (filters.generated_by_agent) {
      query = query.eq('generated_by_agent', filters.generated_by_agent);
    }

    // Order by created_at DESC (newest first)
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    console.log('✅ Supabase response - data:', data);
    console.log('✅ Supabase response - error:', error);

    if (error) {
      console.error('❌ Error fetching owner decisions:', error);
      throw error;
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} owner decisions`);
    return data || [];
  } catch (error) {
    console.error('❌ getOwnerDecisions exception:', error);
    throw error;
  }
};

/**
 * Get a single owner decision by ID with complete details
 * @param {string} decisionId - The decision UUID
 * @returns {Promise<object>} Decision object with history and comments
 */
export const getOwnerDecisionById = async (decisionId) => {
  try {
    console.log('🔄 getOwnerDecisionById called with:', decisionId);

    // Get main decision
    const { data: decision, error: decisionError } = await supabase
      .from('owner_decisions')
      .select('*')
      .eq('id', decisionId)
      .single();

    if (decisionError) {
      console.error('❌ Error fetching decision:', decisionError);
      throw decisionError;
    }

    // Get decision history
    const { data: history, error: historyError } = await supabase
      .from('owner_decision_history')
      .select('*')
      .eq('decision_id', decisionId)
      .order('created_at', { ascending: false });

    if (historyError) console.warn('⚠️ Error fetching history:', historyError);

    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('owner_decision_comments')
      .select('*')
      .eq('decision_id', decisionId)
      .order('created_at', { ascending: false });

    if (commentsError) console.warn('⚠️ Error fetching comments:', commentsError);

    return {
      ...decision,
      history: history || [],
      comments: comments || []
    };
  } catch (error) {
    console.error('❌ getOwnerDecisionById exception:', error);
    throw error;
  }
};

/**
 * Get decisions summary for dashboard
 * @param {string} tenantId - The owner's tenant ID
 * @returns {Promise<object>} Summary stats { pending, urgent, high, total_revenue_impact, total_cost_impact }
 */
export const getDecisionsSummary = async (tenantId) => {
  try {
    console.log('🔄 getDecisionsSummary called for tenant:', tenantId);

    const { data, error } = await supabase
      .from('owner_decisions')
      .select('status, priority, financial_impact_estimate, estimated_cost, estimated_revenue_uplift')
      .eq('tenant_id', tenantId)
      .eq('status', 'pending');

    if (error) {
      console.error('❌ Error fetching summary:', error);
      throw error;
    }

    const summary = {
      pending: data?.length || 0,
      urgent: data?.filter(d => d.priority === 'urgent').length || 0,
      high: data?.filter(d => d.priority === 'high').length || 0,
      medium: data?.filter(d => d.priority === 'medium').length || 0,
      low: data?.filter(d => d.priority === 'low').length || 0,
      total_revenue_impact: data?.reduce((sum, d) => sum + (d.estimated_revenue_uplift || 0), 0) || 0,
      total_cost_impact: data?.reduce((sum, d) => sum + (d.estimated_cost || 0), 0) || 0,
      financial_impact_estimate: data?.reduce((sum, d) => sum + (d.financial_impact_estimate || 0), 0) || 0
    };

    console.log('✅ Summary:', summary);
    return summary;
  } catch (error) {
    console.error('❌ getDecisionsSummary exception:', error);
    return { pending: 0, urgent: 0, high: 0, medium: 0, low: 0, total_revenue_impact: 0, total_cost_impact: 0, financial_impact_estimate: 0 };
  }
};

/**
 * Approve a decision via Decision Router v3.0
 * @param {string} decisionId - The decision UUID
 * @param {string} actionBy - The user/owner ID who approved
 * @param {string} notes - Optional approval notes
 * @returns {Promise<object>} Result from Decision Router
 */
export const approveDecision = async (decisionId, actionBy, notes = '') => {
  try {
    console.log('🔄 approveDecision called:', { decisionId, actionBy, notes });

    const response = await fetch(OCS_ROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        decision_id: decisionId,
        action: 'approve',
        action_by: actionBy,
        notes: notes || 'Approved from MY HOST BizMate dashboard'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Decision Router failed:', response.status, errorText);
      throw new Error(`Decision Router failed: ${response.status} - ${errorText}`);
    }

    // Handle empty responses from n8n
    const text = await response.text();
    let result = { success: true };

    if (text && text.trim() !== '') {
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.warn('⚠️ Response is not JSON, treating as success:', text);
      }
    }

    console.log('✅ Decision approved successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ approveDecision exception:', error);
    throw error;
  }
};

/**
 * Reject a decision via Decision Router v3.0
 * @param {string} decisionId - The decision UUID
 * @param {string} actionBy - The user/owner ID who rejected
 * @param {string} notes - REQUIRED rejection reason
 * @returns {Promise<object>} Result from Decision Router
 */
export const rejectDecision = async (decisionId, actionBy, notes) => {
  if (!notes || notes.trim() === '') {
    throw new Error('Rejection reason is required');
  }

  try {
    console.log('🔄 rejectDecision called:', { decisionId, actionBy, notes });

    const response = await fetch(OCS_ROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        decision_id: decisionId,
        action: 'reject',
        action_by: actionBy,
        notes: notes
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Decision Router failed:', response.status, errorText);
      throw new Error(`Decision Router failed: ${response.status} - ${errorText}`);
    }

    // Handle empty responses from n8n
    const text = await response.text();
    let result = { success: true };

    if (text && text.trim() !== '') {
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.warn('⚠️ Response is not JSON, treating as success:', text);
      }
    }

    console.log('✅ Decision rejected successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ rejectDecision exception:', error);
    throw error;
  }
};

/**
 * Modify a decision (request changes) via Decision Router v3.0
 * @param {string} decisionId - The decision UUID
 * @param {string} actionBy - The user/owner ID who requested modification
 * @param {string} notes - REQUIRED modification notes
 * @returns {Promise<object>} Result from Decision Router
 */
export const modifyDecision = async (decisionId, actionBy, notes) => {
  if (!notes || notes.trim() === '') {
    throw new Error('Modification notes are required');
  }

  try {
    console.log('🔄 modifyDecision called:', { decisionId, actionBy, notes });

    const response = await fetch(OCS_ROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        decision_id: decisionId,
        action: 'modify',
        action_by: actionBy,
        notes: notes
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Decision Router failed:', response.status, errorText);
      throw new Error(`Decision Router failed: ${response.status} - ${errorText}`);
    }

    // Handle empty responses from n8n
    const text = await response.text();
    let result = { success: true };

    if (text && text.trim() !== '') {
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.warn('⚠️ Response is not JSON, treating as success:', text);
      }
    }

    console.log('✅ Decision modification requested:', result);
    return result;
  } catch (error) {
    console.error('❌ modifyDecision exception:', error);
    throw error;
  }
};

/**
 * Add a comment to a decision
 * @param {string} decisionId - The decision UUID
 * @param {string} userId - The user ID who is commenting
 * @param {string} comment - The comment text
 * @returns {Promise<object>} The created comment
 */
export const addComment = async (decisionId, userId, comment) => {
  try {
    console.log('🔄 addComment called:', { decisionId, userId, comment });

    const { data, error } = await supabase
      .from('owner_decision_comments')
      .insert({
        decision_id: decisionId,
        user_id: userId,
        comment: comment
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error adding comment:', error);
      throw error;
    }

    console.log('✅ Comment added successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ addComment exception:', error);
    throw error;
  }
};

/**
 * Get today's owner briefing
 * @param {string} tenantId - The owner's tenant ID
 * @returns {Promise<object|null>} Today's briefing or null
 */
export const getOwnerBriefing = async (tenantId) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    console.log('🔄 getOwnerBriefing called for:', { tenantId, today });

    const { data, error } = await supabase
      .from('owner_briefings')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('briefing_date', today)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Error fetching briefing:', error);
      throw error;
    }

    console.log('✅ Briefing:', data || 'No briefing for today');
    return data || null;
  } catch (error) {
    console.error('❌ getOwnerBriefing exception:', error);
    return null;
  }
};

// Export as named exports and as service object
export const ownerDecisionsService = {
  getOwnerDecisions,
  getOwnerDecisionById,
  getDecisionsSummary,
  approveDecision,
  rejectDecision,
  modifyDecision,
  addComment,
  getOwnerBriefing
};
