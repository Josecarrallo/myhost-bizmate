/**
 * Visual Themes for Website Builder
 * Each theme includes colors, typography, and visual identity
 */

export const themes = {
  'bali-minimal': {
    id: 'bali-minimal',
    name: 'Bali Minimal',
    description: 'Clean and minimalist with soft green accents',
    preview: '/themes/bali-minimal.jpg',
    colors: {
      primary: '#10B981',      // Emerald green
      secondary: '#059669',    // Dark emerald
      accent: '#34D399',       // Light emerald
      background: '#FFFFFF',   // White
      surface: '#F9FAFB',      // Light gray
      text: '#1F2937',         // Dark gray
      textLight: '#6B7280',    // Medium gray
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Inter, sans-serif',
    },
    style: {
      borderRadius: '0.5rem',
      cardStyle: 'minimal',
      buttonStyle: 'rounded',
    }
  },

  'tropical-luxury': {
    id: 'tropical-luxury',
    name: 'Tropical Luxury',
    description: 'Elegant ivory with gold accents for premium properties',
    preview: '/themes/tropical-luxury.jpg',
    colors: {
      primary: '#059669',      // Deep green
      secondary: '#F59E0B',    // Gold
      accent: '#FBBF24',       // Light gold
      background: '#FFFBF5',   // Ivory
      surface: '#FFF7ED',      // Light ivory
      text: '#1F2937',         // Dark gray
      textLight: '#78716C',    // Warm gray
    },
    fonts: {
      heading: 'Cormorant Garamond, serif',
      body: 'Montserrat, sans-serif',
    },
    style: {
      borderRadius: '0.75rem',
      cardStyle: 'elevated',
      buttonStyle: 'sharp',
    }
  },

  'ocean-breeze': {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Fresh blue tones perfect for beachfront properties',
    preview: '/themes/ocean-breeze.jpg',
    colors: {
      primary: '#0EA5E9',      // Sky blue
      secondary: '#0284C7',    // Ocean blue
      accent: '#38BDF8',       // Light blue
      background: '#FFFFFF',   // White
      surface: '#F0F9FF',      // Light blue tint
      text: '#0F172A',         // Navy
      textLight: '#64748B',    // Slate
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    style: {
      borderRadius: '1rem',
      cardStyle: 'soft',
      buttonStyle: 'rounded',
    }
  },

  'sunset-warmth': {
    id: 'sunset-warmth',
    name: 'Sunset Warmth',
    description: 'Warm oranges and terracotta for cozy retreats',
    preview: '/themes/sunset-warmth.jpg',
    colors: {
      primary: '#F97316',      // Orange
      secondary: '#EA580C',    // Deep orange
      accent: '#FB923C',       // Light orange
      background: '#FFFAF5',   // Warm white
      surface: '#FFF7ED',      // Peach tint
      text: '#1C1917',         // Stone dark
      textLight: '#78716C',    // Stone gray
    },
    fonts: {
      heading: 'Lora, serif',
      body: 'Nunito Sans, sans-serif',
    },
    style: {
      borderRadius: '0.5rem',
      cardStyle: 'warm',
      buttonStyle: 'rounded',
    }
  },

  'jungle-modern': {
    id: 'jungle-modern',
    name: 'Jungle Modern',
    description: 'Bold dark greens with modern edge for unique stays',
    preview: '/themes/jungle-modern.jpg',
    colors: {
      primary: '#047857',      // Forest green
      secondary: '#065F46',    // Deep forest
      accent: '#10B981',       // Bright green
      background: '#FFFFFF',   // White
      surface: '#ECFDF5',      // Mint tint
      text: '#1F2937',         // Dark gray
      textLight: '#4B5563',    // Medium gray
    },
    fonts: {
      heading: 'Roboto Slab, serif',
      body: 'Roboto, sans-serif',
    },
    style: {
      borderRadius: '0.25rem',
      cardStyle: 'sharp',
      buttonStyle: 'sharp',
    }
  },
};

/**
 * Get theme by ID
 */
export const getTheme = (themeId) => {
  return themes[themeId] || themes['bali-minimal'];
};

/**
 * Get all themes as array for selection
 */
export const getThemesArray = () => {
  return Object.values(themes);
};

/**
 * Apply theme to document root
 */
export const applyTheme = (themeId) => {
  const theme = getTheme(themeId);
  const root = document.documentElement;

  // Apply CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });

  // Apply fonts
  root.style.setProperty('--theme-font-heading', theme.fonts.heading);
  root.style.setProperty('--theme-font-body', theme.fonts.body);

  // Apply style variables
  root.style.setProperty('--theme-border-radius', theme.style.borderRadius);
};
