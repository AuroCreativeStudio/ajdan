import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
export const fetchApartmentList = async (locale = 'en') => {
  try {
    const response = await axios.get(`${API_URL}/api/lists?populate=*&locale=${locale}`);

return (response.data.data || []).map(item => {
      // For Arabic locale, we need to check if localized fields exist
      const localizedItem = locale === 'ar' ? 
        (item.localizations?.find(loc => loc.locale === 'ar') || {}) : 
        {};
      
      return {
        id: item.id,
        documentId: item.documentId,
        title: locale === 'ar' ? localizedItem.title?.Property_Title || item.title?.Property_Title : item.title?.Property_Title,
        place: locale === 'ar' ? localizedItem.place || item.place : item.place,
        building: locale === 'ar' ? localizedItem.building || item.building : item.building,
        square_feet: locale === 'ar' ? localizedItem.square_feet || item.square_feet : item.square_feet,
        description: locale === 'ar' ? localizedItem.description || item.description : item.description,
        slug: locale === 'ar' ? localizedItem.slug || item.slug : item.slug,
        image: item.image?.url || null,
        amenities_en: item.amenities_en || [],
        amenities_ar: localizedItem.amenities_ar || item.amenities_ar || [],
        property_type_en: item.property_type_en || [],
        property_type_ar: localizedItem.property_type_ar || item.property_type_ar || [],
        payment_plan_en: item.payment_plan_en || [],
        payment_plan_ar: localizedItem.payment_plan_ar || item.payment_plan_ar || [],
        project_headline: locale === 'ar' ? localizedItem.project_headline || item.project_headline :item.project_headline,    
        project_description: locale === "ar"? localizedItem.project_description || item.project_description : item.project_description,
        feature_image: item.feature_image?.url || null,
        gallery_images: (item.gallery_images || []).map(img =>img.url),   
       pdf_upload:
  locale === "ar"
    ? (localizedItem.pdf_upload && localizedItem.pdf_upload.length > 0
        ? localizedItem.pdf_upload.map(file => file.url)
        : (item.pdf_upload && item.pdf_upload.length > 0
            ? item.pdf_upload.map(file => file.url)
            : []))
    : (item.pdf_upload && item.pdf_upload.length > 0
        ? item.pdf_upload.map(file => file.url)
        : []),

       status_blog: !!item.status_blog
  
         };
    });

  } catch (error) {
    console.error('Error fetching apartment list:', error);
    throw error;
  }
};

export const updateProjectList = async (documentId, data, locale = 'en') => {
  try {
    // 1. First verify the document exists
    const checkResponse = await axios.get(
      `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}/api/lists/${documentId}?populate=*`
    );

    if (!checkResponse.data.data) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    // 2. Prepare the update payload
    const updatePayload = {
      data: {
        ...data,
        locale
      }
    };

    // 3. Execute the update
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}/api/lists/${documentId}`,
      updatePayload,
      {
        params: { populate: '*' },
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('jwt') && {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          })
        }
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Update failed:', {
      documentId,
      error: error.response?.data || error.message,
      payload: error.config?.data
    });
    throw error;
  }
};


// Example fetch for a single project
export const fetchSingleProject = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/lists/${id}?populate=localizations`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching single project:', error);
    throw error;
  }
};

export const fetchApartmentListCMS = async () => {
  try {
    // Fetch English and Arabic lists
    const [enRes, arRes] = await Promise.all([
      axios.get(`${API_URL}/api/lists?populate=*&locale=en`),
      axios.get(`${API_URL}/api/lists?populate=*&locale=ar`)
    ]);

    const enData = enRes.data.data || [];
    const arData = arRes.data.data || [];

    // Map by documentId for quick lookup, but also attach the full arabic item for localizations
    const arMap = {};
    arData.forEach(item => {
      arMap[item.documentId] = item;
    });

    // Merge English and Arabic titles using documentId
    return enData.map(item => ({
      ...item,
      title: item.title?.Property_Title || null,
      title_ar: arMap[item.documentId]?.title?.Property_Title || null,
      // Optionally, attach the full arabic localization for use in update screens
      localizations: [
        ...(item.localizations || []),
        ...(arMap[item.documentId] ? [arMap[item.documentId]] : [])
      ]
      // ...add other fields as needed...
    }));
  } catch (error) {
    console.error('Error fetching apartment list:', error);
    throw error;
  }
};


