import { supabase } from '../lib/supabase';

/**
 * Marketing Service - Handles all marketing-related API calls
 *
 * Tables:
 * - marketing_connections (OAuth status for Meta, Google, TikTok)
 * - marketing_campaigns (Ad campaigns with metrics)
 * - marketing_posts (Social media content calendar)
 * - marketing_reviews (Multi-platform reviews aggregation)
 */

const marketingService = {
  // ============================================================================
  // MARKETING CONNECTIONS
  // ============================================================================

  /**
   * Get all marketing platform connections
   */
  async getConnections() {
    try {
      const { data, error } = await supabase
        .from('marketing_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching marketing connections:', error);
      throw error;
    }
  },

  /**
   * Get connection status for a specific provider
   */
  async getConnectionByProvider(provider) {
    try {
      const { data, error } = await supabase
        .from('marketing_connections')
        .select('*')
        .eq('provider', provider)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data;
    } catch (error) {
      console.error(`Error fetching ${provider} connection:`, error);
      throw error;
    }
  },

  /**
   * Update connection status
   */
  async updateConnection(id, updates) {
    try {
      const { data, error } = await supabase
        .from('marketing_connections')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating connection:', error);
      throw error;
    }
  },

  // ============================================================================
  // MARKETING CAMPAIGNS
  // ============================================================================

  /**
   * Get all campaigns with optional filters
   */
  async getCampaigns(filters = {}) {
    try {
      let query = supabase
        .from('marketing_campaigns')
        .select('*, property:property_id(id, name)')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.platform) {
        query = query.eq('platform', filters.platform);
      }
      if (filters.property_id) {
        query = query.eq('property_id', filters.property_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  /**
   * Get a single campaign by ID
   */
  async getCampaignById(id) {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*, property:property_id(id, name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  },

  /**
   * Create a new campaign
   */
  async createCampaign(campaign) {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert([campaign])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  /**
   * Update campaign
   */
  async updateCampaign(id, updates) {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  /**
   * Delete campaign
   */
  async deleteCampaign(id) {
    try {
      const { error } = await supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  /**
   * Get campaign statistics
   */
  async getCampaignStats() {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('status, platform, total_spend_mtd, leads_count, impressions, clicks');

      if (error) throw error;

      // Calculate aggregated stats
      const stats = {
        activeCampaigns: data.filter(c => c.status === 'active').length,
        totalCampaigns: data.length,
        totalSpend: data.reduce((sum, c) => sum + parseFloat(c.total_spend_mtd || 0), 0),
        totalLeads: data.reduce((sum, c) => sum + parseInt(c.leads_count || 0), 0),
        totalImpressions: data.reduce((sum, c) => sum + parseInt(c.impressions || 0), 0),
        totalClicks: data.reduce((sum, c) => sum + parseInt(c.clicks || 0), 0),
        platforms: {
          meta: data.filter(c => c.platform === 'meta').length,
          google: data.filter(c => c.platform === 'google').length,
          tiktok: data.filter(c => c.platform === 'tiktok').length
        }
      };

      return stats;
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      throw error;
    }
  },

  // ============================================================================
  // MARKETING POSTS (Content Calendar)
  // ============================================================================

  /**
   * Get all posts with optional filters
   */
  async getPosts(filters = {}) {
    try {
      let query = supabase
        .from('marketing_posts')
        .select('*, property:property_id(id, name)')
        .order('scheduled_at', { ascending: false, nullsFirst: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.platform) {
        query = query.eq('platform', filters.platform);
      }
      if (filters.property_id) {
        query = query.eq('property_id', filters.property_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  /**
   * Create a new post
   */
  async createPost(post) {
    try {
      const { data, error } = await supabase
        .from('marketing_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  /**
   * Update post
   */
  async updatePost(id, updates) {
    try {
      const { data, error } = await supabase
        .from('marketing_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  /**
   * Delete post
   */
  async deletePost(id) {
    try {
      const { error } = await supabase
        .from('marketing_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // ============================================================================
  // MARKETING REVIEWS
  // ============================================================================

  /**
   * Get all reviews with optional filters
   */
  async getReviews(filters = {}) {
    try {
      let query = supabase
        .from('marketing_reviews')
        .select('*, property:property_id(id, name)')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      if (filters.rating) {
        query = query.eq('rating', filters.rating);
      }
      if (filters.sentiment) {
        query = query.eq('sentiment', filters.sentiment);
      }
      if (filters.property_id) {
        query = query.eq('property_id', filters.property_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  /**
   * Create a new review
   */
  async createReview(review) {
    try {
      const { data, error } = await supabase
        .from('marketing_reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Update review (e.g., add owner response)
   */
  async updateReview(id, updates) {
    try {
      const { data, error } = await supabase
        .from('marketing_reviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  /**
   * Get review statistics
   */
  async getReviewStats() {
    try {
      const { data, error } = await supabase
        .from('marketing_reviews')
        .select('source, rating, sentiment');

      if (error) throw error;

      // Calculate aggregated stats
      const stats = {
        totalReviews: data.length,
        averageRating: data.reduce((sum, r) => sum + r.rating, 0) / data.length,
        bySentiment: {
          positive: data.filter(r => r.sentiment === 'positive').length,
          neutral: data.filter(r => r.sentiment === 'neutral').length,
          negative: data.filter(r => r.sentiment === 'negative').length
        },
        bySource: {
          airbnb: data.filter(r => r.source === 'airbnb').length,
          booking: data.filter(r => r.source === 'booking').length,
          google: data.filter(r => r.source === 'google').length,
          tripadvisor: data.filter(r => r.source === 'tripadvisor').length,
          manual: data.filter(r => r.source === 'manual').length
        },
        byRating: {
          5: data.filter(r => r.rating === 5).length,
          4: data.filter(r => r.rating === 4).length,
          3: data.filter(r => r.rating === 3).length,
          2: data.filter(r => r.rating === 2).length,
          1: data.filter(r => r.rating === 1).length
        }
      };

      return stats;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }
};

export default marketingService;
