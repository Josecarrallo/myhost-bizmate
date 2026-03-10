// Tasks Service - CRUD operations for WF-07 Maintenance & Tasks Engine
// Connects frontend to Supabase 'tasks' and 'task_events' tables
import { supabase } from '../lib/supabase';

export const tasksService = {
  // =====================================================
  // 1. GET TASKS - With filters
  // =====================================================
  async getTasks(tenantId, filters = {}) {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        villa:villas!villa_id(id, name),
        booking:bookings!booking_id(id, guest_name, check_in, check_out)
      `)
      .eq('tenant_id', tenantId)
      .order('due_date', { ascending: true, nullsFirst: false });

    // Apply optional filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters.villa_id) {
      query = query.eq('villa_id', filters.villa_id);
    }

    if (filters.task_type) {
      query = query.eq('task_type', filters.task_type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }

    return data;
  },

  // =====================================================
  // 2. GET TASK STATS - Dashboard metrics
  // =====================================================
  async getTaskStats(tenantId) {
    const now = new Date().toISOString();

    // Count open tasks
    const { count: openCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('status', 'open');

    // Count in_progress tasks
    const { count: inProgressCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('status', 'in_progress');

    // Count overdue tasks (open, assigned, or in_progress with due_date < now)
    const { count: overdueCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .in('status', ['open', 'assigned', 'in_progress'])
      .lt('due_date', now);

    // Count completed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count: completedTodayCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('status', 'completed')
      .gte('updated_at', startOfDay.toISOString());

    return {
      open: openCount || 0,
      inProgress: inProgressCount || 0,
      overdue: overdueCount || 0,
      completedToday: completedTodayCount || 0
    };
  },

  // =====================================================
  // 3. GET SINGLE TASK - By ID
  // =====================================================
  async getTask(taskId) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        villa:villas!villa_id(id, name),
        booking:bookings!booking_id(id, guest_name, check_in, check_out)
      `)
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      throw new Error('Failed to fetch task');
    }

    return data;
  },

  // =====================================================
  // 4. CREATE TASK - Manual task creation
  // =====================================================
  async createTask(taskData, currentUser) {
    // Insert task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        tenant_id: taskData.tenantId,
        property_id: taskData.propertyId,
        villa_id: taskData.villaId || null,
        booking_id: taskData.bookingId || null,
        title: taskData.title,
        description: taskData.description || '',
        task_type: taskData.taskType,
        category: taskData.category,
        priority: taskData.priority || 'medium',
        status: 'open',
        source: 'manual',
        due_date: taskData.dueDate,
        deadline: taskData.deadline || null,
        assignee: taskData.assignee || null,
        estimated_cost: taskData.estimatedCost || null,
        actual_cost: null,
        currency: taskData.currency || 'IDR',
        notes: taskData.notes || null
      })
      .select()
      .single();

    if (taskError) {
      console.error('Error creating task:', taskError);
      throw new Error(taskError.message || 'Failed to create task');
    }

    // Log creation event
    await this.logTaskEvent(task.id, 'created', {
      source: 'dashboard',
      created_by: currentUser?.email || 'unknown'
    });

    return task;
  },

  // =====================================================
  // 5. UPDATE TASK STATUS
  // =====================================================
  async updateTaskStatus(taskId, newStatus, currentUser) {
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    // If completing task, set completed_at
    if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId);

    if (updateError) {
      console.error('Error updating task status:', updateError);
      throw new Error('Failed to update task status');
    }

    // Log status change event
    await this.logTaskEvent(taskId, newStatus === 'completed' ? 'completed' : 'status_changed', {
      new_status: newStatus,
      changed_by: currentUser?.email || 'unknown'
    });

    return { success: true };
  },

  // =====================================================
  // 6. ASSIGN TASK - Assign to staff
  // =====================================================
  async assignTask(taskId, assigneeName, currentUser) {
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        assignee: assigneeName,
        status: 'assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    if (updateError) {
      console.error('Error assigning task:', updateError);
      throw new Error('Failed to assign task');
    }

    // Log assignment event
    await this.logTaskEvent(taskId, 'assigned', {
      assignee: assigneeName,
      assigned_by: currentUser?.email || 'unknown'
    });

    return { success: true };
  },

  // =====================================================
  // 7. UPDATE TASK - Full update
  // =====================================================
  async updateTask(taskId, updates) {
    // Convert camelCase to snake_case for database
    const dbUpdates = {
      title: updates.title,
      description: updates.description,
      task_type: updates.taskType,
      category: updates.category,
      priority: updates.priority,
      status: updates.status,
      assignee: updates.assignee,
      due_date: updates.dueDate,
      deadline: updates.deadline,
      villa_id: updates.villaId,
      notes: updates.notes,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => {
      if (dbUpdates[key] === undefined) {
        delete dbUpdates[key];
      }
    });

    const { data, error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw new Error(error.message || 'Failed to update task');
    }

    return data;
  },

  // =====================================================
  // 8. DELETE TASK
  // =====================================================
  async deleteTask(taskId) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }

    return { success: true };
  },

  // =====================================================
  // 9. GET TASK HISTORY - Audit trail
  // =====================================================
  async getTaskHistory(taskId) {
    const { data, error } = await supabase
      .from('task_events')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching task history:', error);
      return []; // Return empty array if no events yet
    }

    return data;
  },

  // =====================================================
  // 10. LOG TASK EVENT - Internal helper
  // =====================================================
  async logTaskEvent(taskId, eventType, details = {}) {
    const { error } = await supabase
      .from('task_events')
      .insert({
        task_id: taskId,
        event_type: eventType,
        details: details,
        created_by: details.created_by || details.changed_by || details.assigned_by || 'system',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging task event:', error);
      // Don't throw - event logging is not critical
    }
  },

  // =====================================================
  // 11. GET VILLA TASKS - Tasks for specific villa
  // =====================================================
  async getVillaTasks(tenantId, villaId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, villa:villas!villa_id(id, name)')
      .eq('tenant_id', tenantId)
      .eq('villa_id', villaId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching villa tasks:', error);
      throw new Error('Failed to fetch villa tasks');
    }

    return data;
  },

  // =====================================================
  // 12. GET BOOKING TASKS - Tasks for specific booking
  // =====================================================
  async getBookingTasks(bookingId) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, booking:bookings!booking_id(id, guest_name, check_in, check_out)')
      .eq('booking_id', bookingId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching booking tasks:', error);
      throw new Error('Failed to fetch booking tasks');
    }

    return data;
  }
};
