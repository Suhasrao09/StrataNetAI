/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#9E7FFF', // Primary purple
        'brand-secondary': '#38bdf8', // Secondary blue
        'brand-accent': '#f472b6', // Accent pink

        'background-primary': '#171717', // Deep charcoal
        'surface-card': '#262626', // Slightly lighter charcoal for cards
        'border-light': '#2F2F2F', // Light border for separation

        'text-primary': '#FFFFFF', // White
        'text-secondary': '#A3A3A3', // Light gray

        'risk-critical': '#F44336', // Red
        'risk-high': '#FF9800',    // Orange
        'risk-moderate': '#FFEB3B',  // Yellow
        'risk-low': '#4CAF50',     // Green

        'success': '#10b981', // Green for success
        'warning': '#f59e0b', // Orange for warning
        'error': '#ef4444',   // Red for error
      },
      boxShadow: {
        'glow-critical': '0 0 15px 5px rgba(244, 67, 54, 0.7)',
        'glow-high': '0 0 12px 4px rgba(255, 152, 0, 0.6)',
        'glow-moderate': '0 0 8px 3px rgba(255, 235, 59, 0.5)',
      },
      keyframes: {
        'pulse-glow-critical': {
          '0%, 100%': { boxShadow: '0 0 15px 5px rgba(244, 67, 54, 0.7)' },
          '50%': { boxShadow: '0 0 25px 8px rgba(244, 67, 54, 0.9)' },
        },
        'pulse-glow-high': {
          '0%, 100%': { boxShadow: '0 0 12px 4px rgba(255, 152, 0, 0.6)' },
          '50%': { boxShadow: '0 0 20px 6px rgba(255, 152, 0, 0.8)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow-critical': 'pulse-glow-critical 2s infinite ease-in-out',
        'pulse-glow-high': 'pulse-glow-high 2s infinite ease-in-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
