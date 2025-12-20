/**
 * MySite Service - Handles website data and operations
 * Uses localStorage for persistence (can be replaced with Supabase later)
 */

const STORAGE_KEY = 'myhost_user_sites';
const WIZARD_PROGRESS_KEY = 'myhost_wizard_progress';

/**
 * Generate slug from name
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Get all sites for current user
 */
export const getUserSites = (userId = 'demo-user') => {
  try {
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return sites[userId] || null;
  } catch (error) {
    console.error('Error getting user sites:', error);
    return null;
  }
};

/**
 * Check if user has a website
 */
export const hasWebsite = (userId = 'demo-user') => {
  const site = getUserSites(userId);
  return site !== null;
};

/**
 * Create new site
 */
export const createSite = (userId = 'demo-user', siteData) => {
  try {
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    const slug = siteData.slug || generateSlug(siteData.name);

    const newSite = {
      id: `site-${Date.now()}`,
      owner_id: userId,
      status: 'draft',
      slug,
      url: `${window.location.origin}/site/${slug}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: null,
      ...siteData,
    };

    sites[userId] = newSite;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));

    // Clear wizard progress
    clearWizardProgress();

    return newSite;
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

/**
 * Update existing site
 */
export const updateSite = (userId = 'demo-user', updates) => {
  try {
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    if (!sites[userId]) {
      throw new Error('Site not found');
    }

    sites[userId] = {
      ...sites[userId],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));

    return sites[userId];
  } catch (error) {
    console.error('Error updating site:', error);
    throw error;
  }
};

/**
 * Publish site
 */
export const publishSite = (userId = 'demo-user') => {
  try {
    return updateSite(userId, {
      status: 'published',
      published_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error publishing site:', error);
    throw error;
  }
};

/**
 * Unpublish site
 */
export const unpublishSite = (userId = 'demo-user') => {
  try {
    return updateSite(userId, {
      status: 'draft',
    });
  } catch (error) {
    console.error('Error unpublishing site:', error);
    throw error;
  }
};

/**
 * Delete site
 */
export const deleteSite = (userId = 'demo-user') => {
  try {
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete sites[userId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
    return true;
  } catch (error) {
    console.error('Error deleting site:', error);
    throw error;
  }
};

/**
 * Get site by slug (for public view)
 */
export const getSiteBySlug = (slug) => {
  try {
    const sites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    // Find site with matching slug
    for (const userId in sites) {
      if (sites[userId].slug === slug) {
        return sites[userId];
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting site by slug:', error);
    return null;
  }
};

/**
 * Save wizard progress
 */
export const saveWizardProgress = (step, data) => {
  try {
    const progress = JSON.parse(localStorage.getItem(WIZARD_PROGRESS_KEY) || '{}');
    progress.currentStep = step;
    progress.data = { ...progress.data, ...data };
    progress.lastSaved = new Date().toISOString();

    localStorage.setItem(WIZARD_PROGRESS_KEY, JSON.stringify(progress));
    return progress;
  } catch (error) {
    console.error('Error saving wizard progress:', error);
    throw error;
  }
};

/**
 * Get wizard progress
 */
export const getWizardProgress = () => {
  try {
    const progress = localStorage.getItem(WIZARD_PROGRESS_KEY);
    return progress ? JSON.parse(progress) : null;
  } catch (error) {
    console.error('Error getting wizard progress:', error);
    return null;
  }
};

/**
 * Clear wizard progress
 */
export const clearWizardProgress = () => {
  try {
    localStorage.removeItem(WIZARD_PROGRESS_KEY);
  } catch (error) {
    console.error('Error clearing wizard progress:', error);
  }
};

/**
 * Default site template
 */
export const getDefaultSiteTemplate = () => {
  return {
    name: '',
    language: 'en',
    theme: 'bali-minimal',
    properties: [],
    booking_mode: 'direct',
    whatsapp_number: '',
    whatsapp_message_template: "Hello, I'd like to book {{property}} from {{date}} for {{guests}} guests.",
    about_title: 'Welcome to Our Properties',
    about_text: 'Discover our beautiful properties in paradise.',
    footer_text: '© 2025 All rights reserved',
    contact_email: '',
    contact_phone: '',
  };
};

export default {
  getUserSites,
  hasWebsite,
  createSite,
  updateSite,
  publishSite,
  unpublishSite,
  deleteSite,
  getSiteBySlug,
  saveWizardProgress,
  getWizardProgress,
  clearWizardProgress,
  getDefaultSiteTemplate,
  generateSlug,
};
