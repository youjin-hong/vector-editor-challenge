/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#0A0A0B',
          surface: '#141415',
          'surface-hover': '#1C1C1E',
          border: '#2A2A2D',
          primary: '#FAFAFA',
          secondary: '#A1A1AA',
          muted: '#71717A',
          accent: '#F97316',
          'accent-hover': '#FB923C',
          success: '#22C55E',
          error: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
