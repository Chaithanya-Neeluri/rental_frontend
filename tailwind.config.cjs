/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d9edff',
          200: '#b9dcff',
          300: '#8ac3ff',
          400: '#5da4ff',
          500: '#327cff',
          600: '#225fe5',
          700: '#1c4ac1',
          800: '#1b3b96',
          900: '#182f75',
        },
        accent: {
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15,23,42,0.35)',
        glass: '0 18px 60px rgba(15,23,42,0.45)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(56,189,248,0.25), transparent 55%), radial-gradient(circle at top right, rgba(129,140,248,0.3), transparent 55%), radial-gradient(circle at bottom, rgba(236,72,153,0.18), transparent 55%)',
      },
    },
  },
  plugins: [],
};

