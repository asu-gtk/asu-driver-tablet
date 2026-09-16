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
          bg: '#f8fafc',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0',
          borderStrong: '#cbd5e1',
          primary: '#1e40af',
          primaryHover: '#1d4ed8',
          amber: '#d97706',
          emerald: '#059669',
          cyan: '#0284c7',
          crimson: '#dc2626',
          textBase: '#0f172a',
          textMuted: '#64748b',
          textSubtle: '#94a3b8',
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
