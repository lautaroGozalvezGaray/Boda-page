/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fdf8f6',
          100: '#f9ece7',
          200: '#f2d9d0',
          300: '#e6bcae',
          400: '#d69a86',
          500: '#c17a63',
          600: '#a75f49',
          700: '#894a39',
          800: '#6f3d30',
          900: '#5c352b',
        },
        sand: {
          50: '#fbf9f4',
          100: '#f5f0e4',
          200: '#e9e0c9',
          300: '#dccca4',
          400: '#c9b17c',
          500: '#b5975d',
          600: '#98794a',
          700: '#795f3c',
          800: '#634e34',
          900: '#53422e',
        },
        ink: {
          50: '#f6f6f5',
          100: '#e7e5e2',
          200: '#cfcbc4',
          300: '#aca59a',
          400: '#847b6d',
          500: '#655d51',
          600: '#4f483f',
          700: '#3f3a33',
          800: '#332f2a',
          900: '#242220',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        accent: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeScale: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.9s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'fade-scale': 'fadeScale 0.9s ease-out forwards',
      },
    },
  },
  plugins: [],
};
