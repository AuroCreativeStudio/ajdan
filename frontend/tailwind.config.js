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
        univers: ['"Univers Next Arabic Regular"', 'sans-serif'],
        adobeArabic: ['AdobeArabic', 'serif'],
        chapaza: ['"Chapaza"', 'sans-serif'],
        commuter: ['"Commuter Sans"', 'sans-serif'],
        aeoniknormal: ['AeonikTRIAL', 'sans-serif'],
        apollo: ['APOLLO', 'sans-serif'],
        azer: ['29lt-azer', 'sans-serif'],
        denton: ['DentonCondensed', 'sans-serif'],
        cyrillic: ['diodrum-cyrillic-regular', 'sans-serif'],
        laureen:  ['Laureen', 'serif'], // or 'sans-serif' if your Laureen file is sans
        orleen: ['Orleen', 'serif'],
        ivy: ['IvyModeThin', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        rippleOuter: 'rippleOuter 2s infinite ease-in-out 0.5s',
        rippleMiddle: 'rippleMiddle 2s infinite ease-in-out',
        blink: 'blink 1.5s infinite',
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
        blink: { 
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.5)' },
        },
      },
      colors: {
        mainCharcoal1: '#222223',
        mainIvory2: '#EFE3D8',
        mainSilver3: '#CCC7C7',
        mainTaupe4: '#A58C76',
        mainSlatenavy5: '#293C47',
        secondaryDustyblue1: '#8AA3B4',
        secondaryPalesky2: '#BED5DC',
        secondaryBurntumber3: '#833B1C',
        secondaryRustbronze4: '#925323',
        secondaryOxblood5: '#4F1515',
        secondaryLavendergray6: '#AEA4B6',
        secondaryMulberrywine7: '#4C2C39',
        accentForestgreen1: '#354234',
        accentSagegray2: '#6D7A6C',
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'), 
  ],
});
