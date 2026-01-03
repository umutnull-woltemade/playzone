import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Background Layers (CrazyGames-inspired darker theme)
        'bg-void': '#0C0D14',
        'bg-surface': '#14151F',
        'bg-elevated': '#1C1D2A',
        'bg-subtle': '#252736',
        'bg-hover': '#2D2F42',

        // Accent - Purple/Violet (CrazyGames style)
        accent: {
          primary: '#6842FF',
          hover: '#7C5CFF',
          muted: 'rgba(104, 66, 255, 0.15)',
          glow: 'rgba(104, 66, 255, 0.4)',
          light: '#A78BFF',
        },

        // Secondary Accent - Cyan
        cyan: {
          primary: '#00D9FF',
          hover: '#33E1FF',
          muted: 'rgba(0, 217, 255, 0.15)',
        },

        // Warm Accent - Orange/Red for HOT badges
        warm: {
          accent: '#FF5733',
          hover: '#FF7043',
          muted: 'rgba(255, 87, 51, 0.15)',
        },

        // Green for NEW badges
        fresh: {
          primary: '#00E676',
          muted: 'rgba(0, 230, 118, 0.15)',
        },

        // Text
        text: {
          primary: '#F9FAFF',
          secondary: '#AAADBE',
          muted: '#6B6E80',
          'on-accent': '#FFFFFF',
        },

        // Semantic
        success: '#00E676',
        warning: '#FFB300',
        error: '#FF5252',
      },
      fontFamily: {
        display: ['Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 24px rgba(104, 66, 255, 0.25)',
        'glow': '0 0 30px rgba(104, 66, 255, 0.5)',
        'glow-cyan': '0 0 30px rgba(0, 217, 255, 0.4)',
        'lg-dark': '0 12px 32px rgba(0, 0, 0, 0.6)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-card': 'linear-gradient(135deg, rgba(104, 66, 255, 0.1) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
} satisfies Config
