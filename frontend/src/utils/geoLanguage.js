export async function detectLanguageByLocation() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const arabicCountries = ['AE', 'SA', 'OM', 'QA', 'KW', 'BH', 'EG'];
      if (arabicCountries.includes(data.country_code)) {
        return 'ar';
      }
    } catch (err) {
      console.error('Geo-detection failed:', err);
    }
    return 'en';
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


