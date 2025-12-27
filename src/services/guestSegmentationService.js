// Guest Segmentation Service
// Handles guest tagging, segmentation rules, and segment management

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase.js';

const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Tag types and their rules
const TAG_RULES = {
  'VIP': (guest) => guest.total_spent > 2000 || guest.avg_rating >= 4.8,
  'High Value': (guest) => guest.total_spent > 1000,
  'Repeat Guest': (guest) => guest.total_bookings >= 2,
  'Loyal': (guest) => guest.total_bookings >= 5,
  'First Time': (guest) => guest.total_bookings === 0,
  'Recent Booking': (guest) => {
    if (!guest.last_booking_date) return false;
    const daysSince = Math.floor((new Date() - new Date(guest.last_booking_date)) / (1000 * 60 * 60 * 24));
    return daysSince <= 90;
  },
  'At Risk': (guest) => {
    if (!guest.last_booking_date) return false;
    const daysSince = Math.floor((new Date() - new Date(guest.last_booking_date)) / (1000 * 60 * 60 * 24));
    return daysSince >= 180 && daysSince <= 365;
  },
  'Win Back': (guest) => {
    if (!guest.last_booking_date) return false;
    const daysSince = Math.floor((new Date() - new Date(guest.last_booking_date)) / (1000 * 60 * 60 * 24));
    return daysSince > 365;
  }
};

export const guestSegmentationService = {
  /**
   * Calculate which tags should be assigned to a guest based on their data
   * @param {object} guest - Guest object with total_spent, total_bookings, avg_rating, last_booking_date
   * @returns {array} Array of tag types that apply to this guest
   */
  calculateGuestTags(guest) {
    const tags = [];

    for (const [tagType, ruleFn] of Object.entries(TAG_RULES)) {
      if (ruleFn(guest)) {
        tags.push(tagType);
      }
    }

    return tags;
  },

  /**
   * Auto-assign tags to a single guest
   * @param {string} guestId - Guest UUID
   * @param {object} guestData - Guest data for tag calculation
   * @returns {array} Assigned tags
   */
  async autoTagGuest(guestId, guestData) {
    try {
      // Calculate which tags apply
      const applicableTags = this.calculateGuestTags(guestData);

      // Get existing tags for this guest
      const existingTagsResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/guest_tags?guest_id=eq.${guestId}`,
        { headers: supabaseHeaders }
      );

      const existingTags = await existingTagsResponse.json();
      const existingTagTypes = existingTags.map(t => t.tag_type);

      // Tags to add (in applicableTags but not in existingTags)
      const tagsToAdd = applicableTags.filter(tag => !existingTagTypes.includes(tag));

      // Tags to remove (in existingTags but not in applicableTags, and auto_assigned)
      const tagsToRemove = existingTags
        .filter(t => t.auto_assigned && !applicableTags.includes(t.tag_type))
        .map(t => t.id);

      // Add new tags
      if (tagsToAdd.length > 0) {
        const newTags = tagsToAdd.map(tagType => ({
          guest_id: guestId,
          tag_type: tagType,
          auto_assigned: true,
          created_at: new Date().toISOString()
        }));

        await fetch(`${SUPABASE_URL}/rest/v1/guest_tags`, {
          method: 'POST',
          headers: supabaseHeaders,
          body: JSON.stringify(newTags)
        });
      }

      // Remove outdated auto-assigned tags
      if (tagsToRemove.length > 0) {
        for (const tagId of tagsToRemove) {
          await fetch(`${SUPABASE_URL}/rest/v1/guest_tags?id=eq.${tagId}`, {
            method: 'DELETE',
            headers: supabaseHeaders
          });
        }
      }

      return applicableTags;
    } catch (error) {
      console.error('Error auto-tagging guest:', error);
      throw error;
    }
  },

  /**
   * Auto-tag all guests for a tenant
   * @param {string} tenantId - Tenant UUID
   * @returns {object} Summary of tagging operation
   */
  async autoTagAllGuests(tenantId) {
    try {
      // Fetch all guests (in real app, this would need pagination for large datasets)
      const guestsResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/guests?select=*&limit=1000`,
        { headers: supabaseHeaders }
      );

      const guests = await guestsResponse.json();

      let taggedCount = 0;
      let totalTagsAdded = 0;

      for (const guest of guests) {
        const tags = await this.autoTagGuest(guest.id, guest);
        if (tags.length > 0) {
          taggedCount++;
          totalTagsAdded += tags.length;
        }
      }

      return {
        success: true,
        guestsProcessed: guests.length,
        guestsTagged: taggedCount,
        totalTagsAdded
      };
    } catch (error) {
      console.error('Error auto-tagging all guests:', error);
      throw error;
    }
  },

  /**
   * Get tags for a specific guest
   * @param {string} guestId - Guest UUID
   * @returns {array} Array of tag objects
   */
  async getGuestTags(guestId) {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/guest_tags?guest_id=eq.${guestId}&order=created_at.desc`,
        { headers: supabaseHeaders }
      );

      return await response.json();
    } catch (error) {
      console.error('Error fetching guest tags:', error);
      throw error;
    }
  },

  /**
   * Add manual tag to guest
   * @param {string} guestId - Guest UUID
   * @param {string} tagType - Tag type
   * @param {string} tagValue - Optional tag value
   * @returns {object} Created tag
   */
  async addManualTag(guestId, tagType, tagValue = null) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/guest_tags`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          guest_id: guestId,
          tag_type: tagType,
          tag_value: tagValue,
          auto_assigned: false,
          created_at: new Date().toISOString()
        })
      });

      const result = await response.json();
      return result[0];
    } catch (error) {
      console.error('Error adding manual tag:', error);
      throw error;
    }
  },

  /**
   * Remove tag from guest
   * @param {string} tagId - Tag UUID
   */
  async removeTag(tagId) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/guest_tags?id=eq.${tagId}`, {
        method: 'DELETE',
        headers: supabaseHeaders
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      throw error;
    }
  },

  /**
   * Get all segments for a tenant
   * @param {string} tenantId - Tenant UUID
   * @returns {array} Array of segments
   */
  async getSegments(tenantId) {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/guest_segments?tenant_id=eq.${tenantId}&order=created_at.desc`,
        { headers: supabaseHeaders }
      );

      if (!response.ok) {
        console.warn('Failed to fetch segments, returning empty array');
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching segments:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Create a new segment
   * @param {object} segmentData - Segment data
   * @returns {object} Created segment
   */
  async createSegment(segmentData) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/guest_segments`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify({
          ...segmentData,
          created_at: new Date().toISOString()
        })
      });

      const result = await response.json();
      return result[0];
    } catch (error) {
      console.error('Error creating segment:', error);
      throw error;
    }
  },

  /**
   * Get guests in a segment
   * @param {string} segmentId - Segment UUID
   * @returns {array} Array of guests
   */
  async getSegmentGuests(segmentId) {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/segment_guests?segment_id=eq.${segmentId}`,
        { headers: supabaseHeaders }
      );

      const segmentGuests = await response.json();
      const guestIds = segmentGuests.map(sg => sg.guest_id);

      if (guestIds.length === 0) return [];

      // Fetch guest details
      const guestsResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/guests?id=in.(${guestIds.join(',')})`,
        { headers: supabaseHeaders }
      );

      return await guestsResponse.json();
    } catch (error) {
      console.error('Error fetching segment guests:', error);
      throw error;
    }
  },

  /**
   * Calculate segment size based on rules
   * @param {object} rules - Segment rules (e.g., { min_bookings: 3, nationality: "USA" })
   * @returns {number} Number of guests matching rules
   */
  async calculateSegmentSize(rules) {
    try {
      // Build Supabase query based on rules
      let query = `${SUPABASE_URL}/rest/v1/guests?select=id`;

      if (rules.min_bookings) {
        query += `&total_bookings=gte.${rules.min_bookings}`;
      }
      if (rules.max_bookings) {
        query += `&total_bookings=lte.${rules.max_bookings}`;
      }
      if (rules.min_spent) {
        query += `&total_spent=gte.${rules.min_spent}`;
      }
      if (rules.max_spent) {
        query += `&total_spent=lte.${rules.max_spent}`;
      }
      if (rules.nationality) {
        query += `&nationality=eq.${rules.nationality}`;
      }
      if (rules.min_rating) {
        query += `&avg_rating=gte.${rules.min_rating}`;
      }

      const response = await fetch(query, { headers: supabaseHeaders });
      const guests = await response.json();

      return guests.length;
    } catch (error) {
      console.error('Error calculating segment size:', error);
      return 0;
    }
  },

  /**
   * Get tag distribution statistics
   * @returns {object} Tag counts
   */
  async getTagStatistics() {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/guest_tags?select=tag_type`,
        { headers: supabaseHeaders }
      );

      if (!response.ok) {
        console.warn('Failed to fetch tag statistics, returning empty object');
        return {};
      }

      const tags = await response.json();

      if (!Array.isArray(tags)) {
        console.warn('Tag statistics response is not an array, returning empty object');
        return {};
      }

      const tagCounts = {};
      tags.forEach(tag => {
        if (tag && tag.tag_type) {
          tagCounts[tag.tag_type] = (tagCounts[tag.tag_type] || 0) + 1;
        }
      });

      return tagCounts;
    } catch (error) {
      console.error('Error fetching tag statistics:', error);
      return {};
    }
  }
};
