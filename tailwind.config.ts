import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary — SankofaX brown/gold
        primary: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f3d9a8',
          300: '#e8bb6d',
          400: '#d9983a',
          500: '#c4801f',
          600: '#b5813b',
          700: '#8a6028',
          800: '#6b4a1e',
          900: '#4e3616',
          950: '#2e1f0a',
        },
        // Accent — warm gold highlight
        accent: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Surfaces — cream/beige from old site
        surface:   '#fdf9f4',
        'surface-2': '#f7f0e6',
        charcoal: '#1c1a17',
        muted: '#7a6a56',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover':'0 10px 25px -3px rgb(181 129 59 / 0.15), 0 4px 6px -4px rgb(181 129 59 / 0.1)',
        'card-lg':  '0 20px 40px -8px rgb(0 0 0 / 0.12)',
        gold:       '0 0 0 3px rgb(181 129 59 / 0.25)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #b5813b 0%, #d9983a 50%, #8a6028 100%)',
        'gradient-hero': 'linear-gradient(135deg, #2e1f0a 0%, #4e3616 40%, #6b4a1e 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fdf9f4 0%, #f7f0e6 100%)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                              to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(181 129 59 / 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgb(181 129 59 / 0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config