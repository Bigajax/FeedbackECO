/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      colors: {
        blue: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#baddff',
          300: '#8ac3ff',
          400: '#5aa4ff',
          500: '#3b82f6',
          600: '#2570eb',
          700: '#1a56db',
          800: '#1e4ab4',
          900: '#1e408f',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      animation: {
        'pulse': 'pulse 3s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
        'scale': 'scale 0.3s ease-out forwards',
      },
      boxShadow: {
        'apple': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};