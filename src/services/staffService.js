// Staff Service - CRUD operations for managing owner's staff
// Connects frontend to Supabase 'staff' table with RLS
import { supabase } from '../lib/supabase';

export const staffService = {
  // =====================================================
  // 1. GET STAFF - List all staff for the owner
  // =====================================================
  async getStaff(tenantId, filters = {}) {
    let query = supabase
      .from('staff')
      .select(`
        *,
        supervisor:staff!supervisor_id(id, name),
        property:properties!property_id(id, name)
      `)
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true });

    // Filter by active status if provided
    if (filters.active !== undefined) {
      query = query.eq('active', filters.active);
    }

    // Filter by role if provided
    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    // Filter by property if provided
    if (filters.property_id) {
      query = query.eq('property_id', filters.property_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching staff:', error);
      throw error; // Throw original error for display
    }

    return data;
  },

  // =====================================================
  // 2. GET ACTIVE STAFF - For dropdowns (only active)
  // =====================================================
  async getActiveStaff(tenantId) {
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, role, whatsapp')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching active staff:', error);
      throw error;
    }

    return data;
  },

  // =====================================================
  // 3. GET SINGLE STAFF - By ID
  // =====================================================
  async getStaffById(staffId) {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        supervisor:staff!supervisor_id(id, name),
        property:properties!property_id(id, name)
      `)
      .eq('id', staffId)
      .single();

    if (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }

    return data;
  },

  // =====================================================
  // 4. CREATE STAFF - Add new staff member
  // =====================================================
  async createStaff(staffData) {
    const { data, error } = await supabase
      .from('staff')
      .insert({
        tenant_id: staffData.tenantId,
        name: staffData.name,
        whatsapp: staffData.whatsapp || null,
        language: staffData.language || 'en',
        role: staffData.role || 'housekeeping',
        supervisor_id: staffData.supervisorId || null,
        property_id: staffData.propertyId || null,
        active: staffData.active !== undefined ? staffData.active : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating staff:', error);
      console.error('Error details - code:', error.code, 'message:', error.message, 'details:', error.details, 'hint:', error.hint);
      throw error; // Throw original error for display
    }

    return data;
  },

  // =====================================================
  // 5. UPDATE STAFF - Edit staff member
  // =====================================================
  async updateStaff(staffId, updates) {
    const dbUpdates = {
      name: updates.name,
      whatsapp: updates.whatsapp || null,
      language: updates.language,
      role: updates.role,
      supervisor_id: updates.supervisorId || null,  // Convert empty string to null
      property_id: updates.propertyId || null,      // Convert empty string to null
      active: updates.active,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => {
      if (dbUpdates[key] === undefined) {
        delete dbUpdates[key];
      }
    });

    console.log('📝 Updating staff:', staffId, 'with:', dbUpdates);

    const { data, error } = await supabase
      .from('staff')
      .update(dbUpdates)
      .eq('id', staffId)
      .select()
      .single();

    if (error) {
      console.error('Error updating staff:', error);
      console.error('Error details - code:', error.code, 'message:', error.message);
      throw error; // Throw original error for display
    }

    console.log('✅ Staff updated:', data);
    return data;
  },

  // =====================================================
  // 6. TOGGLE STAFF ACTIVE STATUS
  // =====================================================
  async toggleStaffActive(staffId, active) {
    const { data, error } = await supabase
      .from('staff')
      .update({
        active: active,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling staff status:', error);
      throw error;
    }

    return data;
  },

  // =====================================================
  // 7. DELETE STAFF - Remove staff member
  // =====================================================
  async deleteStaff(staffId) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', staffId);

    if (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }

    return { success: true };
  }
};
