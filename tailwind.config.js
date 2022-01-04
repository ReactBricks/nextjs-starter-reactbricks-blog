const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
    './react-bricks/**/*.tsx',
    './node_modules/react-bricks-ui/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    flex: {
      1: '1 1 0%',
      2: '2 2 0%',
    },
    extend: {
      colors: {
        sky: colors.sky,
        orange: colors.orange,
        green: colors.lime,
        cyan: colors.cyan,
        pink: {
          100: '#ffebef',
          200: '#ffd6e0',
          300: '#fdb4c6',
          400: '#fb83a3',
          500: '#f65a8e',
          600: '#d9367f',
          700: '#b43179',
          800: '#8f2468',
          900: '#691f53',
        },
        twitter: {
          50: '#d9d9d9',
          500: '#1d9bf0',
          600: '#1a8cd8',
          900: '#15181c',
          'dark-border': '#2f3336',
          dark: '#000000',
        },
      },
      gradientColorStops: {
        ocean1: '#007cf0',
        ocean2: '#00dfd8',
        violet1: '#7928ca',
        violet2: '#ff0080',
        sun1: '#ff4d4d',
        sun2: '#f9cb28',
      },
      fontFamily: {
        content: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      margin: ['group-hover'],
      opacity: ['group-hover'],
      scale: ['group-hover'],
      translate: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
