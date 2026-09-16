/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mining: {
          bg: '#0e1218',
          surface: '#151b24',
          card: '#1b222e',
          border: '#2a3547',
          amber: '#e59b2b',
          amberLight: '#fbb347',
          emerald: '#10b981',
          cyan: '#38bdf8',
          crimson: '#ef4444',
          textMuted: '#8b9bb4',
          textBase: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
