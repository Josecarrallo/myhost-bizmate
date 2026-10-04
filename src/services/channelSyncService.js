// Channel Sync Service - OTA Integration
// Handles connections, manual sync triggers, jobs, and logs
import { supabase } from '../lib/supabase';

const N8N_BASE_URL = 'https://n8n-production-bb2d.up.railway.app';
const CHANNEL_SYNC_WEBHOOK = `${N8N_BASE_URL}/webhook/channel-sync`;

export const channelSyncService = {
  // =====================================================
  // OTA CONNECTIONS - Get active connections
  // =====================================================

  /**
   * Get all OTA connections for a property
   * @param {string} propertyId - Property UUID
   * @returns {Array} Array of ota_connections
   */
  async getConnections(propertyId) {
    const { data, error } = await supabase
      .from('ota_connections')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message || 'Failed to fetch OTA connections');
    return data || [];
  },

  /**
   * Get connection by channel
   * @param {string} propertyId - Property UUID
   * @param {string} channel - Channel name (airbnb, booking, agoda, traveloka)
   * @returns {Object|null} Connection object or null
   */
  async getConnectionByChannel(propertyId, channel) {
    const { data, error } = await supabase
      .from('ota_connections')
      .select('*')
      .eq('property_id', propertyId)
      .eq('channel', channel)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error(error.message || 'Failed to fetch connection');
    }
    return data || null;
  },

  /**
   * Get all connections grouped by status
   * @param {string} propertyId - Property UUID
   * @returns {Object} { connected: [], not_connected: [], error: [] }
   */
  async getConnectionsByStatus(propertyId) {
    const connections = await this.getConnections(propertyId);

    return {
      connected: connections.filter(c => c.status === 'connected'),
      not_connected: connections.filter(c => c.status === 'not_connected'),
      error: connections.filter(c => c.status === 'error')
    };
  },

  // =====================================================
  // MANUAL SYNC - Trigger webhook
  // =====================================================

  /**
   * Trigger manual sync for specific channels
   * @param {string} propertyId - Property UUID
   * @param {Array<string>} channels - Array of channel names ['airbnb', 'booking', etc]
   * @param {string} triggerType - 'manual' or 'cron'
   * @returns {Object} { success: boolean, job_id: string, status: string, summary: object }
   */
  async triggerSync(propertyId, channels = [], triggerType = 'manual') {
    try {
      const response = await fetch(CHANNEL_SYNC_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          property_id: propertyId,
          channels: channels.length > 0 ? channels : ['airbnb', 'booking', 'agoda', 'traveloka'],
          trigger_type: triggerType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error triggering channel sync:', error);
      throw new Error(error.message || 'Failed to trigger sync');
    }
  },

  /**
   * Trigger sync for all connected channels
   * @param {string} propertyId - Property UUID
   * @returns {Object} Sync result
   */
  async triggerSyncAll(propertyId) {
    const connections = await this.getConnections(propertyId);
    const connectedChannels = connections
      .filter(c => c.status === 'connected')
      .map(c => c.channel);

    if (connectedChannels.length === 0) {
      throw new Error('No connected channels found');
    }

    return this.triggerSync(propertyId, connectedChannels);
  },

  // =====================================================
  // SYNC JOBS - History and status
  // =====================================================

  /**
   * Get sync jobs for a property
   * @param {string} propertyId - Property UUID
   * @param {Object} options - { limit: number, channel: string, status: string }
   * @returns {Array} Array of sync_jobs
   */
  async getSyncJobs(propertyId, options = {}) {
    const { limit = 20, channel, status } = options;

    let query = supabase
      .from('sync_jobs')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (channel) {
      query = query.eq('channel', channel);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message || 'Failed to fetch sync jobs');
    return data || [];
  },

  /**
   * Get latest sync job per channel
   * @param {string} propertyId - Property UUID
   * @returns {Object} { airbnb: job, booking: job, ... }
   */
  async getLatestSyncByChannel(propertyId) {
    const connections = await this.getConnections(propertyId);
    const result = {};

    for (const conn of connections) {
      const jobs = await this.getSyncJobs(propertyId, {
        channel: conn.channel,
        limit: 1
      });

      result[conn.channel] = jobs[0] || null;
    }

    return result;
  },

  /**
   * Get sync job by ID
   * @param {string} jobId - Job UUID
   * @returns {Object|null} Job object
   */
  async getSyncJobById(jobId) {
    const { data, error } = await supabase
      .from('sync_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message || 'Failed to fetch sync job');
    }
    return data || null;
  },

  // =====================================================
  // SYNC LOGS - Detailed logs per job
  // =====================================================

  /**
   * Get logs for a specific sync job
   * @param {string} jobId - Job UUID
   * @param {Object} options - { level: 'info'|'warn'|'error', limit: number }
   * @returns {Array} Array of sync_logs
   */
  async getSyncLogs(jobId, options = {}) {
    const { level, limit = 50 } = options;

    let query = supabase
      .from('sync_logs')
      .select('*')
      .eq('sync_job_id', jobId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message || 'Failed to fetch sync logs');
    return data || [];
  },

  /**
   * Get error logs for a job
   * @param {string} jobId - Job UUID
   * @returns {Array} Array of error logs
   */
  async getErrorLogs(jobId) {
    return this.getSyncLogs(jobId, { level: 'error' });
  },

  // =====================================================
  // CHANNEL BOOKINGS - Get OTA reservations
  // =====================================================

  /**
   * Get bookings from OTA channels
   * @param {string} propertyId - Property UUID
   * @param {Object} filters - { channel: string, startDate: string, endDate: string, source: string }
   * @returns {Array} Array of bookings
   */
  async getChannelBookings(propertyId, filters = {}) {
    const { channel, startDate, endDate, source = 'ical_sync' } = filters;

    let query = supabase
      .from('bookings')
      .select('*')
      .eq('property_id', propertyId)
      .eq('source', source)
      .order('check_in', { ascending: true });

    if (channel) {
      query = query.eq('channel', channel);
    }

    if (startDate) {
      query = query.gte('check_in', startDate);
    }

    if (endDate) {
      query = query.lte('check_out', endDate);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message || 'Failed to fetch channel bookings');
    return data || [];
  },

  /**
   * Get booking stats by channel
   * @param {string} propertyId - Property UUID
   * @param {Object} dateRange - { startDate: string, endDate: string }
   * @returns {Object} { airbnb: { count, revenue }, booking: { count, revenue }, ... }
   */
  async getChannelStats(propertyId, dateRange = {}) {
    const { startDate, endDate } = dateRange;

    let query = supabase
      .from('bookings')
      .select('channel, total_price, status')
      .eq('property_id', propertyId)
      .eq('source', 'ical_sync');

    if (startDate) {
      query = query.gte('check_in', startDate);
    }

    if (endDate) {
      query = query.lte('check_out', endDate);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message || 'Failed to fetch channel stats');

    // Group by channel
    const stats = {
      airbnb: { count: 0, revenue: 0 },
      booking: { count: 0, revenue: 0 },
      agoda: { count: 0, revenue: 0 },
      traveloka: { count: 0, revenue: 0 },
      other: { count: 0, revenue: 0 }
    };

    (data || []).forEach(booking => {
      const channel = booking.channel || 'other';
      const key = stats[channel] ? channel : 'other';

      stats[key].count += 1;
      stats[key].revenue += parseFloat(booking.total_price || 0);
    });

    return stats;
  },

  // =====================================================
  // RAW RESERVATIONS - Staging data
  // =====================================================

  /**
   * Get raw OTA reservations (staging table)
   * @param {string} propertyId - Property UUID
   * @param {Object} filters - { channel: string, limit: number }
   * @returns {Array} Array of ota_reservations_raw
   */
  async getRawReservations(propertyId, filters = {}) {
    const { channel, limit = 50 } = filters;

    let query = supabase
      .from('ota_reservations_raw')
      .select('*')
      .eq('property_id', propertyId)
      .order('fetched_at', { ascending: false })
      .limit(limit);

    if (channel) {
      query = query.eq('channel', channel);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message || 'Failed to fetch raw reservations');
    return data || [];
  },

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================

  /**
   * Get sync status summary for a property
   * @param {string} propertyId - Property UUID
   * @returns {Object} Complete sync status
   */
  async getSyncStatusSummary(propertyId) {
    const [connections, latestJobs, channelStats] = await Promise.all([
      this.getConnections(propertyId),
      this.getLatestSyncByChannel(propertyId),
      this.getChannelStats(propertyId)
    ]);

    return {
      connections: {
        total: connections.length,
        connected: connections.filter(c => c.status === 'connected').length,
        not_connected: connections.filter(c => c.status === 'not_connected').length,
        error: connections.filter(c => c.status === 'error').length,
        list: connections
      },
      latestSyncs: latestJobs,
      stats: channelStats
    };
  },

  /**
   * Format sync job summary for display
   * @param {Object} job - Sync job object
   * @returns {string} Human-readable summary
   */
  formatJobSummary(job) {
    if (!job || !job.summary) return 'No summary available';

    const s = job.summary;
    return `Fetched: ${s.fetched || 0}, Inserted: ${s.inserted_raw || 0}, Upserted: ${s.upserted_bookings || 0}, Skipped: ${s.skipped || 0}, Errors: ${s.errors || 0}`;
  },

  /**
   * Get channel display name
   * @param {string} channel - Channel identifier
   * @returns {string} Display name
   */
  getChannelDisplayName(channel) {
    const names = {
      airbnb: 'Airbnb',
      booking: 'Booking.com',
      agoda: 'Agoda',
      traveloka: 'Traveloka',
      direct: 'Direct Booking',
      other: 'Other Sources'
    };
    return names[channel] || channel;
  }
};
