/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#000000', // Pure Black
        'bg-secondary': '#080808', // Almost Black
        'bg-tertiary': '#121212', // Dark Grey
        'text-primary': '#E6D2B5', // Pale Gold (Readable)
        'text-secondary': '#998A70', // Muted Gold
        'accent-gold': '#D4AF37', // Metallic Gold
        'accent-gold-dim': '#8A7120', // Dim Gold
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4EBD0 50%, #8A7120 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}