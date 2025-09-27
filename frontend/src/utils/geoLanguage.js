// export async function detectLanguageByLocation() {
//     console.log('GeoLanguage: detectLanguageByLocation called');
//     try {
//       const res = await fetch('https://ipapi.co/json/');
//       const data = await res.json();
//       const arabicCountries = ['AE', 'SA', 'OM', 'QA', 'KW', 'BH', 'EG'];
//       console.log('GeoLanguage: country_code =', data.country_code);
//       // debugger; // <-- Add this line to pause execution
//       if (arabicCountries.includes(data.country_code)) {
//         console.log('GeoLanguage: returning ar');
//         return 'ar';
//       }
//     } catch (err) {
//       console.error('Geo-detection failed:', err);
//     }
//     console.log('GeoLanguage: returning en');
//     return 'en';
//   }

export async function detectLanguageByLocation() {
  return 'ar'; // force Arabic always
}


  // export async function detectLanguageByLocation() {
  //   try {
  //     const response = await fetch('https://ipapi.co/json/');
  //     const data = await response.json();
  //     const countryCode = data.country_code;
  
  //     console.log("Detected Country Code:", countryCode);
  
  //     if (countryCode === 'SA' || countryCode === 'AE' || countryCode === 'KW') {
  //       return 'ar'; // Arabic-speaking countries
  //     } else {
  //       return 'en';
  //     }
  //   } catch (error) {
  //     console.error("Failed to detect location. Defaulting to English.", error);
  //     return 'en';
  //   }
  // }


