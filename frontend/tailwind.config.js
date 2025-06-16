/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['"Gurmukhi MN"', 'sans-serif'],
        body: ['"Proxima Nova"', 'sans-serif'],
        chapaza: ['"chapaza "', 'sans-serif'],
        univers: ['"Univers Next Arabic Regular"', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        rippleOuter: 'rippleOuter 2s infinite ease-in-out 0.5s',
        rippleMiddle: 'rippleMiddle 2s infinite ease-in-out ',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        rippleOuter: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '0.1' },
        },
        rippleMiddle: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '0.3' },
        },
      },
      colors: {
        // Ajdan Main Colors
        mainCharcoal1: '#222223',
        mainIvory2: '#EFE3D8',
        mainSilver3: '#CCC7C7',
        mainTaupe4: '#A58C76',
        mainSlatenavy5: '#293C47',

        // Ajdan Secondary Colors
        secondaryDustyblue1: '#8AA3B4',
        secondaryPalesky2: '#BED5DC',
        secondaryBurntumber3: '#833B1C',
        secondaryRustbronze4: '#925323',
        secondaryOxblood5: '#4F1515',
        secondaryLavendergray6: '#AEA4B6',
        secondaryMulberrywine7: '#4C2C39',

        // Ajdan Accent Colors
        accentForestgreen1: '#354234',
        accentSagegray2: '#6D7A6C',
      },
    },
  },
  plugins: [],
});
