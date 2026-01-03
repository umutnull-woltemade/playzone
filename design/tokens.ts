// Design System Tokens
// Single source of truth for colors, spacing, motion, and gradients

export const colors = {
  // Background layers
  bg: {
    void: '#0a0b10',
    surface: '#12131c',
    elevated: '#1a1b28',
    subtle: '#232536',
    hover: '#2c2e44',
    overlay: 'rgba(10, 11, 16, 0.85)',
  },

  // Primary accent - Purple/Violet
  accent: {
    DEFAULT: '#7c3aed',
    light: '#a78bfa',
    dark: '#5b21b6',
    muted: 'rgba(124, 58, 237, 0.15)',
    glow: 'rgba(124, 58, 237, 0.4)',
  },

  // Secondary accent - Cyan
  cyan: {
    DEFAULT: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
    muted: 'rgba(6, 182, 212, 0.15)',
    glow: 'rgba(6, 182, 212, 0.4)',
  },

  // Tertiary accent - Pink/Magenta
  pink: {
    DEFAULT: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
    muted: 'rgba(236, 72, 153, 0.15)',
    glow: 'rgba(236, 72, 153, 0.4)',
  },

  // Warm accent - Orange for HOT
  warm: {
    DEFAULT: '#f97316',
    light: '#fb923c',
    dark: '#ea580c',
    muted: 'rgba(249, 115, 22, 0.15)',
  },

  // Fresh accent - Green for NEW
  fresh: {
    DEFAULT: '#10b981',
    light: '#34d399',
    dark: '#059669',
    muted: 'rgba(16, 185, 129, 0.15)',
  },

  // Text colors
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    muted: '#64748b',
    inverse: '#0f172a',
  },

  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
} as const

export const radii = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
  DEFAULT: '0 4px 12px rgba(0, 0, 0, 0.4)',
  md: '0 8px 24px rgba(0, 0, 0, 0.4)',
  lg: '0 16px 48px rgba(0, 0, 0, 0.5)',
  xl: '0 24px 64px rgba(0, 0, 0, 0.6)',
  glow: {
    accent: '0 0 40px rgba(124, 58, 237, 0.4)',
    cyan: '0 0 40px rgba(6, 182, 212, 0.4)',
    pink: '0 0 40px rgba(236, 72, 153, 0.4)',
  },
  inner: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
} as const

export const gradients = {
  // Mesh gradients for backgrounds
  mesh: {
    calm: `
      radial-gradient(ellipse 80% 50% at 20% 40%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse 60% 80% at 80% 20%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse 50% 60% at 60% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
    `,
    energetic: `
      radial-gradient(ellipse 100% 60% at 10% 30%, rgba(124, 58, 237, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse 80% 100% at 90% 10%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse 70% 80% at 50% 90%, rgba(236, 72, 153, 0.18) 0%, transparent 50%),
      radial-gradient(ellipse 60% 50% at 70% 50%, rgba(249, 115, 22, 0.12) 0%, transparent 50%)
    `,
    minimal: `
      radial-gradient(ellipse 100% 100% at 50% 0%, rgba(124, 58, 237, 0.08) 0%, transparent 60%)
    `,
  },
  // Card gradients
  card: {
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    accent: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, transparent 50%)',
    shine: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
  },
  // Text gradients
  text: {
    accent: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #ec4899 100%)',
    cyan: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
  },
} as const

export const motion = {
  // Duration presets
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
    slowest: 1200,
  },
  // Easing presets
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  },
  // Spring presets for @vueuse/motion
  spring: {
    gentle: { stiffness: 120, damping: 14 },
    wobbly: { stiffness: 180, damping: 12 },
    stiff: { stiffness: 400, damping: 30 },
    slow: { stiffness: 80, damping: 20 },
  },
  // Preset animations
  presets: {
    fadeIn: {
      initial: { opacity: 0 },
      enter: { opacity: 1 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0 },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      enter: { opacity: 1, y: 0 },
    },
    fadeInScale: {
      initial: { opacity: 0, scale: 0.95 },
      enter: { opacity: 1, scale: 1 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 30 },
      enter: { opacity: 1, x: 0 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -30 },
      enter: { opacity: 1, x: 0 },
    },
  },
} as const

export const blur = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
  overlay: 800,
  max: 9999,
} as const

// Export all tokens
export const tokens = {
  colors,
  spacing,
  radii,
  shadows,
  gradients,
  motion,
  blur,
  zIndex,
} as const

export type Tokens = typeof tokens
export type Colors = typeof colors
export type Motion = typeof motion
