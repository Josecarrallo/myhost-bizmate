// Servicio para obtener datos reales de Supabase
import { supabase } from '../lib/supabase';
import { onBookingCreated } from './n8n';

export const dataService = {
  // Obtener todas las properties
  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    return data;
  },

  // Obtener estadísticas del dashboard
  async getDashboardStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_dashboard_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }

    // Function returns TABLE, so data is an array
    if (!data || data.length === 0) {
      return null;
    }

    const row = data[0]; // Get first row from TABLE result

    // Map field names from Supabase function to what the component expects
    return {
      total_revenue: row?.total_revenue || 0,
      occupancy_rate: row?.occupancy_rate || 0,
      active_bookings: row?.active_bookings || 0,
      total_properties: row?.total_villas || 0,
      avg_nightly_rate: row?.avg_daily_rate || 0,
      revpar: row?.revpar || 0
    };
  },

  // Check-ins de hoy
  async getTodayCheckIns(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_today_checkins', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching check-ins:', error);
      return [];
    }

    return data;
  },

  // Check-outs de hoy
  async getTodayCheckOuts(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_today_checkouts', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching check-outs:', error);
      return [];
    }

    return data;
  },

  // Alertas activas
  async getActiveAlerts(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_active_alerts', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }

    return data;
  },

  // Obtener todos los bookings
  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data;
  },

  // Crear nuevo booking
  async createBooking(bookingData) {
    try {
      // 1. Insert booking into Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      console.log('✅ Booking created in Supabase:', data);

      // 2. Trigger n8n workflow (non-blocking)
      onBookingCreated(data)
        .then((result) => {
          console.log('✅ Booking workflow triggered:', result);
        })
        .catch((workflowError) => {
          console.error('⚠️ Workflow trigger failed:', workflowError);
          // Don't fail the booking creation if workflows fail
        });

      return { success: true, data };
    } catch (error) {
      console.error('Error in createBooking:', error);
      return { success: false, error: error.message };
    }
  },

  // ===== AI AGENTS STATS =====

  // LUMINA.AI Stats (Sales & Leads)
  async getLuminaStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_lumina_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching LUMINA stats:', error);
      return { new_leads: 0, in_pipeline: 0, pending_followups: 0 };
    }

    return data[0] || { new_leads: 0, in_pipeline: 0, pending_followups: 0 };
  },

  // BANYU.AI Stats (WhatsApp Concierge)
  async getBanyuStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_banyu_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching BANYU stats:', error);
      return { messages_today: 0, active_conversations: 0, avg_response_time_minutes: null };
    }

    return data[0] || { messages_today: 0, active_conversations: 0, avg_response_time_minutes: null };
  },

  // KORA.AI Stats (Voice Concierge)
  async getKoraStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_kora_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching KORA stats:', error);
      return { calls_today: 0, avg_duration_seconds: null, positive_sentiment_pct: null };
    }

    return data[0] || { calls_today: 0, avg_duration_seconds: null, positive_sentiment_pct: null };
  },

  // OSIRIS.AI Stats (Operations & Control)
  async getOsirisStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    const { data, error } = await supabase
      .rpc('get_osiris_stats', { p_tenant_id: tenantId });

    if (error) {
      console.error('Error fetching OSIRIS stats:', error);
      return { active_workflows: 0, active_alerts: 0, system_health: 'unknown' };
    }

    return data[0] || { active_workflows: 0, active_alerts: 0, system_health: 'unknown' };
  },

  // Get all guest contacts
  async getGuests() {
    const { data, error } = await supabase
      .from('guest_contacts')
      .select('*')
      .order('last_stay_date', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching guests:', error);
      return [];
    }

    return data;
  },

  // Get all reviews
  async getReviews() {
    const { data, error } = await supabase
      .from('marketing_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data;
  },

  // Get all marketing campaigns
  async getCampaigns() {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }

    return data;
  },

  // ===== REPORTS & ANALYTICS =====

  // Get monthly analytics (last 12 months)
  async getMonthlyAnalytics(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    try {
      // Get all bookings from last 12 months
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('check_in, check_out, total_price, property_id, status')
        .gte('check_in', twelveMonthsAgo.toISOString())
        .eq('tenant_id', tenantId);

      if (error) {
        console.error('Error fetching monthly analytics:', error);
        return [];
      }

      // Get properties count for occupancy calculation
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('tenant_id', tenantId);

      const propertyCount = properties?.length || 1;

      // Group by month
      const monthlyStats = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      bookings.forEach(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        const monthKey = `${monthNames[checkIn.getMonth()]} ${checkIn.getFullYear().toString().slice(-2)}`;

        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = {
            month: monthKey,
            revenue: 0,
            bookings: 0,
            totalNights: 0,
            date: checkIn
          };
        }

        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        monthlyStats[monthKey].revenue += parseFloat(booking.total_price) || 0;
        monthlyStats[monthKey].bookings += 1;
        monthlyStats[monthKey].totalNights += nights;
      });

      // Convert to array and calculate occupancy & ADR
      const monthlyData = Object.values(monthlyStats)
        .sort((a, b) => a.date - b.date)
        .map(month => {
          const daysInMonth = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 0).getDate();
          const totalAvailableNights = propertyCount * daysInMonth;
          const occupancy = totalAvailableNights > 0
            ? Math.round((month.totalNights / totalAvailableNights) * 100)
            : 0;
          const adr = month.totalNights > 0
            ? Math.round(month.revenue / month.totalNights)
            : 0;

          return {
            month: month.month,
            revenue: Math.round(month.revenue),
            bookings: month.bookings,
            occupancy,
            adr
          };
        });

      return monthlyData;
    } catch (error) {
      console.error('Error in getMonthlyAnalytics:', error);
      return [];
    }
  },

  // Get recent clients (last bookings)
  async getRecentClients(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db', limit = 4) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        guest_name,
        check_in,
        check_out,
        total_price,
        status,
        property_id,
        properties (name)
      `)
      .eq('tenant_id', tenantId)
      .in('status', ['confirmed', 'checked_in', 'completed'])
      .order('check_in', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent clients:', error);
      return [];
    }

    return data || [];
  },

  // Get top guests by total revenue
  async getTopGuests(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db', limit = 4) {
    const { data, error } = await supabase
      .from('guest_contacts')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('total_revenue', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top guests:', error);
      return [];
    }

    return data || [];
  },

  // Get bookings distribution by property
  async getPropertyDistribution(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('property_id')
        .eq('tenant_id', tenantId);

      if (error) {
        console.error('Error fetching property distribution:', error);
        return [];
      }

      const { data: properties } = await supabase
        .from('properties')
        .select('id, name')
        .eq('tenant_id', tenantId);

      // Count bookings per property
      const distribution = {};
      bookings.forEach(booking => {
        const propId = booking.property_id;
        distribution[propId] = (distribution[propId] || 0) + 1;
      });

      // Map to property names with colors
      const colors = ['#F97316', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
      const propertyDistribution = properties.map((prop, index) => ({
        name: prop.name,
        value: distribution[prop.id] || 0,
        color: colors[index % colors.length]
      })).filter(p => p.value > 0);

      return propertyDistribution;
    } catch (error) {
      console.error('Error in getPropertyDistribution:', error);
      return [];
    }
  },

  // ============================================
  // SMART PRICING FUNCTIONS
  // ============================================

  // Get pricing data for all properties with dynamic calculations
  async getPricingData(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    try {
      console.log('📊 Fetching pricing data for tenant:', tenantId);

      // Get properties with their base prices
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, name, location, base_price, status')
        .eq('tenant_id', tenantId)
        .eq('status', 'active');

      if (propError) throw propError;

      // Get bookings for occupancy calculation (next 30 days)
      const today = new Date().toISOString().split('T')[0];
      const next30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: bookings, error: bookError } = await supabase
        .from('bookings')
        .select('property_id, check_in, check_out, status')
        .eq('tenant_id', tenantId)
        .gte('check_in', today)
        .lte('check_in', next30Days)
        .in('status', ['confirmed', 'checked_in']);

      if (bookError) throw bookError;

      // Calculate pricing data for each property
      const pricingData = properties.map(property => {
        // Calculate occupancy for next 30 days
        const propertyBookings = bookings.filter(b => b.property_id === property.id);
        const bookedDays = propertyBookings.reduce((sum, booking) => {
          const checkIn = new Date(booking.check_in);
          const checkOut = new Date(booking.check_out);
          const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          return sum + nights;
        }, 0);
        const occupancy = Math.min(Math.round((bookedDays / 30) * 100), 100);

        // Simple dynamic pricing algorithm (can be enhanced)
        let dynamicPrice = property.base_price || 300;
        let factors = [];
        let trend = 'stable';

        // High occupancy = price increase
        if (occupancy >= 85) {
          const increase = Math.round(dynamicPrice * 0.15);
          dynamicPrice += increase;
          factors.push({ name: 'High Demand', impact: '+15%', positive: true });
          trend = 'up';
        } else if (occupancy >= 70) {
          const increase = Math.round(dynamicPrice * 0.08);
          dynamicPrice += increase;
          factors.push({ name: 'Moderate Demand', impact: '+8%', positive: true });
          trend = 'up';
        } else if (occupancy < 50) {
          const decrease = Math.round(dynamicPrice * 0.12);
          dynamicPrice -= decrease;
          factors.push({ name: 'Low Demand', impact: '-12%', positive: false });
          trend = 'down';
        }

        // Seasonal adjustments (simplified - can be enhanced with real season data)
        const currentMonth = new Date().getMonth();
        const isPeakSeason = [5, 6, 7, 11, 0].includes(currentMonth); // Jun-Aug, Dec-Jan
        if (isPeakSeason) {
          const increase = Math.round(dynamicPrice * 0.10);
          dynamicPrice += increase;
          factors.push({ name: 'Peak Season', impact: '+10%', positive: true });
        }

        // Location premium (if Bali, Seminyak, Ubud, etc.)
        if (property.location && ['Bali', 'Seminyak', 'Ubud', 'Canggu'].some(loc =>
            property.location.toLowerCase().includes(loc.toLowerCase()))) {
          const increase = Math.round(dynamicPrice * 0.08);
          dynamicPrice += increase;
          factors.push({ name: 'Premium Location', impact: '+8%', positive: true });
        }

        // Calculate next update time (random 1-4 hours for demo)
        const nextUpdateHours = Math.floor(Math.random() * 4) + 1;
        const nextUpdate = `${nextUpdateHours} hour${nextUpdateHours > 1 ? 's' : ''}`;

        // Generate pricing rules
        const rules = [
          { name: 'Weekend Premium', value: '+15%', active: true },
          { name: 'Last-Minute Discount', value: '-10%', active: occupancy < 70 },
          { name: 'Long-Stay Discount (7+ nights)', value: '-12%', active: true },
          { name: isPeakSeason ? 'Peak Season Adjustment' : 'Off-Season Adjustment',
            value: isPeakSeason ? '+20%' : '-12%', active: true }
        ];

        return {
          id: property.id,
          name: property.name,
          basePrice: property.base_price || 300,
          currentPrice: Math.round(dynamicPrice),
          occupancy: occupancy,
          trend: trend,
          nextUpdate: nextUpdate,
          factors: factors.length > 0 ? factors : [
            { name: 'Standard Pricing', impact: '0%', positive: true }
          ],
          rules: rules
        };
      });

      console.log('✅ Pricing data calculated:', pricingData.length, 'properties');
      return pricingData;

    } catch (error) {
      console.error('Error in getPricingData:', error);
      return [];
    }
  },

  // Get overall pricing statistics
  async getPricingStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    try {
      console.log('📊 Fetching pricing stats for tenant:', tenantId);

      // Get all pricing data
      const pricingData = await this.getPricingData(tenantId);

      if (pricingData.length === 0) {
        return {
          avgOccupancy: 0,
          avgDailyRate: 0,
          revPAR: 0,
          revenueGrowth: 0
        };
      }

      // Calculate averages
      const avgOccupancy = Math.round(
        pricingData.reduce((sum, p) => sum + p.occupancy, 0) / pricingData.length
      );

      const avgDailyRate = Math.round(
        pricingData.reduce((sum, p) => sum + p.currentPrice, 0) / pricingData.length
      );

      // RevPAR = Average Daily Rate * Occupancy Rate
      const revPAR = Math.round(avgDailyRate * (avgOccupancy / 100));

      // Revenue growth calculation (comparing current vs base prices)
      const totalCurrentRevenue = pricingData.reduce((sum, p) =>
        sum + (p.currentPrice * (p.occupancy / 100)), 0
      );
      const totalBaseRevenue = pricingData.reduce((sum, p) =>
        sum + (p.basePrice * (p.occupancy / 100)), 0
      );
      const revenueGrowth = totalBaseRevenue > 0
        ? Math.round(((totalCurrentRevenue - totalBaseRevenue) / totalBaseRevenue) * 100)
        : 0;

      console.log('✅ Pricing stats calculated:', {
        avgOccupancy,
        avgDailyRate,
        revPAR,
        revenueGrowth
      });

      return {
        avgOccupancy,
        avgDailyRate,
        revPAR,
        revenueGrowth
      };

    } catch (error) {
      console.error('Error in getPricingStats:', error);
      return {
        avgOccupancy: 0,
        avgDailyRate: 0,
        revPAR: 0,
        revenueGrowth: 0
      };
    }
  },

  // Get price history for a property (last 5 days - simulated for MVP)
  async getPriceHistory(propertyId, days = 5) {
    try {
      console.log('📊 Generating price history for property:', propertyId);

      // For MVP, generate simulated price history based on current pricing
      // In production, this would come from a price_history table
      const pricingData = await this.getPricingData();
      const property = pricingData.find(p => p.id === propertyId);

      if (!property) {
        return [];
      }

      const history = [];
      const today = new Date();
      const currentPrice = property.currentPrice;

      // Generate historical prices (simulate trending toward current price)
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Simulate price variation (±5-10% from current)
        const variation = (Math.random() * 0.15) - 0.075; // -7.5% to +7.5%
        const historicalPrice = Math.round(currentPrice * (1 + variation));

        history.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: historicalPrice
        });
      }

      console.log('✅ Price history generated:', history.length, 'days');
      return history;

    } catch (error) {
      console.error('Error in getPriceHistory:', error);
      return [];
    }
  },

  // ============================================
  // MULTICHANNEL FUNCTIONS
  // ============================================

  // Get multichannel integration data
  async getMultichannelData(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    try {
      console.log('📊 Fetching multichannel data for tenant:', tenantId);

      // Get properties
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, name, status')
        .eq('tenant_id', tenantId)
        .eq('status', 'active');

      if (propError) throw propError;

      // Get bookings for revenue calculation (last 90 days)
      const last90Days = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: bookings, error: bookError } = await supabase
        .from('bookings')
        .select('property_id, total_price, status, source')
        .eq('tenant_id', tenantId)
        .gte('created_at', last90Days)
        .in('status', ['confirmed', 'checked_in', 'checked_out']);

      if (bookError) throw bookError;

      // Define channels with their configuration
      const channelConfigs = [
        {
          name: 'Booking.com',
          logo: '🔵',
          gradient: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          connected: true,
          ratingScale: 10 // Booking.com uses 1-10
        },
        {
          name: 'Airbnb',
          logo: '🔴',
          gradient: 'from-red-500 to-pink-600',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          connected: true,
          ratingScale: 5 // Airbnb uses 1-5
        },
        {
          name: 'Agoda',
          logo: '🌈',
          gradient: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-700',
          connected: false,
          ratingScale: 5
        },
        {
          name: 'Expedia',
          logo: '🟡',
          gradient: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          connected: true,
          ratingScale: 5
        },
        {
          name: 'VRBO',
          logo: '🟠',
          gradient: 'from-orange-500 to-red-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          connected: true,
          ratingScale: 5
        }
      ];

      // Calculate stats for each channel
      const channels = channelConfigs.map(config => {
        if (!config.connected) {
          return {
            ...config,
            lastSync: 'Never',
            stats: { listings: 0, pending: 0, revenue: '0', bookings: 0, avgRating: 0 },
            syncHistory: []
          };
        }

        // For demo: distribute properties across connected channels
        // In production, this would come from a channel_listings table
        const channelListings = properties.filter(() => Math.random() > 0.3); // ~70% of properties per channel

        // Calculate bookings for this channel (filtering by source if available)
        const channelBookings = bookings.filter(b => {
          // If booking has source, match it
          if (b.source) {
            return b.source.toLowerCase().includes(config.name.toLowerCase().split('.')[0]);
          }
          // Otherwise, randomly distribute for demo
          return Math.random() > 0.5;
        });

        // Calculate revenue
        const revenue = channelBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
        const revenueK = (revenue / 1000).toFixed(1) + 'K';

        // Calculate pending (simulated - would come from channel API)
        const pending = Math.floor(channelListings.length * 0.3);

        // Average rating (would come from reviews data)
        const avgRating = config.ratingScale === 10
          ? (8.5 + Math.random() * 1).toFixed(1)
          : (4.5 + Math.random() * 0.5).toFixed(1);

        // Last sync time (random 1-5 hours ago)
        const hoursAgo = Math.floor(Math.random() * 5) + 1;
        const lastSync = `${hoursAgo}h ago`;

        // Generate sync history (last 3 syncs)
        const syncHistory = [];
        for (let i = 0; i < 3; i++) {
          const date = new Date(Date.now() - (i * 3 + hoursAgo) * 60 * 60 * 1000);
          const dateStr = date.toISOString().slice(0, 16).replace('T', ' ');
          const status = Math.random() > 0.9 ? 'warning' : Math.random() > 0.95 ? 'error' : 'success';

          syncHistory.push({
            date: dateStr,
            status: status,
            items: status === 'error' ? 0 : channelListings.length
          });
        }

        return {
          ...config,
          lastSync,
          stats: {
            listings: channelListings.length,
            pending,
            revenue: revenueK,
            bookings: channelBookings.length,
            avgRating: parseFloat(avgRating)
          },
          syncHistory
        };
      });

      console.log('✅ Multichannel data calculated:', channels.length, 'channels');
      return channels;

    } catch (error) {
      console.error('Error in getMultichannelData:', error);
      return [];
    }
  },

  // Get multichannel summary stats
  async getMultichannelStats(tenantId = 'c24393db-d318-4d75-8bbf-0fa240b9c1db') {
    try {
      const channels = await this.getMultichannelData(tenantId);

      const connectedChannels = channels.filter(c => c.connected).length;
      const totalListings = channels.reduce((sum, c) => sum + c.stats.listings, 0);
      const totalRevenue = channels.reduce((sum, c) => {
        const revenue = parseFloat(c.stats.revenue.replace('K', ''));
        return sum + (isNaN(revenue) ? 0 : revenue);
      }, 0).toFixed(1) + 'K';
      const totalBookings = channels.reduce((sum, c) => sum + c.stats.bookings, 0);

      return {
        connectedChannels,
        totalChannels: channels.length,
        totalListings,
        totalRevenue,
        totalBookings
      };

    } catch (error) {
      console.error('Error in getMultichannelStats:', error);
      return {
        connectedChannels: 0,
        totalChannels: 0,
        totalListings: 0,
        totalRevenue: '0K',
        totalBookings: 0
      };
    }
  },

  // ============================================
  // OVERVIEW STATS - Date Range Filtered
  // ============================================

  // Get overview stats filtered by date range
  async getOverviewStats(tenantId, startDate, endDate) {
    try {
      console.log('📊 Fetching overview stats:', { tenantId, startDate, endDate });

      const { data, error } = await supabase
        .rpc('get_overview_stats', {
          p_tenant_id: tenantId,
          p_start_date: startDate,
          p_end_date: endDate
        });

      if (error) {
        console.error('Error fetching overview stats:', error);
        return null;
      }

      // Function returns TABLE, so data is an array
      if (!data || data.length === 0) {
        console.warn('No overview data returned');
        return null;
      }

      const stats = data[0]; // Get first row from TABLE result

      // FIX: Map RPC field names to frontend expected names
      if (stats) {
        // Map properties_data → property_performance_data
        if (stats.properties_data) {
          stats.property_performance_data = stats.properties_data;
        }

        // Map sources_data → channel_breakdown_data
        if (stats.sources_data) {
          stats.channel_breakdown_data = stats.sources_data;
        }
      }

      console.log('✅ Overview stats fetched successfully');
      return stats;

    } catch (error) {
      console.error('Error in getOverviewStats:', error);
      return null;
    }
  },

  // Obtener villas del usuario actual
  async getVillas(tenantId) {
    try {
      if (!tenantId) {
        console.error('getVillas: tenantId is required');
        return [];
      }

      // 1. Get ALL user's property_ids from their bookings (may have multiple properties)
      const { data: bookings } = await supabase
        .from('bookings')
        .select('property_id')
        .eq('tenant_id', tenantId);

      if (!bookings || bookings.length === 0) {
        console.log('[getVillas] No bookings found for tenant, no villas to show');
        return [];
      }

      // Get unique property_ids for this user
      const propertyIds = [...new Set(bookings.map(b => b.property_id))];
      console.log(`[getVillas] User has ${propertyIds.length} property_id(s):`, propertyIds);

      // 2. Get villas for ALL user's property_ids
      const { data, error } = await supabase
        .from('villas')
        .select('*')
        .in('property_id', propertyIds)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching villas:', error);
        return [];
      }

      console.log(`[getVillas] Found ${data?.length || 0} villas for tenant ${tenantId} (property_ids: ${propertyIds.join(', ')})`);
      return data || [];
    } catch (error) {
      console.error('Error in getVillas:', error);
      return [];
    }
  }
};
