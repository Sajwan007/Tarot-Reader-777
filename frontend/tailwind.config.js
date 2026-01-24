
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        cosmic: {
          dark: 'var(--cosmic-dark)',
          purple: 'var(--cosmic-purple)',
          violet: 'var(--cosmic-violet)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          light: 'var(--gold-light)',
          dim: 'var(--gold-dim)',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(to bottom, var(--cosmic-dark), var(--cosmic-purple), var(--cosmic-violet))',
        'mystic-radial': 'radial-gradient(circle at center, var(--cosmic-violet) 0%, var(--cosmic-dark) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
