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
        univers: ['"Univers Next Arabic Regular"', 'sans-serif'], // For Arabic headings and body
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      colors: {
        //Ajdan Main Colors
        mainCharcoal1: '#222223', //Charcoal Black
        mainIvory2: '#EFE3D8', //Ivory Beige
        mainSilver3: '#CCC7C7',  //Pale Silver
        mainTaupe4: '#A58C76',  //Warm Taupe
        mainSlatenavy5: '#293C47',  //Slate Navy

        //Ajdan Secondary Colors
        secondaryDustyblue1: '#8AA3B4', //Dusty Blue
        secondaryPalesky2: '#BED5DC', //Pale Sky
        secondaryBurntumber3: '#833B1C', //Burnt Umber
        secondaryRustbronze4: '#925323', //Rust Bronze
        secondaryOxblood5: '#4F1515', //Oxblood
        secondaryLavendergray6: '#AEA4B6', //Lavender Gray
        secondaryMulberrywine7: '#4C2C39', //Mulberry Wine     

        //Ajdan Accent color
        accentForestgreen1: '#354234', //Forest Green
        accentSagegray2: '#6D7A6C',  //Sage Gray
      }
    },
  },
  plugins: [],
});
