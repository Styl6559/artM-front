/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'script': ['Dancing Script', 'cursive'],
      },
      colors: {
        // Brand colors from logo
        'brand': {
          'blue': '#1e40af',
          'green': '#10b981',
          'orange': '#f97316',
          'red': '#ef4444',
          'yellow': '#f59e0b',
          'teal': '#14b8a6',
          'slate': '#334155',
        },
        // Artistic palette
        'artistic': {
          'navy': '#1e293b',
          'emerald': '#10b981',
          'sky': '#0ea5e9',
          'amber': '#f59e0b',
          'rose': '#f43f5e',
          'violet': '#8b5cf6',
          'lime': '#84cc16',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'paint-splash': 'paintSplash 2s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          '0%': {
            'background-position': '-468px 0'
          },
          '100%': {
            'background-position': '468px 0'
          }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        paintSplash: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'artistic-gradient': 'linear-gradient(135deg, #10b981 0%, #0ea5e9 25%, #8b5cf6 50%, #f59e0b 75%, #ef4444 100%)',
        'paint-palette': 'linear-gradient(45deg, #10b981, #0ea5e9, #8b5cf6, #f59e0b, #ef4444)',
        'creative-flow': 'conic-gradient(from 0deg, #10b981, #0ea5e9, #8b5cf6, #f59e0b, #ef4444, #10b981)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'artistic': '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
        'paint': '0 20px 40px -8px rgba(139, 92, 246, 0.3)',
        'canvas': '0 15px 35px -5px rgba(245, 158, 11, 0.2)',
      }
    },
  },
  plugins: [],
};