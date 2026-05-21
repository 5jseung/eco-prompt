/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        seal: {
          light: '#cfe0f1',
          DEFAULT: '#5d8fc4',
          dark: '#3d6ea1',
        },
        eco: {
          50:  '#eefaf2',
          100: '#d6f2e0',
          500: '#3fa365',
          600: '#2f8852',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        breathe: {
          '0%,100%': { transform: 'translateY(0) scale(1)' },
          '50%':     { transform: 'translateY(-4px) scale(1.02)' },
        },
        tilt: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '25%':     { transform: 'rotate(-6deg)' },
          '75%':     { transform: 'rotate(6deg)' },
        },
        cheer: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        breathe: 'breathe 3.2s ease-in-out infinite',
        tilt: 'tilt 0.7s ease-in-out',
        cheer: 'cheer 0.6s ease-in-out 3',
      },
    },
  },
  plugins: [],
}
